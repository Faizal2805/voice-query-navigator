
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
      {/* EVA Title */}
      <div className="text-center pt-6 mb-8">
        <h1 className="text-xl font-bold text-[#1D4ED8]">EVA</h1>
      </div>

      {/* Results Count */}
      <div 
        className="text-center mb-6 animate-fade-in"
        style={{ animationDelay: '0.2s' }}
      >
        <p className="text-lg text-gray-600">
          Found {results.length} {results.length === 1 ? 'result' : 'results'}
        </p>
      </div>

      {/* Results Cards */}
      <div className="max-w-3xl mx-auto space-y-4">
        {results.map((student, index) => (
          <div
            key={index}
            className="transform transition-all duration-500"
            style={{
              animation: 'popUp 0.5s ease-out forwards',
              animationDelay: `${index * 0.2}s`,
              opacity: 0,
              transform: 'translateY(20px)'
            }}
          >
            <Card className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <p className="text-lg text-gray-800 leading-relaxed">
                {`${student.name} is available at ${student.block}-Block, ${student.floor} Floor and Room No: ${student.room_no}`}
              </p>
            </Card>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {results.length === 0 && (
        <div className="text-center mt-10 animate-fade-in">
          <p className="text-xl text-gray-500">No matching results found</p>
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
