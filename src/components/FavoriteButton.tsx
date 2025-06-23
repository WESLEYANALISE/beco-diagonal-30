
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useFavorites } from '@/hooks/useFavorites';
import { useState } from 'react';

interface FavoriteButtonProps {
  productId: number;
  size?: 'sm' | 'default';
}

export const FavoriteButton = ({ productId, size = 'sm' }: FavoriteButtonProps) => {
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
        ${favorite ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white/90 border-gray-200'} 
        hover:scale-105 transition-all duration-200 
        ${isAnimating ? 'animate-pulse' : ''}
      `}
    >
      <Heart 
        className={`w-3 h-3 transition-all duration-200 ${
          favorite ? 'fill-current text-red-500' : ''
        } ${isAnimating ? 'scale-125' : ''}`} 
      />
      {favorite ? 'Favoritado' : 'Favoritar'}
    </Button>
  );
};
