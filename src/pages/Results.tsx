
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

const ResultsPage = ({ studentsList, department, year }) => {
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Retrieved studentsList:", studentsList);
    console.log("Extracted Department:", department);
    console.log("Mapped Year:", year);

    // Get data from sessionStorage if props are empty
    const storedStudents = sessionStorage.getItem('studentsList');
    const storedDepartment = sessionStorage.getItem('selectedDepartment');
    const storedYear = sessionStorage.getItem('selectedYear');

    const studentsToFilter = studentsList?.length ? studentsList : (storedStudents ? JSON.parse(storedStudents) : []);
    const deptToFilter = department || storedDepartment;
    const yearToFilter = year || storedYear;

    if (studentsToFilter.length > 0) {
      const filtered = studentsToFilter.filter(
        (student) =>
          student.department.toLowerCase() === deptToFilter?.toLowerCase() &&
          student.year.toLowerCase() === yearToFilter?.toLowerCase()
      );

      console.log("Filtered Students:", filtered);
      setFilteredResults(filtered);
    }
  }, [studentsList, department, year]);

  return (
    <div className="p-6 bg-[#FAFAFF] min-h-screen">
      <h1 className="text-2xl font-bold mb-4 animate-fade-in">Search Results</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResults.map((student, index) => (
          <div
            key={index}
            className="transform transition-all duration-500"
            style={{
              animation: 'popUp 0.5s ease-out forwards',
              animationDelay: `${index * 0.1}s`,
              opacity: 0,
              transform: 'translateY(20px)'
            }}
          >
            <Card className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-blue-600">{student.name}</h2>
              <p className="text-gray-700">Block: {student.block}</p>
              <p className="text-gray-700">Floor: {student.floor}</p>
              <p className="text-gray-700">Room No: {student.room_no}</p>
            </Card>
          </div>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <p className="text-red-500 font-bold text-lg text-center mt-8 animate-fade-in">
          No matching student found.
        </p>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white animate-slide-up">
        <Card className="rounded-t-[20px] border-b-0 h-[90px]">
          <div className="flex justify-around items-center mt-4">
            <button 
              onClick={() => navigate(-1)}
              className="border-0 bg-white transform transition hover:scale-105"
            >
              <ArrowLeft size={32} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResultsPage;
