
import React, { useState, useCallback, memo, useRef, useEffect } from 'react';

interface AdvancedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSrc?: string;
}

export const AdvancedImage = memo<AdvancedImageProps>(({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  onLoad,
  onError,
  fallbackSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM5OTk5OTkiPkNhcnJlZ2FuZG8uLi48L3RleHQ+PC9zdmc+'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    const currentRef = imgRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, isInView]);

  // Preload for priority images
  useEffect(() => {
    if (priority && src) {
      const preloadImg = new Image();
      preloadImg.src = src;
      preloadImg.onload = () => setIsLoaded(true);
      preloadImg.onerror = () => {
        setHasError(true);
        setCurrentSrc(fallbackSrc);
      };
    }
  }, [src, priority, fallbackSrc]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (!hasError && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
      onError?.();
    }
  }, [hasError, currentSrc, fallbackSrc, onError]);

  if (hasError && currentSrc === fallbackSrc) {
    return (
      <div className={`bg-gradient-to-br from-magical-gold/10 to-magical-bronze/10 flex items-center justify-center ${className} border border-magical-gold/20 rounded-lg`}>
        <div className="text-center text-magical-gold/60">
          <div className="text-2xl mb-2">✨</div>
          <span className="text-xs font-enchanted">Artefato Mágico</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-magical-gold/5 to-magical-bronze/5 flex items-center justify-center animate-pulse">
          <div className="w-6 h-6 border-2 border-magical-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {isInView && (
        <img
          src={currentSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          style={{
            contentVisibility: 'auto',
            containIntrinsicSize: '200px 200px'
          }}
        />
      )}
    </div>
  );
});

AdvancedImage.displayName = 'AdvancedImage';
