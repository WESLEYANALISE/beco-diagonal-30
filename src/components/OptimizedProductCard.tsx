
import React, { memo, useState, useCallback } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

interface OptimizedProductCardProps {
  product: Product;
  compact?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  onProductClick?: (product: Product) => void;
}

const OptimizedProductCard: React.FC<OptimizedProductCardProps> = memo(({
  product,
  compact = false,
  showBadge = false,
  badgeText,
  onProductClick
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = useCallback((price: string) => {
    if (price.includes('R$')) return price;
    return `R$ ${price}`;
  }, []);

  const handleBuyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(product.link, '_blank');
  }, [product.link]);

  const handleCardClick = useCallback(() => {
    onProductClick?.(product);
  }, [onProductClick, product]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  return (
    <Card 
      className={`group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white ${
        compact ? 'h-auto' : 'h-full'
      }`}
      onClick={handleCardClick}
    >
      <div className={`relative ${compact ? 'aspect-square' : 'aspect-video'} bg-gray-100 overflow-hidden`}>
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        )}
        
        {!imageError ? (
          <img
            src={product.imagem1}
            alt={product.produto}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-gray-400" />
          </div>
        )}

        {showBadge && badgeText && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-600 text-white text-xs font-semibold">
              {badgeText}
            </Badge>
          </div>
        )}

        <div className="absolute top-2 right-2">
          <Badge className="bg-orange-500 text-white text-xs">
            {product.categoria}
          </Badge>
        </div>
      </div>

      <CardContent className={compact ? "p-3" : "p-4"}>
        <h3 className={`font-bold text-gray-900 mb-2 line-clamp-2 ${
          compact ? 'text-xs' : 'text-sm'
        } leading-tight`}>
          {product.produto}
        </h3>
        
        <p className={`text-orange-600 font-bold mb-3 ${
          compact ? 'text-sm' : 'text-lg'
        }`}>
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
        
        <Button
          onClick={handleBuyClick}
          size={compact ? "sm" : "default"}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
        >
          <ShoppingCart className="w-3 h-3 mr-1" />
          Comprar
        </Button>
      </CardContent>
    </Card>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export default OptimizedProductCard;
