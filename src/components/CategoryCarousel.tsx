
import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UltraFastImage } from '@/components/UltraFastImage';
import { useUltraPerformance } from '@/hooks/useUltraPerformance';

interface Product {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  categoria: string;
}

interface CategoryCarouselProps {
  products: Product[];
  onProductClick: (productId: number) => void;
}

export const CategoryCarousel = memo<CategoryCarouselProps>(({ products, onProductClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { optimizedAction, throttledAction } = useUltraPerformance();

  // Memoize recent products to avoid recalculation
  const recentProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => b.id - a.id)
      .slice(0, 8);
  }, [products]);

  const maxIndex = useMemo(() => Math.ceil(recentProducts.length / 2) - 1, [recentProducts.length]);

  // Ultra-optimized auto-scroll
  useEffect(() => {
    if (recentProducts.length === 0 || !isAutoScrolling || isTransitioning) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev >= maxIndex ? 0 : prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [recentProducts.length, isAutoScrolling, isTransitioning, maxIndex]);

  const handleSlideChange = useCallback((direction: 'next' | 'prev') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setIsAutoScrolling(false);
    
    setCurrentIndex((prev) => {
      if (direction === 'next') {
        return prev >= maxIndex ? 0 : prev + 1;
      } else {
        return prev <= 0 ? maxIndex : prev - 1;
      }
    });

    // Reset transition state and auto-scroll
    setTimeout(() => {
      setIsTransitioning(false);
      setTimeout(() => setIsAutoScrolling(true), 8000);
    }, 300);
  }, [maxIndex, isTransitioning]);

  const nextSlide = optimizedAction(useCallback(() => handleSlideChange('next'), [handleSlideChange]));
  const prevSlide = optimizedAction(useCallback(() => handleSlideChange('prev'), [handleSlideChange]));

  const handleProductClick = throttledAction(useCallback((productId: number) => {
    onProductClick(productId);
  }, [onProductClick]), 150);

  if (recentProducts.length === 0) return null;

  return (
    <section className="px-4 py-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-magical-starlight font-magical">
            ✨ Novos Artefatos Mágicos
          </h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={prevSlide}
              disabled={isTransitioning}
              className="text-magical-starlight hover:bg-magical-gold/20 hover:text-magical-gold p-2 rounded-full transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={nextSlide}
              disabled={isTransitioning}
              className="text-magical-starlight hover:bg-magical-gold/20 hover:text-magical-gold p-2 rounded-full transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-out gap-3"
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)`,
              willChange: 'transform'
            }}
          >
            {recentProducts.map((product, index) => (
              <Card
                key={product.id}
                className="flex-shrink-0 w-1/2 md:w-1/4 lg:w-1/6 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-magical-starlight/10 border-magical-gold/30 backdrop-blur-sm"
                onClick={() => handleProductClick(product.id)}
                style={{
                  transform: 'translateZ(0)', // Force hardware acceleration
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="relative aspect-[4/3]">
                  <UltraFastImage
                    src={product.imagem1}
                    alt={product.produto}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    loading={index < 4 ? "eager" : "lazy"}
                    priority={index < 4}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-magical-midnight/60 to-transparent" />
                  
                  {index < 3 && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-magical-gold text-magical-midnight text-xs font-bold px-2 py-1 rounded-full border border-magical-gold/30">
                        NOVO
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-magical-starlight text-sm font-semibold line-clamp-2 mb-1 font-enchanted">
                      {product.produto}
                    </h3>
                    <div className="text-magical-gold text-xs font-medium font-magical">
                      A partir de {product.valor}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Optimized slide indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={optimizedAction(() => {
                if (!isTransitioning) {
                  setCurrentIndex(index);
                  setIsAutoScrolling(false);
                  setTimeout(() => setIsAutoScrolling(true), 8000);
                }
              })}
              disabled={isTransitioning}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'bg-magical-gold w-6' : 'bg-magical-starlight/50'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

CategoryCarousel.displayName = 'CategoryCarousel';
