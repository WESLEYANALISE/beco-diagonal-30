
import React, { memo, useState, useCallback } from 'react';
import { ShoppingCart, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from './OptimizedImage';

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
  click_count?: number;
}

interface OptimizedProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
  onBuyProduct: (product: Product) => void;
  compact?: boolean;
  showBadge?: boolean;
  badgeText?: string;
}

export const OptimizedProductCard = memo<OptimizedProductCardProps>(({
  product,
  onViewProduct,
  onBuyProduct,
  compact = false,
  showBadge = false,
  badgeText
}) => {
  const [imageError, setImageError] = useState(false);

  const formatPrice = useCallback((price: string) => {
    if (price.includes('R$')) return price;
    return `R$ ${price}`;
  }, []);

  const handleViewProduct = useCallback(() => {
    onViewProduct(product);
  }, [onViewProduct, product]);

  const handleBuyProduct = useCallback(() => {
    onBuyProduct(product);
  }, [onBuyProduct, product]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${compact ? 'h-48' : 'h-auto'}`}>
      {/* Imagem do produto */}
      <div className={`relative ${compact ? 'aspect-square' : 'aspect-video'} bg-gray-100 overflow-hidden`}>
        {!imageError ? (
          <OptimizedImage
            src={product.imagem1}
            alt={product.produto}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Imagem não disponível</span>
          </div>
        )}
        
        {/* Badge de categoria */}
        <div className="absolute top-2 left-2">
          <Badge className="bg-orange-500 text-white text-xs">
            {product.categoria}
          </Badge>
        </div>

        {/* Badge personalizado */}
        {showBadge && badgeText && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-red-600 text-white text-xs font-semibold">
              {badgeText}
            </Badge>
          </div>
        )}

        {/* Contador de cliques */}
        {product.click_count && product.click_count > 0 && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-green-600 text-white text-xs">
              🔥 {product.click_count} views
            </Badge>
          </div>
        )}

        {/* Botão de vídeo se disponível */}
        {product.video && (
          <div className="absolute bottom-2 right-2">
            <Badge className="bg-red-600 text-white text-xs font-semibold">
              VÍDEO
            </Badge>
          </div>
        )}
      </div>

      {/* Informações do produto */}
      <div className={`p-3 ${compact ? 'space-y-1' : 'space-y-2'}`}>
        <h3 className={`font-bold text-gray-900 line-clamp-2 ${compact ? 'text-xs' : 'text-sm'} leading-tight`}>
          {product.produto}
        </h3>
        <p className={`text-orange-600 font-bold ${compact ? 'text-sm' : 'text-lg'}`}>
          Menos de {formatPrice(product.valor)}
        </p>
        
        <div className={`flex gap-1 ${compact ? 'flex-col' : 'flex-row'}`}>
          <Button
            onClick={handleViewProduct}
            variant="outline"
            size="sm"
            className={`${compact ? 'flex-1 text-xs h-7' : 'flex-1'} border-orange-500 text-orange-600 hover:bg-orange-50`}
          >
            <Play className={`${compact ? 'w-2 h-2' : 'w-3 h-3'} mr-1`} />
            Ver Mais
          </Button>
          <Button
            onClick={handleBuyProduct}
            size="sm"
            className={`${compact ? 'flex-1 text-xs h-7' : 'flex-1'} bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white`}
          >
            <ShoppingCart className={`${compact ? 'w-2 h-2' : 'w-3 h-3'} mr-1`} />
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';
