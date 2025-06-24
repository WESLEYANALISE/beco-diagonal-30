
import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { Heart, Share2, ShoppingCart, Volume2, VolumeX, Images } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from '@/components/FavoriteButton';
import { ImageZoomModal } from '@/components/ImageZoomModal';

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

interface VideoFeedProps {
  product: Product;
  isActive: boolean;
  onBuy: (product: Product) => void;
  onVideoEnd?: () => void;
}

const VideoFeedComponent: React.FC<VideoFeedProps> = ({
  product,
  isActive,
  onBuy,
  onVideoEnd
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Enhanced video validation
  const isValidVideo = (url: string) => {
    if (!url || typeof url !== 'string') return false;
    
    const isMP4 = url.toLowerCase().includes('.mp4');
    const isValidURL = url.startsWith('http') && !url.includes('undefined') && !url.includes('null');
    const isNotImage = !url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
    
    return isMP4 && isValidURL && isNotImage;
  };

  // Get product images
  const getProductImages = () => {
    const images = [
      product.imagem1,
      product.imagem2,
      product.imagem3,
      product.imagem4,
      product.imagem5
    ].filter(img => img && img.trim() !== '');
    return images;
  };

  useEffect(() => {
    if (isActive && product.video && isValidVideo(product.video)) {
      if (videoRef.current) {
        const video = videoRef.current;
        
        // Reset video state
        setVideoError(false);
        setVideoLoaded(false);
        setIsPlaying(false);
        
        video.currentTime = 0;
        
        // Start muted to avoid autoplay issues
        video.muted = true;
        setIsMuted(true);
        
        // Load video
        video.load();
        
        const handleCanPlayThrough = () => {
          setVideoLoaded(true);
          // Try to play with sound first
          video.muted = false;
          setIsMuted(false);
          
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPlaying(true);
              setVideoError(false);
            }).catch((error) => {
              console.log('Trying without sound due to autoplay policy');
              // If fails with sound, try muted
              video.muted = true;
              setIsMuted(true);
              video.play().then(() => {
                setIsPlaying(true);
                setVideoError(false);
              }).catch(() => {
                setVideoError(true);
                setIsPlaying(false);
              });
            });
          }
        };
        
        const handleError = (e: Event) => {
          console.error('Video error:', e);
          setVideoError(true);
          setVideoLoaded(false);
          setIsPlaying(false);
        };
        
        const handleLoadStart = () => {
          setVideoLoaded(false);
        };

        const handleVideoEnded = () => {
          console.log('Video ended, calling onVideoEnd');
          if (onVideoEnd) {
            onVideoEnd();
          }
        };
        
        video.addEventListener('canplaythrough', handleCanPlayThrough);
        video.addEventListener('error', handleError);
        video.addEventListener('loadstart', handleLoadStart);
        video.addEventListener('ended', handleVideoEnded);
        
        return () => {
          video.removeEventListener('canplaythrough', handleCanPlayThrough);
          video.removeEventListener('error', handleError);
          video.removeEventListener('loadstart', handleLoadStart);
          video.removeEventListener('ended', handleVideoEnded);
        };
      }
    } else {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isActive, product.video, onVideoEnd]);

  const toggleMute = useCallback(() => {
    if (videoRef.current && !videoError && videoLoaded) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
    }
  }, [isMuted, videoError, videoLoaded]);

  const handleBuyClick = useCallback(() => {
    onBuy(product);
  }, [product, onBuy]);

  const handleImageClick = useCallback(() => {
    setCurrentImageIndex(0);
    setShowImageModal(true);
  }, []);

  const formatPrice = useCallback((price: string) => {
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  }, []);

  const renderVideo = () => {
    if (!product.video || !isValidVideo(product.video)) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center text-white p-4">
            {product.imagem1 && (
              <img 
                src={product.imagem1} 
                alt={product.produto} 
                className="w-full h-auto max-h-96 object-contain mx-auto rounded-lg mb-4 shadow-xl" 
              />
            )}
            <p className="text-sm opacity-75">Vídeo não disponível</p>
          </div>
        </div>
      );
    }

    if (videoError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center text-white p-4">
            {product.imagem1 && (
              <img 
                src={product.imagem1} 
                alt={product.produto} 
                className="w-full h-auto max-h-96 object-contain mx-auto rounded-lg mb-4 shadow-xl" 
              />
            )}
            <p className="text-sm opacity-75">Erro ao carregar vídeo</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <video
          ref={videoRef}
          src={product.video}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onError={() => {
            console.error('Error loading video:', product.video);
            setVideoError(true);
          }}
          onLoadedData={() => {
            console.log('Video loaded successfully');
          }}
        />
        
        {/* Loading overlay with image preview */}
        {!videoLoaded && !videoError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
            {product.imagem1 && (
              <img 
                src={product.imagem1} 
                alt={product.produto} 
                className="w-full h-auto max-h-96 object-contain mx-auto opacity-60" 
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          </div>
        )}
      </>
    );
  };

  const productImages = getProductImages();

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Video Container - Responsive */}
      <div className="relative w-full h-full sm:max-w-md sm:mx-auto">
        {renderVideo()}

        {/* Audio Control - Only if video is valid and loaded */}
        {product.video && isValidVideo(product.video) && !videoError && videoLoaded && (
          <div className="absolute top-4 right-4 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="bg-black/50 hover:bg-black/70 rounded-full p-3 backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </Button>
          </div>
        )}

        {/* Product Thumbnail - Responsive positioning */}
        {productImages.length > 0 && (
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick();
              }}
              className="group relative"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/60 transition-all duration-200 bg-black/30 backdrop-blur-sm">
                <img
                  src={productImages[0]}
                  alt={product.produto}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              {productImages.length > 1 && (
                <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-bold">
                  <Images className="w-2 h-2 sm:w-3 sm:h-3" />
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Product Info Overlay - Responsive */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="flex justify-between items-end max-w-md mx-auto gap-3">
          <div className="flex-1 min-w-0">
            <Badge className="bg-orange-500 text-white mb-2 text-xs">
              {product.categoria}
            </Badge>
            <h3 className="text-white font-bold text-base sm:text-lg mb-2 line-clamp-2 leading-tight">
              {product.produto}
            </h3>
            <p className="text-orange-300 font-bold text-lg sm:text-xl mb-3 sm:mb-4">
              Menos de {formatPrice(product.valor)}
            </p>
            <Button 
              onClick={handleBuyClick} 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-full w-full text-sm sm:text-base"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Comprar na Shopee
            </Button>
          </div>

          {/* Action Buttons - Responsive */}
          <div className="flex flex-col gap-3 sm:gap-4 flex-shrink-0">
            <div className="bg-black/50 hover:bg-black/70 rounded-full p-2 sm:p-3 backdrop-blur-sm">
              <FavoriteButton productId={product.id} showText={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      <ImageZoomModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        images={productImages}
        currentIndex={currentImageIndex}
        productName={product.produto}
      />
    </div>
  );
};

export const VideoFeed = memo(VideoFeedComponent);
VideoFeed.displayName = 'VideoFeed';
