
import { useState, useEffect, useCallback } from 'react';

interface VoiceRecognitionProps {
  onResult: (transcript: string) => void;
  onEnd?: () => void;
  continuous?: boolean;
}

export const useVoiceRecognition = ({ onResult, onEnd, continuous = false }: VoiceRecognitionProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = continuous;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          onResult(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
          onEnd?.();
        };

        setRecognition(recognition);
      }
    }
  }, [continuous, onEnd, onResult]);

  const startListening = useCallback(() => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting voice recognition:', error);
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  return {
    isListening,
    startListening,
    stopListening,
    hasSupport: !!recognition,
  };
};
