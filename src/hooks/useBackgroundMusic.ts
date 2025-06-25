
import { useEffect, useRef, useState } from 'react';
import { logger } from '@/utils/logger';

// Global state to prevent multiple instances
let globalAudioInstance: HTMLAudioElement | null = null;
let isAudioInitialized = false;
let globalPlayCount = 0;

export const useBackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const instanceIdRef = useRef(Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    // Prevent multiple instances
    if (isAudioInitialized || globalAudioInstance) {
      logger.debug('Background music already initialized, skipping...', { instanceId: instanceIdRef.current });
      return;
    }

    logger.info('Initializing background music', { instanceId: instanceIdRef.current });
    isAudioInitialized = true;
    
    const audio = new Audio('https://www.dropbox.com/scl/fi/oco24n4cbrgjyekyr9nld/Sem-t-tulo-junho-24-2025.mp3?rlkey=u3urdej3xq7q3nbs1u0yspqwa&st=vkxi6gyd&dl=1');
    audio.volume = 0.15;
    audio.loop = false;
    audio.preload = 'auto';
    
    globalAudioInstance = audio;
    audioRef.current = audio;
    
    const handleCanPlay = () => {
      logger.debug('Audio can play through', { instanceId: instanceIdRef.current });
      setIsLoaded(true);
      // Auto-play immediately when loaded
      if (!hasPlayed && globalPlayCount === 0) {
        audio.play().catch((error) => {
          logger.warn('Auto-play failed, waiting for user interaction', { error: error.message });
        });
      }
    };

    const handlePlay = () => {
      globalPlayCount++;
      setIsPlaying(true);
      logger.info('Background music started playing', { playCount: globalPlayCount });
    };

    const handlePause = () => {
      setIsPlaying(false);
      logger.debug('Background music paused');
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setHasPlayed(true);
      logger.info('Background music ended');
    };

    const handleError = (error: Event) => {
      logger.error('Background music error', { error });
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Try immediate play for browsers that allow it
    const tryPlay = () => {
      if (!hasPlayed && globalPlayCount === 0) {
        audio.play().catch(() => {
          logger.debug('Initial auto-play blocked, setting up user interaction listeners');
          // Add user interaction listeners for restricted browsers
          const handleUserInteraction = () => {
            if (!hasPlayed && audioRef.current && globalPlayCount === 0) {
              audioRef.current.play().catch((error) => {
                logger.warn('User interaction play failed', { error: error.message });
              });
              document.removeEventListener('click', handleUserInteraction);
              document.removeEventListener('keydown', handleUserInteraction);
              document.removeEventListener('touchstart', handleUserInteraction);
            }
          };

          document.addEventListener('click', handleUserInteraction, { once: true });
          document.addEventListener('keydown', handleUserInteraction, { once: true });
          document.addEventListener('touchstart', handleUserInteraction, { once: true });
        });
      }
    };

    tryPlay();

    return () => {
      if (audioRef.current === globalAudioInstance) {
        logger.info('Cleaning up background music', { instanceId: instanceIdRef.current });
        audio.removeEventListener('canplaythrough', handleCanPlay);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.pause();
        globalAudioInstance = null;
        isAudioInitialized = false;
        globalPlayCount = 0;
      }
    };
  }, [hasPlayed]);

  return { isPlaying, isLoaded, hasPlayed };
};
