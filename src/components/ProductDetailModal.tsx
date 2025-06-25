
import React, { useState, useEffect, memo } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X, ShoppingCart, Heart, Star, Play, Lightbulb, Sparkles, Wand2, Crown, Zap, Shield, Book } from 'lucide-react';
import { ImageZoomModal } from '@/components/ImageZoomModal';
import { ProductVideoModal } from '@/components/ProductVideoModal';
import { MagicalParticles } from '@/components/MagicalParticles';

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

  const getMagicalCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Itens Colecionáveis': Crown,
      'Bonecas e Brinquedos de Pelúcia': Sparkles,
      'Luminária': Wand2,
      'Colares': Crown,
      'Moletons e Suéteres': Shield,
      'Capinhas': Shield,
      'Canecas': Zap
    };
    return iconMap[category] || Book;
  };

  const getMagicalCategoryName = (category: string) => {
    const nameMap: Record<string, string> = {
      'Itens Colecionáveis': 'Artefatos Colecionáveis',
      'Bonecas e Brinquedos de Pelúcia': 'Criaturas Encantadas',
      'Luminária': 'Iluminação Mística',
      'Colares': 'Joias Encantadas',
      'Moletons e Suéteres': 'Vestes Mágicas',
      'Capinhas': 'Proteções Místicas',
      'Canecas': 'Cálices Mágicos'
    };
    return nameMap[category] || category;
  };

  const getMagicalSubcategoryName = (subcategory: string) => {
    const nameMap: Record<string, string> = {
      'Capa Dura': 'Edição de Luxo',
      'Capa Comum': 'Edição Padrão',
    };
    return nameMap[subcategory] || subcategory;
  };

  const CategoryIcon = getMagicalCategoryIcon(product.categoria);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-gradient-to-br from-magical-deepPurple via-magical-mysticalPurple to-magical-midnight border-2 border-magical-gold/50 shadow-2xl shadow-magical-gold/30 relative">
          <MagicalParticles />
          
          {/* Header mágico aprimorado com botão de fechar */}
          <div className="relative bg-gradient-to-r from-magical-mysticalPurple via-magical-deepPurple to-magical-mysticalPurple text-magical-starlight p-4 flex items-center justify-between z-50 border-b-2 border-magical-gold/40">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-base md:text-lg font-bold line-clamp-2 font-magical flex items-center gap-2">
                <CategoryIcon className="w-5 h-5 text-magical-gold" />
                {product.produto}
                <Sparkles className="w-4 h-4 text-magical-gold animate-sparkle" />
              </h2>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge className="bg-gradient-to-r from-magical-gold/30 to-magical-bronze/30 text-magical-gold border-magical-gold/50 text-xs font-enchanted shadow-lg">
                  ⚡ {getMagicalCategoryName(product.categoria)}
                </Badge>
                {product.subcategoria && (
                  <Badge className="bg-gradient-to-r from-magical-bronze/30 to-magical-gold/30 text-magical-bronze border-magical-bronze/50 text-xs font-enchanted shadow-lg">
                    ✨ {getMagicalSubcategoryName(product.subcategoria)}
                  </Badge>
                )}
                <div className="flex items-center gap-1 bg-magical-gold/20 px-2 py-1 rounded-full border border-magical-gold/30">
                  <Star className="w-3 h-3 text-magical-gold fill-current" />
                  <span className="text-xs text-magical-starlight font-bold">4.8</span>
                  <span className="text-xs text-magical-starlight/80">(2.1k encantamentos)</span>
                </div>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost" 
              size="sm"
              className="text-magical-starlight hover:bg-magical-crimson/80 bg-magical-crimson/60 border-2 border-magical-gold/50 rounded-full w-12 h-12 p-0 flex-shrink-0 transition-all duration-300 hover:scale-110 shadow-xl hover:shadow-magical-crimson/50"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Layout em grid mágico aprimorado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-gradient-to-br from-magical-midnight/50 to-magical-deepPurple/30 relative">
            {/* Galeria mágica à esquerda */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gradient-to-br from-magical-gold/10 to-magical-bronze/10 rounded-xl overflow-hidden border-2 border-magical-gold/40 shadow-2xl backdrop-blur-sm">
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
                          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Badge className="bg-magical-gold/80 text-magical-midnight text-xs">
                              🔍 Clique para ampliar
                            </Badge>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 bg-magical-deepPurple/90 hover:bg-magical-mysticalPurple text-magical-gold border-2 border-magical-gold/40 shadow-lg" />
                  <CarouselNext className="right-2 bg-magical-deepPurple/90 hover:bg-magical-mysticalPurple text-magical-gold border-2 border-magical-gold/40 shadow-lg" />
                </Carousel>
                
                {product.video && (
                  <Button
                    onClick={() => setIsVideoOpen(true)}
                    className="absolute bottom-4 right-4 bg-gradient-to-r from-magical-crimson to-magical-gold hover:from-magical-gold hover:to-magical-crimson rounded-full p-3 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-magical-starlight/30"
                  >
                    <Play className="w-5 h-5 text-magical-starlight" />
                  </Button>
                )}
              </div>

              {/* Miniaturas mágicas aprimoradas */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {getProductImages().map((image, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-magical-gold/30 hover:border-magical-gold/80 overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-magical-gold/30"
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
              {/* Preço mágico aprimorado */}
              <div className="bg-gradient-to-br from-magical-gold/15 to-magical-bronze/15 p-6 rounded-xl border-2 border-magical-gold/40 backdrop-blur-sm shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-magical-gold/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="text-3xl font-bold text-magical-gold mb-2 font-magical flex items-center gap-3">
                  <Wand2 className="w-7 h-7 text-magical-gold animate-pulse" />
                  <span className="bg-gradient-to-r from-magical-gold to-magical-bronze bg-clip-text text-transparent">
                    Menos de {formatPrice(product.valor)}
                  </span>
                  <Zap className="w-5 h-5 text-magical-gold animate-sparkle" />
                </div>
                <div className="text-sm text-magical-starlight/90 mb-6 font-enchanted flex items-center gap-2">
                  <Crown className="w-4 h-4 text-magical-gold" />
                  ⚡ Entrega mágica expressa para todo o Reino Mágico
                  <Sparkles className="w-4 h-4 text-magical-gold animate-sparkle" />
                </div>
                
                {/* Botões de ação mágicos aprimorados */}
                <div className="flex gap-3 mb-4">
                  <Button
                    variant="outline" 
                    size="default"
                    className="flex-1 border-2 border-magical-gold/40 text-magical-gold hover:bg-magical-gold/20 bg-magical-gold/10 backdrop-blur-sm font-enchanted shadow-lg hover:shadow-magical-gold/30 transition-all duration-300 hover:scale-105"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    💫 Favoritar
                  </Button>
                  <Button
                    onClick={handleBuyClick}
                    size="default"
                    className="flex-2 bg-gradient-to-r from-magical-mysticalPurple to-magical-deepPurple hover:from-magical-deepPurple hover:to-magical-mysticalPurple text-magical-starlight font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-enchanted border-2 border-magical-gold/30 hover:border-magical-gold/50"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    🏰 Adquirir Artefato Mágico
                  </Button>
                </div>

                {/* Selo de autenticidade mágica */}
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-magical-emerald/30 to-magical-mysticalPurple/30 text-magical-starlight border border-magical-gold/30 px-3 py-1 text-xs">
                    ✅ Certificado pelos Mestres de Hogwarts
                  </Badge>
                </div>
              </div>

              {/* Tabs mágicas aprimoradas */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-magical-deepPurple/80 border-2 border-magical-gold/40 backdrop-blur-sm">
                  <TabsTrigger value="description" className="data-[state=active]:bg-magical-gold data-[state=active]:text-magical-midnight font-enchanted flex items-center gap-2">
                    <Book className="w-4 h-4" />
                    📜 Descrição Mágica
                  </TabsTrigger>
                  <TabsTrigger value="uso" className="data-[state=active]:bg-magical-gold data-[state=active]:text-magical-midnight font-enchanted flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    🔮 Instruções de Uso
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-4">
                  <Card className="bg-gradient-to-br from-magical-deepPurple/60 to-magical-mysticalPurple/40 border-2 border-magical-gold/40 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-6">
                      {product.descricao && product.descricao.trim() !== '' ? (
                        <div className="bg-gradient-to-r from-magical-gold/10 to-magical-bronze/10 p-4 rounded-lg border border-magical-gold/30 shadow-inner">
                          <p className="text-sm text-magical-starlight leading-relaxed whitespace-pre-wrap font-enchanted">
                            {product.descricao}
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm text-magical-starlight leading-relaxed mb-4 font-enchanted">
                            <strong className="text-magical-gold">✨ {product.produto}</strong> é um artefato mágico de alta qualidade, forjado pelos melhores artesãos dos mundos mágicos de Hogwarts. 
                            Perfeito para bruxos e bruxas que buscam praticidade, durabilidade e funcionalidade em suas aventuras mágicas cotidianas.
                          </p>
                          
                          <div>
                            <h4 className="font-medium mb-3 text-magical-gold font-magical flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              🌟 Características Mágicas Especiais:
                            </h4>
                            <ul className="text-sm text-magical-starlight/90 space-y-2 font-enchanted">
                              <li className="flex items-center gap-2">
                                <Crown className="w-3 h-3 text-magical-gold" />
                                ✨ Encantamento de alta durabilidade e resistência mágica
                              </li>
                              <li className="flex items-center gap-2">
                                <Wand2 className="w-3 h-3 text-magical-gold" />
                                🔮 Design funcional inspirado nas tradições de Hogwarts
                              </li>
                              <li className="flex items-center gap-2">
                                <Zap className="w-3 h-3 text-magical-gold" />
                                ⚡ Fácil de usar no cotidiano mágico e aventuras
                              </li>
                              <li className="flex items-center gap-2">
                                <Star className="w-3 h-3 text-magical-gold" />
                                🌟 Excelente relação magia-preço certificada pelos mestres
                              </li>
                            </ul>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="uso" className="mt-4">
                  <Card className="bg-gradient-to-br from-magical-deepPurple/60 to-magical-mysticalPurple/40 border-2 border-magical-gold/40 backdrop-blur-sm shadow-xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-magical-gold" />
                        <h3 className="font-semibold text-magical-starlight font-magical">🔮 Instruções Mágicas de Uso</h3>
                      </div>
                      
                      {product.uso && product.uso.trim() !== '' ? (
                        <div className="bg-gradient-to-r from-magical-gold/10 to-magical-bronze/10 p-4 rounded-lg border border-magical-gold/30 shadow-inner">
                          <p className="text-sm text-magical-starlight leading-relaxed whitespace-pre-wrap font-enchanted">
                            {product.uso}
                          </p>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-magical-mysticalPurple/20 to-magical-deepPurple/20 p-6 rounded-lg border border-magical-gold/30 text-center shadow-inner">
                          <div className="flex items-center justify-center gap-2 mb-3">
                            <Wand2 className="w-5 h-5 text-magical-gold animate-pulse" />
                            <Sparkles className="w-4 h-4 text-magical-gold animate-sparkle" />
                          </div>
                          <p className="text-sm text-magical-starlight/90 font-enchanted">
                            ⚡ As instruções de uso mágicas deste artefato estão sendo preparadas pelos mestres de Hogwarts 
                            e serão reveladas em breve através de pergaminhos encantados. 
                          </p>
                          <p className="text-xs text-magical-starlight/70 mt-2 font-enchanted">
                            🦉 Aguarde a entrega por coruja mágica!
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
