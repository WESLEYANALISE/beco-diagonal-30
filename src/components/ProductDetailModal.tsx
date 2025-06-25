
import React, { useState, useEffect, memo } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X, ShoppingCart, Heart, Star, Play, Lightbulb } from 'lucide-react';
import { ImageZoomModal } from '@/components/ImageZoomModal';
import { ProductVideoModal } from '@/components/ProductVideoModal';

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
  descricao?: string;
  uso?: string;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = memo(({
  isOpen,
  onClose,
  product
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Auto-play video when modal opens
  useEffect(() => {
    if (isOpen && product.video) {
      const timer = setTimeout(() => {
        setIsVideoOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, product.video]);

  const getProductImages = () => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5].filter(Boolean);
  };

  const formatPrice = (price: string) => {
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  };

  const getProductDescription = () => {
    if (product.descricao && product.descricao.trim() !== '') {
      return product.descricao;
    }
    
    // Fallback description
    const category = product.categoria || 'Produto';
    return `${product.produto} é um ${category.toLowerCase()} de alta qualidade que oferece excelente custo-benefício. Perfeito para quem busca praticidade, durabilidade e funcionalidade no dia a dia. Com design moderno e acabamento cuidadoso, este produto foi desenvolvido para atender suas necessidades com máxima satisfação.`;
  };

  const getProductUsage = () => {
    if (product.uso && product.uso.trim() !== '') {
      return product.uso;
    }
    return null;
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsZoomOpen(true);
  };

  const handleBuyClick = () => {
    window.open(product.link, '_blank');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-gradient-to-br from-magical-deepPurple/95 to-magical-mysticalPurple/95 border border-magical-gold/30 backdrop-blur-md">
          {/* Header com botão de fechar fixo */}
          <div className="relative bg-gradient-to-r from-magical-mysticalPurple/90 to-magical-deepPurple/90 text-magical-starlight p-4 flex items-center justify-between z-50 border-b border-magical-gold/30">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-base md:text-lg font-bold line-clamp-2 font-magical">
                {product.produto}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-magical-gold/20 text-magical-starlight border-magical-gold/30 text-xs">
                  {product.categoria}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-magical-gold fill-current" />
                  <span className="text-xs">4.8 (2.1k)</span>
                </div>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost" 
              size="sm"
              className="text-magical-starlight hover:bg-magical-crimson/80 bg-magical-crimson/60 border border-magical-gold/50 rounded-full w-12 h-12 p-0 flex-shrink-0 transition-all duration-300 hover:scale-110"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Layout em grid compacto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
            {/* Galeria à esquerda */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-magical-deepPurple/30 rounded-lg overflow-hidden border border-magical-gold/20">
                <Carousel className="w-full h-full">
                  <CarouselContent>
                    {getProductImages().map((image, index) => (
                      <CarouselItem key={index}>
                        <div 
                          className="h-full cursor-pointer"
                          onClick={() => handleImageClick(index)}
                        >
                          <img
                            src={image}
                            alt={`${product.produto} - ${index + 1}`}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-magical-gold/20 hover:bg-magical-gold/40 border-magical-gold/30" />
                  <CarouselNext className="right-2 bg-magical-gold/20 hover:bg-magical-gold/40 border-magical-gold/30" />
                </Carousel>
                
                {product.video && (
                  <Button
                    onClick={() => setIsVideoOpen(true)}
                    className="absolute bottom-4 right-4 bg-magical-crimson hover:bg-magical-crimson/80 rounded-full p-3 border border-magical-gold/30"
                  >
                    <Play className="w-5 h-5 text-magical-starlight" />
                  </Button>
                )}
              </div>

              {/* Miniaturas compactas */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {getProductImages().map((image, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 w-16 h-16 rounded border-2 border-magical-gold/30 hover:border-magical-gold overflow-hidden transition-colors"
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={image}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Informações à direita */}
            <div className="space-y-6">
              {/* Preço */}
              <div>
                <div className="text-3xl font-bold text-magical-gold mb-2 font-magical">
                  Menos de {formatPrice(product.valor)}
                </div>
                <div className="text-sm text-magical-starlight/80 mb-4 font-enchanted">
                  Entrega mágica garantida
                </div>
                
                {/* Botões de ação */}
                <div className="flex gap-3 mb-6">
                  <Button
                    variant="outline" 
                    size="default"
                    className="flex-1 border-magical-gold/30 text-magical-starlight hover:bg-magical-gold/20 bg-magical-deepPurple/40"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Favoritar
                  </Button>
                  <Button
                    onClick={handleBuyClick}
                    size="default"
                    className="flex-2 bg-gradient-to-r from-magical-gold to-magical-bronze hover:from-magical-darkGold hover:to-magical-bronze text-magical-midnight font-semibold font-enchanted"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Adquirir Artefato
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-magical-deepPurple/60 border border-magical-gold/30">
                  <TabsTrigger value="description" className="text-magical-starlight data-[state=active]:bg-magical-gold/20">Descrição</TabsTrigger>
                  <TabsTrigger value="uso" className="text-magical-starlight data-[state=active]:bg-magical-gold/20">Como usar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-4">
                  <Card className="bg-magical-deepPurple/40 border-magical-gold/30">
                    <CardContent className="p-4">
                      <p className="text-sm text-magical-starlight leading-relaxed mb-4 font-enchanted">
                        {getProductDescription()}
                      </p>
                      
                      <div>
                        <h4 className="font-medium mb-3 text-magical-gold font-magical">Características Mágicas:</h4>
                        <ul className="text-sm text-magical-starlight/90 space-y-2 font-enchanted">
                          <li>• Qualidade superior e durabilidade encantada</li>
                          <li>• Design moderno e funcional</li>
                          <li>• Perfeito para uso cotidiano</li>
                          <li>• Excelente relação custo-benefício</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="uso" className="mt-4">
                  <Card className="bg-magical-deepPurple/40 border-magical-gold/30">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-magical-gold" />
                        <h3 className="font-semibold text-magical-starlight font-magical">Instruções de Uso</h3>
                      </div>
                      
                      {getProductUsage() ? (
                        <div className="bg-gradient-to-r from-magical-mysticalPurple/30 to-magical-deepPurple/30 p-4 rounded-lg border border-magical-gold/20">
                          <p className="text-sm text-magical-starlight leading-relaxed whitespace-pre-wrap font-enchanted">{getProductUsage()}</p>
                        </div>
                      ) : (
                        <div className="bg-magical-deepPurple/60 p-4 rounded-lg border border-magical-gold/20">
                          <p className="text-sm text-magical-starlight/80 text-center font-enchanted">
                            Instruções de uso serão fornecidas junto com o artefato mágico.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={getProductImages()}
        currentIndex={selectedImageIndex}
        productName={product.produto}
      />

      {product.video && (
        <ProductVideoModal
          isOpen={isVideoOpen}
          onClose={() => setIsVideoOpen(false)}
          videoUrl={product.video}
          productName={product.produto}
          productPrice={formatPrice(product.valor)}
          productLink={product.link}
          productImages={getProductImages()}
        />
      )}
    </>
  );
});

ProductDetailModal.displayName = 'ProductDetailModal';
