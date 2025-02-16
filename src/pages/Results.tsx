import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Results = () => {
  const [displayedTexts, setDisplayedTexts] = useState<string[]>([]);
  const navigate = useNavigate();

  // Retrieve filtered results
  const filteredResults = JSON.parse(sessionStorage.getItem('filteredResults') || '[]');
  console.log("Filtered Results:", filteredResults); // ✅ Debug: Check final filtered data

  useEffect(() => {
    if (filteredResults.length === 0) {
      setDisplayedTexts(["No Student Found..."]);
    } else {
      let index = 0;
      const tempTexts = new Array(filteredResults.length).fill('');

      const interval = setInterval(() => {
        let allComplete = true;
        filteredResults.forEach((student: any, i: number) => {
          const fullText = `${student.name} is available at ${student.block}, Room No: ${student.room_no}`;
          if (index <= fullText.length) {
            tempTexts[i] = fullText.slice(0, index);
            allComplete = false;
          }
        });
        setDisplayedTexts([...tempTexts]);
        if (allComplete) {
          clearInterval(interval);
        }
        index++;
      }, 50);

      return () => clearInterval(interval);
    }
  }, [filteredResults]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-4">
      {displayedTexts.map((text, index) => (
        <Card key={index} className="w-full max-w-md p-4 text-center shadow-lg rounded-lg">
          <p className="text-lg font-semibold text-gray-800">{text}</p>
        </Card>
      ))}
      <Button onClick={() => navigate('/')} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
        OK
      </Button>
    </div>
  );
};

export default Results;
