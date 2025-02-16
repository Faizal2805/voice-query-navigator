
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Results = () => {
  const [displayedText, setDisplayedText] = useState('');
  const navigate = useNavigate();
  const results = JSON.parse(sessionStorage.getItem('filteredResults') || '[]');

  useEffect(() => {
    let text;
    if (results.length === 0) {
      text = "No Student Found...";
    } else if (results.length === 1) {
      text = `${results[0].name} is available at ${results[0].block} - Block, ${results[0].floor} Floor and Room No : ${results[0].room_no}`;
    } else {
      text = results.map((student: any) => 
        `${student.name} is available at ${student.block} - Block, ${student.floor} Floor and Room No : ${student.room_no}`
      ).join('\n');
    }

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
      window.speechSynthesis.cancel();
    };
  }, [results]);

  return (
    <div className="min-h-screen">
      <div className="container flex flex-col items-center justify-center">
        <Card className="mt-32 mb-8 p-6 max-w-2xl w-full">
          <p className="text-[#2d336b] text-2xl font-bold text-balance whitespace-pre-line">
            {displayedText}
          </p>
        </Card>
        
        <Button
          onClick={() => navigate('/')}
          className="mt-8 bg-[#1D4ED8] hover:bg-[#1e40af] text-white px-8 py-2 rounded-lg text-lg font-semibold transition-all duration-300"
        >
          OK
        </Button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <Card className="rounded-t-[20px] border-b-0 h-[90px]">
          <div className="flex justify-around items-center mt-4">
            <button 
              onClick={() => {
                window.speechSynthesis.cancel();
                navigate('/department-selection');
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

export default Results;
