
import { useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { getStoredDeviceId } from '@/utils/deviceFingerprint';
import { logger } from '@/utils/logger';

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
      
      logger.debug(`Tracked ${clickType} for product ${productId}`, { productId, clickType, deviceId });
    } catch (error) {
      logger.error('Error tracking product click', { error, productId, clickType });
    }
  }, []);

  const getMostClickedProducts = useCallback(async (limit: number = 12) => {
    try {
      const { data, error } = await supabase.rpc('get_most_clicked_products_with_videos', {
        limit_count: limit
      });
      
      if (error) {
        logger.error('Error fetching most clicked products', { error, limit });
        return [];
      }
      
      logger.debug('Fetched most clicked products', { count: data?.length || 0, limit });
      return data || [];
    } catch (error) {
      logger.error('Error in getMostClickedProducts', { error, limit });
      return [];
    }
  }, []);

  return {
    trackProductClick,
    getMostClickedProducts
  };
};
