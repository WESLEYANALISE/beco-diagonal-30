
import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { Play, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { useProductClicks } from '@/hooks/useProductClicks';

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
  const videoRef = useRef<HTMLVideoElement>(null);

  const isValidMP4Video = useCallback((url: string) => {
    if (!url) return false;
    return url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('mp4');
  }, []);

  useEffect(() => {
    if (isValidMP4Video(product.video) && videoRef.current) {
      const video = videoRef.current;
      
      const handleLoadedData = () => {
        setIsLoading(false);
        video.play().catch(() => {
          // Silent fail for autoplay
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
  }, [product.video, isValidMP4Video]);

  const handleWatchClick = useCallback(() => {
    onWatchVideo(product);
  }, [product, onWatchVideo]);

  const handleBuyClick = useCallback(() => {
    onBuyProduct(product);
  }, [product, onBuyProduct]);

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
      {/* Video Container */}
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        {product.video && isValidMP4Video(product.video) ? (
          <>
            <video
              ref={videoRef}
              src={product.video}
              className="w-full h-full object-cover"
              loop
              muted
              playsInline
              preload="metadata"
              autoPlay
              onError={() => setIsLoading(false)}
            />
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <img
                  src={product.imagem1}
                  alt={product.produto}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              </div>
            )}
          </>
        ) : (
          <img
            src={product.imagem1}
            alt={product.produto}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleWatchClick}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full p-4"
            size="sm"
          >
            <Play className="w-6 h-6 text-white fill-white" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-red-600 text-white text-xs font-semibold">
            VÍDEO
          </Badge>
        </div>

        <div className="absolute top-3 left-3">
          <Badge className="bg-orange-500 text-white text-xs">
            {product.categoria}
          </Badge>
        </div>

        {product.click_count && product.click_count > 0 && (
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-green-600 text-white text-xs">
              🔥 {product.click_count} views
            </Badge>
          </div>
        )}
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
            onClick={handleWatchClick}
            variant="outline"
            size="sm"
            className="flex-1 border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            <Play className="w-3 h-3 mr-1" />
            Ver Mais
          </Button>
          <Button
            onClick={handleBuyClick}
            size="sm"
            className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            <ShoppingCart className="w-3 h-3 mr-1" />
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
});

VideoThumbnail.displayName = 'VideoThumbnail';

export const VideoCarouselHome: React.FC<VideoCarouselHomeProps> = memo(({
  products: fallbackProducts
}) => {
  const { trackProductClick, getMostClickedProducts } = useProductClicks();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Load most clicked products on mount
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const mostClicked = await getMostClickedProducts(12);
        
        if (mostClicked.length > 0) {
          setFeaturedProducts(mostClicked);
        } else {
          setFeaturedProducts(fallbackProducts);
        }
      } catch (error) {
        console.error('Error loading featured products:', error);
        setFeaturedProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, [getMostClickedProducts, fallbackProducts]);

  const handleWatchVideo = useCallback(async (product: Product) => {
    await trackProductClick(product.id, 'video_view');
    setSelectedProduct(product);
    setShowDetailModal(true);
  }, [trackProductClick]);

  const handleBuyProduct = useCallback(async (product: Product) => {
    await trackProductClick(product.id, 'buy_click');
    window.open(product.link, '_blank');
  }, [trackProductClick]);

  const formatPrice = useCallback((price: string) => {
    if (price.includes('R$')) return price;
    return `R$ ${price}`;
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  }, []);

  if (loading) {
    return (
      <section className="md:px-6 py-8 md:py-12 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 backdrop-blur-sm px-0">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-white/20 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-white/20 rounded-2xl"></div>
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
      <section className="md:px-6 py-8 md:py-12 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 backdrop-blur-sm px-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 animate-slide-in-left">
              🏆 Produtos em Destaque
            </h2>
            <p className="text-base text-white/80 animate-slide-in-right">
              Os produtos mais visualizados pelos usuários
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
            <CarouselPrevious className="left-2 md:left-4 bg-white/90 hover:bg-white border-orange-200" />
            <CarouselNext className="right-2 md:right-4 bg-white/90 hover:bg-white border-orange-200" />
          </Carousel>

          <div className="text-center mt-6 animate-fade-in">
            <Button
              onClick={async () => {
                await trackProductClick(0, 'explore_products');
                // Instead of navigate, we could show more products or open a modal
              }}
              className="bg-white text-red-600 hover:bg-gray-100 font-semibold transition-all duration-300 hover:scale-105"
            >
              Explorar Produtos
              <Play className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          isOpen={showDetailModal}
          onClose={handleCloseModal}
          product={selectedProduct}
        />
      )}
    </>
  );
});

VideoCarouselHome.displayName = 'VideoCarouselHome';
