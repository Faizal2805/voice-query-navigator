import { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Keyboard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from "@/components/ui/use-toast";

const DepartmentSelection = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [outputText, setOutputText] = useState('');
  const navigate = useNavigate();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const text = "Please tell me both the department and year. For example, 'Computer Science department, second year'";
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
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const startListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    // Start recognition after 1 second
    setTimeout(() => {
      setIsListening(true);
      setOutputText('Listening...');
      
      const SpeechRecognition = (window.SpeechRecognition || window.webkitSpeechRecognition) as SpeechRecognitionConstructor | undefined;
      
      if (!SpeechRecognition) {
        setOutputText('Speech recognition is not supported in your browser');
        setIsListening(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-UK';

      recognitionRef.current = recognition;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setOutputText(transcript);
        
        // Reset silence timeout
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        
        silenceTimeoutRef.current = setTimeout(async () => {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            
            try {
              // Show what we're processing
              toast({
                title: "Processing your request",
                description: `Looking for: ${transcript}`,
              });

              const response = await fetch('https://extract-dept.onrender.com/extract', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: transcript }),
              });

              const data = await response.json();
              
              if (!data || data.error) {
                const errorMessage = "Please mention both department and year clearly. For example, 'Computer Science department, second year'";
                setOutputText(errorMessage);
                const utterance = new SpeechSynthesisUtterance(errorMessage);
                utterance.lang = 'en-UK';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
                
                toast({
                  variant: "destructive",
                  title: "Information Missing",
                  description: errorMessage,
                });
                return;
              }

              // Get stored student list and filter based on department and year
              const studentsList = JSON.parse(sessionStorage.getItem('studentsList') || '[]');
              const filteredStudents = studentsList.filter((student: any) => 
                student.department.toLowerCase() === data.department.toLowerCase() &&
                student.year.toString() === data.year.toString()
              );

              if (filteredStudents.length > 0) {
                const student = filteredStudents[0];
                const message = `${student.name} is available at ${student.block} - Block, ${student.floor} Floor and Room-No: ${student.room_no}.`;
                
                setOutputText(message);
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.lang = 'en-UK';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);

                toast({
                  title: "Student Found",
                  description: message,
                });
              } else {
                const errorMessage = "No student found with these details";
                setOutputText(errorMessage);
                const utterance = new SpeechSynthesisUtterance(errorMessage);
                utterance.lang = 'en-UK';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);

                toast({
                  variant: "destructive",
                  title: "No Match",
                  description: errorMessage,
                });
              }
            } catch (error) {
              console.error('Error processing department/year:', error);
              const errorMessage = "Please mention both department and year clearly. For example, 'Computer Science department, second year'";
              setOutputText(errorMessage);
              const utterance = new SpeechSynthesisUtterance(errorMessage);
              utterance.lang = 'en-UK';
              utterance.rate = 0.9;
              window.speechSynthesis.speak(utterance);

              toast({
                variant: "destructive",
                title: "Error",
                description: errorMessage,
              });
            }
          }
        }, 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <div className="container flex flex-col items-center justify-center">
        <p className="mt-32 mb-4 text-[#2d336b] text-2xl font-bold">
          {displayedText}
        </p>
        <p className="text-gray-600 text-center max-w-md mb-8">{outputText}</p>
        <button 
          id="Start-Btn"
          className="voice-button"
          onClick={startListening}
        >
          <div className={`rounded-full ${isListening ? 'scale-125' : ''} transition-transform`}>
            <div className="rainbow-container">
              <div className="green"></div>
              <div className="pink"></div>
              <div className="blue"></div>
            </div>
          </div>
        </button>

        {outputText && outputText !== 'Listening...' && !outputText.includes('Please, provide') && (
          <button
            id="OK-Btn"
            onClick={() => navigate('/')}
            className="mt-8 bg-[#1D4ED8] hover:bg-[#1e40af] text-white px-8 py-2 rounded-lg text-lg font-semibold transition-all duration-300"
          >
            OK
          </button>
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
            <button 
              onClick={() => setShowKeyboard(!showKeyboard)}
              className="border-0 bg-white"
            >
              <Keyboard size={32} />
            </button>
          </div>
          {showKeyboard && (
            <div className="bg-white">
              <Input
                type="text"
                placeholder="Ask me anything..."
                className="keyboard-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setOutputText(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DepartmentSelection;
