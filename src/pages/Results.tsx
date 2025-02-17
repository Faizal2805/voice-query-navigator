
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface Student {
  block: string;
  department: string;
  floor: string;
  name: string;
  room_no: number;
  year: string;
}

const ResultsPage = () => {
  const [results, setResults] = useState<Student[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get filtered results from sessionStorage
    const storedResults = sessionStorage.getItem("filteredResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }

    // Redirect to homepage after 10 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FAFAFF] p-4">
      {/* Results Count */}
      <div 
        className="text-center mb-6 animate-fade-in"
        style={{ animationDelay: '0.2s' }}
      >
        <p className="text-lg text-gray-600">
          There are {results.length} {results.length === 1 ? 'student' : 'students'} found in the name "{`${student.name}"
        </p>
      </div>

      {/* Results Cards */}
      <div className="max-w-3xl mx-auto space-y-4">
        {results.map((student, index) => (
          <div
            key={index}
            className="transform transition-all duration-500"
            style={{
              animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
              animationDelay: `${index * 0.2}s`
            }}
          >
            <Card className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <p className="text-lg font-medium text-gray-800 leading-relaxed">
                {`${student.name} is available at ${student.block}-Block, ${student.floor} Floor and Room No: ${student.room_no}`}
              </p>
            </Card>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {results.length === 0 && (
        <div className="text-center mt-10 animate-fade-in">
          <p className="text-xl text-gray-500">Sorry, currently no student found with your specifications</p>
        </div>
      )}

      {/* Auto-redirect Message */}
      <div className="fixed bottom-8 left-0 right-0 text-center animate-fade-in">
        <p className="text-sm text-gray-500">
          Redirecting to homepage in a few seconds...
        </p>
      </div>
    </div>
  );
};

export default ResultsPage;
