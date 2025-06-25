
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LazyImage } from '@/components/LazyImage';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { useMagicalSounds } from '@/hooks/useMagicalSounds';
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  imagem2: string;
  imagem3: string;
  imagem4: string;
  imagem5: string;
  imagem6?: string;
  imagem7?: string;
  categoria: string;
  subcategoria?: string;
  descricao?: string;
  uso?: string;
  video: string;
  link: string;
}

interface CategoryCarouselProps {
  products: Product[];
  onProductClick: (productId: number) => void;
}

export const CategoryCarousel = ({ products, onProductClick }: CategoryCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [fullProducts, setFullProducts] = useState<Product[]>([]);
  const { playRandomMagicalSound } = useMagicalSounds();

  useEffect(() => {
    // Pega os 30 produtos mais recentes
    const newest = [...products]
      .sort((a, b) => b.id - a.id)
      .slice(0, 30);
    setRecentProducts(newest);
  }, [products]);

  // Load full product details when needed
  const loadFullProductDetails = async (productId: number) => {
    try {
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('*')
        .eq('id', productId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error loading product details:', error);
      return null;
    }
  };

  // Auto-scroll otimizado para 30 produtos
  useEffect(() => {
    if (recentProducts.length === 0 || !isAutoScrolling) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const itemsPerView = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : 2;
        const maxIndex = Math.ceil(recentProducts.length / itemsPerView) - 1;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [recentProducts.length, isAutoScrolling]);

  const nextSlide = useCallback(() => {
    setIsAutoScrolling(false);
    playRandomMagicalSound();
    const itemsPerView = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : 2;
    const maxIndex = Math.ceil(recentProducts.length / itemsPerView) - 1;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setTimeout(() => setIsAutoScrolling(true), 10000);
  }, [recentProducts.length, playRandomMagicalSound]);

  const prevSlide = useCallback(() => {
    setIsAutoScrolling(false);
    playRandomMagicalSound();
    const itemsPerView = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : 2;
    const maxIndex = Math.ceil(recentProducts.length / itemsPerView) - 1;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsAutoScrolling(true), 10000);
  }, [recentProducts.length, playRandomMagicalSound]);

  const handleProductClick = useCallback(async (product: Product) => {
    playRandomMagicalSound();
    onProductClick(product.id);
    
    // Load full product details and open modal
    const fullProduct = await loadFullProductDetails(product.id);
    if (fullProduct) {
      setSelectedProduct(fullProduct);
    }
  }, [onProductClick, playRandomMagicalSound]);

  if (recentProducts.length === 0) return null;

  const itemsPerView = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 768 ? 4 : 2;

  return (
    <>
      <section className="px-4 py-4 animate-fade-in relative overflow-hidden">
        {/* Magical background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-magical-deepPurple/10 via-transparent to-magical-mysticalPurple/10 pointer-events-none"></div>
        <div className="absolute top-2 left-10 w-2 h-2 bg-magical-gold rounded-full animate-sparkle opacity-60"></div>
        <div className="absolute bottom-4 right-20 w-3 h-3 bg-magical-bronze rounded-full animate-magical-glow opacity-40"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-magical-starlight font-magical flex items-center gap-2">
              ⚡ Novidades Mágicas - {recentProducts.length} Artefatos Encantados
              <span className="text-sm animate-sparkle">✨</span>
            </h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={prevSlide}
                className="text-magical-starlight hover:bg-magical-gold/20 p-2 rounded-full transition-all duration-300 hover:scale-110 border border-magical-gold/30 hover:border-magical-gold/60 shadow-lg hover:shadow-magical-gold/30"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={nextSlide}
                className="text-magical-starlight hover:bg-magical-gold/20 p-2 rounded-full transition-all duration-300 hover:scale-110 border border-magical-gold/30 hover:border-magical-gold/60 shadow-lg hover:shadow-magical-gold/30"
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
                  } overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl bg-gradient-to-br from-magical-deepPurple/80 to-magical-mysticalPurple/60 border border-magical-gold/30 hover:border-magical-gold/60 group relative`}
                  onClick={() => handleProductClick(product)}
                >
                  {/* Magical hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-magical-gold/10 to-magical-bronze/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  
                  <div className="relative aspect-[4/3]">
                    <LazyImage
                      src={product.imagem1}
                      alt={product.produto}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-magical-midnight/80 to-transparent" />
                    
                    {/* Magical sparkle effect on hover */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-4 h-4 bg-magical-gold rounded-full animate-sparkle shadow-lg shadow-magical-gold/50"></div>
                    </div>
                    
                    {/* Badge NOVO para os 10 primeiros */}
                    {index < 10 && (
                      <div className="absolute top-2 left-2">
                        <div className="bg-gradient-to-r from-magical-crimson to-magical-darkGold text-magical-starlight text-xs font-bold px-2 py-1 rounded-full animate-magical-glow border border-magical-gold/30 shadow-lg">
                          ⚡ NOVO
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-magical-starlight text-sm font-semibold line-clamp-2 mb-1 font-enchanted">
                        {product.produto}
                      </h3>
                      <div className="text-magical-gold text-xs font-bold font-magical flex items-center gap-1">
                        <span className="animate-sparkle">💰</span>
                        Menos de {product.valor}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Indicadores de slide otimizados com tema mágico */}
          <div className="flex justify-center mt-4 gap-1">
            {Array.from({ length: Math.ceil(recentProducts.length / itemsPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  playRandomMagicalSound();
                  setCurrentIndex(index);
                  setIsAutoScrolling(false);
                  setTimeout(() => setIsAutoScrolling(true), 10000);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-500 border border-magical-gold/30 ${
                  currentIndex === index 
                    ? 'bg-magical-gold w-6 shadow-lg shadow-magical-gold/50 animate-magical-glow' 
                    : 'bg-magical-starlight/50 hover:bg-magical-gold/70'
                }`}
                aria-label={`Ir para slide mágico ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </>
  );
};
