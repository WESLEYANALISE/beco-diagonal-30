
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
      console.log('Favorites saved:', newFavorites); // Debug log
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, []);

  // Memoized toggle function for better performance
  const toggleFavorite = useCallback((productId: number) => {
    console.log('Toggling favorite for product:', productId); // Debug log
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      console.log('New favorites array:', newFavorites); // Debug log
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  const removeFavorite = useCallback((productId: number) => {
    console.log('Removing favorite:', productId); // Debug log
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== productId);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  const isFavorite = useCallback((productId: number) => {
    const result = favorites.includes(productId);
    console.log(`Is product ${productId} favorite?`, result); // Debug log
    return result;
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
