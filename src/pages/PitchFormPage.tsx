import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PitchForm } from '@/components/PitchForm';
import { PitchResults } from '@/components/PitchResults';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FlowiseService } from '@/services/flowiseApi';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Sparkles } from 'lucide-react';

type PageState = 'form' | 'results' | 'loading';

interface StartupEvaluationData {
  startup_idea: string;
  industry: string;
  target_audience: string;
  uploaded_file?: File;
}

const PitchFormPage = () => {
  const [pageState, setPageState] = useState<PageState>('form');
  const [evaluationData, setEvaluationData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFormSubmit = async (formData: StartupEvaluationData) => {
    setIsLoading(true);
    setPageState('loading');

    try {
      toast({
        title: "Evaluating your startup idea...",
        description: "StartwiseAI is analyzing your idea with comprehensive market research and recommendations.",
      });

      console.log('Sending request to your Flowise API:', formData);
      const result = await FlowiseService.generatePitchDeck(formData);
      console.log('Received evaluation from your Flowise API:', result);
      
      setEvaluationData(result);
      setPageState('results');

      toast({
        title: "Evaluation complete!",
        description: "Your comprehensive startup evaluation is ready for review.",
      });
    } catch (error) {
      console.error('Error evaluating startup idea:', error);
      
      toast({
        title: "Evaluation failed",
        description: error instanceof Error ? error.message : "Failed to evaluate startup idea. Please try again.",
        variant: "destructive"
      });
      
      setPageState('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    setPageState('form');
    setEvaluationData('');
  };

  const handleRegenerate = () => {
    setPageState('form');
    toast({
      title: "Ready to regenerate",
      description: "Modify your inputs below and submit again to create a new pitch deck.",
    });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (pageState === 'results' && evaluationData) {
    return (
      <>
        <ThemeToggle />
        <PitchResults 
          pitchData={evaluationData}
          onGoBack={handleGoBack}
          onRegenerate={handleRegenerate}
        />
      </>
    );
  }

  if (pageState === 'loading') {
    return (
      <>
        <ThemeToggle />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold mb-4 gradient-text">Analyzing Your Startup Idea</h2>
            <p className="text-muted-foreground leading-relaxed">
              StartwiseAI is conducting a comprehensive evaluation of your startup idea, 
              including market analysis, tech recommendations, and competitive insights. This usually takes 30-60 seconds.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <ThemeToggle />
      
      {/* Navigation Header */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {/* <div className="relative">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-accent to-secondary rounded-full flex items-center justify-center">
                <Sparkles className="h-2.5 w-2.5 text-primary" />
              </div>
            </div> */}
            <div>
              <h1 className="text-2xl font-bold gradient-text">StartwiseAI</h1>
              <p className="text-xs text-muted-foreground font-medium">Startup Intelligence</p>
            </div>
          </div>

          {/* Back Button */}
          <Button 
            onClick={handleBackToHome}
            variant="outline" 
            size="sm"
            className="glass-card bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </nav>
      
      {/* Form Section */}
      <PitchForm 
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default PitchFormPage;
