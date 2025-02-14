
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCards, setShowCards] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    const text = "How can I assist you?";
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
        setShowCards(true);
      }
    }, 70);

    return () => {
      clearInterval(interval);
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="text-center max-w-[576px] w-full mb-8">
          <Card className={`glass-effect p-8 ${isMobile ? 'mx-4' : ''}`}>
            <h1 className="text-[#2d336b] text-2xl font-bold">
              {displayedText}
              <span className="blinking-cursor">|</span>
            </h1>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 w-full max-w-[576px]">
          {showCards && (
            <>
              <Card 
                onClick={() => navigate('/student-details')}
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
