
import { useCallback, useRef } from 'react';

export const useOptimizedInteractions = () => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const throttleRef = useRef<boolean>(false);

  const debounce = useCallback((func: Function, delay: number = 300) => {
    return (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => func(...args), delay);
    };
  }, []);

  const throttle = useCallback((func: Function, delay: number = 200) => {
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
      // Use requestAnimationFrame for smooth performance
      requestAnimationFrame(() => func(...args));
    };
  }, []);

  return { debounce, throttle, instantAction };
};
