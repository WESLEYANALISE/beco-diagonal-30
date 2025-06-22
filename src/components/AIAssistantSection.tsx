
import React from 'react';
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, Zap } from 'lucide-react';

interface AIAssistantSectionProps {
  onActivate: () => void;
  isActive: boolean;
}

export const AIAssistantSection: React.FC<AIAssistantSectionProps> = ({
  onActivate,
  isActive
}) => {
  return (
    <section className="px-4 md:px-6 py-8 md:py-12 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden animate-fade-in">
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-500"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="space-y-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto animate-bounce backdrop-blur-sm">
            <Brain className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-white animate-slide-in-left flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
              Me Ajuda Escolher
              <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            </h2>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed animate-slide-in-right">
              <strong>IA Especializada</strong> para te ajudar a encontrar o produto perfeito
            </p>
            <p className="text-white/80 text-base max-w-xl mx-auto animate-fade-in">
              Selecione até 5 produtos e nossa inteligência artificial fará uma análise personalizada baseada nas suas necessidades
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>Análise em segundos</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>Recomendações personalizadas</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>100% gratuito</span>
            </div>
          </div>
          
          <Button 
            size="lg" 
            onClick={onActivate}
            className={`py-4 px-8 font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 ${
              isActive 
                ? 'bg-white text-purple-600 hover:bg-gray-100' 
                : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
            }`}
          >
            <Brain className="w-6 h-6 mr-3" />
            {isActive ? 'IA Ativada - Selecione Produtos' : 'Ativar Assistente IA'}
            <Sparkles className="w-6 h-6 ml-3" />
          </Button>

          {isActive && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mx-auto max-w-md animate-scale-in">
              <p className="text-white font-semibold text-sm">
                🎯 Modo IA Ativo
              </p>
              <p className="text-white/80 text-xs mt-1">
                Clique nos produtos abaixo para selecioná-los
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
