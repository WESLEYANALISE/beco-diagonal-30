
import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, Play, Heart, Share2, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { LazyImage } from '@/components/LazyImage';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { FavoriteButton } from '@/components/FavoriteButton';
import { useProductCardLogic } from '@/components/product/ProductCardLogic';
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
  descricao?: string;
  uso?: string;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { getProductImages, formatPrice, handleBuyClick } = useProductCardLogic(product);
  const { playModalOpen, playButtonClick, playHover } = useMagicalSounds();

  useEffect(() => {
    if (isOpen) {
      playModalOpen();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, playModalOpen]);

  if (!isOpen) return null;

  const images = getProductImages(product);

  const handleVideoClick = () => {
    playButtonClick();
    setIsVideoModalOpen(true);
  };

  const handleCloseClick = () => {
    playButtonClick();
    onClose();
  };

  const handleBuyClickWithSound = () => {
    playButtonClick();
    handleBuyClick();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-magical-midnight/90 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleCloseClick}
      />
      
      {/* Modal Container - Fixed positioning with proper responsive behavior */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="relative w-full max-w-4xl max-h-[95vh] bg-gradient-to-br from-magical-deepPurple/95 to-magical-mysticalPurple/95 backdrop-blur-md border border-magical-gold/30 rounded-2xl shadow-2xl animate-magical-entrance overflow-hidden">
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-3 right-3 z-10 text-magical-starlight hover:text-magical-gold hover:bg-magical-gold/20 transition-all duration-300 rounded-full w-8 h-8 p-0"
            onClick={handleCloseClick}
            onMouseEnter={playHover}
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Scrollable Content Container */}
          <div className="overflow-y-auto max-h-[95vh] custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-6">
              
              {/* Images Section */}
              <div className="space-y-4">
                <div className="relative">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-square rounded-xl overflow-hidden border border-magical-gold/20">
                            <LazyImage 
                              src={image} 
                              alt={`${product.produto} - ${index + 1}`} 
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {images.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30" />
                        <CarouselNext className="right-2 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30" />
                      </>
                    )}
                  </Carousel>

                  {/* Video Play Button */}
                  {product.video && (
                    <div className="absolute top-4 right-4">
                      <Button
                        size="sm"
                        className="bg-magical-crimson/90 hover:bg-magical-crimson text-magical-starlight border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        onClick={handleVideoClick}
                        onMouseEnter={playHover}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Assistir Vídeo
                      </Button>
                    </div>
                  )}
                </div>

                {/* Product Badges - Mobile Responsive */}
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-magical-gold/20 text-magical-gold border-magical-gold/30">
                    {product.categoria}
                  </Badge>
                  {product.subcategoria && (
                    <Badge variant="secondary" className="bg-magical-starlight/10 text-magical-starlight border-magical-starlight/30">
                      {product.subcategoria}
                    </Badge>
                  )}
                  <Badge className="bg-magical-emerald/20 text-magical-emerald border-magical-emerald/30">
                    ⚡ Item Mágico
                  </Badge>
                </div>
              </div>

              {/* Product Info Section */}
              <div className="space-y-4">
                <div className="space-y-3">
                  {/* Product Title - Responsive text sizing */}
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-magical-starlight leading-tight font-magical">
                    {product.produto}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-magical-gold fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-magical-starlight/80 font-enchanted">
                      4.8 (2.1k encantamentos)
                    </span>
                  </div>

                  {/* Price - Responsive sizing */}
                  <div className="text-2xl sm:text-3xl font-bold text-magical-gold font-magical">
                    Menos de {formatPrice(product.valor)}
                  </div>

                  {/* Description */}
                  {product.descricao && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-magical-starlight font-magical">
                        ✨ Descrição Mágica
                      </h3>
                      <p className="text-sm sm:text-base text-magical-starlight/90 leading-relaxed font-enchanted">
                        {product.descricao}
                      </p>
                    </div>
                  )}

                  {/* Usage Instructions */}
                  {product.uso && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-magical-starlight font-magical">
                        🪄 Como Usar
                      </h3>
                      <p className="text-sm sm:text-base text-magical-starlight/90 leading-relaxed font-enchanted">
                        {product.uso}
                      </p>
                    </div>
                  )}

                  {/* Features */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-magical-starlight font-magical">
                      🌟 Características Mágicas
                    </h3>
                    <ul className="space-y-1 text-sm sm:text-base text-magical-starlight/90 font-enchanted">
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-magical-gold" />
                        Encantamento de Alta Qualidade
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-magical-gold" />
                        Autenticado pelo Ministério da Magia
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-magical-gold" />
                        Garantia de 3 anos contra feitiços
                      </li>
                      <li className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-magical-gold" />
                        Entrega via Coruja Expressa
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Action Buttons - Responsive layout */}
                <div className="space-y-3 pt-4 border-t border-magical-gold/20">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-magical-mysticalPurple to-magical-deepPurple hover:from-magical-deepPurple hover:to-magical-mysticalPurple text-magical-starlight font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-105 border-0 shadow-lg hover:shadow-xl font-enchanted"
                      onClick={handleBuyClickWithSound}
                      onMouseEnter={playHover}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adquirir Relíquia Mágica
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <FavoriteButton 
                      productId={product.id} 
                      enhanced={true}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-magical-starlight/10 border-magical-gold/30 text-magical-starlight hover:bg-magical-gold/20 hover:text-magical-gold transition-all duration-300"
                      onMouseEnter={playHover}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartilhar Magia
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {product.video && (
        <ProductVideoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          videoUrl={product.video}
          productName={product.produto}
        />
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(212, 175, 55, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.7);
        }
      `}</style>
    </>
  );
};
