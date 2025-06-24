
import React, { useState, useCallback, useRef, useEffect, memo } from 'react';
import { Heart, Share2, ShoppingCart, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from '@/components/FavoriteButton';

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
}

const VideoFeedComponent: React.FC<VideoFeedProps> = ({
  product,
  isActive,
  onBuy
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Changed to false for automatic audio
  const [showControls, setShowControls] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Check if video is YouTube or direct MP4
  const isYouTubeVideo = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  useEffect(() => {
    if (isActive && product.video) {
      if (isYouTubeVideo(product.video)) {
        // Handle YouTube videos
        if (iframeRef.current) {
          const youtubeId = getYouTubeVideoId(product.video);
          if (youtubeId) {
            iframeRef.current.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&controls=0&rel=0&loop=1&playlist=${youtubeId}&enablejsapi=1&allow=autoplay`;
          }
        }
        setIsPlaying(true);
      } else {
        // Handle direct MP4 videos with automatic audio
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.muted = false; // Start with audio enabled
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPlaying(true);
            }).catch(() => {
              // If autoplay with audio fails, try muted
              if (videoRef.current) {
                videoRef.current.muted = true;
                setIsMuted(true);
                videoRef.current.play().then(() => {
                  setIsPlaying(true);
                }).catch(() => {
                  setIsPlaying(false);
                });
              }
            });
          }
        }
      }
    } else {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isActive, product.video]);

  const togglePlay = useCallback(() => {
    if (!isYouTubeVideo(product.video) && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying, product.video]);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    
    if (!isYouTubeVideo(product.video) && videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  }, [isMuted, product.video]);

  const handleVideoClick = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    
    togglePlay();
    
    setShowControls(true);
    setTimeout(() => setShowControls(false), 2000);
  }, [togglePlay, hasInteracted]);

  const handleBuyClick = useCallback(() => {
    onBuy(product);
  }, [product, onBuy]);

  const formatPrice = useCallback((price: string) => {
    if (price.includes('R$')) {
      return price;
    }
    return `R$ ${price}`;
  }, []);

  const renderVideo = () => {
    if (isYouTubeVideo(product.video)) {
      const youtubeId = getYouTubeVideoId(product.video);
      if (youtubeId) {
        return (
          <iframe 
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${isActive ? 1 : 0}&mute=0&controls=0&rel=0&loop=1&playlist=${youtubeId}&enablejsapi=1`}
            className="w-full h-full object-cover rounded-lg" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" 
            allowFullScreen
            title={product.produto}
          />
        );
      }
    }

    // Direct video (MP4)
    return (
      <video
        ref={videoRef}
        src={product.video}
        className="w-full h-full object-cover rounded-lg"
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
        autoPlay={isActive}
        onError={() => {
          console.error('Error loading video:', product.video);
        }}
      />
    );
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Video Container */}
      <div className="relative w-full h-full max-w-md mx-auto" onClick={handleVideoClick}>
        {product.video ? (
          renderVideo()
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <img src={product.imagem1} alt={product.produto} className="w-full h-full object-contain" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-4">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Play/Pause Overlay */}
        {showControls && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/30 rounded-full p-4 animate-fade-in">
              {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
            </div>
          </div>
        )}

        {/* Audio Control */}
        {product.video && !isYouTubeVideo(product.video) && (
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="bg-black/50 hover:bg-black/70 rounded-full p-3"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
            </Button>
          </div>
        )}
      </div>

      {/* Product Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-between items-end max-w-md mx-auto">
          <div className="flex-1 pr-4">
            <Badge className="bg-orange-500 text-white mb-2">
              {product.categoria}
            </Badge>
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
              {product.produto}
            </h3>
            <p className="text-orange-300 font-bold text-xl mb-4">
              Menos de {formatPrice(product.valor)}
            </p>
            <Button 
              onClick={handleBuyClick} 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-3 rounded-full w-full"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Comprar na Shopee
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <div className="bg-black/50 hover:bg-black/70 rounded-full p-3">
              <FavoriteButton productId={product.id} showText={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VideoFeed = memo(VideoFeedComponent);
VideoFeed.displayName = 'VideoFeed';
