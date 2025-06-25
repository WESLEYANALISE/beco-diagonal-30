
import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  key: string;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, CacheEntry<any>>();

export const useSupabaseCache = <T>(
  query: () => Promise<{ data: T | null; error: any }>,
  cacheKey: string,
  deps: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await query();
      
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
        // Cache the result
        cache.set(cacheKey, {
          data: result.data,
          timestamp: Date.now(),
          key: cacheKey
        });
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [query, cacheKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  const invalidateCache = useCallback(() => {
    cache.delete(cacheKey);
    fetchData();
  }, [cacheKey, fetchData]);

  return { data, loading, error, refetch: fetchData, invalidateCache };
};

export const clearSupabaseCache = () => {
  cache.clear();
};
