
import { useState, useEffect, useCallback } from 'react';

interface CacheEntry {
  url: string;
  blob: Blob;
  timestamp: number;
}

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_SIZE = 50; // Maximum number of cached images

class ImageCacheManager {
  private cache = new Map<string, CacheEntry>();
  private cacheOrder: string[] = [];

  get(url: string): string | null {
    const entry = this.cache.get(url);
    if (!entry) return null;

    // Check if cache entry is still valid
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.cache.delete(url);
      this.cacheOrder = this.cacheOrder.filter(u => u !== url);
      return null;
    }

    // Move to end (most recently used)
    this.cacheOrder = this.cacheOrder.filter(u => u !== url);
    this.cacheOrder.push(url);

    return URL.createObjectURL(entry.blob);
  }

  set(url: string, blob: Blob): void {
    // Remove oldest entries if cache is full
    while (this.cacheOrder.length >= MAX_CACHE_SIZE) {
      const oldestUrl = this.cacheOrder.shift();
      if (oldestUrl) {
        this.cache.delete(oldestUrl);
      }
    }

    this.cache.set(url, {
      url,
      blob,
      timestamp: Date.now()
    });
    this.cacheOrder.push(url);
  }

  clear(): void {
    this.cache.clear();
    this.cacheOrder = [];
  }
}

const imageCache = new ImageCacheManager();

export const useImageCache = (src: string) => {
  const [cachedUrl, setCachedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadImage = useCallback(async (url: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cached = imageCache.get(url);
      if (cached) {
        setCachedUrl(cached);
        setIsLoading(false);
        return;
      }

      // Fetch image
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load image');

      const blob = await response.blob();
      imageCache.set(url, blob);
      
      const objectUrl = URL.createObjectURL(blob);
      setCachedUrl(objectUrl);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (src) {
      loadImage(src);
    }
  }, [src, loadImage]);

  return { cachedUrl, isLoading, error };
};
