
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

  // Dividir categorias em grupos de 4 (2 linhas x 2 colunas)
  const groupedCategories = [];
  for (let i = 0; i < allCategories.length; i += 4) {
    groupedCategories.push(allCategories.slice(i, i + 4));
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
    return category === 'todos' ? 'Todas as Escolas' : category;
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-magical-starlight font-magical">
          Explorar por Categoria
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
              <div className="grid grid-cols-2 gap-2">
                {group.map((category, index) => (
                  <Button
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    className={`h-12 text-xs font-medium transition-all duration-300 ${
                      currentCategory === category
                        ? 'bg-magical-gold text-magical-midnight shadow-lg scale-105'
                        : 'bg-magical-starlight/10 text-magical-starlight border border-magical-gold/30 hover:bg-magical-gold/20 hover:text-magical-gold'
                    }`}
                  >
                    {getCategoryLabel(category)}
                  </Button>
                ))}
                {/* Preencher espaços vazios se necessário */}
                {group.length < 4 && Array.from({ length: 4 - group.length }).map((_, emptyIndex) => (
                  <div key={`empty-${emptyIndex}`} className="h-12"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores de slide */}
      {groupedCategories.length > 1 && (
        <div className="flex justify-center mt-3 gap-2">
          {groupedCategories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'bg-magical-gold w-4' : 'bg-magical-starlight/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
