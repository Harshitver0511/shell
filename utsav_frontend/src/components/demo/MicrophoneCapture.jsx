import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Radio, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MicrophoneCapture({ 
  onCaptionReceived, 
  selectedLanguage,
  simplifyMode 
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  // Map our language codes to browser speech recognition language codes
  const languageMap = {
    hindi: 'hi-IN',
    bengali: 'bn-IN',
    tamil: 'ta-IN',
    telugu: 'te-IN',
    marathi: 'mr-IN',
    malayalam: 'ml-IN',
    kannada: 'kn-IN',
    gujarati: 'gu-IN',
    odia: 'or-IN',
    english: 'en-IN'
  };

  // Simplified captions mapping (basic simplification for demo)
  const simplifyText = (text) => {
    if (!simplifyMode) return text;
    
    // Basic simplification - remove complex words, shorten sentences
    return text
      .replace(/\b(however|nevertheless|furthermore|moreover)\b/gi, 'but')
      .replace(/\b(additionally|furthermore)\b/gi, 'also')
      .replace(/\b(therefore|consequently|thus)\b/gi, 'so')
      .replace(/\b(approximately|roughly)\b/gi, 'about')
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .slice(0, 2) // Keep only first 2 sentences
      .join('. ') + '.';
  };

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = languageMap[selectedLanguage] || 'en-IN';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setError(null);
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalText += transcript + ' ';
        } else {
          interimText += transcript;
        }
      }

      if (interimText) {
        setInterimTranscript(interimText);
        const processedText = simplifyText(interimText);
        onCaptionReceived(processedText);
      }

      if (finalText) {
        const fullTranscript = transcript + finalText;
        setTranscript(fullTranscript);
        const processedText = simplifyText(fullTranscript);
        onCaptionReceived(processedText);
        setInterimTranscript('');
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions.');
      } else if (event.error === 'no-speech') {
        setError('No speech detected. Please try speaking again.');
      } else {
        setError(`Error: ${event.error}`);
      }
      
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage, simplifyMode]);

  const toggleListening = () => {
    if (!isSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        setTranscript('');
        setInterimTranscript('');
        setError(null);
        recognitionRef.current?.start();
      } catch (err) {
        setError('Failed to start microphone. Please refresh and try again.');
      }
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    onCaptionReceived('');
  };

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-red-600" />
            Live Microphone Input
          </div>
          {isListening && (
            <Badge className="bg-red-100 text-red-700 border-red-200 animate-pulse">
              <Radio className="w-3 h-3 mr-1" />
              Recording
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isSupported && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge for the best experience.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button
            onClick={toggleListening}
            disabled={!isSupported}
            className={`flex-1 ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            size="lg"
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 mr-2" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </>
            )}
          </Button>
          
          {transcript && (
            <Button
              variant="outline"
              onClick={clearTranscript}
              size="lg"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Transcript Display */}
        {(transcript || interimTranscript) && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 min-h-[100px]">
            <p className="text-sm text-slate-500 mb-2 font-medium">Live Transcript:</p>
            <p className="text-slate-900 leading-relaxed">
              {transcript}
              {interimTranscript && (
                <span className="text-slate-400 italic">{interimTranscript}</span>
              )}
            </p>
          </div>
        )}

        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-900">
            <AlertCircle className="w-4 h-4 inline mr-2" />
            <strong>Tip:</strong> Speak clearly into your microphone. The system will automatically detect speech and generate captions in real-time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}