
import { useCallback, useRef } from 'react';

export const usePerformanceOptimization = () => {
  const debounceRef = useRef<Record<string, NodeJS.Timeout>>({});

  const debounce = useCallback((key: string, fn: () => void, delay: number = 300) => {
    if (debounceRef.current[key]) {
      clearTimeout(debounceRef.current[key]);
    }
    
    debounceRef.current[key] = setTimeout(() => {
      fn();
      delete debounceRef.current[key];
    }, delay);
  }, []);

  const memoizeImages = useCallback((imageUrl: string) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        const img = new Image();
        img.src = imageUrl;
      });
    }
  }, []);

  const optimizeRender = useCallback((callback: () => void) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(callback);
    } else {
      setTimeout(callback, 0);
    }
  }, []);

  return {
    debounce,
    memoizeImages,
    optimizeRender
  };
};
