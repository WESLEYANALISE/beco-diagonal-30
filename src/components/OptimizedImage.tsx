
import React, { useState, useCallback, memo } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  priority?: boolean;
}

export const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  className = '',
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM5OTk5OTkiPkNhcnJlZ2FuZG8uLi48L3RleHQ+PC9zdmc+',
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <img
          src={placeholder}
          alt="Carregando..."
          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-50"
        />
      )}
      <img
        src={hasError ? placeholder : src}
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
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';
