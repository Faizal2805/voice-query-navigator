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
  <div className="min-h-screen flex flex-col items-center justify-center p-4">
    {/* Display filtered results */}
    {filteredResults.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResults.map((student, index) => (
          <Card key={index} className="p-4 shadow-lg rounded-lg bg-white">
            <h2 className="text-xl font-bold">{student.name}</h2>
            <p className="text-gray-600">
              Available at {student.block}, Room No: {student.room_no}
            </p>
          </Card>
        ))}
      </div>
    ) : (
      <p className="text-2xl font-bold">No Student Found...</p>
    )}

    {/* OK Button */}
    <button
      onClick={() => navigate('/')}
      className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg"
    >
      OK
    </button>
  </div>
);


export default Results;
