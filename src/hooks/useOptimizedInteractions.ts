
import { useCallback, useRef } from 'react';

export const useOptimizedInteractions = () => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const throttleRef = useRef<NodeJS.Timeout>();

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
        throttleRef.current = setTimeout(() => {
          throttleRef.current = undefined;
        }, delay);
      }
    };
  }, []);

  const instantAction = useCallback((func: Function) => {
    return (...args: any[]) => {
      // Use requestAnimationFrame for smooth animations
      requestAnimationFrame(() => func(...args));
    };
  }, []);

  return { debounce, throttle, instantAction };
};
