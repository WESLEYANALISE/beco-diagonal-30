
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LazyImage } from '@/components/LazyImage';

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
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  useEffect(() => {
    // Pega os 30 produtos mais recentes (aumentado de 8 para 30)
    const newest = [...products]
      .sort((a, b) => b.id - a.id)
      .slice(0, 30);
    setRecentProducts(newest);
  }, [products]);

  // Auto-scroll otimizado para 30 produtos
  useEffect(() => {
    if (recentProducts.length === 0 || !isAutoScrolling) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const itemsPerView = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : 2;
        const maxIndex = Math.ceil(recentProducts.length / itemsPerView) - 1;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000); // Aumentado para 5 segundos para dar tempo de visualizar mais produtos

    return () => clearInterval(interval);
  }, [recentProducts.length, isAutoScrolling]);

  const nextSlide = useCallback(() => {
    setIsAutoScrolling(false);
    const itemsPerView = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : 2;
    const maxIndex = Math.ceil(recentProducts.length / itemsPerView) - 1;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    // Reativar auto-scroll após 10 segundos
    setTimeout(() => setIsAutoScrolling(true), 10000);
  }, [recentProducts.length]);

  const prevSlide = useCallback(() => {
    setIsAutoScrolling(false);
    const itemsPerView = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : 2;
    const maxIndex = Math.ceil(recentProducts.length / itemsPerView) - 1;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    // Reativar auto-scroll após 10 segundos
    setTimeout(() => setIsAutoScrolling(true), 10000);
  }, [recentProducts.length]);

  const handleProductClick = useCallback((productId: number) => {
    onProductClick(productId);
  }, [onProductClick]);

  if (recentProducts.length === 0) return null;

  const itemsPerView = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : 2;

  return (
    <section className="px-4 py-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-magical-starlight font-magical">
            ⚡ Novidades Mágicas - {recentProducts.length} Artefatos
          </h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={prevSlide}
              className="text-magical-starlight hover:bg-magical-gold/20 p-2 rounded-full transition-all duration-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={nextSlide}
              className="text-magical-starlight hover:bg-magical-gold/20 p-2 rounded-full transition-all duration-300"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-in-out gap-3"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {recentProducts.map((product, index) => (
              <Card
                key={product.id}
                className={`flex-shrink-0 ${
                  itemsPerView === 6 ? 'w-1/6' : itemsPerView === 4 ? 'w-1/4' : 'w-1/2'
                } overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-magical-deepPurple/80 to-magical-mysticalPurple/60 border border-magical-gold/30`}
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative aspect-[4/3]">
                  <LazyImage
                    src={product.imagem1}
                    alt={product.produto}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-magical-midnight/80 to-transparent" />
                  
                  {/* Badge NOVO para os 10 primeiros */}
                  {index < 10 && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-gradient-to-r from-magical-crimson to-magical-darkGold text-magical-starlight text-xs font-bold px-2 py-1 rounded-full animate-magical-glow border border-magical-gold/30">
                        ⚡ NOVO
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-magical-starlight text-sm font-semibold line-clamp-2 mb-1 font-enchanted">
                      {product.produto}
                    </h3>
                    <div className="text-magical-gold text-xs font-bold font-magical">
                      Menos de {product.valor}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Indicadores de slide otimizados para 30 produtos */}
        <div className="flex justify-center mt-4 gap-1">
          {Array.from({ length: Math.ceil(recentProducts.length / itemsPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoScrolling(false);
                setTimeout(() => setIsAutoScrolling(true), 10000);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                currentIndex === index ? 'bg-magical-gold w-6' : 'bg-magical-starlight/50'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
