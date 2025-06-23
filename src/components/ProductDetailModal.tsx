
import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X, ShoppingCart, Heart, Star, Play, Lightbulb, Sparkles } from 'lucide-react';
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
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [aiTips, setAiTips] = useState<string>('');
  const [loadingTips, setLoadingTips] = useState(false);

  const getProductImages = () => {
    return [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5].filter(Boolean);
  };

  const formatPrice = (price: string) => {
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  };

  const generateProductDescription = () => {
    const category = product.categoria || 'Produto';
    return `${product.produto} é um ${category.toLowerCase()} de alta qualidade que oferece excelente custo-benefício. Perfeito para quem busca praticidade, durabilidade e funcionalidade no dia a dia. Com design moderno e acabamento cuidadoso, este produto foi desenvolvido para atender suas necessidades com máxima satisfação.`;
  };

  const generateAITips = async () => {
    setLoadingTips(true);
    
    // Simulação de dicas da IA (em um app real, você faria uma chamada para uma API de IA)
    const tips = [
      `Olha, esse ${product.produto} é perfeito para o seu dia a dia! 💫`,
      `Uma dica de amiga: aproveite ao máximo usando ele regularmente - a qualidade compensa!`,
      `Se você está em dúvida, pode confiar! Produtos como esse sempre fazem diferença na rotina.`,
      `Pro tip: combine com outros itens da mesma categoria para um resultado ainda melhor! ✨`,
      `Dica valiosa: leia as instruções com calma na primeira vez - vai te ajudar a usar melhor.`,
      `Entre nós: pelo preço que está, é uma baita oportunidade! Não deixa passar não! 🛍️`,
      `Ah, e uma coisa importante: cuida bem dele que vai durar muito tempo!`,
    ];
    
    setTimeout(() => {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setAiTips(randomTip);
      setLoadingTips(false);
    }, 1500);
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
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 bg-white">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-lg md:text-xl font-bold line-clamp-2">
                {product.produto}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  {product.categoria}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-300 fill-current" />
                  <span className="text-sm">4.8 (2.1k avaliações)</span>
                </div>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20 rounded-lg"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Conteúdo principal */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Galeria de imagens */}
              <div className="space-y-4">
                <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
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
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                  
                  {product.video && (
                    <Button
                      onClick={() => setIsVideoOpen(true)}
                      className="absolute bottom-4 right-4 bg-red-500 hover:bg-red-600 rounded-full p-3"
                    >
                      <Play className="w-5 h-5 text-white" />
                    </Button>
                  )}
                </div>

                {/* Miniaturas */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {getProductImages().map((image, index) => (
                    <button
                      key={index}
                      className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-gray-200 hover:border-purple-500 overflow-hidden transition-colors"
                      onClick={() => handleImageClick(index)}
                    >
                      <img
                        src={image}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Informações do produto */}
              <div className="space-y-6">
                <div>
                  <div className="text-3xl font-bold text-red-500 mb-2">
                    Menos de {formatPrice(product.valor)}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Frete grátis para todo o Brasil
                  </div>
                </div>

                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="description">Descrição</TabsTrigger>
                    <TabsTrigger value="tips">Dicas de Uso</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-3">Sobre o produto</h3>
                        <p className="text-gray-700 leading-relaxed">
                          {generateProductDescription()}
                        </p>
                        
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">Características:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Alta qualidade e durabilidade</li>
                            <li>• Design moderno e funcional</li>
                            <li>• Fácil de usar no dia a dia</li>
                            <li>• Excelente custo-benefício</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="tips" className="mt-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Lightbulb className="w-5 h-5 text-yellow-500" />
                          <h3 className="font-semibold">Dicas da IA</h3>
                        </div>
                        
                        {!aiTips && !loadingTips && (
                          <Button
                            onClick={generateAITips}
                            variant="outline"
                            className="w-full mb-4"
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Gerar dicas personalizadas
                          </Button>
                        )}
                        
                        {loadingTips && (
                          <div className="flex items-center gap-2 text-gray-600 mb-4">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                            <span className="text-sm">Gerando dicas especiais para você...</span>
                          </div>
                        )}
                        
                        {aiTips && (
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                            <p className="text-gray-800 leading-relaxed">{aiTips}</p>
                            <Button
                              onClick={generateAITips}
                              variant="ghost"
                              size="sm"
                              className="mt-3 text-purple-600 hover:text-purple-700"
                            >
                              <Sparkles className="w-4 h-4 mr-1" />
                              Gerar nova dica
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                {/* Botões de ação */}
                <div className="flex gap-3">
                  <Button
                    variant="outline" 
                    size="lg"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Favoritar
                  </Button>
                  <Button
                    onClick={handleBuyClick}
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Comprar na Shopee
                  </Button>
                </div>
              </div>
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
        />
      )}
    </>
  );
};
