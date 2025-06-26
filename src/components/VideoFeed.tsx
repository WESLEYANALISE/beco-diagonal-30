
import React, { useRef, useState, useCallback } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UltraFastVideo } from '@/components/UltraFastVideo';
import { useOptimizedInteractions } from '@/hooks/useOptimizedInteractions';

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
  const { instantAction } = useOptimizedInteractions();

  const handleVideoLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleBuyClick = instantAction(useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onBuy();
  }, [onBuy]));

  return (
    <div className="relative w-full h-full bg-magical-midnight overflow-hidden">
      {/* Minimal loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-magical-deepPurple/60 to-magical-midnight/60 animate-pulse">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-magical-midnight/30 rounded-xl p-3 space-y-2">
              <div className="h-3 bg-magical-gold/20 rounded animate-pulse"></div>
              <div className="h-2 bg-magical-gold/20 rounded w-2/3 animate-pulse"></div>
              <div className="h-6 bg-magical-gold/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      <UltraFastVideo
        src={videoUrl}
        className="w-full h-full"
        autoPlay={isActive}
        muted={true}
        loop={false}
        isActive={isActive}
        onEnded={onVideoEnd}
        onLoadedData={handleVideoLoad}
        preload={isActive ? "auto" : "metadata"}
        priority={isActive}
      />
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-magical-midnight/60 z-10" />
      
      <div className="absolute bottom-4 left-4 right-4 z-20 safe-area-bottom">
        <div className="bg-magical-midnight/70 backdrop-blur-sm rounded-xl p-3 border border-magical-gold/20 shadow-xl transform transition-all duration-200 hover:scale-[1.01]">
          <h3 className="text-magical-starlight font-bold text-sm mb-2 line-clamp-2 font-magical">
            {title}
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-magical-gold font-bold text-base font-magical">Menos de {price}</span>
            <Badge className="bg-magical-gold/20 text-magical-gold border-magical-gold/30 text-xs">
              {category}
            </Badge>
          </div>
          <Button 
            onClick={handleBuyClick}
            className="w-full bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight hover:from-magical-darkGold hover:to-magical-bronze font-semibold transition-all duration-200 hover:scale-[1.02] font-enchanted shadow-lg text-sm py-2 transform active:scale-[0.98]"
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
