# from flask import Flask, render_template, request, jsonify
# from flask_socketio import SocketIO, emit
# from flask_cors import CORS
# # from google.cloud import speech
# # from google.cloud import translate_v2 as translate
# from google.cloud import speech_v1p1beta1 as speech
# from google.cloud import translate_v2 as translate
# import os
# import base64
# import json
# import re

# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'your-secret-key-here'
# CORS(app, resources={r"/*": {"origins": "*"}})
# socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# # Set your Google Cloud credentials
# os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'credentials.json'

# speech_client = speech.SpeechClient()
# translate_client = translate.Client()

# # Language mapping
# LANGUAGE_CODES = {
#     'english': 'en-IN',
#     'hindi': 'hi-IN',
#     'bengali': 'bn-IN',
#     'tamil': 'ta-IN',
#     'telugu': 'te-IN',
#     'marathi': 'mr-IN',
#     'malayalam': 'ml-IN',
#     'kannada': 'kn-IN',
#     'gujarati': 'gu-IN',
#     'punjabi': 'pa-IN',
#     'odia': 'or-IN'
# }

# TRANSLATE_CODES = {
#     'english': 'en',
#     'hindi': 'hi',
#     'bengali': 'bn',
#     'tamil': 'ta',
#     'telugu': 'te',
#     'marathi': 'mr',
#     'malayalam': 'ml',
#     'kannada': 'kn',
#     'gujarati': 'gu',
#     'punjabi': 'pa',
#     'odia': 'or'
# }

# def simplify_text(text):
#     """Simplify text for deaf-friendly captions"""
#     if not text:
#         return text
    
#     # Remove filler words
#     fillers = ['um', 'uh', 'like', 'you know', 'basically', 'actually']
#     for filler in fillers:
#         text = re.sub(r'\b' + filler + r'\b', '', text, flags=re.IGNORECASE)
    
#     # Split long sentences
#     text = re.sub(r'([.!?])\s+', r'\1\n', text)
#     sentences = text.split('\n')
    
#     simplified = []
#     for sentence in sentences:
#         sentence = sentence.strip()
#         if not sentence:
#             continue
        
#         words = sentence.split()
#         if len(words) > 12:
#             # Split at conjunctions
#             parts = re.split(r'\b(and|but|or|because|so)\b', sentence, flags=re.IGNORECASE)
#             for i, part in enumerate(parts):
#                 part = part.strip()
#                 if part and part.lower() not in ['and', 'but', 'or', 'because', 'so']:
#                     simplified.append(part)
#         else:
#             simplified.append(sentence)
    
#     # Join and clean
#     result = '. '.join(simplified)
#     result = re.sub(r'\s+', ' ', result)
#     result = re.sub(r'\s+([.,!?])', r'\1', result)
    
#     return result.strip()

# def translate_text(text, target_lang):
#     """Translate text to target language"""
#     if not text or target_lang == 'en':
#         return text
    
#     try:
#         result = translate_client.translate(
#             text,
#             target_language=target_lang,
#             format_='text'
#         )
#         return result['translatedText']
#     except Exception as e:
#         print(f"Translation error: {e}")
#         return text

# @app.route('/')
# def index():
#     return render_template('index.html')

# @socketio.on('connect')
# def handle_connect():
#     print('Client connected')
#     emit('connected', {'data': 'Connected to server'})

# @socketio.on('disconnect')
# def handle_disconnect():
#     print('Client disconnected')

# @socketio.on('start_stream')
# def handle_start_stream(data):
#     print('Stream started')
#     emit('stream_started', {'status': 'success'})



# @socketio.on('audio_data')
# # def handle_audio_data(data):
# #     try:
# #         audio_data = base64.b64decode(data['audio'])
# #         source_lang = data.get('source_language', 'english')
# #         target_lang = data.get('target_language', 'english')
# #         simplify = data.get('simplify', True)
        
# #         # ✅ FIX: Don't specify sample_rate_hertz - let API auto-detect from audio
# #         config = speech.RecognitionConfig(
# #             encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,  # ✅ Changed from LINEAR16
# #             # sample_rate_hertz removed - API will auto-detect
# #             language_code=LANGUAGE_CODES.get(source_lang, 'en-IN'),
# #             enable_automatic_punctuation=True,
# #             model='latest_long',
# #             use_enhanced=True
# #         )
        
# #         audio = speech.RecognitionAudio(content=audio_data)
        
# #         # Perform recognition
# #         response = speech_client.recognize(config=config, audio=audio)
        
# #         if not response.results:
# #             print("No speech detected in audio chunk")
# #             return
        
# #         for result in response.results:
# #             transcript = result.alternatives[0].transcript
            
# #             if not transcript:
# #                 continue
            
# #             print(f"✅ Transcribed: {transcript}")
            
# #             # Simplify if needed
# #             if simplify:
# #                 transcript = simplify_text(transcript)
# #                 print(f"📝 Simplified: {transcript}")
            
