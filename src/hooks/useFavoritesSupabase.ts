
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

export const useFavoritesSupabase = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Usar localStorage como fallback já que a tabela user_favorites_harry_potter não existe
  const getFavoritesFromStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem('harry_potter_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }, []);

  const saveFavoritesToStorage = useCallback((favorites: number[]) => {
    try {
      localStorage.setItem('harry_potter_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, []);

  // Buscar favoritos do localStorage
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const favorites = getFavoritesFromStorage();
      setFavoriteIds(favorites);
    } catch (error) {
      console.error('Erro inesperado:', error);
    } finally {
      setLoading(false);
    }
  }, [getFavoritesFromStorage]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(async (productId: number) => {
    try {
      const currentFavorites = getFavoritesFromStorage();
      const newFavorites = [...currentFavorites, productId];
      
      saveFavoritesToStorage(newFavorites);
      setFavoriteIds(newFavorites);
      
      toast({
        title: "Artefato Adicionado!",
        description: "Artefato adicionado ao seu grimório mágico",
      });
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar artefato ao grimório",
        variant: "destructive",
      });
    }
  }, [getFavoritesFromStorage, saveFavoritesToStorage, toast]);

  const removeFavorite = useCallback(async (productId: number) => {
    try {
      const currentFavorites = getFavoritesFromStorage();
      const newFavorites = currentFavorites.filter((id: number) => id !== productId);
      
      saveFavoritesToStorage(newFavorites);
      setFavoriteIds(newFavorites);
      
      toast({
        title: "Artefato Removido",
        description: "Artefato removido do seu grimório",
      });
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover artefato do grimório",
        variant: "destructive",
      });
    }
  }, [getFavoritesFromStorage, saveFavoritesToStorage, toast]);

  const toggleFavorite = useCallback((productId: number) => {
    if (favoriteIds.includes(productId)) {
      removeFavorite(productId);
    } else {
      addFavorite(productId);
    }
  }, [favoriteIds, addFavorite, removeFavorite]);

  const isFavorite = useCallback((productId: number) => {
    return favoriteIds.includes(productId);
  }, [favoriteIds]);

  return {
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    loading
  };
};
