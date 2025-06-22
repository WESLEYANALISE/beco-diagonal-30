
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CategoryCarouselProps {
  categories: string[];
  onCategorySelect: (category: string) => void;
  selectedCategory: string;
}

const categoryImages: Record<string, string> = {
  'Beleza e Cuidados Pessoais': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
  'Casa e Decoração': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
  'Eletrônicos': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop',
  'Moda': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
  'Esportes': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
  'Saúde': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop',
};

export const CategoryCarousel = ({ categories, onCategorySelect, selectedCategory }: CategoryCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCategories, setVisibleCategories] = useState<string[]>([]);

  useEffect(() => {
    // Show top 6 categories with fallback images
    const topCategories = categories.slice(0, 6);
    setVisibleCategories(topCategories);
  }, [categories]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(visibleCategories.length / 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(visibleCategories.length / 2)) % Math.ceil(visibleCategories.length / 2));
  };

  const getImageForCategory = (category: string) => {
    return categoryImages[category] || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=200&fit=crop';
  };

  if (visibleCategories.length === 0) return null;

  return (
    <section className="px-4 py-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            📍 Categorias Populares
          </h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={prevSlide}
              className="text-white hover:bg-white/20 p-2 rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={nextSlide}
              className="text-white hover:bg-white/20 p-2 rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out gap-3"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {visibleCategories.map((category, index) => (
              <Card
                key={category}
                className={`flex-shrink-0 w-1/2 md:w-1/4 lg:w-1/6 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category ? 'ring-2 ring-white shadow-xl' : ''
                }`}
                onClick={() => onCategorySelect(category)}
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={getImageForCategory(category)}
                    alt={category}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white text-sm font-semibold line-clamp-2">
                      {category}
                    </h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
