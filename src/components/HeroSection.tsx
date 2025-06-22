
import React from 'react';
import { Gift, TrendingUp, Star, Zap } from 'lucide-react';

interface HeroSectionProps {
  productsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ productsCount }) => {
  return (
    <section className="px-4 md:px-6 py-6 md:py-12 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 md:space-y-6 mb-8">
          <div className="animate-fade-in-scale">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 animate-bounce shadow-2xl backdrop-blur-sm">
              <Gift className="w-8 h-8 md:w-10 md:h-10 text-white animate-pulse" />
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight animate-slide-in-left">
              Achadinhos <span className="text-yellow-300 animate-pulse">Shopee</span>
            </h1>
            <p className="text-base md:text-lg text-white/90 mb-6 max-w-2xl mx-auto leading-relaxed animate-slide-in-right">
              Os melhores produtos com os menores preços! Descubra ofertas incríveis e promoções imperdíveis.
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto animate-scale-in">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/30 transition-all duration-300 hover:scale-105">
              <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4 animate-pulse" />
                {productsCount}+
              </div>
              <div className="text-xs text-white/80">Produtos</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/30 transition-all duration-300 hover:scale-105">
              <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-300 animate-spin-slow" />
                4.8
              </div>
              <div className="text-xs text-white/80">Avaliação</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/30 transition-all duration-300 hover:scale-105">
              <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 text-yellow-300 animate-bounce" />
                70%
              </div>
              <div className="text-xs text-white/80">Desconto</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
