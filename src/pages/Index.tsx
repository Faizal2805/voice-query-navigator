
import { useState } from 'react';
import { VoiceInput } from '@/components/VoiceInput';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserRound, Users } from 'lucide-react';

type UserType = 'student' | 'faculty' | null;
type SearchStep = 'initial' | 'name' | 'confirm' | 'department' | 'relation';

const Index = () => {
  const [userType, setUserType] = useState<UserType>(null);
  const [step, setStep] = useState<SearchStep>('initial');
  const [transcript, setTranscript] = useState('');
  const [searchData, setSearchData] = useState({
    name: '',
    department: '',
    year: '',
    relation: '',
  });

  const handleTranscript = (text: string) => {
    setTranscript(text);

    switch (step) {
      case 'name':
        setSearchData(prev => ({ ...prev, name: text }));
        break;
      case 'department':
        // In a real app, we'd use NLP to extract department and year
        setSearchData(prev => ({ ...prev, department: text }));
        break;
      case 'relation':
        setSearchData(prev => ({ ...prev, relation: text }));
        break;
      default:
        break;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'initial':
        return (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-semibold text-primary text-center">
              How can I assist you?
            </h1>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => {
                  setUserType('student');
                  setStep('name');
                }}
                className="bg-accent hover:bg-accent-dark p-6 h-auto flex flex-col gap-2"
              >
                <Users className="h-8 w-8" />
                <span>Student Details</span>
              </Button>
              <Button
                onClick={() => {
                  setUserType('faculty');
                  setStep('name');
                }}
                className="bg-primary hover:bg-primary-dark p-6 h-auto flex flex-col gap-2"
              >
                <UserRound className="h-8 w-8" />
                <span>Faculty Details</span>
              </Button>
            </div>
          </div>
        );

      case 'name':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-medium text-primary text-center">
              Who are you looking for?
            </h2>
            <VoiceInput
              onTranscript={handleTranscript}
              placeholder="Speak the name..."
            />
            {transcript && (
              <div className="flex justify-center">
                <Button
                  onClick={() => setStep('confirm')}
                  className="bg-accent hover:bg-accent-dark"
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-medium text-primary text-center">
              Are you looking for {searchData.name}?
            </h2>
            <div className="flex justify-center gap-4">
              <Button
                onClick={() => setStep('department')}
                className="bg-accent hover:bg-accent-dark"
              >
                Yes, continue
              </Button>
              <Button
                onClick={() => {
                  setTranscript('');
                  setStep('name');
                }}
                className="bg-primary hover:bg-primary-dark"
              >
                No, try again
              </Button>
            </div>
          </div>
        );

      case 'department':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-medium text-primary text-center">
              Which department and year does {searchData.name} belong to?
            </h2>
            <VoiceInput
              onTranscript={handleTranscript}
              placeholder="Speak department and year..."
            />
            {transcript && (
              <div className="flex justify-center">
                <Button
                  onClick={() => setStep('relation')}
                  className="bg-accent hover:bg-accent-dark"
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        );

      case 'relation':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-medium text-primary text-center">
              What is your relation with {searchData.name}?
            </h2>
            <VoiceInput
              onTranscript={handleTranscript}
              placeholder="Speak your relation..."
            />
            {transcript && (
              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    // Here we would typically process the collected data
                    console.log('Collected data:', searchData);
                    setStep('initial');
                    setTranscript('');
                    setSearchData({
                      name: '',
                      department: '',
                      year: '',
                      relation: '',
                    });
                  }}
                  className="bg-accent hover:bg-accent-dark"
                >
                  Submit
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light px-4 py-8">
      <div className="max-w-xl mx-auto">
        <Card className="p-8 bg-white/80 backdrop-blur shadow-lg">
          {renderStep()}
        </Card>
      </div>
    </div>
  );
};

export default Index;
