
import { useState, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('shopee-favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      localStorage.setItem('shopee-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== productId);
      localStorage.setItem('shopee-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (productId: number) => favorites.includes(productId);

  return {
    favorites,
    toggleFavorite,
    removeFavorite,
    isFavorite,
    favoritesCount: favorites.length
  };
};
