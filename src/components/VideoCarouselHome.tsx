
import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { Play, ShoppingCart, Sparkles, Crown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useNavigate } from 'react-router-dom';
import { useProductClicks } from '@/hooks/useProductClicks';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { logger } from '@/utils/logger';

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
  uso?: string;
  click_count?: number;
}

interface VideoCarouselHomeProps {
  products: Product[];
}

interface VideoThumbnailProps {
  product: Product;
  onWatchVideo: (product: Product) => void;
  onBuyProduct: (product: Product) => void;
  formatPrice: (price: string) => string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = memo(({
  product,
  onWatchVideo,
  onBuyProduct,
  formatPrice
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check if video is YouTube or direct MP4
  const isYouTubeVideo = useCallback((url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }, []);

  const getYouTubeVideoId = useCallback((url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  }, []);

  useEffect(() => {
    if (!isYouTubeVideo(product.video) && videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedData = () => {
        setIsLoading(false);
        // Enable autoplay for videos
        video.play().catch(() => {
          // Se autoplay falhar, apenas esconde o loading
        });
      };

      const handleError = () => {
        setIsLoading(false);
      };

      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);

      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [product.video, isYouTubeVideo]);

  const renderVideoContent = () => {
    if (isYouTubeVideo(product.video)) {
      const youtubeId = getYouTubeVideoId(product.video);
      if (youtubeId) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1`}
            className="w-full h-full object-cover"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            title={product.produto}
            onLoad={() => setIsLoading(false)}
            loading="lazy"
          />
        );
      }
    }

    // Vídeo direto (MP4) com autoplay habilitado
    return (
      <video
        ref={videoRef}
        src={product.video}
        className="w-full h-full object-cover"
        loop
        muted
        autoPlay
        playsInline
        preload="metadata"
        poster={product.imagem1}
        onError={() => setIsLoading(false)}
      />
    );
  };

  const getCategoryIcon = () => {
    switch (product.categoria) {
      case 'Itens Colecionáveis':
        return Crown;
      case 'Bonecas e Brinquedos de Pelúcia':
        return Sparkles;
      default:
        return Crown;
    }
  };

  const IconComponent = getCategoryIcon();

  return (
    <div className="group relative bg-gradient-to-br from-magical-deepPurple to-magical-mysticalPurple rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-magical-gold/30">
      {/* Video Container com autoplay */}
      <div className="relative aspect-video bg-magical-midnight overflow-hidden">
        {product.video ? (
          <>
            {renderVideoContent()}
            
            {/* Loading Overlay otimizado */}
            {isLoading && (
              <div className="absolute inset-0 bg-magical-midnight flex items-center justify-center">
                {!imageError ? (
                  <img
                    src={product.imagem1}
                    alt={product.produto}
                    className="w-full h-full object-cover opacity-70"
                    loading="lazy"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-magical-deepPurple flex items-center justify-center">
                    <div className="text-magical-starlight text-sm font-enchanted">Carregando magia...</div>
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-magical-gold"></div>
                </div>
              </div>
            )}
          </>
        ) : (
          <img
            src={product.imagem1}
            alt={product.produto}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Video Overlay mágico */}
        <div className="absolute inset-0 bg-magical-midnight/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={() => onWatchVideo(product)}
            className="bg-magical-gold/20 hover:bg-magical-gold/30 backdrop-blur-sm border border-magical-gold/30 rounded-full p-4 animate-magical-glow"
            size="sm"
          >
            <Play className="w-6 h-6 text-magical-gold fill-magical-gold" />
          </Button>
        </div>

        {/* Category Badge temático */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight text-xs font-bold border border-magical-gold/30 flex items-center gap-1">
            <IconComponent className="w-3 h-3" />
            {product.categoria}
          </Badge>
        </div>

        {/* Click count indicator mágico */}
        {product.click_count && product.click_count > 0 && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-gradient-to-r from-magical-crimson to-magical-darkGold text-magical-starlight text-xs font-bold animate-pulse">
              ⚡ {product.click_count} visualizações
            </Badge>
          </div>
        )}
      </div>

      {/* Product Info temático */}
      <div className="p-4 bg-gradient-to-br from-magical-deepPurple/90 to-magical-mysticalPurple/90">
        <h3 className="font-bold text-magical-starlight mb-2 line-clamp-2 text-sm leading-tight font-enchanted">
          {product.produto}
        </h3>
        <p className="text-magical-gold font-bold text-lg mb-3 font-magical">
          Menos de {formatPrice(product.valor)}
        </p>
        
        <div className="flex gap-2">
          <Button
            onClick={() => onWatchVideo(product)}
            variant="outline"
            size="sm"
            className="flex-1 border-magical-gold text-magical-gold hover:bg-magical-gold/20 font-enchanted"
          >
            <Play className="w-3 h-3 mr-1" />
            Ver Magia
          </Button>
          <Button
            onClick={() => onBuyProduct(product)}
            size="sm"
            className="flex-1 bg-gradient-to-r from-magical-gold to-magical-bronze hover:from-magical-darkGold hover:to-magical-bronze text-magical-midnight font-bold font-enchanted"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Adquirir
          </Button>
        </div>
      </div>
    </div>
  );
});

VideoThumbnail.displayName = 'VideoThumbnail';

export const VideoCarouselHome: React.FC<VideoCarouselHomeProps> = memo(() => {
  const navigate = useNavigate();
  const { trackProductClick, getMostClickedProducts } = useProductClicks();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Carregar produtos mais clicados com vídeos
  useEffect(() => {
    const loadMostClickedProducts = async () => {
      try {
        logger.info('Carregando produtos mais clicados com vídeos');
        
        const products = await getMostClickedProducts(12);
        
        if (products && products.length > 0) {
          setFeaturedProducts(products);
          logger.info(`${products.length} produtos mais clicados com vídeo carregados`);
        } else {
          logger.warn('Nenhum produto com vídeo e cliques encontrado');
        }
      } catch (error) {
        logger.error('Erro ao carregar produtos mais clicados:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMostClickedProducts();
  }, [getMostClickedProducts]);

  const handleWatchVideo = useCallback(async (product: Product) => {
    await trackProductClick(product.id, 'video_view');
    setSelectedProduct(product);
  }, [trackProductClick]);

  const handleBuyProduct = useCallback(async (product: Product) => {
    await trackProductClick(product.id, 'buy_click');
    window.open(product.link, '_blank');
  }, [trackProductClick]);

  const formatPrice = useCallback((price: string) => {
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  }, []);

  const handleExploreClick = useCallback(async () => {
    await trackProductClick(0, 'explore_products');
    navigate('/explorar');
  }, [trackProductClick, navigate]);

  if (loading) {
    return (
      <section className="md:px-6 py-8 md:py-12 bg-gradient-to-r from-magical-deepPurple/30 via-magical-mysticalPurple/30 to-magical-darkBlue/30 backdrop-blur-sm px-0">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-magical-gold/20 rounded-2xl backdrop-blur-sm"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-magical-gold/20 rounded-2xl backdrop-blur-sm animate-shimmer"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) return null;

  return (
    <>
      <section className="md:px-6 py-8 md:py-12 bg-gradient-to-r from-magical-deepPurple/30 via-magical-mysticalPurple/30 to-magical-darkBlue/30 backdrop-blur-sm px-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-magical-midnight/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-magical-starlight mb-3 animate-slide-in-left font-magical">
              🏆 Artefatos Mágicos em Destaque
            </h2>
            <p className="text-base text-magical-starlight/80 animate-slide-in-right font-enchanted">
              Os artefatos mais populares de Hogwarts com demonstrações mágicas
            </p>
          </div>

          <Carousel className="w-full animate-scale-in">
            <CarouselContent className="-ml-2 md:-ml-3">
              {featuredProducts.map((product, index) => (
                <CarouselItem
                  key={product.id}
                  className="pl-2 md:pl-3 basis-3/4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <VideoThumbnail
                    product={product}
                    onWatchVideo={handleWatchVideo}
                    onBuyProduct={handleBuyProduct}
                    formatPrice={formatPrice}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 md:left-4 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30 shadow-2xl" />
            <CarouselNext className="right-2 md:right-4 bg-magical-starlight/90 hover:bg-magical-starlight border-magical-gold/30 shadow-2xl" />
          </Carousel>

          <div className="text-center mt-6 animate-fade-in">
            <Button
              onClick={handleExploreClick}
              className="bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight hover:from-magical-darkGold hover:to-magical-bronze font-semibold transition-all duration-300 hover:scale-105 font-enchanted shadow-2xl"
            >
              Explorar Mais Artefatos
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </>
  );
});

VideoCarouselHome.displayName = 'VideoCarouselHome';
