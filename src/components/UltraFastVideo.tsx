
import React, { useRef, useState, useCallback, useEffect, memo } from 'react';
import { Play, Pause } from 'lucide-react';

interface UltraFastVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onLoadedData?: () => void;
  isActive?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  priority?: boolean;
}

export const UltraFastVideo = memo<UltraFastVideoProps>(({
  src,
  className = '',
  autoPlay = false,
  muted = true,
  loop = false,
  onPlay,
  onPause,
  onEnded,
  onLoadedData,
  isActive = true,
  preload = 'metadata',
  priority = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise) {
        playPromise.then(() => {
          setIsPlaying(true);
          onPlay?.();
        }).catch(() => {
          // Silent fail para restrições de autoplay
        });
      }
    }
  }, [onPlay]);

  const handlePause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    }
  }, [onPause]);

  const handleVideoClick = useCallback(() => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [isPlaying, handlePlay, handlePause]);

  const handleLoadedData = useCallback(() => {
    setIsLoading(false);
    onLoadedData?.();
    if (autoPlay && isActive) {
      handlePlay();
    }
  }, [autoPlay, isActive, handlePlay, onLoadedData]);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
    onLoadedData?.();
  }, [onLoadedData]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  // Play/pause otimizado para vídeos ativos
  useEffect(() => {
    if (isActive && autoPlay && videoRef.current && !isLoading && !hasError) {
      handlePlay();
    } else if (!isActive && isPlaying) {
      handlePause();
    }
  }, [isActive, autoPlay, isLoading, hasError, isPlaying, handlePlay, handlePause]);

  // Preload para vídeos de alta prioridade
  useEffect(() => {
    if (priority && videoRef.current) {
      videoRef.current.load();
    }
  }, [src, priority]);

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-magical-deepPurple to-magical-midnight flex items-center justify-center ${className}`}>
        <div className="text-center text-magical-starlight/60">
          <div className="text-3xl mb-3">⚡</div>
          <span className="text-sm font-enchanted">Carregando relíquia...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        muted={muted}
        loop={loop}
        playsInline
        preload={preload}
        onLoadedData={handleLoadedData}
        onCanPlay={handleCanPlay}
        onEnded={handleEnded}
        onError={handleError}
        onClick={handleVideoClick}
        style={{
          minHeight: '100%',
          objectFit: 'cover',
          willChange: 'auto'
        }}
      />
      
      {/* Loading overlay minimalista */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-magical-deepPurple/60 to-magical-midnight/60 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-magical-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Indicador de play/pause sutil */}
      {!isLoading && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/5">
          <div className="w-16 h-16 bg-magical-starlight/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-magical-gold/30 transition-all duration-200 hover:scale-110">
            {isPlaying ? (
              <Pause className="w-6 h-6 text-magical-starlight drop-shadow-lg" />
            ) : (
              <Play className="w-6 h-6 text-magical-starlight ml-1 drop-shadow-lg" />
            )}
          </div>
        </div>
      )}
    </div>
  );
});

UltraFastVideo.displayName = 'UltraFastVideo';
