
import { useState, useEffect, useCallback } from 'react';
import { useDeviceId } from './useDeviceId';

export const useFavorites = () => {
  const deviceId = useDeviceId();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    if (!deviceId) return;
    
    try {
      const storedFavorites = localStorage.getItem(`favorites-${deviceId}`);
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
          console.log('Favorites loaded:', parsed);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, [deviceId]);

  // Save favorites to localStorage whenever favorites change
  const saveFavorites = useCallback((newFavorites: number[]) => {
    if (!deviceId) return;
    
    try {
      localStorage.setItem(`favorites-${deviceId}`, JSON.stringify(newFavorites));
      console.log('Favorites saved:', newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [deviceId]);

  // Toggle favorite function
  const toggleFavorite = useCallback((productId: number) => {
    console.log('Toggling favorite for product:', productId);
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      console.log('New favorites array:', newFavorites);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  const removeFavorite = useCallback((productId: number) => {
    console.log('Removing favorite:', productId);
    setFavorites(prev => {
      const newFavorites = prev.filter(id => id !== productId);
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, [saveFavorites]);

  const isFavorite = useCallback((productId: number) => {
    const result = favorites.includes(productId);
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
    isLoading,
    deviceId
  };
};
