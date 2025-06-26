
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
  onLoadedData?: () => void;
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
  onLoadedData,
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
    onLoadedData?.();
    if (autoPlay && isActive) {
      handlePlay();
    }
  }, [autoPlay, isActive, handlePlay, onLoadedData]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
    onLoadedData?.();
  }, [onLoadedData]);

  // Auto-play when becoming active
  useEffect(() => {
    if (isActive && autoPlay && videoRef.current && !isLoading && !hasError) {
      const playPromise = videoRef.current.play();
      if (playPromise) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch(console.error);
      }
    } else if (!isActive && isPlaying) {
      handlePause();
    }
  }, [isActive, autoPlay, isLoading, hasError, isPlaying, handlePause]);

  // Preload next video when current becomes active
  useEffect(() => {
    if (videoRef.current && isActive) {
      videoRef.current.load();
    }
  }, [src, isActive]);

  if (hasError) {
    return (
      <div className={`bg-gradient-to-br from-magical-deepPurple to-magical-midnight flex items-center justify-center ${className}`}>
        <div className="text-center text-magical-starlight/60">
          <div className="text-2xl mb-2">⚡</div>
          <span className="text-sm">Carregando artefato mágico...</span>
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
          objectFit: 'cover'
        }}
      />
      
      {/* Loading overlay with magical theme */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-magical-deepPurple via-magical-mysticalPurple to-magical-midnight flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-magical-gold border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-magical-gold text-sm font-enchanted animate-pulse">
              Invocando magia...
            </div>
          </div>
        </div>
      )}
      
      {/* Play/Pause overlay */}
      {!isLoading && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/20">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transform transition-transform duration-200 hover:scale-110">
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
