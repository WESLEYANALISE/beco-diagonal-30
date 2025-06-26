
import { useEffect, useRef, useState } from 'react';

// Global flag to prevent multiple instances
let globalAudioInstance: HTMLAudioElement | null = null;
let isAudioInitialized = false;

export const useBackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    // Prevent multiple instances
    if (isAudioInitialized || globalAudioInstance) {
      return;
    }

    isAudioInitialized = true;
    
    const audio = new Audio('https://www.dropbox.com/scl/fi/oco24n4cbrgjyekyr9nld/Sem-t-tulo-junho-24-2025.mp3?rlkey=u3urdej3xq7q3nbs1u0yspqwa&st=vkxi6gyd&dl=1');
    audio.volume = 0.15;
    audio.loop = false;
    audio.preload = 'auto';
    
    globalAudioInstance = audio;
    audioRef.current = audio;
    
    const handleCanPlay = () => {
      setIsLoaded(true);
      // Auto-play immediately when loaded
      if (!hasPlayed) {
        audio.play().catch(() => {
          // Silent fail for autoplay restrictions
        });
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setHasPlayed(true);
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Try immediate play for browsers that allow it
    const tryPlay = () => {
      if (!hasPlayed) {
        audio.play().catch(() => {
          // Add user interaction listeners for restricted browsers
          const handleUserInteraction = () => {
            if (!hasPlayed && audioRef.current) {
              audioRef.current.play().catch(() => {});
              document.removeEventListener('click', handleUserInteraction);
              document.removeEventListener('keydown', handleUserInteraction);
              document.removeEventListener('touchstart', handleUserInteraction);
            }
          };

          document.addEventListener('click', handleUserInteraction);
          document.addEventListener('keydown', handleUserInteraction);
          document.addEventListener('touchstart', handleUserInteraction);
        });
      }
    };

    tryPlay();

    return () => {
      if (audioRef.current === globalAudioInstance) {
        audio.removeEventListener('canplaythrough', handleCanPlay);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
        globalAudioInstance = null;
        isAudioInitialized = false;
      }
    };
  }, [hasPlayed]);

  return { isPlaying, isLoaded, hasPlayed };
};
