
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Confirmation = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const text = "Kindly tell the full name of the person you are looking for...";
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

    // Get the spoken text from storage if it exists
    const spokenText = sessionStorage.getItem('spokenText');
    if (spokenText) {
      setSearchInput(spokenText);
      sessionStorage.removeItem('spokenText'); // Clear it after use
    }

    return () => {
      clearInterval(interval);
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    // Redirect to loading page first
    navigate('/details-fetching');
    
    try {
      const response = await fetch('https://voice-search-backend.onrender.com/process_voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: searchInput }),
      });

      if (!response.ok) {
        // If it's a 404 error, navigate to error page
        if (response.status === 404) {
          navigate('/error', { state: { returnPath: '/confirmation' } });
          return;
        }
      }

      const data = await response.json();
      
      if (data.length === 0) {
        navigate('/error', { state: { returnPath: '/confirmation' } });
      } else {
        // Store the complete student data
        sessionStorage.setItem('studentsList', JSON.stringify(data));
        navigate('/department-selection');
      }
    } catch (error) {
      console.error('Error processing search:', error);
      navigate('/error', { state: { returnPath: '/confirmation' } });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container flex flex-col items-center justify-center">
        <p className="mt-32 mb-8 text-[#2d336b] text-2xl font-bold">
          {displayedText}
        </p>
        <div className="flex gap-2 w-full max-w-md px-4">
          <Input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter name to search..."
            className="shadow-lg rounded-lg text-lg py-6"
          />
          <Button
            id="searchNameBtn"
            onClick={handleSearch}
            className="bg-[#1D4ED8] hover:bg-[#1e40af] px-6"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <Card className="rounded-t-[20px] border-b-0 h-[90px]">
          <div className="flex justify-around items-center mt-4">
            <button 
              onClick={() => {
                window.speechSynthesis.cancel();
                navigate('/student-details');
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

export default Confirmation;
