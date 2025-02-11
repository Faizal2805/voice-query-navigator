
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [hasSpoken, setHasSpoken] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!hasSpoken && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("I am Eva, a virtual assistant");
      utterance.onend = () => setHasSpoken(true);
      speechSynthesis.speak(utterance);
    }
  }, [hasSpoken]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className={`glass-morphism ${isMobile ? 'p-6 w-[90%]' : 'p-8 w-full max-w-md'} animate-fade-in`}>
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-800 mb-4`}>
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
