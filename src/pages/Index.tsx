import { HeroSection } from '@/components/HeroSection';
import { ThemeToggle } from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen">
      <ThemeToggle />
      <HeroSection />
    </div>
  );
};

export default Index;
