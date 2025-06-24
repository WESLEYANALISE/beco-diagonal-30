
import { useEffect, useRef, useState } from 'react';

export const useBackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const audio = new Audio('https://www.dropbox.com/scl/fi/oco24n4cbrgjyekyr9nld/Sem-t-tulo-junho-24-2025.mp3?rlkey=u3urdej3xq7q3nbs1u0yspqwa&st=vkxi6gyd&dl=1');
    audio.volume = 0.15; // Low volume
    audio.loop = true;
    audio.preload = 'auto';
    
    audio.addEventListener('canplaythrough', () => {
      setIsLoaded(true);
    });

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    
    audioRef.current = audio;

    // Auto-play when loaded (with user interaction)
    const playAudio = () => {
      if (audio && isLoaded) {
        audio.play().catch(console.log);
      }
    };

    // Try to play after first user interaction
    const handleUserInteraction = () => {
      playAudio();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [isLoaded]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.log);
      }
    }
  };

  return { isPlaying, toggleMusic, isLoaded };
};
