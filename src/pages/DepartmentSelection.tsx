
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DepartmentSelection = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const yearMapping = {
    "I": "FIRSTYEAR",
    "II": "SECONDYEAR",
    "III": "THIRDYEAR",
    "IV": "FOURTHYEAR"
  };

  useEffect(() => {
    const text = "Which department and year does the person you are looking for study?";
    let index = 0;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-UK';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: searchInput })
      });

      const data = await response.json();
      if (!data.department || !data.year) {
        navigate('/error', { state: { returnPath: '/department-selection' } });
        return;
      }

      const studentsList = JSON.parse(sessionStorage.getItem('studentsList') || '[]');
      console.log("Retrieved studentsList:", studentsList);
      
      const extractedDepartment = data.department.trim().toLowerCase();
      const mappedYear = yearMapping[data.year.trim().toUpperCase()] || data.year.trim().toUpperCase();
      console.log("Extracted Department:", extractedDepartment);
      console.log("Mapped Year:", mappedYear);

      const filteredStudents = studentsList.filter(student => 
        student.department && student.department.toLowerCase() === extractedDepartment &&
        student.year === mappedYear
      );
      console.log("Filtered Students:", filteredStudents);

      sessionStorage.setItem('filteredResults', JSON.stringify(filteredStudents));
      navigate('/results');
    } catch (error) {
      console.error('Error processing department/year:', error);
      navigate('/error', { state: { returnPath: '/department-selection' } });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container flex flex-col items-center justify-center">
        <p className="mt-32 mb-8 text-[#2d336b] text-2xl font-bold text-balance whitespace-pre-line">
          {displayedText}
        </p>
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
            id="searchDeptYearBtn" 
            onClick={handleSearch} 
            className="bg-[#1D4ED8] hover:bg-[#1e40af] px-6 h-[60px]"
          >
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <Card className="rounded-t-[20px] border-b-0 h-[90px]">
          <div className="flex justify-around items-center mt-4">
            <button onClick={() => { window.speechSynthesis.cancel(); navigate('/confirmation'); }} className="border-0 bg-white">
              <ArrowLeft size={32} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DepartmentSelection;
