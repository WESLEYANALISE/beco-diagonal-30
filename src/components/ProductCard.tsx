
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
  listView?: boolean;
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
  listView = false,
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
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[role="button"]') || (e.target as HTMLElement).closest('.carousel-nav')) {
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

  if (listView) {
    return (
      <>
        <Card id={`product-${product.id}`} style={style} className={`
            overflow-hidden hover:shadow-xl transition-all duration-300 
            bg-gradient-to-br from-magical-deepPurple/80 to-magical-mysticalPurple/60 
            border border-magical-gold/30 shadow-lg group animate-fade-in cursor-pointer
            backdrop-blur-sm hover:border-magical-gold/50 hover:shadow-magical-gold/20
            ${selected ? 'ring-2 ring-magical-gold' : ''}
          `} onClick={handleCardClick}>
          <CardContent className="p-3">
            <div className="flex gap-3">
              {/* Image */}
              <div className="relative w-24 h-24 flex-shrink-0">
                <LazyImage src={product.imagem1} alt={product.produto} className="w-full h-full object-cover rounded-lg border border-magical-gold/20" />
                {product.video && (
                  <div className="absolute top-1 right-1">
                    <div className="bg-magical-midnight/70 rounded-full p-1 border border-magical-gold/30">
                      <Play className="w-3 h-3 text-magical-gold" />
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-magical-starlight text-sm line-clamp-2 mb-2 font-enchanted">
                  {product.produto}
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-magical-gold text-sm font-magical">
                    Menos de {formatPrice(product.valor)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-magical-gold fill-current" />
                    <span className="text-xs text-magical-starlight/80">4.8</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <FavoriteButton productId={product.id} showText={false} />
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-magical-gold to-magical-bronze hover:from-magical-darkGold hover:to-magical-bronze text-magical-midnight font-semibold text-xs border-0 shadow-md hover:shadow-lg transition-all duration-300" onClick={handleBuyClick}>
                    <ShoppingCart className="w-3 h-3 mr-1" />
                    Comprar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <ProductDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} product={product} />
      </>
    );
  }

  return (
    <>
      <Card id={`product-${product.id}`} style={style} className={`
          overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 
          bg-gradient-to-br from-magical-deepPurple/80 to-magical-mysticalPurple/60 
          border border-magical-gold/30 shadow-lg group animate-fade-in cursor-pointer
          backdrop-blur-sm hover:border-magical-gold/50 hover:shadow-magical-gold/20
          ${selected ? 'ring-2 ring-magical-gold' : ''}
          ${showBadge ? 'hover:animate-magical-glow' : ''}
        `} onClick={handleCardClick}>
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-square overflow-hidden">
                    <LazyImage src={image} alt={`${product.produto} - ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className={`carousel-nav left-1 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30 ${compact ? 'w-5 h-5' : 'w-6 h-6'}`} />
            <CarouselNext className={`carousel-nav right-1 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30 ${compact ? 'w-5 h-5' : 'w-6 h-6'}`} />
          </Carousel>
          
          {product.video && (
            <div className={`absolute ${compact ? 'top-1 right-1' : 'top-2 right-2'}`}>
              {/* Video indicator */}
            </div>
          )}
          
          {showBadge && (
            <div className={`absolute ${compact ? 'top-1 left-1' : 'top-2 left-2'}`}>
              <Badge className="bg-gradient-to-r from-magical-crimson to-magical-darkGold text-magical-starlight font-bold text-xs animate-bounce border border-magical-gold/30 shadow-lg">
                {badgeText}
              </Badge>
            </div>
          )}

          {product.categoria && !showBadge && compact && (
            <div className="absolute bottom-1 left-1">
              <Badge variant="secondary" className="text-xs bg-magical-starlight/90 text-magical-midnight px-1 py-0 border border-magical-gold/20">
                {product.categoria}
              </Badge>
            </div>
          )}

          {selectable && (
            <div className="absolute top-2 left-2">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selected ? 'bg-magical-gold border-magical-gold' : 'bg-magical-starlight/20 border-magical-gold/50'}`}>
                {selected && <div className="w-2 h-2 bg-magical-midnight rounded-full"></div>}
              </div>
            </div>
          )}

          {/* Favorite button - versão melhorada para "Mais Vendidos" */}
          {!showBadge && !selectable && (
            <div className={`absolute ${compact ? 'top-1 left-1' : 'top-2 left-2'}`}>
              <FavoriteButton 
                productId={product.id} 
                showText={false} 
                enhanced={showBadge} // Usar versão melhorada se for "Mais Vendidos"
              />
            </div>
          )}
        </div>

        <CardContent className={compact ? "p-2" : "p-3"}>
          <h3 className={`font-medium text-magical-starlight mb-2 line-clamp-2 hover:text-magical-gold transition-colors font-enchanted ${compact ? 'text-xs leading-tight' : 'text-sm'}`}>
            {product.produto}
          </h3>
          
          <div className="flex items-center justify-between mb-2">
            <div className={`font-bold text-magical-gold font-magical ${compact ? 'text-xs' : 'text-sm'}`}>
              Menos de {formatPrice(product.valor)}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-magical-gold fill-current" />
              <span className="text-xs text-magical-starlight/80">4.8</span>
            </div>
          </div>
          
          <div className="space-y-1">
            {/* Botão de favoritar melhorado para produtos com badge */}
            {(showBadge || selectable) && (
              <div className="flex gap-1 mb-1">
                <FavoriteButton 
                  productId={product.id} 
                  enhanced={showBadge} // Versão melhorada para "Mais Vendidos"
                />
              </div>
            )}
            
            <ProductPhotosModal images={images} productName={product.produto} productPrice={formatPrice(product.valor)} productLink={product.link} videoUrl={product.video} />
            
            <Button size="sm" className={`w-full bg-gradient-to-r from-magical-gold to-magical-bronze hover:from-magical-darkGold hover:to-magical-bronze text-magical-midnight font-semibold text-xs hover:scale-105 transition-all duration-300 border-0 shadow-md hover:shadow-lg font-enchanted ${compact ? 'py-1' : ''}`} onClick={handleBuyClick}>
              <ShoppingCart className="w-3 h-3 mr-1" />
              Comprar na Shopee
            </Button>
          </div>
        </CardContent>
      </Card>

      <ProductDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} product={product} />
    </>
  );
};

export const ProductCard = memo(ProductCardComponent);
ProductCard.displayName = 'ProductCard';
