
import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'harryPotter_favorites';

export const useFavoritesLocal = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // Carregar favoritos do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavoriteIds(parsed);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos do localStorage:', error);
    }
  }, []);

  // Salvar no localStorage sempre que favoriteIds mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch (error) {
      console.error('Erro ao salvar favoritos no localStorage:', error);
    }
  }, [favoriteIds]);

  const addFavorite = useCallback((productId: number) => {
    setFavoriteIds(prev => {
      if (!prev.includes(productId)) {
        return [...prev, productId];
      }
      return prev;
    });
  }, []);

  const removeFavorite = useCallback((productId: number) => {
    setFavoriteIds(prev => prev.filter(id => id !== productId));
  }, []);

  const toggleFavorite = useCallback((productId: number) => {
    setFavoriteIds(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  }, []);

  const isFavorite = useCallback((productId: number) => {
    return favoriteIds.includes(productId);
  }, [favoriteIds]);

  const clearFavorites = useCallback(() => {
    setFavoriteIds([]);
  }, []);

  return {
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };
};
