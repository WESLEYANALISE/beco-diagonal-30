
import React, { useState, memo, useCallback } from 'react';
import { Star, Play, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { FavoriteButton } from '@/components/FavoriteButton';
import { LazyImage } from '@/components/LazyImage';

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
}

interface ProductCardProps {
  product: Product;
  showBadge?: boolean;
  badgeText?: string;
  compact?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (product: Product) => void;
  style?: React.CSSProperties;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  showBadge = false,
  badgeText = "MAIS VENDIDO",
  compact = false,
  selectable = false,
  selected = false,
  onToggle,
  style
}) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const getProductImages = useCallback((product: Product) => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5].filter(Boolean);
  }, []);

  const formatPrice = useCallback((price: string) => {
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  }, []);

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Evitar abrir o modal se clicar em botões específicos
    if (
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('[role="button"]') ||
      (e.target as HTMLElement).closest('.carousel-nav')
    ) {
      return;
    }

    if (selectable && onToggle) {
      onToggle(product);
    } else {
      setIsDetailModalOpen(true);
    }
  }, [selectable, onToggle, product]);

  const handleBuyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(product.link, '_blank');
  }, [product.link]);

  const images = getProductImages(product);

  return (
    <>
      <Card 
        id={`product-${product.id}`} 
        style={style} 
        className={`
          overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 
          bg-white border-0 shadow-lg group animate-fade-in cursor-pointer
          ${selected ? 'ring-2 ring-blue-500' : ''}
        `} 
        onClick={handleCardClick}
      >
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square overflow-hidden">
                    <LazyImage 
                      src={image} 
                      alt={`${product.produto} - ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={`carousel-nav left-1 bg-white/90 hover:bg-white ${compact ? 'w-5 h-5' : 'w-6 h-6'}`} />
            <CarouselNext className={`carousel-nav right-1 bg-white/90 hover:bg-white ${compact ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </Carousel>
          
          {product.video && (
            <div className={`absolute ${compact ? 'top-1 right-1' : 'top-2 right-2'}`}>
              <div className="bg-red-500 rounded-full p-1 animate-pulse">
                <Play className={`text-white ${compact ? 'w-3 h-3' : 'w-3 h-3'}`} />
              </div>
            </div>
          )}
          
          {showBadge && (
            <div className={`absolute ${compact ? 'top-1 left-1' : 'top-2 left-2'}`}>
              <Badge className="bg-red-500 text-white font-bold text-xs animate-bounce">
                {badgeText}
              </Badge>
            </div>
          )}

          {product.categoria && !showBadge && compact && (
            <div className="absolute bottom-1 left-1">
              <Badge variant="secondary" className="text-xs bg-white/90 px-1 py-0">
                {product.categoria}
              </Badge>
            </div>
          )}

          {selectable && (
            <div className="absolute top-2 left-2">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                selected ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'
              }`}>
                {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
            </div>
          )}

          {/* Favorite button positioned in top-right when no video */}
          {!product.video && (
            <div className={`absolute ${compact ? 'top-1 right-1' : 'top-2 right-2'}`}>
              <FavoriteButton productId={product.id} showText={false} />
            </div>
          )}
        </div>

        <CardContent className={compact ? "p-2" : "p-3"}>
          <h3 
            className={`font-medium text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors ${
              compact ? 'text-xs leading-tight' : 'text-sm'
            }`}
          >
            {product.produto}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <div className={`font-bold text-red-500 ${compact ? 'text-xs' : 'text-sm'}`}>
              Menos de {formatPrice(product.valor)}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-600">4.8</span>
            </div>
          </div>
          
          <div className="space-y-1">
            {/* Show favorite button here if there's a video (since it's not in top-right) */}
            {product.video && (
              <div className="flex gap-1 mb-1">
                <FavoriteButton productId={product.id} />
              </div>
            )}
            
            <ProductPhotosModal 
              images={images} 
              productName={product.produto} 
              productPrice={formatPrice(product.valor)} 
              productLink={product.link} 
              videoUrl={product.video} 
            />
            
            <Button 
              size="sm" 
              className={`w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold text-xs hover:scale-105 transition-all duration-300 ${
                compact ? 'py-1' : ''
              }`} 
              onClick={handleBuyClick}
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Comprar na Shopee
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProductDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        product={product} 
      />
    </>
  );
};

export const ProductCard = memo(ProductCardComponent);
ProductCard.displayName = 'ProductCard';
