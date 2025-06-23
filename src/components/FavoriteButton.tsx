
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';

interface FavoriteButtonProps {
  productId: number;
  size?: 'sm' | 'default';
  showText?: boolean;
}

export const FavoriteButton = ({ 
  productId, 
  size = 'sm', 
  showText = true 
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const favorite = isFavorite(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    setIsAnimating(true);
    toggleFavorite(productId);
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Button
      variant="outline"
      size={size}
      onClick={handleClick}
      className={`
        ${favorite ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100' : 'bg-white/90 border-gray-200 hover:bg-gray-50'} 
        hover:scale-105 transition-all duration-200 shadow-sm
        ${isAnimating ? 'animate-pulse' : ''}
        ${!showText ? 'px-2' : ''}
      `}
    >
      <Heart 
        className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} transition-all duration-200 ${
          favorite ? 'fill-current text-red-500' : ''
        } ${isAnimating ? 'scale-125' : ''}`} 
      />
      {showText && (
        <span className="ml-1 text-xs">
          {favorite ? 'Favoritado' : 'Favoritar'}
        </span>
      )}
    </Button>
  );
};
