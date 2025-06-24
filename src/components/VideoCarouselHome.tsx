
import React from 'react';
import { Play, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNavigate } from 'react-router-dom';

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

interface VideoCarouselHomeProps {
  products: Product[];
}

export const VideoCarouselHome: React.FC<VideoCarouselHomeProps> = ({ products }) => {
  const navigate = useNavigate();

  const handleWatchVideo = (productId: number) => {
    // Navigate to Explorar page with the specific product
    navigate(`/explorar?video=${productId}`);
  };

  const handleBuyProduct = (product: Product) => {
    window.open(product.link, '_blank');
  };

  const formatPrice = (price: string) => {
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  };

  if (products.length === 0) return null;

  return (
    <section className="px-4 md:px-6 py-8 md:py-12 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 animate-slide-in-left">
            🎬 Vídeos em Destaque
          </h2>
          <p className="text-base text-white/80 animate-slide-in-right">
            Conheça os produtos através dos vídeos exclusivos
          </p>
        </div>

        <Carousel className="w-full animate-scale-in">
          <CarouselContent className="-ml-2 md:-ml-3">
            {products.map((product, index) => (
              <CarouselItem 
                key={product.id} 
                className="pl-2 md:pl-3 basis-3/4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video bg-gray-900 overflow-hidden">
                    <img 
                      src={product.imagem1} 
                      alt={product.produto}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Video Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        onClick={() => handleWatchVideo(product.id)}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full p-4"
                        size="sm"
                      >
                        <Play className="w-6 h-6 text-white fill-white" />
                      </Button>
                    </div>

                    {/* Video Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-red-600 text-white text-xs font-semibold">
                        VÍDEO
                      </Badge>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-orange-500 text-white text-xs">
                        {product.categoria}
                      </Badge>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm leading-tight">
                      {product.produto}
                    </h3>
                    <p className="text-orange-600 font-bold text-lg mb-3">
                      Menos de {formatPrice(product.valor)}
                    </p>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleWatchVideo(product.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Assistir
                      </Button>
                      <Button 
                        onClick={() => handleBuyProduct(product)}
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                      >
                        <ShoppingCart className="w-3 h-3 mr-1" />
                        Comprar
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:left-4 bg-white/90 hover:bg-white border-orange-200" />
          <CarouselNext className="right-2 md:right-4 bg-white/90 hover:bg-white border-orange-200" />
        </Carousel>

        <div className="text-center mt-6 animate-fade-in">
          <Button 
            onClick={() => navigate('/explorar')}
            className="bg-white text-red-600 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105"
          >
            Ver Todos os Vídeos
            <Play className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
