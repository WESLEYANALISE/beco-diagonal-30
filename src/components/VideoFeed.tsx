
import React, { useRef, useState, useCallback } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FastVideo } from '@/components/FastVideo';

interface VideoFeedProps {
  productId: number;
  videoUrl: string;
  title: string;
  price: string;
  image: string;
  category: string;
  isActive: boolean;
  onBuy: () => void;
  onVideoEnd?: () => void;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({
  productId,
  videoUrl,
  title,
  price,
  image,
  category,
  isActive,
  onBuy,
  onVideoEnd
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleVideoLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleBuyClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onBuy();
  }, [onBuy]);

  return (
    <div className="relative w-full h-full bg-magical-midnight overflow-hidden">
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-magical-deepPurple to-magical-midnight animate-pulse">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-magical-midnight/40 rounded-2xl p-4 space-y-3">
              <div className="h-4 bg-magical-gold/20 rounded animate-pulse"></div>
              <div className="h-3 bg-magical-gold/20 rounded w-2/3 animate-pulse"></div>
              <div className="h-8 bg-magical-gold/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      <FastVideo
        src={videoUrl}
        className="w-full h-full"
        autoPlay={isActive}
        muted={true}
        loop={false}
        isActive={isActive}
        onEnded={onVideoEnd}
        onLoadedData={handleVideoLoad}
        preload={isActive ? "auto" : "metadata"}
      />
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-magical-midnight/80 z-10" />
      
      <div className="absolute bottom-4 left-4 right-4 z-20 safe-area-bottom">
        <div className="bg-magical-midnight/80 backdrop-blur-sm rounded-2xl p-4 border border-magical-gold/30 shadow-2xl transform transition-all duration-300 hover:scale-[1.02]">
          <h3 className="text-magical-starlight font-bold text-base mb-2 line-clamp-2 font-magical">
            {title}
          </h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-magical-gold font-bold text-lg font-magical">Menos de {price}</span>
            <Badge className="bg-magical-gold/20 text-magical-gold border-magical-gold/30 text-xs animate-pulse">
              {category}
            </Badge>
          </div>
          <Button 
            onClick={handleBuyClick}
            className="w-full bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight hover:from-magical-darkGold hover:to-magical-bronze font-semibold transition-all duration-300 hover:scale-105 font-enchanted shadow-lg text-sm py-2 transform active:scale-95"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Adquirir Artefato Mágico
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