# #             # Translate if needed
# #             if target_lang != source_lang:
# #                 target_code = TRANSLATE_CODES.get(target_lang, 'en')
# #                 translated = translate_text(transcript, target_code)
# #                 print(f"🌐 Translated to {target_lang}: {translated}")
# #                 transcript = translated
            
# #             # Send caption to client
# #             emit('caption', {
# #                 'text': transcript,
# #                 'confidence': result.alternatives[0].confidence,
# #                 'language': target_lang
# #             })
            
# #     except Exception as e:
# #         print(f"❌ Error processing audio: {e}")
# #         import traceback
# #         traceback.print_exc()
# #         emit('error', {'message': str(e)})
# @socketio.on('audio_data')
# def handle_audio_data(data):
#     try:
#         audio_data = base64.b64decode(data['audio'])
#         source_lang = data.get('source_language', 'english')
#         target_lang = data.get('target_language', 'english')
#         simplify = data.get('simplify', True)
        
#         # ✅ FIX: Specify 48000 Hz for WEBM_OPUS (standard browser rate)
#         # config = speech.RecognitionConfig(
#         #     encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
#         #     sample_rate_hertz=48000,  # ✅ Browser default for WebM
#         #     language_code=LANGUAGE_CODES.get(source_lang, 'en-IN'),
#         #     enable_automatic_punctuation=True,
#         #     model='latest_long',
#         #     use_enhanced=True
#         # )
#         config = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
#         sample_rate_hertz=48000,
#         audio_channel_count=2,
#         language_code=LANGUAGE_CODES.get(source_lang, 'en-IN'),
#         enable_automatic_punctuation=True,
#         model='latest_long',
#         use_enhanced=True
#         )


#         audio = speech.RecognitionAudio(content=audio_data)
        
#         # Perform recognition
#         response = speech_client.recognize(config=config, audio=audio)
        
#         if not response.results:
#             print("No speech detected in audio chunk")
#             return
        
#         for result in response.results:
#             transcript = result.alternatives[0].transcript
            
#             if not transcript:
#                 continue
            
#             print(f"✅ Transcribed: {transcript}")
            
#             # Simplify if needed
#             if simplify:
#                 transcript = simplify_text(transcript)
#                 print(f"📝 Simplified: {transcript}")
            
#             # Translate if needed
#             if target_lang != source_lang:
#                 target_code = TRANSLATE_CODES.get(target_lang, 'en')
#                 translated = translate_text(transcript, target_code)
#                 print(f"🌐 Translated to {target_lang}: {translated}")
#                 transcript = translated
            
#             # Send caption to client
#             emit('caption', {
#                 'text': transcript,
#                 'confidence': result.alternatives[0].confidence,
#                 'language': target_lang
#             })
            
#     except Exception as e:
#         print(f"❌ Error processing audio: {e}")
#         import traceback
#         traceback.print_exc()
#         emit('error', {'message': str(e)})

# # @socketio.on('audio_data')
# # def handle_audio_data(data):
# #     try:
# #         audio_data = base64.b64decode(data['audio'])
# #         source_lang = data.get('source_language', 'english')
# #         target_lang = data.get('target_language', 'english')
# #         simplify = data.get('simplify', True)
        
# #         # Configure recognition
# #         config = speech.RecognitionConfig(
# #             encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
# #             sample_rate_hertz=16000,
# #             language_code=LANGUAGE_CODES.get(source_lang, 'en-IN'),
# #             enable_automatic_punctuation=True,
# #             model='latest_long',
# #             use_enhanced=True
# #         )
        
# #         audio = speech.RecognitionAudio(content=audio_data)
        
# #         # Perform recognition
# #         response = speech_client.recognize(config=config, audio=audio)
        
# #         for result in response.results:
# #             transcript = result.alternatives[0].transcript
            
# #             # Simplify if needed
# #             if simplify:
# #                 transcript = simplify_text(transcript)
            
# #             # Translate if needed
# #             if target_lang != 'english':
# #                 target_code = TRANSLATE_CODES.get(target_lang, 'en')
# #                 transcript = translate_text(transcript, target_code)
            
# #             # Send caption to client
# #             emit('caption', {
# #                 'text': transcript,
# #                 'confidence': result.alternatives[0].confidence,
# #                 'language': target_lang
# #             })
            
# #     except Exception as e:
# #         print(f"Error processing audio: {e}")
# #         emit('error', {'message': str(e)})

# @socketio.on('stop_stream')
# def handle_stop_stream():
#     print('Stream stopped')
#     emit('stream_stopped', {'status': 'success'})

# if __name__ == '__main__':
#     socketio.run(app, host='0.0.0.0', port=5000, debug=True)
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import translate_v2 as translate
import os
import base64
import json
import re

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Set your Google Cloud credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'credentials.json'

