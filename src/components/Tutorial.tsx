
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, ChevronRight, Heart, Sparkles, Search, ShoppingCart } from 'lucide-react';

interface TutorialProps {
  onComplete: (userName: string) => void;
  onSkip: () => void;
}

const tutorialSteps = [
  {
    title: "Bem-vindo ao Shopee Showcase! 🛍️",
    content: "Descubra os melhores produtos da Shopee com preços incríveis e compare facilmente!",
    icon: ShoppingCart,
    color: "from-blue-500 to-purple-500"
  },
  {
    title: "Navegue por Categorias 📱",
    content: "Explore produtos organizados por categorias como Eletrônicos, Casa & Jardim, Moda e muito mais!",
    icon: Search,
    color: "from-green-500 to-blue-500"
  },
  {
    title: "Favorite Produtos ❤️",
    content: "Clique no coração para salvar seus produtos favoritos e acessá-los facilmente depois!",
    icon: Heart,
    color: "from-red-500 to-pink-500"
  },
  {
    title: "IA Inteligente 🤖",
    content: "Use nossa IA para comparar até 5 produtos e descobrir qual é a melhor opção para você!",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500"
  }
];

export const Tutorial = ({ onComplete, onSkip }: TutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowNameInput(true);
    }
  };

  const handleComplete = () => {
    if (userName.trim()) {
      onComplete(userName.trim());
    }
  };

  const currentTutorial = tutorialSteps[currentStep];
  const IconComponent = currentTutorial?.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-white shadow-2xl animate-scale-in">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              {showNameInput ? 'Personalização' : `${currentStep + 1} de ${tutorialSteps.length}`}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkip}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {!showNameInput ? (
            <>
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${currentTutorial.color} flex items-center justify-center mx-auto mb-4 animate-bounce`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-xl font-bold text-center mb-4 text-gray-900">
                {currentTutorial.title}
              </h2>
              
              <p className="text-gray-600 text-center mb-6 leading-relaxed">
                {currentTutorial.content}
              </p>

              <div className="flex gap-2 mb-4">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                      index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onSkip}
                  className="flex-1"
                >
                  Pular Tutorial
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {currentStep === tutorialSteps.length - 1 ? 'Finalizar' : 'Próximo'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👋</span>
              </div>
              
              <h2 className="text-xl font-bold text-center mb-4 text-gray-900">
                Como podemos te chamar?
              </h2>
              
              <p className="text-gray-600 text-center mb-6">
                Vamos personalizar sua experiência! Digite seu nome para continuar.
              </p>

              <Input
                placeholder="Digite seu nome..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="mb-6"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleComplete()}
              />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onSkip}
                  className="flex-1"
                >
                  Pular
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={!userName.trim()}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  Continuar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
