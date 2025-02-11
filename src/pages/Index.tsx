
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [hasSpoken, setHasSpoken] = useState(false);

  useEffect(() => {
    if (!hasSpoken && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("I am Eva, a virtual assistant");
      utterance.onend = () => setHasSpoken(true);
      speechSynthesis.speak(utterance);
    }
  }, [hasSpoken]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="glass-morphism p-8 w-full max-w-md animate-fade-in">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          I am Eva, a virtual assistant
        </h1>
        <p className="text-gray-600">
          How can I help you today?
        </p>
      </Card>
    </div>
  );
};

export default Index;
