
import { useCallback, useRef, useEffect } from 'react';

export const useOptimizedInteractions = () => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const throttleRef = useRef<boolean>(false);
  const rafRef = useRef<number>();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const debounce = useCallback((func: Function, delay: number = 150) => {
    return (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => func(...args), delay);
    };
  }, []);

  const throttle = useCallback((func: Function, delay: number = 100) => {
    return (...args: any[]) => {
      if (!throttleRef.current) {
        func(...args);
        throttleRef.current = true;
        setTimeout(() => {
          throttleRef.current = false;
        }, delay);
      }
    };
  }, []);

  const instantAction = useCallback((func: Function) => {
    return (...args: any[]) => {
      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      // Use requestAnimationFrame for ultra-smooth performance
      rafRef.current = requestAnimationFrame(() => func(...args));
    };
  }, []);

  return { debounce, throttle, instantAction };
};
