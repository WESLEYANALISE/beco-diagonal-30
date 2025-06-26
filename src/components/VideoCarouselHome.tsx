
import React, { useCallback, useRef, useEffect, useState } from 'react';
import { Crown, Play, Zap, Eye, Package } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LazyImage } from '@/components/LazyImage';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';

interface Product {
  id: number;
  produto: string;
  valor: string;
  video: string;
  imagem1: string;
  imagem2?: string;
  imagem3?: string;
  imagem4?: string;
  imagem5?: string;
  link: string;
  categoria: string;
  descricao?: string;
}

interface VideoCarouselHomeProps {
  products: Product[];
}

export const VideoCarouselHome: React.FC<VideoCarouselHomeProps> = ({
  products
}) => {
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});

  const handleBuyClick = useCallback((link: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const handleVideoClick = useCallback((productId: number) => {
    const video = videoRefs.current[productId];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  }, []);

  const getProductImages = (product: Product): string[] => {
    const images = [product.imagem1, product.imagem2, product.imagem3, product.imagem4, product.imagem5]
      .filter((img): img is string => Boolean(img));
    return images;
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="px-4 md:px-6 py-8 animate-fade-in bg-gradient-to-r from-red-900/20 via-yellow-600/20 to-red-800/20 border-y border-yellow-500/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-yellow-500 animate-bounce" />
            <h2 className="text-2xl md:text-3xl font-bold text-magical-starlight font-magical">
              🏆 Artefatos em Destaque
            </h2>
            <Zap className="w-8 h-8 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-magical-starlight/90 text-lg font-enchanted">
            Os artefatos mais visualizados pelos usuários
          </p>
        </div>

        <Carousel className="w-full">
          <CarouselContent className="-ml-2 md:-ml-3">
            {products.map((product, index) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-3 basis-full md:basis-1/2 lg:basis-1/3">
                <Card className="group overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-br from-red-900/30 via-yellow-600/20 to-red-800/30 border-yellow-500/40 backdrop-blur-sm animate-fade-in" style={{
                  animationDelay: `${index * 0.1}s`
                }}>
                  <div className="relative aspect-video overflow-hidden">
                    {product.video ? (
                      <div className="relative w-full h-full">
                        <video
                          ref={(el) => videoRefs.current[product.id] = el}
                          src={product.video}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          autoPlay
                          muted
                          loop
                          playsInline
                          onClick={() => handleVideoClick(product.id)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 via-transparent to-transparent" />
                      </div>
                    ) : (
                      <>
                        <LazyImage 
                          src={product.imagem1} 
                          alt={product.produto} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900/80 via-red-900/20 to-transparent" />
                      </>
                    )}
                    
                    {/* Featured badge */}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-yellow-500/90 text-red-900 font-bold border border-yellow-400 shadow-lg">
                        <Crown className="w-3 h-3 mr-1" />
                        DESTAQUE
                      </Badge>
                    </div>
                    
                    {/* Play button overlay for videos */}
                    {product.video && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 bg-yellow-500/90 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-yellow-400 shadow-xl animate-pulse">
                          <Play className="w-6 h-6 text-red-900 ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4 bg-gradient-to-br from-red-900/40 to-yellow-600/20">
                    <div className="space-y-3">
                      <h3 className="font-bold text-magical-starlight text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors duration-300 font-enchanted">
                        {product.produto}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400/80 text-xs font-enchanted">Menos de</span>
                          <span className="text-yellow-400 font-bold text-lg font-magical">
                            {product.valor}
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          {product.categoria}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleBuyClick(product.link)} 
                          className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-red-900 hover:from-yellow-400 hover:to-yellow-500 font-semibold transition-all duration-300 hover:scale-105 font-enchanted shadow-lg hover:shadow-yellow-500/20"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Adquirir
                        </Button>
                        
                        <ProductPhotosModal
                          images={getProductImages(product)}
                          productName={product.produto}
                          productPrice={product.valor}
                          productLink={product.link}
                          videoUrl={product.video}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:left-4 bg-magical-starlight/90 hover:bg-magical-starlight border-yellow-500/30 shadow-xl" />
          <CarouselNext className="right-2 md:right-4 bg-magical-starlight/90 hover:bg-magical-starlight border-yellow-500/30 shadow-xl" />
        </Carousel>
      </div>
    </section>
  );
};
