
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [assistText, setAssistText] = useState('');
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    const text = "I'm Eva, a virtual voice assistant!!";
    let index = 0;
    const words = text.split(' ');
    let wordIndex = 0;
    let currentWord = words[wordIndex];
    let letterIndex = 0;
    
    // Text-to-speech
    const utterance = new SpeechSynthesisUtterance("I am Eva, a virtual voice assistant");
    utterance.lang = 'en-UK';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);

    // Typing animation with word-by-word approach
    const interval = setInterval(() => {
      if (wordIndex < words.length) {
        if (letterIndex < currentWord.length) {
          setDisplayedText(prev => prev + currentWord[letterIndex]);
          letterIndex++;
        } else {
          setDisplayedText(prev => prev + ' ');
          wordIndex++;
          letterIndex = 0;
          currentWord = words[wordIndex];
        }
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
    
    // Typing animation for assistance message
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
          <div className="blurred-box">
            <h1 className="intro-text" style={{ opacity: displayedText ? 1 : 0 }}>
              {displayedText}
              <span className="blinking-cursor">|</span>
            </h1>
            {assistText && (
              <h1 className="assist-text mt-4">
                {assistText}
                <span className="blinking-cursor">|</span>
              </h1>
            )}
          </div>
        </div>

        {showGetStarted && (
          <Button
            onClick={handleGetStarted}
            className="get-started-btn"
          >
            Get Started
          </Button>
        )}

        {showCards && (
          <div className="grid grid-cols-1 gap-6 w-full max-w-[576px] mt-10">
            <Card 
              onClick={() => {
                window.speechSynthesis.cancel();
                navigate('/student-details');
              }}
              className="animated-card cursor-pointer"
              style={{ animationDelay: '0s' }}
            >
              <h2 className="text-[#2d336b] text-xl font-medium">Student-Details</h2>
            </Card>
            <Card 
              className="animated-card cursor-pointer"
              style={{ animationDelay: '0.5s' }}
            >
              <h2 className="text-[#2d336b] text-xl font-medium">Staff-Details</h2>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
