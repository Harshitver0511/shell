from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import os
import json
import base64
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import translate_v2 as translate
from openai import OpenAI
import threading
import queue
import time
import uuid
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-goes-here-change-me!'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

class LiveCaptionSystem:
    """Real-time caption system with streaming recognition"""
    def __init__(self, openai_api_key, google_credentials_path):
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = google_credentials_path
        
        self.speech_client = speech.SpeechClient()
        self.translate_client = translate.Client()
        self.openai_client = OpenAI(api_key=openai_api_key)
        
        self.supported_languages = {
            'en-IN': 'English (India)',
            'hi-IN': 'Hindi',
            'bn-IN': 'Bengali',
            'te-IN': 'Telugu',
            'mr-IN': 'Marathi',
            'ta-IN': 'Tamil',
            'gu-IN': 'Gujarati',
            'kn-IN': 'Kannada',
            'ml-IN': 'Malayalam',
            'pa-IN': 'Punjabi',
            'or-IN': 'Odia'
        }
        
        self.target_languages = {
            'en': 'English',
            'hi': 'Hindi',
            'bn': 'Bengali',
            'te': 'Telugu',
            'mr': 'Marathi',
            'ta': 'Tamil',
            'gu': 'Gujarati',
            'kn': 'Kannada',
            'ml': 'Malayalam',
            'pa': 'Punjabi',
            'or': 'Odia'
        }
        
        # Active streaming sessions
        self.active_sessions = {}
    
    def translate_text(self, text, target_language):
        """Translate text to target language"""
        if not text.strip() or target_language == 'en':
            return text, 'en'
        
        try:
            print(f"Translating: '{text}' to {target_language}")
            result = self.translate_client.translate(
                text,
                target_language=target_language
            )
            return result['translatedText'], result.get('detectedSourceLanguage', 'en')
        except Exception as e:
            print(f"Translation error: {e}")
            return text, 'en'
    
    def simplify_text(self, text, language_name):
        """Simplify text for deaf-friendly captions"""
        if not text.strip():
            return text
        
        prompt = f"""Simplify this {language_name} text for people who are deaf or hard-of-hearing.

RULES:
1. Use very simple, common words.
2. Keep sentences very short (5-10 words).
3. Do not change the meaning.
4. Use active voice.
5. If the text is already simple, return it exactly as-is.

TEXT: {text}

SIMPLIFIED:"""
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an accessibility expert who simplifies text."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=200
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Simplification error: {e}")
            return text
    
    def start_streaming_session(self, session_id, language_code, target_language, simplify, sid):
        """Start a streaming recognition session"""
        print(f"Starting streaming session {session_id} for {language_code}")
        
        audio_queue = queue.Queue()
        stop_event = threading.Event()
        
        # --- FIX 1: Create configs *outside* the generator ---
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code=language_code,
            enable_automatic_punctuation=True,
            model='default'
        )
        
        streaming_config = speech.StreamingRecognitionConfig(
            config=config,
            interim_results=True
        )
        # --- End FIX 1 ---

        def request_generator():
            """Generate requests for streaming recognize"""
            
            # --- FIX 2: REMOVED the yield for streaming_config ---
            # The generator now *only* yields audio content.
            
            # Subsequent requests with audio
            while not stop_event.is_set():
                try:
                    chunk = audio_queue.get(timeout=0.5)
                    if chunk is None:  # Stop signal
                        break
                    yield speech.StreamingRecognizeRequest(audio_content=chunk)
                except queue.Empty:
                    continue
        
        def process_responses():
            """Process streaming responses"""
            try:
                print(f"Starting speech recognition stream for {session_id}")
                
                # --- FIX 3: Pass 'streaming_config' as the first argument ---
                responses = self.speech_client.streaming_recognize(
                    config=streaming_config,
                    requests=request_generator()
                )
                # --- End FIX 3 ---
                
                for response in responses:
                    if stop_event.is_set():
                        break
                    
                    if not response.results:
                        continue
                    
                    result = response.results[0]
                    if not result.alternatives:
                        continue
                    
                    transcript = result.alternatives[0].transcript
                    confidence = result.alternatives[0].confidence if result.is_final else 0
                    
                    print(f"Transcript ({'final' if result.is_final else 'interim'}): {transcript}")
                    
                    # Only process final results
                    if result.is_final and transcript.strip():
                        chunk_id = str(uuid.uuid4())
                        
                        # Emit original transcript
                        socketio.emit('caption_result', {
                            'id': chunk_id,
                            'original': transcript,
                            'confidence': confidence,
                            'timestamp': time.time()
                        }, room=sid)
                        
                        # Process derivatives in background
                        socketio.start_background_task(
                            target=self.process_derivatives,
                            chunk_id=chunk_id,
                            transcript=transcript,
                            target_language=target_language,
                            simplify=simplify,
                            sid=sid
                        )
            
            except Exception as e:
                print(f"Streaming error: {e}")
                import traceback
                traceback.print_exc()
                socketio.emit('error', {'message': f'Streaming error: {str(e)}'}, room=sid)
            finally:
                print(f"Stream ended for {session_id}")
        
        # Store session
        self.active_sessions[session_id] = {
            'audio_queue': audio_queue,
            'stop_event': stop_event,
            'thread': threading.Thread(target=process_responses)
        }
        
        # Start processing thread
        self.active_sessions[session_id]['thread'].start()
        
        return audio_queue
    # def stop_streaming_session(self, session_id):
    #     """Stop a streaming session"""
    #     if session_id in self.active_sessions:
    #         print(f"Stopping session {session_id}")
    #         session = self.active_sessions[session_id]
            
    #         # Signal stop
    #         session['stop_event'].set()
    #         session['audio_queue'].put(None)  # Stop signal
            
    #         # Wait for thread
    #         session['thread'].join(timeout=2)
            
    #         del self.active_sessions[session_id]
    def stop_streaming_session(self, session_id):
        """Stop a streaming session"""
        if session_id not in self.active_sessions:
            print(f"Session {session_id} not found, already stopped")
            return

        print(f"Stopping session {session_id}")
        session = self.active_sessions[session_id]
    
    # Signal stop
        session['stop_event'].set()
        session['audio_queue'].put(None)  # Stop signal
    
    # Wait for thread
        session['thread'].join(timeout=2)
    
    # Safely delete session
        if session_id in self.active_sessions:
            del self.active_sessions[session_id]
        
    """Stop a streaming session"""
   
    def process_derivatives(self, chunk_id, transcript, target_language, simplify, sid):
        """Process translation and simplification"""
        # Translate
        translated, _ = self.translate_text(transcript, target_language)
        socketio.emit('caption_update', {
            'id': chunk_id,
            'translated': translated
        }, room=sid)
        
        # Simplify
        if simplify:
            target_lang_name = self.target_languages.get(target_language, 'English')
            simplified = self.simplify_text(translated, target_lang_name)
            socketio.emit('caption_update', {
                'id': chunk_id,
                'simplified': simplified
            }, room=sid)


