
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DetailsFetching = () => {
  const [displayedText, setDisplayedText] = useState('');
  const navigate = useNavigate();
  const loadingTexts = [
    "Details-Fetching...",
    "Processing your request...",
    "Almost done..."
  ];

  useEffect(() => {
    // Initial text-to-speech
    const utterance = new SpeechSynthesisUtterance("Fetching details, please wait...");
    utterance.lang = 'en-UK';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);

    // Text animation for the first message
    let index = 0;
    const interval = setInterval(() => {
      if (index <= loadingTexts[0].length) {
        setDisplayedText(loadingTexts[0].slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 70);

    // Cycle through loading messages
    let messageIndex = 1;
    const messageInterval = setInterval(() => {
      if (messageIndex < loadingTexts.length) {
        setDisplayedText(loadingTexts[messageIndex]);
        messageIndex++;
      }
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(messageInterval);
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <p className="text-[#2d336b] text-2xl font-bold mb-8">
          {displayedText}
        </p>
        
        {/* Loading Animation */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-16 h-16 rounded-full border-4 border-[#1D4ED8] border-t-transparent animate-spin"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full animate-pulse">
            <div className="w-16 h-16 rounded-full bg-[#1D4ED8] opacity-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsFetching;
