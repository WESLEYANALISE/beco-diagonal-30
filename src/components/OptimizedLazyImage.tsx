
import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  priority?: boolean;
}

const OptimizedLazyImageComponent: React.FC<OptimizedLazyImageProps> = ({ 
  src, 
  alt, 
  className = "", 
  placeholder,
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const imgRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

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
        threshold: 0.01, // Load as soon as 1% is visible
        rootMargin: '50px' // Reduced from 100px for better performance
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Optimized image loading with progressive enhancement
  const loadImage = useCallback(async () => {
    if (!src || !isInView) return;

    try {
      // Create new image for preloading
      const img = new Image();
      img.decoding = 'async';
      img.loading = 'lazy';
      
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
        setHasError(false);
      };

      img.onerror = () => {
        setHasError(true);
        setIsLoaded(true);
      };

      img.src = src;
      imageRef.current = img;
    } catch (error) {
      setHasError(true);
      setIsLoaded(true);
    }
  }, [src, isInView]);

  useEffect(() => {
    loadImage();
    
    return () => {
      if (imageRef.current) {
        imageRef.current.onload = null;
        imageRef.current.onerror = null;
      }
    };
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
