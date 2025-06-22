
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  productId: number;
  size?: 'sm' | 'default';
}

export const FavoriteButton = ({ productId, size = 'sm' }: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(productId);

  return (
    <Button
      variant="outline"
      size={size}
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      className={`${favorite ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white/90 border-gray-200'} hover:scale-105 transition-all duration-200`}
    >
      <Heart className={`w-3 h-3 ${favorite ? 'fill-current' : ''}`} />
      {favorite ? 'Favoritado' : 'Favoritar'}
    </Button>
  );
};