speech_client = speech.SpeechClient()
translate_client = translate.Client()

# Language mapping - Fixed to match frontend
LANGUAGE_CODES = {
    'en': 'en-IN',
    'hi': 'hi-IN',
    'bn': 'bn-IN',
    'ta': 'ta-IN',
    'te': 'te-IN',
    'mr': 'mr-IN',
    'ml': 'ml-IN',
    'kn': 'kn-IN',
    'gu': 'gu-IN',
    'pa': 'pa-IN',
    'or': 'or-IN'
}

TRANSLATE_CODES = {
    'en': 'en',
    'hi': 'hi',
    'bn': 'bn',
    'ta': 'ta',
    'te': 'te',
    'mr': 'mr',
    'ml': 'ml',
    'kn': 'kn',
    'gu': 'gu',
    'pa': 'pa',
    'or': 'or'
}

def simplify_text(text, level='medium'):
    """Simplify text for deaf-friendly captions"""
    if not text:
        return text
    
    # Remove filler words
    fillers = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally']
    for filler in fillers:
        text = re.sub(r'\b' + filler + r'\b', '', text, flags=re.IGNORECASE)
    
    if level == 'low':
        # Minimal simplification
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    # Split long sentences
    text = re.sub(r'([.!?])\s+', r'\1\n', text)
    sentences = text.split('\n')
    
    simplified = []
    max_words = 15 if level == 'medium' else 10
    
    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue
        
        words = sentence.split()
        if len(words) > max_words:
            # Split at conjunctions
            parts = re.split(r'\b(and|but|or|because|so|when|while|if)\b', sentence, flags=re.IGNORECASE)
            for part in parts:
                part = part.strip()
                if part and part.lower() not in ['and', 'but', 'or', 'because', 'so', 'when', 'while', 'if']:
                    simplified.append(part)
        else:
            simplified.append(sentence)
    
    # Join and clean
    result = '. '.join(simplified)
    result = re.sub(r'\s+', ' ', result)
    result = re.sub(r'\s+([.,!?])', r'\1', result)
    
    return result.strip()

def translate_text(text, target_lang):
    """Translate text to target language"""
    if not text or target_lang == 'en':
        return text
    
    try:
        result = translate_client.translate(
            text,
            target_language=target_lang,
            format_='text'
        )
        return result['translatedText']
    except Exception as e:
        print(f"Translation error: {e}")
        return text

@app.route('/')
def index():
    return render_template('index2.html')

@socketio.on('connect')
def handle_connect():
    print(' Client connected')
    emit('connected', {'data': 'Connected to server'})

@socketio.on('disconnect')
def handle_disconnect():
    print(' Client disconnected')

@socketio.on('start_stream')
def handle_start_stream(data):
    print(' Stream started with:', data)
    emit('stream_started', {'status': 'success'})

@socketio.on('audio_data')
def handle_audio_data(data):
    try:
        audio_data = base64.b64decode(data['audio'])
        source_lang = data.get('source_language', 'en')
        target_lang = data.get('target_language', 'en')
        simplify = data.get('simplify', True)
        simplification_level = data.get('simplification_level', 'medium')
        
        # Check if audio data is too small
        if len(audio_data) < 100:
            print("⏭ Skipping: Audio chunk too small")
            return
        
        print(f" Received audio: {len(audio_data)} bytes, source: {source_lang}, target: {target_lang}")
        
        # Configure recognition for LINEAR16 PCM
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code=LANGUAGE_CODES.get(source_lang, 'en-IN'),
            enable_automatic_punctuation=True,
            model='default',  # Changed from latest_long
            use_enhanced=True
        )
        
        audio = speech.RecognitionAudio(content=audio_data)
        
        # Perform recognition
        response = speech_client.recognize(config=config, audio=audio)
        
        if not response.results:
            print(" No speech detected in audio chunk")
            return
        
        for result in response.results:
            if not result.alternatives:
                continue
                
            transcript = result.alternatives[0].transcript
            
            if not transcript:
                continue
            
            print(f" Transcribed: {transcript}")
            
            # Simplify if needed
            if simplify:
                transcript = simplify_text(transcript, simplification_level)
                print(f" Simplified: {transcript}")
            
            # Translate if needed
            if target_lang != source_lang:
                target_code = TRANSLATE_CODES.get(target_lang, 'en')
                translated = translate_text(transcript, target_code)
                print(f" Translated to {target_lang}: {translated}")
                transcript = translated
            
            # Send caption to client
            emit('caption', {
                'text': transcript,
                'confidence': result.alternatives[0].confidence,
                'language': target_lang
            })
            
    except Exception as e:
        print(f" Error processing audio: {e}")
        import traceback
        traceback.print_exc()
        emit('error', {'message': str(e)})

@socketio.on('stop_stream')
def handle_stop_stream():
    print(' Stream stopped')
    emit('stream_stopped', {'status': 'success'})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
