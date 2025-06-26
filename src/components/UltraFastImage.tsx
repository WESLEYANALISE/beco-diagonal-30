
import React, { useState, useCallback, memo, useRef, useEffect } from 'react';

interface UltraFastImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
}

export const UltraFastImage = memo<UltraFastImageProps>(({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  onLoad,
  onError,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // Preload critical images with ultra-optimization
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [src, priority]);

  // Intersection Observer for lazy loading optimization
  useEffect(() => {
    if (loading === 'lazy' && !priority && imgRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            img.src = src;
            observerRef.current?.unobserve(img);
          }
        },
        {
          rootMargin: '50px',
          threshold: 0.1
        }
      );

      observerRef.current.observe(imgRef.current);

      return () => {
        observerRef.current?.disconnect();
      };
    }
  }, [src, loading, priority]);

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-magical-deepPurple/20 to-magical-mysticalPurple/20 flex items-center justify-center ${className} backdrop-blur-sm border border-magical-gold/20`}>
        <span className="text-magical-gold text-xs animate-pulse">✨</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={loading === 'eager' || priority ? src : undefined}
      alt={alt}
      className={`${className} transition-opacity duration-100 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      loading={loading}
      decoding="async"
      onLoad={handleLoad}
      onError={handleError}
      style={{
        contentVisibility: 'auto',
        containIntrinsicSize: '200px 200px',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        willChange: 'transform, opacity'
      }}
    />
  );
});

UltraFastImage.displayName = 'UltraFastImage';
