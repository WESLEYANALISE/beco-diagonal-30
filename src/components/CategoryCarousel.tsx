
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

export const CategoryCarousel = ({ products, onProductClick }: CategoryCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Pega os 8 produtos mais recentes
    const newest = [...products]
      .sort((a, b) => b.id - a.id)
      .slice(0, 8);
    setRecentProducts(newest);
  }, [products]);

  // Auto-scroll effect with smooth transitions
  useEffect(() => {
    if (recentProducts.length === 0) return;
    
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const maxIndex = Math.ceil(recentProducts.length / 2) - 1;
          return prev >= maxIndex ? 0 : prev + 1;
        });
        setIsTransitioning(false);
      }, 150);
    }, 4000); // Move a cada 4 segundos

    return () => clearInterval(interval);
  }, [recentProducts.length]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      const maxIndex = Math.ceil(recentProducts.length / 2) - 1;
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      setIsTransitioning(false);
    }, 150);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      const maxIndex = Math.ceil(recentProducts.length / 2) - 1;
      setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
      setIsTransitioning(false);
    }, 150);
  };

  if (recentProducts.length === 0) return null;

  return (
    <section className="px-4 py-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">
            ✨ Novidades
          </h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={prevSlide}
              disabled={isTransitioning}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={nextSlide}
              disabled={isTransitioning}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className={`flex gap-3 transition-all duration-500 ease-in-out ${
              isTransitioning ? 'opacity-90' : 'opacity-100'
            }`}
            style={{ 
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {recentProducts.map((product, index) => (
              <Card
                key={product.id}
                className="flex-shrink-0 w-1/2 md:w-1/4 lg:w-1/6 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl transform-gpu"
                onClick={() => onProductClick(product.id)}
              >
                <div className="relative aspect-[4/3]">
                  <img
                    src={product.imagem1}
                    alt={product.produto}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Badge NOVO para os 3 primeiros */}
                  {index < 3 && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        NOVO
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white text-sm font-semibold line-clamp-2 mb-1">
                      {product.produto}
                    </h3>
                    <div className="text-white/90 text-xs font-medium">
                      A partir de {product.valor}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Indicadores de slide */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: Math.ceil(recentProducts.length / 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentIndex(index);
                    setIsTransitioning(false);
                  }, 150);
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? 'bg-white w-6' : 'bg-white/50 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
