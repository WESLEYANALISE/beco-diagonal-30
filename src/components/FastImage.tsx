
import React, { useState, useCallback, memo } from 'react';

interface FastImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

export const FastImage = memo<FastImageProps>(({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  onLoad,
  onError 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

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
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-xs">Erro ao carregar</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} transition-opacity duration-200 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      loading={loading}
      decoding="async"
      onLoad={handleLoad}
      onError={handleError}
    />
  );
});

FastImage.displayName = 'FastImage';