class DummyCaptionSystem:
    """Dummy system for testing without credentials"""
    def __init__(self):
        print("[Dummy System] Running in test mode")
        self.supported_languages = {
            'en-IN': 'English (India)', 'hi-IN': 'Hindi', 'bn-IN': 'Bengali',
            'te-IN': 'Telugu', 'mr-IN': 'Marathi', 'ta-IN': 'Tamil',
            'gu-IN': 'Gujarati', 'kn-IN': 'Kannada', 'ml-IN': 'Malayalam',
            'pa-IN': 'Punjabi', 'or-IN': 'Odia'
        }
        self.target_languages = {
            'en': 'English', 'hi': 'Hindi', 'bn': 'Bengali', 'te': 'Telugu',
            'mr': 'Marathi', 'ta': 'Tamil', 'gu': 'Gujarati', 'kn': 'Kannada',
            'ml': 'Malayalam', 'pa': 'Punjabi', 'or': 'Odia'
        }
        self.active_sessions = {}
    
    def start_streaming_session(self, session_id, language_code, target_language, simplify, sid):
        """Dummy streaming session"""
        audio_queue = queue.Queue()
        stop_event = threading.Event()
        
        def dummy_processor():
            counter = 0
            while not stop_event.is_set():
                try:
                    chunk = audio_queue.get(timeout=2)
                    if chunk is None:
                        break
                    
                    # Simulate processing every few chunks
                    counter += 1
                    if counter % 5 == 0:
                        chunk_id = str(uuid.uuid4())
                        socketio.emit('caption_result', {
                            'id': chunk_id,
                            'original': f'[Dummy] Test transcript {counter}',
                            'confidence': 0.95,
                            'timestamp': time.time()
                        }, room=sid)
                        
                        time.sleep(0.3)
                        socketio.emit('caption_update', {
                            'id': chunk_id,
                            'translated': f'[Translated] Test {counter}'
                        }, room=sid)
                        
                        time.sleep(0.3)
                        socketio.emit('caption_update', {
                            'id': chunk_id,
                            'simplified': f'[Simple] Test {counter}'
                        }, room=sid)
                
                except queue.Empty:
                    continue
        
        self.active_sessions[session_id] = {
            'audio_queue': audio_queue,
            'stop_event': stop_event,
            'thread': threading.Thread(target=dummy_processor)
        }
        self.active_sessions[session_id]['thread'].start()
        return audio_queue
    
    def stop_streaming_session(self, session_id):
        if session_id in self.active_sessions:
            session = self.active_sessions[session_id]
            session['stop_event'].set()
            session['audio_queue'].put(None)
            session['thread'].join(timeout=2)
            del self.active_sessions[session_id]


