
import { useState, useEffect } from 'react';
import { X, ArrowRight, Heart, Search, ShoppingCart, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from '@/hooks/useUserPreferences';

export const WelcomeTutorial = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (preferences.firstVisit && !preferences.tutorialCompleted) {
      setIsOpen(true);
    }
  }, [preferences]);

  const tutorialSteps = [
    {
      title: "Bem-vindo ao Shopee Ofertas! 🎉",
      content: "Primeiro, como podemos te chamar?",
      component: (
        <div className="space-y-4">
          <Input
            placeholder="Digite seu nome..."
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="text-center"
          />
        </div>
      )
    },
    {
      title: `Olá, ${userName || 'visitante'}! ✨`,
      content: "Aqui você encontra os melhores produtos da Shopee com preços incríveis!",
      component: (
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Produtos selecionados especialmente para você</p>
        </div>
      )
    },
    {
      title: "Como usar? 🔍",
      content: "É super fácil navegar pelo app:",
      component: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <Search className="w-5 h-5 text-blue-600" />
            <span className="text-sm">Use a busca para encontrar produtos</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <Heart className="w-5 h-5 text-red-600" />
            <span className="text-sm">Favorite produtos para ver depois</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-orange-600" />
            <span className="text-sm">Clique para comprar na Shopee</span>
          </div>
        </div>
      )
    },
    {
      title: "Tudo pronto! 🚀",
      content: "Agora você pode explorar milhares de produtos incríveis!",
      component: (
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-gray-600">Aproveite as melhores ofertas da Shopee!</p>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep === 0 && userName.trim()) {
      updatePreferences({ userName: userName.trim() });
    }
    
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    updatePreferences({ 
      tutorialCompleted: true,
      userName: userName.trim() || preferences.userName
    });
    setIsOpen(false);
  };

  const handleSkip = () => {
    updatePreferences({ tutorialCompleted: true });
    setIsOpen(false);
  };

  const currentStepData = tutorialSteps[currentStep];
  const canProceed = currentStep === 0 ? userName.trim().length > 0 : true;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto" hideClose>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-2">
                {currentStep + 1} de {tutorialSteps.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center text-gray-900">
              {currentStepData.title}
            </h2>
            <p className="text-center text-gray-600">
              {currentStepData.content}
            </p>
            {currentStepData.component}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                Voltar
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Começar' : 'Próximo'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
