
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-white">
          {/* Header compacto */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h2 className="text-base md:text-lg font-bold line-clamp-1">
                {product.produto}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                  {product.categoria}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-300 fill-current" />
                  <span className="text-xs">4.8 (2.1k)</span>
                </div>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Layout em grid compacto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Galeria à esquerda */}
            <div className="space-y-3">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
                    className="absolute bottom-3 right-3 bg-red-500 hover:bg-red-600 rounded-full p-2"
                  >
                    <Play className="w-4 h-4 text-white" />
                  </Button>
                )}
              </div>

              {/* Miniaturas compactas */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {getProductImages().map((image, index) => (
                  <button
                    key={index}
                    className="flex-shrink-0 w-12 h-12 rounded border-2 border-gray-200 hover:border-purple-500 overflow-hidden transition-colors"
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

            {/* Informações à direita */}
            <div className="space-y-4">
              {/* Preço */}
              <div>
                <div className="text-2xl font-bold text-red-500 mb-1">
                  Menos de {formatPrice(product.valor)}
                </div>
                <div className="text-xs text-gray-600">
                  Frete grátis para todo o Brasil
                </div>
              </div>

              {/* Tabs compactas */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-8">
                  <TabsTrigger value="description" className="text-xs">Descrição</TabsTrigger>
                  <TabsTrigger value="tips" className="text-xs">Dicas IA</TabsTrigger>
                </TabsList>
                
                <TabsContent value="description" className="mt-3">
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-sm text-gray-700 leading-relaxed mb-3">
                        {generateProductDescription()}
                      </p>
                      
                      <div>
                        <h4 className="font-medium mb-2 text-sm">Características:</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li>• Alta qualidade e durabilidade</li>
                          <li>• Design moderno e funcional</li>
                          <li>• Fácil de usar no dia a dia</li>
                          <li>• Excelente custo-benefício</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="tips" className="mt-3">
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        <h3 className="font-semibold text-sm">Dicas da IA</h3>
                      </div>
                      
                      {!aiTips && !loadingTips && (
                        <Button
                          onClick={generateAITips}
                          variant="outline"
                          size="sm"
                          className="w-full mb-3"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Gerar dicas personalizadas
                        </Button>
                      )}
                      
                      {loadingTips && (
                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                          <span className="text-xs">Gerando dicas especiais para você...</span>
                        </div>
                      )}
                      
                      {aiTips && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200">
                          <p className="text-sm text-gray-800 leading-relaxed">{aiTips}</p>
                          <Button
                            onClick={generateAITips}
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-purple-600 hover:text-purple-700 h-8"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            Nova dica
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Botões de ação */}
              <div className="flex gap-2">
                <Button
                  variant="outline" 
                  size="sm"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 h-9"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favoritar
                </Button>
                <Button
                  onClick={handleBuyClick}
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold h-9"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Comprar na Shopee
                </Button>
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
