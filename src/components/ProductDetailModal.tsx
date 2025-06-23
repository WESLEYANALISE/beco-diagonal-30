
import React, { useState, useEffect } from 'react';
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

  const generateProductDescription = () => {
    const category = product.categoria || 'Produto';
    return `${product.produto} é um ${category.toLowerCase()} de alta qualidade que oferece excelente custo-benefício. Perfeito para quem busca praticidade, durabilidade e funcionalidade no dia a dia. Com design moderno e acabamento cuidadoso, este produto foi desenvolvido para atender suas necessidades com máxima satisfação.`;
  };

  const generateAITips = async () => {
    setLoadingTips(true);
    
    const categoryTips: Record<string, string[]> = {
      'Fones de Ouvido': [
        `Ó, esse ${product.produto} é perfeito pra quando você quer se desconectar do mundo! 🎧 Use no trabalho pra focar melhor, ou no ônibus pra curtir sua playlist favorita.`,
        `Dica de quem entende: coloca ele quando for estudar, malhar na academia ou até fazer uma caminhada. O som fica incrível e você nem sente o tempo passar!`,
        `Olha só, esse fone é ideal pra quem gosta de jogar online com os amigos ou fazer aquelas calls de trabalho sem incomodar ninguém em casa.`,
        `Entre nós: é perfeito pra usar quando você quer assistir Netflix tarde da noite sem acordar a família toda! 😄`,
        `Pro tip: leva ele pra viagem, no avião ou ônibus de longa distância. Vai ser seu melhor companheiro pra passar o tempo!`,
      ],
      'Beleza e Cuidados Pessoais': [
        `Menina, esse ${product.produto} é tudo de bom! Use de manhã depois do banho ou à noite antes de dormir - sua pele vai agradecer! ✨`,
        `Dica valiosa: aplica ele depois de limpar bem o rosto, pode ser no seu ritual de skincare noturno. Combina super bem com outros produtos!`,
        `Ó, é perfeito pra usar antes daquela festa importante ou encontro especial. Deixa a pele linda e radiante!`,
        `Entre amigas: usa regularmente, tipo 2-3 vezes por semana. A consistência é o segredo pra ter resultados incríveis!`,
        `Dica de ouro: compartilha com sua irmã, mãe ou melhor amiga - vocês vão amar fazer esse ritual juntas!`,
      ],
      'Casa e Decoração': [
        `Esse ${product.produto} vai dar uma renovada incrível na sua casa! Coloca na sala pra impressionar as visitas ou no quarto pra criar um ambiente mais aconchegante 🏠`,
        `Dica de decoração: combina super bem com plantas, velas aromáticas ou aqueles cantinhos instagramáveis que todo mundo ama!`,
        `Olha, é perfeito pra quando você quer fazer aquela renovação sem gastar muito. Pequenos detalhes fazem toda diferença!`,
        `Pro tip: convida as amigas pra ajudar a organizar e decorar - vira uma tarde super divertida e o resultado fica lindo!`,
        `Entre nós: é ideal pra quem tá começando a vida adulta ou se mudando. Dá pra começar devagar e ir montando a casa dos sonhos!`,
      ],
      'Tecnologia e Acessórios': [
        `Esse ${product.produto} vai facilitar muito sua vida! Use no trabalho, na faculdade ou em casa - é super prático e funcional 📱`,
        `Dica tech: perfeito pra quem vive grudado no celular ou trabalha no computador. Vai te ajudar a ser mais produtivo!`,
        `Olha só, é ideal pra quem gosta de estar sempre conectado ou precisa de algo confiável pro dia a dia.`,
        `Entre nós: compatível com praticamente tudo! Leva pra onde for que não vai te decepcionar.`,
        `Pro tip: investe nesse tipo de produto porque dura muito e compensa cada centavo. Qualidade que vale a pena!`,
      ]
    };
    
    const defaultTips = [
      `Olha, esse ${product.produto} é perfeito para o seu dia a dia! 💫 Use sempre que precisar de praticidade e qualidade.`,
      `Dica de amigo: aproveite ao máximo usando ele regularmente - a qualidade compensa e você vai adorar!`,
      `Se você está em dúvida, pode confiar! Produtos como esse sempre fazem diferença na rotina e facilitam a vida.`,
      `Pro tip: combina com outros itens similares para um resultado ainda melhor! É investimento que vale a pena! ✨`,
      `Entre nós: pelo preço que está, é uma baita oportunidade! Não deixa passar não! 🛍️`,
    ];
    
    const tips = categoryTips[product.categoria] || defaultTips;
    
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
                  <TabsTrigger value="tips" className="text-xs">Me dê dicas</TabsTrigger>
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
                        <h3 className="font-semibold text-sm">Me dê dicas</h3>
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
