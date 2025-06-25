
import { Star, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';

interface FavoriteButtonProps {
  productId: number;
  size?: 'sm' | 'default';
  showText?: boolean;
  enhanced?: boolean;
}

export const FavoriteButton = ({
  productId,
  size = 'sm',
  showText = true,
  enhanced = false
}: FavoriteButtonProps) => {
  const {
    isFavorite,
    toggleFavorite
  } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const favorite = isFavorite(productId);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAnimating(true);
    toggleFavorite(productId);

    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 600);
  };

  if (enhanced) {
    return (
      <Button 
        variant={favorite ? "default" : "outline"} 
        size={size} 
        onClick={handleClick} 
        className={`
          ${favorite 
            ? 'bg-gradient-to-r from-magical-gold to-magical-bronze text-magical-midnight border-0 shadow-lg hover:from-magical-darkGold hover:to-magical-bronze' 
            : 'bg-magical-starlight/95 border-2 border-magical-gold/50 text-magical-gold hover:bg-magical-gold/10 hover:border-magical-gold'
          } 
          transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg
          ${!showText ? 'px-3' : 'px-4'}
          font-enchanted font-medium
        `}
      >
        <Star 
          className={`
            ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} 
            transition-all duration-300 
            ${favorite ? 'fill-current scale-110' : ''} 
            ${isAnimating ? 'animate-sparkle scale-125' : ''}
            ${showText ? 'mr-2' : ''}
          `} 
        />
        {showText && (
          <span className="font-semibold">
            {favorite ? 'No Grimório' : 'Adicionar'}
          </span>
        )}
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size={size} 
      onClick={handleClick} 
      className={`
        ${favorite 
          ? 'bg-magical-gold/20 border-magical-gold/50 text-magical-gold hover:bg-magical-gold/30' 
          : 'bg-magical-starlight/90 border-magical-silver/30 hover:bg-magical-silver/10'
        } 
        hover:scale-105 transition-all duration-300 shadow-sm
        ${!showText ? 'px-2' : ''}
        font-enchanted
      `}
    >
      <Star 
        className={`
          ${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} 
          transition-all duration-500 
          ${favorite ? 'fill-current text-magical-gold scale-110' : ''} 
          ${isAnimating ? 'animate-sparkle scale-125' : ''}
        `} 
      />
      {showText && (
        <span className="ml-1 text-xs">
          {favorite ? 'Grimório' : 'Guardar'}
        </span>
      )}
    </Button>
  );
};
