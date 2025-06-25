
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

export const useFavoritesSupabase = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Buscar favoritos do localStorage como fallback já que a tabela não existe
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      
      // Como a tabela user_favorites_harry_potter não existe, usar localStorage
      const stored = localStorage.getItem('harryPotter_favorites');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavoriteIds(parsed);
        }
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(async (productId: number) => {
    try {
      const newFavorites = [...favoriteIds, productId];
      setFavoriteIds(newFavorites);
      localStorage.setItem('harryPotter_favorites', JSON.stringify(newFavorites));
      
      toast({
        title: "Artefato Adicionado!",
        description: "Artefato adicionado ao seu grimório mágico",
      });
    } catch (error) {
      console.error('Erro inesperado:', error);
    }
  }, [toast, favoriteIds]);

  const removeFavorite = useCallback(async (productId: number) => {
    try {
      const newFavorites = favoriteIds.filter(id => id !== productId);
      setFavoriteIds(newFavorites);
      localStorage.setItem('harryPotter_favorites', JSON.stringify(newFavorites));
      
      toast({
        title: "Artefato Removido",
        description: "Artefato removido do seu grimório",
      });
    } catch (error) {
      console.error('Erro inesperado:', error);
    }
  }, [toast, favoriteIds]);

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
