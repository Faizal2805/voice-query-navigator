
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

  useEffect(() => {useEffect(() => {
  console.log("🚀 Running useEffect - Checking Filtered Results");
  console.log("Filtered Results:", filteredResults);

  let text = "No Student Found...";  // Default message

  if (filteredResults.length === 1) {
    let s = filteredResults[0];
    text = `${s.name} is available at ${s.block} - Block, ${s.floor} Floor and Room No: ${s.room_no}`;
  } else if (filteredResults.length > 1) {
    text = filteredResults.map((s) => 
      `${s.name} is available at ${s.block} - Block, ${s.floor} Floor and Room No: ${s.room_no}`
    ).join('\n');
  }

  console.log("✅ Final Text to Display:", text);

  let index = 0;
  setDisplayedText(""); // Reset text before animation
  const interval = setInterval(() => {
    if (index <= text.length) {
      setDisplayedText(text.slice(0, index));
      index++;
    } else {
      clearInterval(interval);
    }
  }, 70);

  return () => clearInterval(interval);
}, [filteredResults, studentsList, extractedDepartment, extractedYear]);  // 🔥 Ensure effect re-runs!


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
