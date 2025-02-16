
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Results = () => {
  const [displayedText, setDisplayedText] = useState('');
  const navigate = useNavigate();

  // Retrieve full student list
  const studentsList = JSON.parse(sessionStorage.getItem('studentsList') || '[]');
  console.log("Full Students List:", studentsList); // ✅ Debug: Check the full list

  // Retrieve extracted department & year
  const extractedDepartment = sessionStorage.getItem('extractedDepartment') || '';
  const extractedYear = sessionStorage.getItem('extractedYear') || '';
  console.log("Extracted Department:", extractedDepartment); // ✅ Debug: Check extracted department
  console.log("Extracted Year:", extractedYear); // ✅ Debug: Check extracted year

  console.log(sessionStorage.getItem('studentsList'));
  console.log(sessionStorage.getItem('extractedDepartment'));
  console.log(sessionStorage.getItem('extractedYear'));
  console.log("Debug: Component Rendered!");
  alert("Results Page Loaded!");
  console.log("✅ Results Page Rendered");



  // Map extractedYear to match JSON format
  const yearMapping: Record<string, string> = {
    'I': 'FIRSTYEAR',
    'II': 'SECONDYEAR',
    'III': 'THIRDYEAR',
    'IV': 'FOURTHYEAR'
  };
  const mappedYear = yearMapping[extractedYear] || '';
  console.log("Mapped Year:", mappedYear); // ✅ Debug: Ensure correct mapping

  // Filter students based on Department & Year
  const filteredResults = studentsList.filter((student: any) => 
    student.year === mappedYear && student.department === extractedDepartment
  );

  // Store filtered results for displaying
  sessionStorage.setItem('filteredResults', JSON.stringify(filteredResults));
  console.log("Filtered Results:", filteredResults); // ✅ Debug: Check final filtered data

  useEffect(() => {
    let text;
    if (filteredResults.length === 0) {
      text = "No Student Found...";
    } else if (filteredResults.length === 1) {
      text = `${filteredResults[0].name} is available at ${filteredResults[0].block} - Block, ${filteredResults[0].floor} Floor and Room No : ${filteredResults[0].room_no}`;
    } else {
      text = filteredResults.map((student: any) => 
        `${student.name} is available at ${student.block} - Block, ${student.floor} Floor and Room No : ${student.room_no}`
      ).join('\n');
    }

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
  }, [filteredResults]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-2xl font-bold">{displayedText}</p>
      <button onClick={() => navigate('/')} className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg">
        OK
      </button>
    </div>
  );
};
export default Results;
