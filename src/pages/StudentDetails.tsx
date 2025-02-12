import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Keyboard } from 'lucide-react';
import { Input } from '@/components/ui/input';

const StudentDetails = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [outputText, setOutputText] = useState('');
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const text = "Who are you looking for?";
    let index = 0;
    
    // Text-to-speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-UK';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);

    // Typing animation
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 70);

    return () => {
      clearInterval(interval);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  const resetSilenceTimeout = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = setTimeout(() => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
      }
    }, 2000);
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    setIsListening(false);
  };

  const startListening = () => {
    if (isListening) {
      stopRecognition();
      return;
    }

    setIsListening(true);
    setOutputText('Listening...');
    
    const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
    
    if (!SpeechRecognition) {
      setOutputText('Speech recognition is not supported in your browser');
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-UK';

    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        setOutputText(transcript);
      }
      resetSilenceTimeout();
    };

    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      setOutputText('Error occurred during speech recognition');
    };

    try {
      recognition.start();
      resetSilenceTimeout();
    } catch (error) {
      setIsListening(false);
      setOutputText('Error starting speech recognition');
    }
  };

  const handleKeyboardInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setOutputText(e.currentTarget.value);
      e.currentTarget.value = '';
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container flex flex-col items-center justify-center">
        <p className="mt-32 mb-4 text-[#2d336b] text-2xl font-bold">
          {displayedText}
        </p>
        <p className="text-gray-600 text-center max-w-md mb-8">{outputText}</p>
        <button 
          className="voice-button"
          onClick={startListening}
        >
          <div className={`rounded-full ${isListening ? 'scale-125' : ''} transition-transform`}>
            <div className="rainbow-container">
              <div className="green"></div>
              <div className="pink"></div>
              <div className="blue"></div>
            </div>
          </div>
        </button>
      </div>

      {/* Bottom Card */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <Card className="rounded-t-[20px] border-b-0 h-[90px]">
          <div className="flex justify-around items-center mt-4">
            <button 
              onClick={() => navigate('/page-1')}
              className="border-0 bg-white"
            >
              <ArrowLeft size={32} />
            </button>
            <button 
              onClick={() => setShowKeyboard(!showKeyboard)}
              className="border-0 bg-white"
            >
              <Keyboard size={32} />
            </button>
          </div>
          {showKeyboard && (
            <div className="bg-white">
              <Input
                type="text"
                placeholder="Ask me anything..."
                className="keyboard-input"
                onKeyDown={handleKeyboardInput}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDetails;
