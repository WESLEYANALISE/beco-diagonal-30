
import React, { useRef, useState, useCallback } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoClick = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    if (onVideoEnd) {
      onVideoEnd();
    }
  }, [onVideoEnd]);

  return (
    <div className="relative w-full h-full bg-magical-midnight overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover cursor-pointer"
        muted
        loop
        onClick={handleVideoClick}
        onEnded={handleVideoEnded}
        autoPlay={isActive}
        playsInline
        style={{ 
          objectPosition: 'center center',
          aspectRatio: '9/16'
        }}
      />
      
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-magical-midnight/80 z-10" />
      
      <div className="absolute bottom-4 left-4 right-4 z-20 safe-area-bottom">
        <div className="bg-red-900/90 backdrop-blur-sm rounded-2xl p-4 border border-yellow-500/40 shadow-2xl">
          <h3 className="text-magical-starlight font-bold text-base md:text-lg mb-2 line-clamp-2 font-magical">
            {title}
          </h3>
          <div className="flex items-center justify-between mb-3">
            <span className="text-yellow-400 font-bold text-lg md:text-xl font-magical">{price}</span>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
              {category}
            </Badge>
          </div>
          <Button 
            onClick={onBuy}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-red-900 hover:from-yellow-400 hover:to-yellow-500 font-semibold transition-all duration-300 hover:scale-105 font-enchanted shadow-lg text-sm md:text-base py-2 md:py-3"
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
