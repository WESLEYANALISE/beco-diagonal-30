
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'harryPotter_favorites';

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Load favorites from localStorage on mount
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

  // Save to localStorage whenever favoriteIds changes
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
        toast({
          title: "Artefato Adicionado!",
          description: "Artefato adicionado ao seu grimório mágico",
        });
        return [...prev, productId];
      }
      return prev;
    });
  }, [toast]);

  const removeFavorite = useCallback((productId: number) => {
    setFavoriteIds(prev => {
      const filtered = prev.filter(id => id !== productId);
      toast({
        title: "Artefato Removido",
        description: "Artefato removido do seu grimório",
      });
      return filtered;
    });
  }, [toast]);

  const toggleFavorite = useCallback((productId: number) => {
    setFavoriteIds(prev => {
      if (prev.includes(productId)) {
        toast({
          title: "Artefato Removido",
          description: "Artefato removido do seu grimório",
        });
        return prev.filter(id => id !== productId);
      } else {
        toast({
          title: "Artefato Adicionado!",
          description: "Artefato adicionado ao seu grimório mágico",
        });
        return [...prev, productId];
      }
    });
  }, [toast]);

  const isFavorite = useCallback((productId: number) => {
    return favoriteIds.includes(productId);
  }, [favoriteIds]);

  const clearFavorites = useCallback(() => {
    setFavoriteIds([]);
    toast({
      title: "Grimório Limpo",
      description: "Todos os artefatos foram removidos do grimório",
    });
  }, [toast]);

  const favoritesCount = favoriteIds.length;

  return {
    favoriteIds,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount,
    loading
  };
};
