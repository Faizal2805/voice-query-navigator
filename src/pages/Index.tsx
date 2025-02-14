
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [assistText, setAssistText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    const text = "I'm Eva, a virtual voice assistant!!";
    let index = 0;
    
    // Text-to-speech
    const utterance = new SpeechSynthesisUtterance("I am Eva, a virtual voice assistant");
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
        setShowGetStarted(true);
      }
    }, 100);

    return () => {
      clearInterval(interval);
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleGetStarted = () => {
    window.speechSynthesis.cancel();
    setShowGetStarted(false);
    let index = 0;
    const text = "How can I assist you?";
    
    // Text-to-speech for assistance message
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-UK';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    
    const interval = setInterval(() => {
      if (index <= text.length) {
        setAssistText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setShowCards(true);
      }
    }, 70);
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="text-center max-w-[576px] w-full mb-8">
          <Card className={`glass-effect p-8 ${isMobile ? 'mx-4' : ''}`}>
            <h1 className="text-[#2d336b] text-2xl font-bold">
              {displayedText}
              {assistText && (
                <div className="mt-4">
                  {assistText}
                  <span className="blinking-cursor">|</span>
                </div>
              )}
            </h1>
          </Card>
        </div>

        {showGetStarted && (
          <Button
            onClick={handleGetStarted}
            className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white px-8 py-2 rounded-lg text-lg font-semibold transition-all duration-300 animate-fade-in"
          >
            Get Started
          </Button>
        )}

        <div className="grid grid-cols-1 gap-6 w-full max-w-[576px]">
          {showCards && (
            <>
              <Card 
                onClick={() => {
                  window.speechSynthesis.cancel();
                  navigate('/student-details');
                }}
                className="p-4 text-center transform transition-all duration-500 hover:shadow-lg cursor-pointer animate-fade-in"
              >
                <h2 className="text-[#2d336b] text-xl font-medium">Student-Details</h2>
              </Card>
              <Card 
                className="p-4 text-center transform transition-all duration-500 hover:shadow-lg cursor-pointer animate-fade-in"
              >
                <h2 className="text-[#2d336b] text-xl font-medium">Staff-Details</h2>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
