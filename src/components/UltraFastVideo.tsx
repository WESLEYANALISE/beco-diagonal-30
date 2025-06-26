
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
          // Silent fail for autoplay restrictions
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

  // Instant play/pause for active videos
  useEffect(() => {
    if (isActive && autoPlay && videoRef.current && !isLoading && !hasError) {
      handlePlay();
    } else if (!isActive && isPlaying) {
      handlePause();
    }
  }, [isActive, autoPlay, isLoading, hasError, isPlaying, handlePlay, handlePause]);

  // Preload high priority videos
  useEffect(() => {
    if (priority && videoRef.current) {
      videoRef.current.load();
    }
  }, [src, priority]);

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-magical-deepPurple to-magical-midnight flex items-center justify-center ${className}`}>
        <div className="text-center text-magical-starlight/60">
          <div className="text-2xl mb-2">⚡</div>
          <span className="text-sm">Carregando...</span>
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
          contentVisibility: 'auto'
        }}
      />
      
      {/* Minimal loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-magical-deepPurple/80 to-magical-midnight/80 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-magical-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Quick play/pause indicator */}
      {!isLoading && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/10">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 text-white ml-0.5" />
            )}
          </div>
        </div>
      )}
    </div>
  );
});

UltraFastVideo.displayName = 'UltraFastVideo';
