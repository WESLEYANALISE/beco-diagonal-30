
import React, { useCallback, memo, useMemo } from 'react';
import { Crown, ShoppingCart, Zap } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UltraFastImage } from '@/components/UltraFastImage';
import { UltraFastVideo } from '@/components/UltraFastVideo';
import { ProductPhotosModal } from '@/components/ProductPhotosModal';
import { useUltraPerformance } from '@/hooks/useUltraPerformance';

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

export const VideoCarouselHome = memo<VideoCarouselHomeProps>(({ products }) => {
  const { optimizedAction, throttledAction } = useUltraPerformance();

  const handleBuyClick = throttledAction(useCallback((link: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  }, []), 150);

  const getProductImages = useCallback((product: Product) => {
    const images = [];
    if (product.imagem1) images.push(product.imagem1);
    if (product.imagem2) images.push(product.imagem2);
    if (product.imagem3) images.push(product.imagem3);
    if (product.imagem4) images.push(product.imagem4);
    if (product.imagem5) images.push(product.imagem5);
    return images;
  }, []);

  const memoizedProducts = useMemo(() => products.slice(0, 8), [products]);

  if (!memoizedProducts || memoizedProducts.length === 0) {
    return null;
  }

  return (
    <section className="px-4 md:px-6 py-6 animate-fade-in bg-gradient-to-r from-red-900/20 via-yellow-600/20 to-red-800/20 border-y border-yellow-500/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Crown className="w-7 h-7 text-yellow-500 animate-bounce" />
            <h2 className="text-xl md:text-2xl font-bold text-magical-starlight font-magical">
              🏆 Artefatos em Destaque
            </h2>
            <Zap className="w-7 h-7 text-yellow-500 animate-pulse" />
          </div>
          <p className="text-magical-starlight/90 text-base font-enchanted">
            Os artefatos mais visualizados pelos usuários
          </p>
        </div>

        <Carousel 
          className="w-full"
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: false,
            duration: 20
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-3">
            {memoizedProducts.map((product, index) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-3 basis-full md:basis-1/2 lg:basis-1/3">
                <Card 
                  className="group overflow-hidden transition-all duration-200 hover:scale-[1.02] hover:shadow-xl bg-gradient-to-br from-red-900/30 via-yellow-600/20 to-red-800/30 border-yellow-500/40 backdrop-blur-sm"
                  style={{
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    willChange: 'transform'
                  }}
                >
                  <div className="relative aspect-video overflow-hidden">
                    {product.video ? (
                      <UltraFastVideo
                        src={product.video}
                        className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                        autoPlay={false}
                        muted={true}
                        loop={true}
                        preload="metadata"
                        priority={index < 3}
                      />
                    ) : (
                      <>
                        <UltraFastImage 
                          src={product.imagem1} 
                          alt={product.produto} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading={index < 3 ? "eager" : "lazy"}
                          priority={index < 3}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 via-red-900/10 to-transparent" />
                      </>
                    )}
                    
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-yellow-500/90 text-red-900 font-bold border border-yellow-400 shadow-lg text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        DESTAQUE
                      </Badge>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-transparent" />
                  </div>
                  
                  <CardContent className="p-3 bg-gradient-to-br from-red-900/40 to-yellow-600/20">
                    <div className="space-y-2">
                      <h3 className="font-bold text-magical-starlight text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors duration-200 font-enchanted">
                        {product.produto}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400/80 font-medium text-xs font-magical">
                            Menos de
                          </span>
                          <span className="text-yellow-400 font-bold text-base font-magical">
                            R$ {product.valor}
                          </span>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                          {product.categoria}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <ProductPhotosModal
                          images={getProductImages(product)}
                          productName={product.produto}
                          productPrice={`R$ ${product.valor}`}
                          productLink={product.link}
                          videoUrl={product.video}
                        />
                        
                        <Button 
                          onClick={optimizedAction(() => handleBuyClick(product.link))}
                          className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-red-900 hover:from-yellow-400 hover:to-yellow-500 font-semibold transition-all duration-200 hover:scale-[1.02] font-enchanted shadow-lg hover:shadow-yellow-500/20 text-sm py-2 active:scale-[0.98]"
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Ver Mais
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 md:left-4 bg-magical-starlight/90 hover:bg-magical-starlight border-yellow-500/30 shadow-lg transition-all duration-200" />
          <CarouselNext className="right-2 md:right-4 bg-magical-starlight/90 hover:bg-magical-starlight border-yellow-500/30 shadow-lg transition-all duration-200" />
        </Carousel>
      </div>
    </section>
  );
});

VideoCarouselHome.displayName = 'VideoCarouselHome';
