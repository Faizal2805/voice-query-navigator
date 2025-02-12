
import { useEffect, useState } from 'react';
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

    return () => clearInterval(interval);
  }, []);

  const startListening = () => {
    if (!isListening) {
      setIsListening(true);
      setOutputText('Listening...');
      
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-UK';

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
          setOutputText(transcript);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
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
      <div className="container mt-0">
        <p className="pt-[200px] m-0 text-[#2d336b] text-2xl font-bold">
          {displayedText}
        </p>
        <p className="mt-4 text-gray-600">{outputText}</p>
        
        <button 
          className="voice-button mt-[100px] ml-[125px]"
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
              onClick={() => navigate('/')}
              className="border-0 bg-white"
            >
              <ArrowLeft size={32} />
            </button>
            <button className="border-0 bg-white">
              <X size={32} />
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
