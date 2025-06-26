
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface CategoryCarouselExplorarProps {
  categories: string[];
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryCarouselExplorar: React.FC<CategoryCarouselExplorarProps> = ({
  categories,
  currentCategory,
  onCategoryChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Adicionar "todos" no início das categorias
  const allCategories = ['todos', ...categories];

  // Dividir categorias em grupos menores para mobile
  const groupedCategories = [];
  for (let i = 0; i < allCategories.length; i += 3) {
    groupedCategories.push(allCategories.slice(i, i + 3));
  }

  const nextSlide = () => {
    if (currentIndex < groupedCategories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getCategoryLabel = (category: string) => {
    return category === 'todos' ? '🏰 Todas' : `✨ ${category}`;
  };

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      'todos': '🏰',
      'Itens Colecionáveis': '👑',
      'Bonecas e Brinquedos de Pelúcia': '🧸',
      'Luminária': '💡',
      'Colares': '📿',
      'Moletons e Suéteres': '👕',
      'Capinhas': '📱',
      'Canecas': '☕'
    };
    return emojiMap[category] || '⚡';
  };

  return (
    <div className="relative bg-magical-midnight/30 backdrop-blur-sm rounded-2xl p-4 border border-magical-gold/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-magical-starlight font-magical">
          🏰 Explorar por Casa
        </h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="text-magical-starlight hover:bg-magical-gold/20 hover:text-magical-gold p-2 rounded-full transition-all duration-300 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={nextSlide}
            disabled={currentIndex === groupedCategories.length - 1}
            className="text-magical-starlight hover:bg-magical-gold/20 hover:text-magical-gold p-2 rounded-full transition-all duration-300 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {groupedCategories.map((group, groupIndex) => (
            <div key={groupIndex} className="w-full flex-shrink-0">
              <div className="flex flex-col gap-3">
                {group.map((category, index) => (
                  <Button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`h-14 text-sm font-medium transition-all duration-300 flex items-center justify-start gap-3 px-4 ${
                      currentCategory === category
                        ? 'bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight shadow-lg scale-105 border-2 border-magical-gold/50'
                        : 'bg-magical-starlight/10 text-magical-starlight border border-magical-gold/30 hover:bg-magical-gold/20 hover:text-magical-gold hover:scale-102'
                    }`}
                  >
                    <span className="text-xl">{getCategoryEmoji(category)}</span>
                    <span className="flex-1 text-left">{getCategoryLabel(category)}</span>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores de slide otimizados */}
      {groupedCategories.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {groupedCategories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === index 
                  ? 'bg-magical-gold w-6 h-2 shadow-md shadow-magical-gold/50' 
                  : 'bg-magical-starlight/50 hover:bg-magical-starlight/80 w-2 h-2'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
