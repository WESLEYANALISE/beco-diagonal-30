
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface FastVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  isActive?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}

export const FastVideo: React.FC<FastVideoProps> = ({
  src,
  className = '',
  autoPlay = false,
  muted = true,
  loop = false,
  onPlay,
  onPause,
  onEnded,
  isActive = true,
  preload = 'metadata'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        onPlay?.();
      }).catch(console.error);
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
    if (autoPlay && isActive) {
      handlePlay();
    }
  }, [autoPlay, isActive, handlePlay]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  // Auto-play when becoming active
  useEffect(() => {
    if (isActive && autoPlay && videoRef.current && !isLoading) {
      handlePlay();
    } else if (!isActive && isPlaying) {
      handlePause();
    }
  }, [isActive, autoPlay, isLoading, isPlaying, handlePlay, handlePause]);

  if (hasError) {
    return (
      <div className={`bg-gray-900 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Erro ao carregar vídeo</span>
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
        onEnded={handleEnded}
        onError={handleError}
        onClick={handleVideoClick}
        style={{
          minHeight: '100%',
          objectFit: 'cover'
        }}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-magical-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Play/Pause overlay */}
      {!isLoading && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
