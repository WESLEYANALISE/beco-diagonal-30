
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { imageCache } from '@/utils/imageCache';

interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  priority?: boolean;
  compress?: boolean;
}

const OptimizedLazyImageComponent: React.FC<OptimizedLazyImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  placeholder,
  priority = false,
  compress = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLDivElement>(null);

  // Ultra-optimized intersection observer
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.01,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Load image using advanced cache
  const loadImage = useCallback(async () => {
    if (!src || !isInView) return;

    try {
      const cachedUrl = await imageCache.getImage(src, compress);
      setCurrentSrc(cachedUrl);
      setIsLoaded(true);
      setHasError(false);
    } catch (error) {
      setHasError(true);
      setIsLoaded(true);
    }
  }, [src, isInView, compress]);

  useEffect(() => {
    loadImage();
  }, [loadImage]);

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full bg-gradient-to-r from-magical-gold/10 via-magical-gold/20 to-magical-gold/10 animate-pulse" />
      )}
      
      {isInView && (
        <img
          src={hasError ? (placeholder || '/placeholder.svg') : currentSrc}
          alt={alt}
          className={`${className} transition-all duration-300 will-change-transform ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          loading="lazy"
          decoding="async"
          style={{
            willChange: isLoaded ? 'auto' : 'opacity, transform'
          }}
        />
      )}
    </div>
  );
};

export const OptimizedLazyImage = memo(OptimizedLazyImageComponent);
OptimizedLazyImage.displayName = 'OptimizedLazyImage';