# Global system
caption_system = None

def initialize_system():
    global caption_system
    
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    GOOGLE_CREDENTIALS_PATH = os.getenv('GOOGLE_CREDENTIALS_PATH', 'credentials.json')
    
    if not os.path.exists(GOOGLE_CREDENTIALS_PATH) or os.path.getsize(GOOGLE_CREDENTIALS_PATH) == 0:
        print("="*50)
        print("WARNING: Running in DUMMY MODE")
        print("="*50)
        caption_system = DummyCaptionSystem()
    elif not OPENAI_API_KEY:
        print("="*50)
        print("WARNING: Missing OPENAI_API_KEY, running in DUMMY MODE")
        print("="*50)
        caption_system = DummyCaptionSystem()
    else:
        try:
            print("Initializing real caption system...")
            caption_system = LiveCaptionSystem(OPENAI_API_KEY, GOOGLE_CREDENTIALS_PATH)
            print("System initialized successfully!")
        except Exception as e:
            print(f"ERROR: {e}")
            print("Falling back to DUMMY MODE")
            caption_system = DummyCaptionSystem()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/languages')
def get_languages():
    if caption_system is None:
        return jsonify({"error": "System not initialized"}), 500
    
    return jsonify({
        'source_languages': caption_system.supported_languages,
        'target_languages': caption_system.target_languages
    })


@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {request.sid}')
    emit('connected', {'message': 'Connected to caption system'})


# @socketio.on('disconnect')
# def handle_disconnect():
#     print(f'Client disconnected: {request.sid}')
#     # Stop any active sessions for this client
#     sessions_to_stop = [sid for sid in caption_system.active_sessions.keys() 
#                         if sid.startswith(request.sid)]
#     for session_id in sessions_to_stop:
#         caption_system.stop_streaming_session(session_id)
@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {request.sid}')
    # Stop any active sessions for this client
    sessions_to_stop = [sid for sid in list(caption_system.active_sessions.keys()) 
                        if sid.startswith(request.sid)]
    for session_id in sessions_to_stop:
        caption_system.stop_streaming_session(session_id)


@socketio.on('start_stream')
def handle_start_stream(data):
    """Start streaming session"""
    if caption_system is None:
        emit('error', {'message': 'System not initialized'})
        return
    
    session_id = f"{request.sid}_{int(time.time())}"
    source_language = data.get('source_language', 'en-IN')
    target_language = data.get('target_language', 'hi')
    simplify = data.get('simplify', True)
    
    try:
        audio_queue = caption_system.start_streaming_session(
            session_id, source_language, target_language, simplify, request.sid
        )
        
        # Store session ID in connection
        emit('stream_started', {'session_id': session_id})
        print(f"Stream started: {session_id}")
        
    except Exception as e:
        print(f"Error starting stream: {e}")
        import traceback
        traceback.print_exc()
        emit('error', {'message': str(e)})


@socketio.on('audio_chunk')
def handle_audio_chunk(data):
    """Receive audio chunk"""
    session_id = data.get('session_id')
    audio_base64 = data.get('audio')
    
    if not session_id or session_id not in caption_system.active_sessions:
        return
    
    try:
        # Decode audio
        audio_data = base64.b64decode(audio_base64)
        
        # Add to queue
        audio_queue = caption_system.active_sessions[session_id]['audio_queue']
        audio_queue.put(audio_data)
        
    except Exception as e:
        print(f"Error processing chunk: {e}")


@socketio.on('stop_stream')
def handle_stop_stream(data):
    """Stop streaming session"""
    session_id = data.get('session_id')
    
    if session_id:
        caption_system.stop_streaming_session(session_id)
        emit('stream_stopped', {'session_id': session_id})
        print(f"Stream stopped: {session_id}")


if __name__ == '__main__':
    initialize_system()
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)