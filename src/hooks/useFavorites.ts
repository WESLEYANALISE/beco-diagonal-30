
import { useState, useEffect, useCallback } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('shopee-favorites');
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  const saveFavorites = useCallback((newFavorites: number[]) => {
    try {
      localStorage.setItem('shopee-favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  // Memoized toggle function for better performance
  const toggleFavorite = useCallback((productId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  const removeFavorite = useCallback((productId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== productId);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  const isFavorite = useCallback((productId: number) => {
    return favorites.includes(productId);
  }, [favorites]);

  const clearAllFavorites = useCallback(() => {
    setFavorites([]);
    saveFavorites([]);
  }, [saveFavorites]);

  return {
    favorites,
    toggleFavorite,
    removeFavorite,
    isFavorite,
    clearAllFavorites,
    favoritesCount: favorites.length,
    isLoading
  };
};
