
import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onExploreCollection: (categoria: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreCollection }) => {
  return (
    <section className="px-4 py-8 text-center">
      <div className="mb-8">
        <div className="relative inline-block">
          <h1 className="text-4xl md:text-5xl font-bold text-magical-starlight mb-4 font-magical">
            ✨ Artefatos Mágicos
          </h1>
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-8 h-8 text-magical-gold animate-pulse" />
          </div>
        </div>
        
        <p className="text-lg text-magical-starlight/90 mb-6 font-enchanted leading-relaxed">
          Descubra objetos encantados e poções raras<br/>
          do mundo bruxo mais fascinante
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={() => onExploreCollection('Livros')}
            className="bg-gradient-to-r from-magical-gold to-magical-bronze hover:from-magical-bronze hover:to-magical-gold text-magical-midnight font-bold py-3 px-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-enchanted"
          >
            <Wand2 className="w-5 h-5 mr-2" />
            Explorar Coleção
          </Button>
          
          <Button 
            onClick={() => onExploreCollection('Varitas')}
            variant="outline" 
            className="border-2 border-magical-gold text-magical-gold hover:bg-magical-gold hover:text-magical-midnight font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 font-enchanted"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Varitas Mágicas
          </Button>
        </div>
      </div>
    </section>
  );
};
