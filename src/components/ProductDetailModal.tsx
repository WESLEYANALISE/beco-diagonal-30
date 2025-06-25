
import React, { useState, useEffect, memo } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X, ShoppingCart, Heart, Star, Play, Lightbulb, Sparkles, Wand2 } from 'lucide-react';
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

export const ProductDetailModal: React.FC<ProductDetailModalProps> = memo(({
  isOpen,
  onClose,
  product
}) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Auto-play video quando modal abre (se houver vídeo)
  useEffect(() => {
    if (isOpen && product.video) {
      const timer = setTimeout(() => {
        setIsVideoOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, product.video]);

  const getProductImages = () => {
    return [
      product.imagem1, 
      product.imagem2, 
      product.imagem3, 
      product.imagem4, 
      product.imagem5,
      product.imagem6,
      product.imagem7
    ].filter(Boolean);
  };

  const formatPrice = (price: string) => {
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-gradient-to-br from-magical-deepPurple via-magical-mysticalPurple to-magical-midnight border border-magical-gold/30 shadow-2xl shadow-magical-gold/20">
          {/* Header mágico com botão de fechar */}
          <div className="relative bg-gradient-to-r from-magical-mysticalPurple via-magical-deepPurple to-magical-mysticalPurple text-magical-starlight p-4 flex items-center justify-between z-50 border-b border-magical-gold/30">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-base md:text-lg font-bold line-clamp-2 font-magical">
                {product.produto}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-magical-gold/20 text-magical-gold border-magical-gold/30 text-xs font-enchanted">
                  {product.categoria}
                </Badge>
                {product.subcategoria && (
                  <Badge className="bg-magical-bronze/20 text-magical-bronze border-magical-bronze/30 text-xs font-enchanted">
                    {product.subcategoria}
                  </Badge>
                )}
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
              className="text-magical-starlight hover:bg-magical-crimson/80 bg-magical-crimson/60 border border-magical-gold/50 rounded-full w-12 h-12 p-0 flex-shrink-0 transition-all duration-300 hover:scale-110 shadow-lg"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Layout em grid mágico */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-100px)] bg-gradient-to-br from-magical-midnight/50 to-magical-deepPurple/30">
            {/* Galeria mágica à esquerda */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gradient-to-br from-magical-gold/10 to-magical-bronze/10 rounded-xl overflow-hidden border border-magical-gold/30 shadow-lg backdrop-blur-sm">
                <Carousel className="w-full h-full">
                  <CarouselContent>
                    {getProductImages().map((image, index) => (
                      <CarouselItem key={index}>
                        <div 
                          className="h-full cursor-pointer relative group"
                          onClick={() => handleImageClick(index)}
                        >
                          <img
                            src={image}
                            alt={`${product.produto} - ${index + 1}`}
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-magical-midnight/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <Sparkles className="absolute top-2 right-2 w-4 h-4 text-magical-gold animate-sparkle opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-magical-deepPurple/90 hover:bg-magical-mysticalPurple text-magical-gold border-magical-gold/30" />
                  <CarouselNext className="right-2 bg-magical-deepPurple/90 hover:bg-magical-mysticalPurple text-magical-gold border-magical-gold/30" />
                </Carousel>
                
                {product.video && (
                  <Button
                    onClick={() => setIsVideoOpen(true)}
                    className="absolute bottom-4 right-4 bg-gradient-to-r from-magical-crimson to-magical-gold hover:from-magical-gold hover:to-magical-crimson rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  >
                    <Play className="w-5 h-5 text-magical-starlight" />
                  </Button>
                )}
              </div>

              {/* Miniaturas mágicas */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {getProductImages().map((image, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-magical-gold/20 hover:border-magical-gold/60 overflow-hidden transition-all duration-300 hover:scale-105 shadow-md"
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

            {/* Informações mágicas à direita */}
            <div className="space-y-6">
              {/* Preço mágico */}
              <div className="bg-gradient-to-br from-magical-gold/10 to-magical-bronze/10 p-4 rounded-xl border border-magical-gold/30 backdrop-blur-sm">
                <div className="text-3xl font-bold text-magical-gold mb-2 font-magical flex items-center gap-2">
                  <Wand2 className="w-6 h-6 text-magical-gold" />
                  Menos de {formatPrice(product.valor)}
                </div>
                <div className="text-sm text-magical-starlight/80 mb-4 font-enchanted">
                  ⚡ Entrega mágica para todo o Reino
                </div>
                
                {/* Botões de ação mágicos */}
                <div className="flex gap-3 mb-6">
                  <Button
                    variant="outline" 
                    size="default"
                    className="flex-1 border-magical-gold/30 text-magical-gold hover:bg-magical-gold/10 bg-magical-gold/5 backdrop-blur-sm font-enchanted"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Favoritar
                  </Button>
                  <Button
                    onClick={handleBuyClick}
                    size="default"
                    className="flex-2 bg-gradient-to-r from-magical-mysticalPurple to-magical-deepPurple hover:from-magical-deepPurple hover:to-magical-mysticalPurple text-magical-starlight font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-enchanted"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Adquirir Artefato
                  </Button>
                </div>
              </div>

              {/* Tabs mágicas */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-magical-deepPurple/60 border border-magical-gold/30">
                  <TabsTrigger value="description" className="data-[state=active]:bg-magical-gold data-[state=active]:text-magical-midnight font-enchanted">
                    Descrição Mágica
                  </TabsTrigger>
                  <TabsTrigger value="uso" className="data-[state=active]:bg-magical-gold data-[state=active]:text-magical-midnight font-enchanted">
                    Instruções de Uso
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-4">
                  <Card className="bg-gradient-to-br from-magical-deepPurple/60 to-magical-mysticalPurple/40 border border-magical-gold/30 backdrop-blur-sm">
                    <CardContent className="p-4">
                      {product.descricao && product.descricao.trim() !== '' ? (
                        <div className="bg-gradient-to-r from-magical-gold/10 to-magical-bronze/10 p-4 rounded-lg border border-magical-gold/20">
                          <p className="text-sm text-magical-starlight leading-relaxed whitespace-pre-wrap font-enchanted">
                            {product.descricao}
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-magical-starlight leading-relaxed mb-4 font-enchanted">
                            {product.produto} é um artefato mágico de alta qualidade, criado pelos melhores artesãos de Hogwarts. 
                            Perfeito para bruxos e bruxas que buscam praticidade, durabilidade e funcionalidade no dia a dia mágico.
                          </p>
                          
                          <div>
                            <h4 className="font-medium mb-3 text-magical-gold font-magical flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              Características Mágicas:
                            </h4>
                            <ul className="text-sm text-magical-starlight/80 space-y-2 font-enchanted">
                              <li>✨ Encantamento de alta durabilidade</li>
                              <li>🔮 Design funcional e elegante</li>
                              <li>⚡ Fácil de usar no cotidiano mágico</li>
                              <li>🌟 Excelente relação magia-preço</li>
                            </ul>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="uso" className="mt-4">
                  <Card className="bg-gradient-to-br from-magical-deepPurple/60 to-magical-mysticalPurple/40 border border-magical-gold/30 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-magical-gold" />
                        <h3 className="font-semibold text-magical-starlight font-magical">Instruções Mágicas</h3>
                      </div>
                      
                      {product.uso && product.uso.trim() !== '' ? (
                        <div className="bg-gradient-to-r from-magical-gold/10 to-magical-bronze/10 p-4 rounded-lg border border-magical-gold/20">
                          <p className="text-sm text-magical-starlight leading-relaxed whitespace-pre-wrap font-enchanted">
                            {product.uso}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-magical-mysticalPurple/20 to-magical-deepPurple/20 p-4 rounded-lg border border-magical-gold/20">
                          <p className="text-sm text-magical-starlight/80 text-center font-enchanted">
                            ⚡ Instruções de uso mágicas serão reveladas em breve pelos mestres de Hogwarts.
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
