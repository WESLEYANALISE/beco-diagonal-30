
import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useOptimizedProducts } from '@/hooks/useOptimizedProducts';

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
  link: string;
  categoria: string;
  uso?: string;
}

interface VideoCarouselHomeProps {
  onProductClick: (product: Product) => void;
}

const VideoCarouselHome = ({ onProductClick }: VideoCarouselHomeProps) => {
  const { products, loading } = useOptimizedProducts();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Get only products with videos for featured section
  const featuredProducts = products.withVideos.slice(0, 12);

  const formatPrice = useCallback((price: string) => {
    if (price.includes('R$')) return price;
    return `R$ ${price}`;
  }, []);

  const handleBuyClick = useCallback((e: React.MouseEvent, link: string) => {
    e.stopPropagation();
    window.open(link, '_blank');
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % Math.max(1, featuredProducts.length - 2));
  }, [featuredProducts.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + Math.max(1, featuredProducts.length - 2)) % Math.max(1, featuredProducts.length - 2));
  }, [featuredProducts.length]);

  if (loading) {
    return (
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg aspect-video"></div>
          ))}
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum produto com vídeo encontrado</p>
      </div>
    );
  }

  const visibleProducts = featuredProducts.slice(currentIndex, currentIndex + 3);

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* Navigation Buttons */}
      {featuredProducts.length > 3 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">
        {visibleProducts.map((product) => (
          <Card 
            key={product.id} 
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white overflow-hidden"
            onClick={() => onProductClick(product)}
          >
            <div className="relative aspect-video bg-gray-100">
              <video
                src={product.video}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                muted
                loop
                playsInline
                onMouseEnter={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.play().catch(() => {});
                }}
                onMouseLeave={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.pause();
                  video.currentTime = 0;
                }}
              />
              
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              
              <div className="absolute top-3 left-3">
                <Badge className="bg-red-600 text-white font-semibold">
                  EM DESTAQUE
                </Badge>
              </div>
              
              <div className="absolute top-3 right-3">
                <Badge className="bg-orange-500 text-white text-xs">
                  {product.categoria}
                </Badge>
              </div>

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 rounded-full p-3">
                  <Play className="w-6 h-6 text-gray-800" />
                </div>
              </div>
            </div>

            <CardContent className="p-4">
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
                {product.produto}
              </h3>
              
              <p className="text-orange-600 font-bold mb-3 text-lg">
                Menos de {formatPrice(product.valor)}
              </p>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">4.8 (2.1k)</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 hover:bg-red-50"
                >
                  <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Button
                  onClick={(e) => handleBuyClick(e, product.link)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Comprar
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductClick(product);
                  }}
                >
                  Ver Mais
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Indicators */}
      {featuredProducts.length > 3 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.max(1, featuredProducts.length - 2) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoCarouselHome;
