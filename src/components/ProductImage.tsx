
import React, { useState, useCallback, memo, useRef, useEffect } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const ProductImage = memo<ProductImageProps>(({ 
  src, 
  alt, 
  className = '', 
  priority = false,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection observer otimizado para carregamento ultra-rápido
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
        threshold: 0.01,
        rootMargin: '150px' // Pré-carrega mais cedo
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

  // Preload para imagens prioritárias
  useEffect(() => {
    if (priority && src) {
      const preloadImg = new Image();
      preloadImg.src = src;
      preloadImg.onload = () => setIsLoaded(true);
      preloadImg.onerror = () => setHasError(true);
    }
  }, [src, priority]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  if (hasError) {
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
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
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

ProductImage.displayName = 'ProductImage';
