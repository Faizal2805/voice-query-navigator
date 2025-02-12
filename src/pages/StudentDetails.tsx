
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const StudentDetails = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCards, setShowCards] = useState(false);
  const isMobile = useIsMobile();

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
        setShowCards(true);
      }
    }, 70);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <div className={`flex flex-col items-start ${isMobile ? 'p-4' : 'p-12'} max-w-[576px] mx-auto mt-20`}>
        <h1 className="text-[#2d336b] text-2xl font-bold mb-10">
          {displayedText}
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
                <h2 className="text-[#2d336b] text-xl font-medium">Search by Name</h2>
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
                <h2 className="text-[#2d336b] text-xl font-medium">Search by Roll Number</h2>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
