import React, { useState, useEffect } from "react";

const ResultsPage = ({ studentsList, department, year }) => {
  const [filteredResults, setFilteredResults] = useState([]);

  useEffect(() => {
    console.log("Retrieved studentsList:", studentsList);
    console.log("Extracted Department:", department);
    console.log("Mapped Year:", year);

    if (studentsList.length > 0) {
      const filtered = studentsList.filter(
        (student) =>
          student.department.toLowerCase() === department.toLowerCase() &&
          student.year.toLowerCase() === year.toLowerCase()
      );

      console.log("Filtered Students:", filtered);
      setFilteredResults(filtered);
    }
  }, [studentsList, department, year]);

  return (
  <div className="p-6 bg-[#FAFAFF] min-h-screen">
    <h1 className="text-2xl font-bold mb-4">Search Results</h1>

    {/* Debugging: Check if the filteredResults array has students */}
    {filteredResults.length > 0 && (
      <p className="text-green-500 font-bold">
        Rendering {filteredResults.length} students...
      </p>
    )}

    {/* Debugging: Show message if no results found */}
    {filteredResults.length === 0 && (
      <p className="text-red-500 font-bold text-lg">No matching student found.</p>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredResults.map((student, index) => (
        <div
          key={index}
          className="p-4 bg-gray-100 rounded-lg shadow-md border border-gray-300"
        >
          <h2 className="text-xl font-bold text-blue-600">{student.name}</h2>
          <p className="text-gray-700">Block: {student.block}</p>
          <p className="text-gray-700">Floor: {student.floor}</p>
          <p className="text-gray-700">Room No: {student.room_no}</p>
        </div>
      ))}
    </div>
  </div>
);
};

export default ResultsPage;
