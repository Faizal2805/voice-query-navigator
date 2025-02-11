
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('homepage');
  const [displayedText, setDisplayedText] = useState('');
  const [assistText, setAssistText] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const text = "I'm Eva, a virtual voice assistant!!";
    let index = 0;
    
    // Text-to-speech
    const utterance = new SpeechSynthesisUtterance("I am Eva, a virtual voice assistant");
    utterance.lang = 'en-UK';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);

    // Show button immediately
    setShowButton(true);

    // Typing animation
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    setCurrentSection('page-1');
    let index = 0;
    const text = "How can I assist you?";
    
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
      {/* Header */}
      <div className="text-center pt-6">
        <h1 className="text-xl font-bold text-[#1D4ED8]">EVA</h1>
      </div>

      {/* Homepage Section */}
      {currentSection === 'homepage' && (
        <div className="flex flex-col justify-between min-h-[80vh] px-4">
          <div className="flex items-center justify-center flex-1">
            <div className="text-center max-w-[576px] w-full">
              <Card className={`glass-effect p-8 mb-8 ${isMobile ? 'mx-4' : ''}`}>
                <h1 className="text-[#1D4ED8] text-2xl font-medium transition-opacity duration-500">
                  {displayedText}
                  <span className="blinking-cursor">|</span>
                </h1>
              </Card>
            </div>
          </div>
          {showButton && (
            <div className="text-center pb-8">
              <button
                onClick={handleGetStarted}
                className="bg-[#1D4ED8] text-white px-16 py-4 rounded-full text-xl pop-up hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      )}

      {/* Page 1 Section */}
      {currentSection === 'page-1' && (
        <div className={`flex flex-col items-start ${isMobile ? 'p-4' : 'p-12'} max-w-[576px] mx-auto mt-20`}>
          <h1 className="text-[#2d336b] text-2xl font-bold mb-10">
            {assistText}
          </h1>
          <div className="grid grid-cols-1 gap-6 w-full">
            {showCards && (
              <>
                <Card 
                  className="p-4 text-center transform transition-all duration-500 hover:shadow-lg cursor-pointer"
                  style={{
                    animation: 'popUp 1s forwards',
                    opacity: 0,
                    transform: 'scale(0)',
                    animationDelay: '0s'
                  }}
                >
                  <h2 className="text-[#2d336b] text-xl font-medium">Student-Details</h2>
                </Card>
                <Card 
                  className="p-4 text-center transform transition-all duration-500 hover:shadow-lg cursor-pointer"
                  style={{
                    animation: 'popUp 1s forwards',
                    opacity: 0,
                    transform: 'scale(0)',
                    animationDelay: '0.5s'
                  }}
                >
                  <h2 className="text-[#2d336b] text-xl font-medium">Staff-Details</h2>
                </Card>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
