
import { useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { getStoredDeviceId } from '@/utils/deviceFingerprint';

export const useProductClicks = () => {
  const trackProductClick = useCallback(async (productId: number, clickType: string = 'video_view') => {
    try {
      const deviceId = getStoredDeviceId();
      
      await supabase
        .from('product_clicks')
        .insert({
          product_id: productId,
          device_id: deviceId,
          click_type: clickType
        });
      
      console.log(`Tracked ${clickType} for product ${productId}`);
    } catch (error) {
      console.error('Error tracking product click:', error);
    }
  }, []);

  const getMostClickedProducts = useCallback(async (limit: number = 12) => {
    try {
      // Buscar produtos mais clicados da tabela HARRY POTTER
      const { data: clickData, error: clickError } = await supabase
        .from('product_clicks')
        .select('product_id, count(*)')
        .gte('clicked_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Últimos 30 dias
        .group('product_id')
        .order('count', { ascending: false })
        .limit(limit);

      if (clickError) {
        console.error('Error fetching click data:', clickError);
      }

      // Buscar todos os produtos da tabela HARRY POTTER com vídeos
      const { data: products, error: productsError } = await supabase
        .from('HARRY POTTER')
        .select('*')
        .not('video', 'is', null)
        .neq('video', '');

      if (productsError) {
        console.error('Error fetching Harry Potter products:', productsError);
        return [];
      }

      if (!products) return [];

      // Combinar dados de cliques com produtos
      const productsWithClicks = products.map(product => {
        const clickCount = clickData?.find(click => click.product_id === product.id)?.count || 0;
        return {
          ...product,
          click_count: clickCount
        };
      });

      // Ordenar por cliques e depois aleatoriamente
      const sortedProducts = productsWithClicks
        .sort((a, b) => {
          if (b.click_count !== a.click_count) {
            return b.click_count - a.click_count;
          }
          return Math.random() - 0.5; // Random para produtos com mesmo número de cliques
        })
        .slice(0, limit);

      return sortedProducts;
    } catch (error) {
      console.error('Error in getMostClickedProducts:', error);
      return [];
    }
  }, []);

  const getHarryPotterProducts = useCallback(async (limit: number = 12) => {
    try {
      const { data, error } = await supabase
        .from('HARRY POTTER')
        .select('*')
        .not('video', 'is', null)
        .neq('video', '')
        .order('id', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching Harry Potter products:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getHarryPotterProducts:', error);
      return [];
    }
  }, []);

  return {
    trackProductClick,
    getMostClickedProducts,
    getHarryPotterProducts
  };
};
