
import { useCallback, useRef, useMemo, useEffect } from 'react';

export const useUltraPerformance = () => {
  const rafRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const throttleRef = useRef<boolean>(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const optimizedAction = useCallback((callback: Function) => {
    return (...args: any[]) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(() => {
        callback(...args);
      });
    };
  }, []);

  const throttledAction = useCallback((callback: Function, delay: number = 100) => {
    return (...args: any[]) => {
      if (!throttleRef.current) {
        callback(...args);
        throttleRef.current = true;
        setTimeout(() => {
          throttleRef.current = false;
        }, delay);
      }
    };
  }, []);

  const debouncedAction = useCallback((callback: Function, delay: number = 200) => {
    return (...args: any[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }, []);

  const memoizedCallback = useCallback((callback: Function, deps: any[]) => {
    return useMemo(() => callback, deps);
  }, []);

  return {
    optimizedAction,
    throttledAction,
    debouncedAction,
    memoizedCallback
  };
};
