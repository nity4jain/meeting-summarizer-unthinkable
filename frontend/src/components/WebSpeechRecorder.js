import React, { useState, useRef, useEffect } from 'react';

const WebSpeechRecorder = ({ onTranscriptionComplete, onError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      let finalTranscript = '';

      recognition.onstart = () => {
        setIsRecording(true);
        finalTranscript = '';
        setTranscript('');
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscript + interimTranscript);
      };

      recognition.onend = () => {
        setIsRecording(false);
        if (finalTranscript.trim()) {
          setTranscript(finalTranscript.trim()); // Display the final transcript
          onTranscriptionComplete({
            transcript: finalTranscript.trim(),
            filename: 'voice-recording.wav',
          });
        } else {
          setTranscript('');
          onError('No speech detected. Please try again.');
        }
      };

      recognition.onerror = (event) => {
        setIsRecording(false);
        setTranscript('');
        let msg = 'Speech recognition error';
        if (event.error === 'no-speech') msg = 'No speech detected. Try again.';
        else if (event.error === 'audio-capture') msg = 'Mic not found.';
        else if (event.error === 'not-allowed') msg = 'Mic access denied.';
        onError(msg);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscriptionComplete, onError, isRecording]);

  const startRecording = () => {
    if (isSupported && recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (isSupported && recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
    }
  };

  return !isSupported ? (
    <div style={{ color: 'red', padding: '1rem' }}>
      Speech recognition not supported on this browser (try Chrome/Edge).
    </div>
  ) : (
    <div className="web-speech-recorder">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="record-button"
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>

      <div style={{ marginTop: '1rem', minHeight: '40px' }}>
        <strong>Transcript:</strong>
        <div style={{ minHeight: '20px', color: 'blue' }}>
          {transcript || (
            <span style={{ color: 'gray' }}>
              {isRecording ? 'Listening...' : 'No transcript yet.'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebSpeechRecorder;
