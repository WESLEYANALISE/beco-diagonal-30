
import React, { memo, useCallback } from 'react';
import { ProductImage } from '@/components/ProductImage';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ExternalLink, Check } from 'lucide-react';

interface Product {
  id: number;
  produto: string;
  valor: string;
  imagem1: string;
  categoria: string;
  link: string;
}

interface OptimizedProductCardProps {
  product: Product;
  compact?: boolean;
  showBadge?: boolean;
  badgeText?: string;
  listView?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggle?: (product: Product) => void;
  style?: React.CSSProperties;
}

const OptimizedProductCard = memo<OptimizedProductCardProps>(({
  product,
  compact = true,
  showBadge = false,
  badgeText = '',
  listView = false,
  selectable = false,
  selected = false,
  onToggle,
  style
}) => {
  const handleClick = useCallback(() => {
    if (selectable && onToggle) {
      onToggle(product);
    } else if (product.link) {
      window.open(product.link, '_blank', 'noopener,noreferrer');
    }
  }, [selectable, onToggle, product]);

  const formatPrice = useCallback((price: string) => {
    if (!price) return 'Preço não disponível';
    const cleanPrice = price.replace(/[^\d,]/g, '');
    return cleanPrice ? `R$ ${cleanPrice}` : 'Consulte o preço';
  }, []);

  if (listView) {
    return (
      <Card 
        className="flex bg-gradient-to-r from-magical-starlight/95 to-magical-starlight/90 backdrop-blur-sm border border-magical-gold/30 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer animate-fade-in"
        onClick={handleClick}
        style={style}
      >
        <div className="w-24 h-24 flex-shrink-0">
          <ProductImage
            src={product.imagem1}
            alt={product.produto}
            className="w-full h-full rounded-l-2xl"
            priority={false}
          />
        </div>
        <CardContent className="flex-1 p-3 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-magical-midnight text-sm line-clamp-2 font-enchanted">
              {product.produto}
            </h3>
            <Badge variant="secondary" className="text-xs mt-1 bg-magical-gold/20 text-magical-deepPurple">
              {product.categoria}
            </Badge>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-magical-deepPurple font-bold text-sm font-enchanted">
              {formatPrice(product.valor)}
            </span>
            <Button size="sm" className="h-7 px-2 bg-magical-gold text-magical-midnight hover:bg-magical-darkGold">
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`group relative overflow-hidden bg-gradient-to-br from-magical-starlight/95 to-magical-starlight/90 backdrop-blur-sm border border-magical-gold/30 rounded-2xl transition-all duration-200 hover:shadow-2xl hover:scale-[1.02] cursor-pointer animate-fade-in ${
        selected ? 'ring-2 ring-magical-gold shadow-magical-gold/50' : ''
      }`}
      onClick={handleClick}
      style={style}
    >
      {showBadge && badgeText && (
        <Badge className="absolute top-2 left-2 z-10 bg-magical-gold text-magical-midnight font-enchanted text-xs">
          {badgeText}
        </Badge>
      )}

      {selectable && (
        <div className="absolute top-2 right-2 z-10">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            selected 
              ? 'bg-magical-gold border-magical-gold' 
              : 'bg-magical-starlight/80 border-magical-gold/50'
          }`}>
            {selected && <Check className="w-3 h-3 text-magical-midnight" />}
          </div>
        </div>
      )}

      <div className={compact ? 'aspect-square' : 'aspect-[4/3]'}>
        <ProductImage
          src={product.imagem1}
          alt={product.produto}
          className="w-full h-full object-cover rounded-t-2xl"
          priority={false}
        />
      </div>

      <CardContent className="p-3">
        <h3 className={`font-semibold text-magical-midnight mb-2 font-enchanted line-clamp-2 ${
          compact ? 'text-sm' : 'text-base'
        }`}>
          {product.produto}
        </h3>

        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs bg-magical-gold/20 text-magical-deepPurple font-enchanted">
            {product.categoria}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-magical-deepPurple font-bold font-enchanted text-sm">
            {formatPrice(product.valor)}
          </span>
          
          {!selectable && (
            <Button 
              size="sm" 
              className="bg-magical-gold text-magical-midnight hover:bg-magical-darkGold transition-all duration-200 font-enchanted"
              onClick={(e) => {
                e.stopPropagation();
                if (product.link) {
                  window.open(product.link, '_blank', 'noopener,noreferrer');
                }
              }}
            >
              <ShoppingCart className="w-3 h-3 mr-1" />
              Comprar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

export { OptimizedProductCard };
