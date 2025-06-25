
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

export const useFavoritesSupabase = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Buscar favoritos do usuário logado
  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_favorites_harry_potter')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao buscar favoritos:', error);
        return;
      }

      const ids = data?.map(item => item.product_id) || [];
      setFavoriteIds(ids);
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Login Necessário",
          description: "Faça login para adicionar artefatos ao grimório",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('user_favorites_harry_potter')
        .insert({ user_id: user.id, product_id: productId });

      if (error) {
        console.error('Erro ao adicionar favorito:', error);
        toast({
          title: "Erro",
          description: "Erro ao adicionar artefato ao grimório",
          variant: "destructive",
        });
        return;
      }

      setFavoriteIds(prev => [...prev, productId]);
      toast({
        title: "Artefato Adicionado!",
        description: "Artefato adicionado ao seu grimório mágico",
      });
    } catch (error) {
      console.error('Erro inesperado:', error);
    }
  }, [toast]);

  const removeFavorite = useCallback(async (productId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_favorites_harry_potter')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        console.error('Erro ao remover favorito:', error);
        toast({
          title: "Erro",
          description: "Erro ao remover artefato do grimório",
          variant: "destructive",
        });
        return;
      }

      setFavoriteIds(prev => prev.filter(id => id !== productId));
      toast({
        title: "Artefato Removido",
        description: "Artefato removido do seu grimório",
      });
    } catch (error) {
      console.error('Erro inesperado:', error);
    }
  }, [toast]);

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
