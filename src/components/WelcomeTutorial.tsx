
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Sparkles, ShoppingCart, Heart, Search, ArrowRight } from 'lucide-react';

export const WelcomeTutorial = () => {
  const { preferences, updatePreferences, isLoading } = useUserPreferences();
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    if (!isLoading && preferences.firstVisit && !preferences.tutorialCompleted) {
      setShowTutorial(true);
    }
  }, [isLoading, preferences]);

  const steps = [
    {
      title: "Bem-vindo ao Shopee Ofertas! 🎉",
      content: "Descobrir os melhores produtos com os melhores preços nunca foi tão fácil!",
      icon: <Sparkles className="w-8 h-8 text-yellow-500" />
    },
    {
      title: "Como te chamamos? 😊",
      content: "Queremos personalizar sua experiência:",
      icon: <Heart className="w-8 h-8 text-red-500" />,
      showInput: true
    },
    {
      title: "Explore Categorias 🛍️",
      content: "Navegue por diferentes categorias de produtos e encontre exatamente o que precisa.",
      icon: <ShoppingCart className="w-8 h-8 text-blue-500" />
    },
    {
      title: "Busque Produtos 🔍",
      content: "Use nossa busca inteligente para encontrar produtos específicos rapidamente.",
      icon: <Search className="w-8 h-8 text-green-500" />
    },
    {
      title: "Salve seus Favoritos ❤️",
      content: "Clique no coração para salvar produtos e acessá-los depois na aba Favoritos.",
      icon: <Heart className="w-8 h-8 text-red-500" />
    },
    {
      title: "Pronto para começar! 🚀",
      content: "Agora você está pronto para descobrir ofertas incríveis. Vamos começar?",
      icon: <ArrowRight className="w-8 h-8 text-purple-500" />
    }
  ];

  const handleNext = () => {
    if (currentStep === 1 && userName.trim()) {
      updatePreferences({ userName: userName.trim() });
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    updatePreferences({ 
      tutorialCompleted: true,
      firstVisit: false,
      userName: userName.trim() || 'visitante'
    });
    setShowTutorial(false);
  };

  const handleSkip = () => {
    updatePreferences({ 
      tutorialCompleted: true,
      firstVisit: false,
      userName: 'visitante'
    });
    setShowTutorial(false);
  };

  if (!showTutorial || isLoading) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isNameStep = currentStep === 1;

  return (
    <Dialog open={showTutorial} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
        <div className="text-center space-y-6 p-4">
          {/* Step indicator */}
          <div className="flex justify-center space-x-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-orange-500 w-6' 
                    : index < currentStep 
                      ? 'bg-orange-300' 
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
              {currentStepData.icon}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {currentStepData.content}
            </p>

            {/* Name input */}
            {isNameStep && (
              <div className="space-y-3">
                <Input
                  placeholder="Digite seu nome"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-center text-lg border-orange-200 focus:border-orange-400"
                  maxLength={30}
                />
                <p className="text-xs text-gray-500">
                  Opcional - você pode pular esta etapa
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {!isLastStep && (
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Pular
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={isNameStep && userName.length > 30}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
            >
              {isLastStep ? 'Começar!' : 'Próximo'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
