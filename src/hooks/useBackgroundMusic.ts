
import { useEffect, useRef, useState } from 'react';

export const useBackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const audio = new Audio('https://www.dropbox.com/scl/fi/oco24n4cbrgjyekyr9nld/Sem-t-tulo-junho-24-2025.mp3?rlkey=u3urdej3xq7q3nbs1u0yspqwa&st=vkxi6gyd&dl=1');
    audio.volume = 0.15; // Low volume
    audio.loop = false; // Play only once
    audio.preload = 'auto';
    
    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
      // Auto-play immediately when loaded - only if hasn't played yet
      if (!hasPlayed) {
        audio.play().catch(console.log);
      }
    });

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setHasPlayed(true);
    });
    
    audioRef.current = audio;

    // Try to play immediately on load
    const playAudio = () => {
      if (audio && !hasPlayed) {
        audio.play().catch(console.log);
      }
    };

    // Auto-play on first user interaction if not already playing
    const handleUserInteraction = () => {
      if (!hasPlayed && audioRef.current) {
        audioRef.current.play().catch(console.log);
        document.removeEventListener('click', handleUserInteraction);
        document.removeEventListener('keydown', handleUserInteraction);
      }
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    // Try to play immediately
    playAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [hasPlayed]);

  return { isPlaying, isLoaded, hasPlayed };
};
