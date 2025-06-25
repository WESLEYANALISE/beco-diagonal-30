
import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  navigationStart: number;
  loadEventEnd: number;
  domContentLoaded: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
}

export const usePerformanceMonitor = () => {
  const measurePerformance = useCallback(() => {
    if (typeof window === 'undefined' || !window.performance) return null;

    const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = window.performance.getEntriesByType('paint');
    
    const metrics: PerformanceMetrics = {
      navigationStart: navigation.navigationStart,
      loadEventEnd: navigation.loadEventEnd,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
    };

    // Web Vitals measurements
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.largestContentfulPaint = lastEntry.startTime;
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            metrics.cumulativeLayoutShift = clsValue;
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
        }
      }).observe({ entryTypes: ['first-input'] });
    }

    return metrics;
  }, []);

  const logPerformanceMetrics = useCallback((metrics: PerformanceMetrics | null) => {
    if (!metrics || process.env.NODE_ENV !== 'development') return;

    console.group('🚀 Performance Metrics');
    console.log('📊 DOM Content Loaded:', `${metrics.domContentLoaded}ms`);
    console.log('🎨 First Paint:', metrics.firstPaint ? `${metrics.firstPaint}ms` : 'N/A');
    console.log('🖼️ First Contentful Paint:', metrics.firstContentfulPaint ? `${metrics.firstContentfulPaint}ms` : 'N/A');
    console.log('🖥️ Largest Contentful Paint:', metrics.largestContentfulPaint ? `${metrics.largestContentfulPaint}ms` : 'N/A');
    console.log('📐 Cumulative Layout Shift:', metrics.cumulativeLayoutShift ? metrics.cumulativeLayoutShift.toFixed(4) : 'N/A');
    console.log('⚡ First Input Delay:', metrics.firstInputDelay ? `${metrics.firstInputDelay}ms` : 'N/A');
    console.groupEnd();
  }, []);

  useEffect(() => {
    const handleLoad = () => {
      // Delay measurement to ensure all metrics are captured
      setTimeout(() => {
        const metrics = measurePerformance();
        logPerformanceMetrics(metrics);
      }, 100);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [measurePerformance, logPerformanceMetrics]);

  return { measurePerformance, logPerformanceMetrics };
};
