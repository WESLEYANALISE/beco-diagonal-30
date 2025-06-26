
import { useCallback, useMemo, useRef } from 'react';

export const usePerformanceOptimization = () => {
  const debounceTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const throttleTimers = useRef<Map<string, boolean>>(new Map());

  const debounce = useCallback((key: string, func: Function, delay: number = 300) => {
    return (...args: any[]) => {
      const existingTimer = debounceTimers.current.get(key);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }
      
      const timer = setTimeout(() => func(...args), delay);
      debounceTimers.current.set(key, timer);
    };
  }, []);

  const throttle = useCallback((key: string, func: Function, delay: number = 200) => {
    return (...args: any[]) => {
      if (!throttleTimers.current.get(key)) {
        func(...args);
        throttleTimers.current.set(key, true);
        
        setTimeout(() => {
          throttleTimers.current.set(key, false);
        }, delay);
      }
    };
  }, []);

  const memoizeExpensive = useCallback(<T>(computeFunction: () => T, dependencies: any[]): T => {
    return useMemo(computeFunction, dependencies);
  }, []);

  return { debounce, throttle, memoizeExpensive };
};
