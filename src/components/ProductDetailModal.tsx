
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
    
    // Generate tips based on category and product name
    const productName = product.produto.toLowerCase();
    const category = product.categoria || '';
    
    let specificTips = '';
    
    if (category.includes('Fones de Ouvido') || productName.includes('fone') || productName.includes('headphone') || productName.includes('earphone')) {
      const fonesExamples = [
        `Esse ${product.produto} é perfeito para várias situações do seu dia! 🎧 Use no trabalho quando você precisa se concentrar - especialmente se trabalha em escritório aberto ou home office com barulho. É ideal para estudar também, ajuda muito na concentração! No transporte público então, é essencial - ônibus, metrô, avião... você fica no seu mundo ouvindo música, podcast ou audiobook. Para quem malha na academia, faz toda diferença! A música te motiva muito mais. Para calls de trabalho ou aulas online? Perfeito! Ninguém mais reclama que não te escuta bem. E para gamers que jogam online com amigos, é indispensável para uma boa comunicação na equipe!`,
        
        `O ${product.produto} vai ser seu melhor amigo em tantos momentos! 🎵 De manhã cedo, quando você quer ouvir música sem acordar a família. À noite, quando quer assistir Netflix ou YouTube sem incomodar ninguém. É excelente para quem tem filhos pequenos e precisa trabalhar em casa - você consegue se concentrar mesmo com a criançada brincando. Para estudantes então, nossa! Biblioteca, quarto de república, qualquer lugar fica mais silencioso. E para quem viaja muito? Indispensável! No avião você não sofre com choro de bebê ou conversa alta. É ótimo também para relaxar fazendo meditação ou ouvindo sons da natureza antes de dormir.`,
        
        `Vou te dar dicas de ouro sobre quando usar o ${product.produto}! 💎 No trabalho: reuniões online, calls importantes, ou quando você precisa dar uma pausa e ouvir música para relaxar. Em casa, é perfeito quando tem visita e você quer se desconectar um pouquinho, ou quando está cozinhando e quer ouvir seu podcast favorito. Para exercícios, seja caminhada, corrida ou academia, a música com um bom fone muda tudo! Para quem tem ansiedade ou stress, é terapêutico colocar um som relaxante. E para gamers: essencial em jogos cooperativos com amigos!`
      ];
      specificTips = fonesExamples[Math.floor(Math.random() * fonesExamples.length)];
    }
    else if (category.includes('Beleza') || category.includes('Cuidados') || productName.includes('creme') || productName.includes('loção') || productName.includes('serum')) {
      const belezaExamples = [
        `O ${product.produto} vai revolucionar sua rotina de cuidados! ✨ Use de manhã depois do banho, principalmente se sua pele está ressecada - aplique com a pele ainda úmida que absorve melhor. À noite, no seu ritual de skincare, é perfeito depois de limpar bem o rosto. Fins de semana, faça uma sessão spa em casa: aplique, coloque música relaxante e aproveite o momento. É ótimo antes de eventos importantes - casamentos, formaturas, encontros especiais - deixa a pele preparada para maquiagem. Para quem trabalha muito no computador ou fica em ambiente com ar condicionado, usar durante o dia ajuda a manter a hidratação!`,
        
        `Esse ${product.produto} é perfeito para vários momentos! 🌟 De manhã, no seu ritual matinal - acorda a pele e te deixa fresquinha para o dia. Depois do exercício, é maravilhoso para acalmar a pele. No pós-sol também, se você foi à praia ou piscina. À noite, depois de um dia cansativo, é como um mimo para você! Perfeito para usar antes de dormir - você acorda com a pele renovada. Nos dias de TPM quando a pele fica mais sensível, ele ajuda muito a acalmar. Para quem tem rotina corrida, aplique rapidinho antes de sair que já faz diferença!`
      ];
      specificTips = belezaExamples[Math.floor(Math.random() * belezaExamples.length)];
    }
    else if (category.includes('Casa') || category.includes('Decoração') || productName.includes('decoração') || productName.includes('organizador')) {
      const casaExamples = [
        `O ${product.produto} vai transformar sua casa! 🏠 É perfeito para sala de estar - deixa o ambiente mais aconchegante para receber amigos e família. No quarto, cria aquela vibe relaxante que todo mundo ama. Ideal para quem está decorando o primeiro apartamento ou mudando de casa - pequenos detalhes fazem toda diferença! Use para criar cantinhos instagramáveis que ficam lindos nas fotos. Ótimo para apartamentos alugados onde você não pode fazer mudanças grandes - melhora o visual sem furar parede! Combina super bem com plantas, livros e outros elementos decorativos!`,
        
        `Esse ${product.produto} será o destaque da sua casa! ✨ Coloque na entrada para causar boa primeira impressão nas visitas. Na sala de jantar, deixa as refeições em família mais especiais. Perfeito para home office também - deixa o ambiente mais inspirador para trabalhar. Para quem mora com roommates, é uma forma de personalizar seu espaço. Use para criar ambiente romântico para jantares especiais. Ideal também para festas em casa - deixa tudo mais bonito para os amigos!`
      ];
      specificTips = casaExamples[Math.floor(Math.random() * casaExamples.length)];
    }
    else if (category.includes('Tecnologia') || category.includes('Acessórios') || productName.includes('carregador') || productName.includes('cabo') || productName.includes('suporte')) {
      const tecExamples = [
        `O ${product.produto} vai facilitar muito sua vida! 📱 É essencial para quem trabalha muito no computador ou celular - evita aquele stress de cabo desorganizado. Perfeito para home office, deixa tudo mais profissional e organizado. Use no quarto também, principalmente para carregar o celular durante a noite. Ideal para quem viaja muito - ocupa pouco espaço na mala e resolve vários problemas. Na faculdade ou trabalho, todo mundo vai te pedir emprestado! Ótimo também para família - um produto que toda casa deveria ter!`,
        
        `Esse ${product.produto} é indispensável hoje em dia! ⚡ Use no carro para manter os dispositivos sempre carregados em viagens longas. Perfeito para escritório, principalmente se você fica muito tempo fora de casa. Em casa, deixe na sala para toda família usar - evita briga por carregador! Ideal para estudantes que passam o dia na faculdade. Para quem trabalha com delivery, freelancer ou qualquer trabalho que depende do celular, é essencial!`
      ];
      specificTips = tecExamples[Math.floor(Math.random() * tecExamples.length)];
    }
    else {
      // Default tips based on product name and category
      const defaultExamples = [
        `O ${product.produto} é perfeito para o seu dia a dia! 💫 Use sempre que precisar de praticidade e qualidade na categoria ${category}. É ideal para você, sua família e amigos - todo mundo vai aprovar! Funciona super bem em casa, no trabalho, na escola, em viagens... é bem versátil mesmo! A qualidade compensa cada centavo, e você vai ver como facilita sua rotina. É daqueles produtos que depois que você tem, não consegue mais ficar sem!`,
        
        `Esse ${product.produto} vai ser seu melhor amigo! 🌟 Use de manhã para começar o dia bem, à tarde quando precisar de praticidade, e à noite para relaxar. É perfeito para usar sozinho ou com a família. Combina com seu estilo de vida, seja mais agitado ou mais tranquilo. É uma escolha inteligente na categoria ${category} - você investe uma vez e aproveita por muito tempo. Recomendo muito!`,
        
        `Vou te dar a real sobre o ${product.produto}! ✨ É daqueles itens que você compra achando que é só mais um, mas vira essencial na sua vida. Use sempre que quiser se sentir bem e confortável. É perfeito para presentear também - mãe, pai, irmão, melhor amigo... todo mundo gosta de produtos da categoria ${category}! A qualidade é top e o preço está super justo. Não deixe passar essa oportunidade! 🛍️`
      ];
      specificTips = defaultExamples[Math.floor(Math.random() * defaultExamples.length)];
    }
    
    setTimeout(() => {
      setAiTips(specificTips);
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
          {/* Header com botão de fechar mais visível */}
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
              className="text-white hover:bg-red-500/80 bg-red-500/60 border border-white/50 rounded-full w-10 h-10 p-0 flex-shrink-0 transition-all duration-300 hover:scale-110"
            >
              <X className="w-5 h-5" />
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
                            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
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
                          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{aiTips}</p>
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
          productImages={getProductImages()}
        />
      )}
    </>
  );
};
