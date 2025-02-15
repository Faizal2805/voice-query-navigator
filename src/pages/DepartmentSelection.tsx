
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DepartmentSelection = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showOkButton, setShowOkButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const text = "Which department and year does the person you are looking for study?";
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
  }, []);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    navigate('/details-fetching');
    
    try {
      const response = await fetch('https://extract-dept.onrender.com/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: searchInput }),
      });

      if (response.status === 400) {
        navigate('/error', { state: { returnPath: '/department-selection' } });
        return;
      }

      const data = await response.json();
      
      if (!data || data.error) {
        navigate('/error', { state: { returnPath: '/department-selection' } });
      } else {
        const studentsList = JSON.parse(sessionStorage.getItem('studentsList') || '[]');
        const filteredStudents = studentsList.filter((student: any) => 
          student.department.toLowerCase() === data.department.toLowerCase() &&
          student.year.toString() === data.year.toString()
        );

        if (filteredStudents.length > 0) {
          const student = filteredStudents[0];
          const message = `${student.name} is available at ${student.block} - Block, ${student.floor} Floor and Room-No: ${student.room_no}.`;
          displayCharacterByCharacter(message);
        } else {
          navigate('/error', { state: { returnPath: '/department-selection' } });
        }
      }
    } catch (error) {
      console.error('Error processing department/year:', error);
      navigate('/error', { state: { returnPath: '/department-selection' } });
    }
  };

  const displayCharacterByCharacter = (message: string) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= message.length) {
        setDisplayedText(message.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setShowOkButton(true);
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'en-UK';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    }, 70);
  };

  return (
    <div className="min-h-screen">
      <div className="container flex flex-col items-center justify-center">
        <p className="mt-32 mb-8 text-[#2d336b] text-2xl font-bold">
          {displayedText}
        </p>
        {!showOkButton && (
          <div className="flex gap-2 w-full max-w-md px-4">
            <Input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter department and year..."
              className="shadow-lg rounded-lg text-lg py-6"
            />
            <Button
              onClick={handleSearch}
              className="bg-[#1D4ED8] hover:bg-[#1e40af] px-6"
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>
        )}

        {showOkButton && (
          <Button
            id="OK-Btn"
            onClick={() => navigate('/')}
            className="mt-8 bg-[#1D4ED8] hover:bg-[#1e40af] text-white px-8 py-2 rounded-lg text-lg font-semibold transition-all duration-300"
          >
            OK
          </Button>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <Card className="rounded-t-[20px] border-b-0 h-[90px]">
          <div className="flex justify-around items-center mt-4">
            <button 
              onClick={() => {
                window.speechSynthesis.cancel();
                navigate('/confirmation');
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

export default DepartmentSelection;
