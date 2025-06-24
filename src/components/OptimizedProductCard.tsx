
import React, { memo, useState, useCallback } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from '@/components/LazyImage';
import { FavoriteButton } from '@/components/FavoriteButton';

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
  onBuyClick?: (product: Product) => void;
}

const OptimizedProductCardComponent: React.FC<OptimizedProductCardProps> = ({
  product,
  compact = false,
  showBadge = false,
  badgeText = '',
  onProductClick,
  onBuyClick
}) => {
  const [imageError, setImageError] = useState(false);

  const formatPrice = useCallback((price: string) => {
    if (price.includes('R$')) return price;
    return `R$ ${price}`;
  }, []);

  const handleProductClick = useCallback(() => {
    onProductClick?.(product);
  }, [product, onProductClick]);

  const handleBuyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyClick?.(product);
  }, [product, onBuyClick]);

  const cardClasses = compact 
    ? "group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer h-72"
    : "group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden cursor-pointer";

  return (
    <div className={cardClasses} onClick={handleProductClick}>
      {/* Image Container */}
      <div className={`relative overflow-hidden ${compact ? 'h-32' : 'h-48'} bg-gray-100`}>
        {!imageError ? (
          <LazyImage
            src={product.imagem1}
            alt={product.produto}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Imagem não disponível</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <Badge className="bg-orange-500 text-white text-xs">
            {product.categoria}
          </Badge>
          {showBadge && badgeText && (
            <Badge className="bg-red-600 text-white text-xs font-semibold">
              {badgeText}
            </Badge>
          )}
        </div>

        {/* Video indicator */}
        {product.video && product.video.includes('.mp4') && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-red-600 text-white text-xs">
              VÍDEO
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-3 ${compact ? 'space-y-2' : 'space-y-3'}`}>
        <h3 className={`font-bold text-gray-900 line-clamp-2 ${compact ? 'text-xs' : 'text-sm'} leading-tight`}>
          {product.produto}
        </h3>
        
        <p className={`text-orange-600 font-bold ${compact ? 'text-sm' : 'text-lg'}`}>
          Menos de {formatPrice(product.valor)}
        </p>
        
        <div className="flex gap-2">
          <Button
            onClick={handleProductClick}
            variant="outline"
            size="sm"
            className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50 text-xs h-8"
          >
            <Eye className="w-3 h-3 mr-1" />
            Ver Mais
          </Button>
          <Button
            onClick={handleBuyClick}
            size="sm"
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs h-8"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Comprar
          </Button>
        </div>

        {/* Favorite Button */}
        <div className="flex justify-center">
          <FavoriteButton productId={product.id} size="sm" showText={false} />
        </div>
      </div>
    </div>
  );
};

export const OptimizedProductCard = memo(OptimizedProductCardComponent);
OptimizedProductCard.displayName = 'OptimizedProductCard';
