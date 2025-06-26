import React, { useRef, useState, useCallback, memo } from 'react';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
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
export const VideoFeed = memo<VideoFeedProps>(({
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
  const [isLiked, setIsLiked] = useState(false);
  const {
    instantAction
  } = useOptimizedInteractions();
  const handleVideoLoad = useCallback(() => {
    setIsLoading(false);
  }, []);
  const handleBuyClick = instantAction(useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onBuy();
  }, [onBuy]));
  const handleLikeClick = instantAction(useCallback(() => {
    setIsLiked(!isLiked);
  }, [isLiked]));
  const handleShareClick = instantAction(useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Confira esta relíquia mágica: ${title}`,
        url: window.location.href
      });
    }
  }, [title]));
  return <div className="relative w-full h-full bg-magical-midnight overflow-hidden">
      {/* Loading skeleton minimalista */}
      {isLoading && <div className="absolute inset-0 bg-gradient-to-br from-magical-deepPurple/40 to-magical-midnight/40 animate-pulse">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-magical-midnight/20 rounded-xl p-3 space-y-2 backdrop-blur-sm">
              <div className="h-3 bg-magical-gold/10 rounded animate-pulse"></div>
              <div className="h-2 bg-magical-gold/10 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>}

      <UltraFastVideo src={videoUrl} className="w-full h-full" autoPlay={isActive} muted={true} loop={false} isActive={isActive} onEnded={onVideoEnd} onLoadedData={handleVideoLoad} preload={isActive ? "auto" : "metadata"} priority={isActive} />
      
      {/* Gradiente sutil */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-magical-midnight/80 z-10" />
      
      {/* Controles laterais estilo TikTok */}
      
      
      {/* Info do produto otimizada para mobile */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pb-6">
        <div className="space-y-3">
          {/* Título */}
          <h3 className="text-magical-starlight font-bold text-lg leading-tight font-magical line-clamp-2 drop-shadow-lg">
            {title}
          </h3>
          
          {/* Preço e categoria */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-magical-gold font-bold text-xl font-magical drop-shadow-lg">
                Menos de R$ {price}
              </span>
              <Badge className="bg-magical-gold/90 text-magical-midnight border-magical-gold/30 text-sm font-semibold">
                {category}
              </Badge>
            </div>
          </div>
          
          {/* Botão de compra destacado */}
          <Button onClick={handleBuyClick} className="w-full bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight hover:from-magical-darkGold hover:to-magical-bronze font-bold transition-all duration-200 hover:scale-[1.02] font-enchanted shadow-2xl text-base py-3 transform active:scale-[0.98] border-2 border-magical-gold/50">
            <ShoppingCart className="w-5 h-5 mr-2" />
            ⚡ Adquirir Esta Relíquia
          </Button>
        </div>
      </div>
    </div>;
});
VideoFeed.displayName = 'VideoFeed';
export default VideoFeed;