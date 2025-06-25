
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { OptimizedLazyImage } from '@/components/OptimizedLazyImage';

interface Product {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  categoria: string;
}

interface OptimizedCarouselProps {
  products: Product[];
  onProductClick: (productId: number) => void;
  autoScrollInterval?: number;
  itemsToShow?: number;
}

const OptimizedCarouselComponent: React.FC<OptimizedCarouselProps> = ({
  products,
  onProductClick,
  autoScrollInterval = 6000, // Increased from 4000ms for better UX
  itemsToShow = 2
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  // Memoize filtered and shuffled products
  const optimizedProducts = useMemo(() => {
    const validProducts = products.filter(product => 
      product && product.imagem1 && product.produto && product.valor
    );
    
    // Shuffle array for better variety
    const shuffled = [...validProducts];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, 8); // Limit to 8 items for better performance
  }, [products]);

  const maxIndex = Math.max(0, Math.ceil(optimizedProducts.length / itemsToShow) - 1);

  // Optimized auto-scroll with performance improvements
  useEffect(() => {
    if (optimizedProducts.length === 0 || !isAutoScrolling || isDragging) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [optimizedProducts.length, isAutoScrolling, isDragging, maxIndex, autoScrollInterval]);

  const handleNavigation = useCallback((direction: 'next' | 'prev') => {
    setIsAutoScrolling(false);
    
    if (direction === 'next') {
      setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
    } else {
      setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
    }
    
    // Re-enable auto-scroll after 10 seconds
    setTimeout(() => setIsAutoScrolling(true), 10000);
  }, [maxIndex]);

  const handleProductClick = useCallback((productId: number) => {
    onProductClick(productId);
  }, [onProductClick]);

  // Touch/drag handlers for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setIsAutoScrolling(false);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    
    const diffX = startX - currentX;
    const threshold = 50;
    
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        handleNavigation('next');
      } else {
        handleNavigation('prev');
      }
    }
    
    setIsDragging(false);
    setTimeout(() => setIsAutoScrolling(true), 10000);
  }, [isDragging, startX, currentX, handleNavigation]);

  if (optimizedProducts.length === 0) return null;

  return (
    <section className="px-4 py-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-magical-starlight font-magical">
            ✨ Artefatos em Destaque
          </h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleNavigation('prev')}
              className="text-magical-starlight hover:bg-magical-gold/20 p-2 rounded-full transition-all duration-200 will-change-transform"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleNavigation('next')}
              className="text-magical-starlight hover:bg-magical-gold/20 p-2 rounded-full transition-all duration-200 will-change-transform"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div 
          className="relative overflow-hidden touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-500 ease-out will-change-transform gap-3"
            style={{ 
              transform: `translate3d(-${currentIndex * 100}%, 0, 0)`,
              willChange: 'transform'
            }}
          >
            {optimizedProducts.map((product, index) => (
              <Card
                key={`${product.id}-${index}`}
                className="flex-shrink-0 w-1/2 md:w-1/4 lg:w-1/6 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl will-change-transform bg-gradient-to-br from-magical-deepPurple/80 to-magical-mysticalPurple/60 border border-magical-gold/30"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative aspect-[4/3]">
                  <OptimizedLazyImage
                    src={product.imagem1}
                    alt={product.produto}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 will-change-transform"
                    priority={index < 2} // Prioritize first 2 images
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-magical-midnight/60 to-transparent" />
                  
                  {index < 3 && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-magical-gold/90 text-magical-midnight text-xs font-bold px-2 py-1 rounded-full animate-pulse">
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
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoScrolling(false);
                setTimeout(() => setIsAutoScrolling(true), 10000);
              }}
              className={`h-2 rounded-full transition-all duration-300 will-change-transform ${
                currentIndex === index ? 'bg-magical-gold w-6' : 'bg-magical-starlight/50 w-2'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export const OptimizedCarousel = memo(OptimizedCarouselComponent);
OptimizedCarousel.displayName = 'OptimizedCarousel';
