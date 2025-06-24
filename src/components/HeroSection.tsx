
import React from 'react';
import { Crown, TrendingUp, Star, Sparkles, Wand2 } from 'lucide-react';

interface HeroSectionProps {
  productsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  productsCount
}) => {
  return (
    <section className="px-4 md:px-6 py-6 md:py-12 animate-fade-in relative overflow-hidden">
      {/* Magical background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-2 h-2 bg-magical-gold rounded-full animate-sparkle"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-magical-bronze rounded-full animate-sparkle" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-magical-silver rounded-full animate-sparkle" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-magical-gold rounded-full animate-sparkle" style={{animationDelay: '1.5s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-4 md:space-y-6 mb-8">
          <div className="animate-fade-in-scale">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-magical-gold/30 to-magical-bronze/30 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-levitate shadow-2xl backdrop-blur-sm border border-magical-gold/20">
              <Crown className="w-8 h-8 md:w-10 md:h-10 text-magical-gold animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-magical font-bold text-magical-starlight mb-3 leading-tight animate-slide-in-left">
              Bem-vindo ao <span className="text-magical-gold animate-pulse bg-gradient-to-r from-magical-gold to-magical-bronze bg-clip-text text-transparent">Universo Potter</span>
            </h1>
            <p className="text-base md:text-lg text-magical-starlight/90 mb-6 max-w-2xl mx-auto leading-relaxed animate-slide-in-right font-enchanted">
              Descubra artefatos mágicos extraordinários com preços encantados! Os melhores itens do mundo bruxo reunidos em um só lugar.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto animate-scale-in">
            <div className="bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-magical-gold/30 transition-all duration-300 hover:scale-105 border border-magical-gold/20">
              <div className="text-lg font-bold text-magical-starlight flex items-center justify-center gap-1 font-magical">
                <TrendingUp className="w-4 h-4 animate-pulse text-magical-gold" />
                {productsCount}+
              </div>
              <div className="text-xs text-magical-silver font-enchanted">Artefatos</div>
            </div>
            <div className="bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-magical-gold/30 transition-all duration-300 hover:scale-105 border border-magical-gold/20">
              <div className="text-lg font-bold text-magical-starlight flex items-center justify-center gap-1 font-magical">
                <Star className="w-4 h-4 text-magical-gold animate-sparkle" />
                4.9
              </div>
              <div className="text-xs text-magical-silver font-enchanted">Magia</div>
            </div>
            <div className="bg-gradient-to-br from-magical-gold/20 to-magical-bronze/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-magical-gold/30 transition-all duration-300 hover:scale-105 border border-magical-gold/20">
              <div className="text-lg font-bold text-magical-starlight flex items-center justify-center gap-1 font-magical">
                <Sparkles className="w-4 h-4 text-magical-gold animate-bounce" />
                80%
              </div>
              <div className="text-xs text-magical-silver font-enchanted">Desconto</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
