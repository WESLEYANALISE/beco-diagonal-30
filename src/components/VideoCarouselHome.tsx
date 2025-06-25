
import React, { useState, useEffect, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight, Play, ShoppingCart, Star, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { LazyImage } from '@/components/LazyImage';
import { useProductClicks } from '@/hooks/useProductClicks';
import { useMagicalSounds } from '@/hooks/useMagicalSounds';

interface Product {
  id: number;
  produto: string;
  valor: string;
  video: string;
  imagem1: string;
  imagem2: string;
  imagem3: string;
  imagem4: string;
  imagem5: string;
  imagem6?: string;
  imagem7?: string;
  link: string;
  categoria: string;
  subcategoria?: string;
  click_count?: number;
}

interface VideoCarouselHomeProps {
  products?: Product[];
}

const VideoCarouselHomeComponent: React.FC<VideoCarouselHomeProps> = ({ products: propProducts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const { getHarryPotterProducts, trackProductClick } = useProductClicks();
  const { playClickSound, playHoverSound } = useMagicalSounds();

  // Buscar produtos mágicos do Harry Potter se não foram fornecidos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        if (propProducts && propProducts.length > 0) {
          setProducts(propProducts);
        } else {
          const harryPotterProducts = await getHarryPotterProducts(8);
          setProducts(harryPotterProducts);
        }
      } catch (error) {
        console.error('Erro ao buscar artefatos mágicos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [propProducts, getHarryPotterProducts]);

  // Auto-scroll otimizado para produtos mágicos
  useEffect(() => {
    if (products.length === 0 || !isAutoScrolling) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, products.length - 3);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 5000); // 5 segundos para dar tempo de apreciar os artefatos

    return () => clearInterval(interval);
  }, [products.length, isAutoScrolling]);

  const nextSlide = useCallback(() => {
    playClickSound();
    setIsAutoScrolling(false);
    const maxIndex = Math.max(0, products.length - 3);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setTimeout(() => setIsAutoScrolling(true), 15000);
  }, [products.length, playClickSound]);

  const prevSlide = useCallback(() => {
    playClickSound();
    setIsAutoScrolling(false);
    const maxIndex = Math.max(0, products.length - 3);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setTimeout(() => setIsAutoScrolling(true), 15000);
  }, [products.length, playClickSound]);

  const handleProductClick = useCallback(async (product: Product) => {
    try {
      playClickSound();
      await trackProductClick(product.id, 'product_view');
      setSelectedProduct(product);
    } catch (error) {
      console.error('Erro ao rastrear clique no artefato:', error);
    }
  }, [trackProductClick, playClickSound]);

  const handleBuyClick = useCallback((e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    playClickSound();
    trackProductClick(product.id, 'buy_click');
    window.open(product.link, '_blank');
  }, [trackProductClick, playClickSound]);

  const formatPrice = useCallback((price: string) => {
    if (price.includes('R$')) return price;
    return `R$ ${price}`;
  }, []);

  if (loading) {
    return (
      <section className="px-4 py-6 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-magical-starlight font-magical flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-magical-gold animate-sparkle" />
              ⚡ Artefatos Mágicos em Destaque
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-magical-gold/20 rounded-2xl animate-pulse h-64 border border-magical-gold/30"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <>
      <section className="px-4 py-6 animate-fade-in bg-gradient-to-r from-magical-deepPurple/30 via-magical-mysticalPurple/30 to-magical-deepPurple/30 border-y border-magical-gold/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-magical-starlight font-magical flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-magical-gold animate-sparkle" />
                ⚡ Artefatos Mágicos em Destaque
              </h2>
              <p className="text-sm text-magical-starlight/80 mt-1 font-enchanted">
                Os artefatos mais poderosos de Hogwarts com demonstrações mágicas
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={prevSlide}
                onMouseEnter={playHoverSound}
                className="text-magical-starlight hover:bg-magical-gold/20 p-2 rounded-full transition-all duration-300 border border-magical-gold/30 shadow-lg hover:shadow-magical-gold/30"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={nextSlide}
                onMouseEnter={playHoverSound}
                className="text-magical-starlight hover:bg-magical-gold/20 p-2 rounded-full transition-all duration-300 border border-magical-gold/30 shadow-lg hover:shadow-magical-gold/30"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out gap-4"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-magical-gold/20 bg-gradient-to-br from-magical-deepPurple/80 to-magical-mysticalPurple/60 border border-magical-gold/30 backdrop-blur-sm"
                  onClick={() => handleProductClick(product)}
                  onMouseEnter={playHoverSound}
                >
                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden bg-magical-midnight/20">
                      <LazyImage
                        src={product.imagem1}
                        alt={product.produto}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-magical-midnight/60 via-transparent to-transparent" />
                      
                      {/* Badge de Destaque */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-magical-crimson to-magical-darkGold text-magical-starlight font-bold text-xs animate-pulse border border-magical-gold/50 shadow-lg">
                          ⚡ DESTAQUE MÁGICO
                        </Badge>
                      </div>

                      {/* Indicador de Vídeo */}
                      {product.video && (
                        <div className="absolute top-3 right-3">
                          <div className="bg-magical-midnight/80 rounded-full p-2 border border-magical-gold/50 shadow-lg animate-bounce">
                            <Play className="w-4 h-4 text-magical-gold" />
                          </div>
                        </div>
                      )}

                      {/* Categoria */}
                      {product.categoria && (
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="secondary" className="bg-magical-gold/20 text-magical-gold border border-magical-gold/30 text-xs font-enchanted backdrop-blur-sm">
                            {product.categoria}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-magical-starlight text-base line-clamp-2 mb-2 font-enchanted hover:text-magical-gold transition-colors">
                          {product.produto}
                        </h3>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-bold text-magical-gold text-lg font-magical">
                            Menos de {formatPrice(product.valor)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-magical-gold fill-current" />
                            <span className="text-sm text-magical-starlight/80 font-enchanted">4.9</span>
                          </div>
                        </div>

                        {/* Subcategoria se disponível */}
                        {product.subcategoria && (
                          <div className="mb-3">
                            <Badge variant="outline" className="text-xs text-magical-bronze border-magical-bronze/30 font-enchanted">
                              {product.subcategoria}
                            </Badge>
                          </div>
                        )}
                      </div>

                      <Button 
                        className="w-full bg-gradient-to-r from-magical-mysticalPurple to-magical-deepPurple hover:from-magical-deepPurple hover:to-magical-mysticalPurple text-magical-starlight font-semibold border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-enchanted" 
                        onClick={(e) => handleBuyClick(e, product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Adquirir Artefato Mágico
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Indicadores de slide com tema mágico */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.max(1, products.length - 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  playClickSound();
                  setCurrentIndex(index);
                  setIsAutoScrolling(false);
                  setTimeout(() => setIsAutoScrolling(true), 15000);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-500 border border-magical-gold/30 ${
                  currentIndex === index 
                    ? 'bg-magical-gold w-8 shadow-lg shadow-magical-gold/50 animate-pulse' 
                    : 'bg-magical-gold/30 hover:bg-magical-gold/60'
                }`}
                aria-label={`Ir para artefato ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal de Detalhes do Produto */}
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

export const VideoCarouselHome = memo(VideoCarouselHomeComponent);
VideoCarouselHome.displayName = 'VideoCarouselHome';
