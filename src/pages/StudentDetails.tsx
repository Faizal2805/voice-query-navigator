
import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Keyboard } from 'lucide-react';
import { Input } from '@/components/ui/input';

const StudentDetails = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [outputText, setOutputText] = useState('');
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
      window.speechSynthesis.cancel();
    };
  }, []);

  const startListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    setTimeout(() => {
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
        }
        setOutputText(transcript);
        
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        
        silenceTimeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            sessionStorage.setItem('spokenText', transcript);
            navigate('/confirmation');
          }
        }, 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <div className="container flex flex-col items-center justify-center">
        <p className="mt-32 mb-4 text-[#2d336b] text-2xl font-bold">
          {displayedText}
        </p>
        <p className="text-gray-600 text-center max-w-md mb-8">{outputText}</p>
        {/* Added mt-40 to move the button lower */}
        <div className="mt-40">
          <button 
            id="Start-Btn"
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
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <Card className="rounded-t-[20px] border-b-0 h-[90px]">
          <div className="flex justify-around items-center mt-4">
            <button 
              onClick={() => {
                window.speechSynthesis.cancel();
                navigate('/');
              }}
              className="border-0 bg-white"
            >
              <ArrowLeft size={32} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetails;
