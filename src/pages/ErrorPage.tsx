
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftCircle } from 'lucide-react';

const ErrorPage = () => {
  const [displayedText, setDisplayedText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const returnPath = location.state?.returnPath || '/';

  useEffect(() => {
    const text = "Please provide a valid input";
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

    // Auto redirect after 5 seconds
    const timeout = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.speechSynthesis.cancel();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <p className="text-[#2d336b] text-2xl font-bold mb-8">
          {displayedText}
        </p>
        <Button
          onClick={() => navigate(returnPath)}
          className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <ArrowLeftCircle className="w-5 h-5" />
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
