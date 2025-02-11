
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  isActive?: boolean;
  placeholder?: string;
}

export const VoiceInput = ({ onTranscript, isActive = true, placeholder = "Listening..." }: VoiceInputProps) => {
  const [transcript, setTranscript] = useState('');
  
  const { isListening, startListening, stopListening, hasSupport } = useVoiceRecognition({
    onResult: (text) => {
      setTranscript(text);
      onTranscript(text);
    },
  });

  useEffect(() => {
    if (!isActive && isListening) {
      stopListening();
    }
  }, [isActive, isListening, stopListening]);

  if (!hasSupport) {
    return (
      <Card className="p-4 text-center bg-neutral-light">
        <p className="text-primary">Voice recognition is not supported in your browser.</p>
      </Card>
    );
  }

  return (
    <div className="relative">
      <Card className={`p-6 transition-all duration-300 ${isListening ? 'bg-accent-light/10' : 'bg-neutral-light'}`}>
        <div className="flex flex-col items-center space-y-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`rounded-full p-4 h-16 w-16 transition-all duration-300 ${
              isListening 
                ? 'bg-accent hover:bg-accent-dark' 
                : 'bg-primary hover:bg-primary-dark'
            }`}
          >
            {isListening ? (
              <Mic className="h-6 w-6 text-white animate-pulse" />
            ) : (
              <MicOff className="h-6 w-6 text-white" />
            )}
          </Button>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-primary-light">
              {isListening ? placeholder : 'Click the microphone to start'}
            </p>
            {transcript && (
              <p className="text-lg font-medium text-primary animate-fade-in">
                {transcript}
              </p>
            )}
          </div>
        </div>
      </Card>
      
      {isListening && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-2 border-accent rounded-lg animate-ripple"></div>
        </div>
      )}
    </div>
  );
};
