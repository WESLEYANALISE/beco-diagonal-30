
import { useEffect, useRef, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";

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

    const initializeMusic = async () => {
      try {
        // Fetch music from database
        const { data, error } = await supabase
          .from('musicasharrypotter')
          .select('intro')
          .limit(1)
          .single();

        if (error || !data?.intro) {
          console.log('Música não encontrada, usando padrão');
          return;
        }

        isAudioInitialized = true;
        
        const audio = new Audio(data.intro);
        audio.volume = 0.15;
        audio.loop = false;
        audio.preload = 'auto';
        
        globalAudioInstance = audio;
        audioRef.current = audio;
        
        const handleCanPlay = () => {
          setIsLoaded(true);
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

        // Auto-play após um pequeno delay para melhor UX
        setTimeout(() => {
          if (!hasPlayed && isLoaded) {
            audio.play().catch(() => {
              // Silent fail for autoplay restrictions
            });
          }
        }, 1000);

      } catch (error) {
        console.error('Erro ao carregar música:', error);
      }
    };

    initializeMusic();

    return () => {
      if (audioRef.current === globalAudioInstance) {
        const audio = audioRef.current;
        audio?.removeEventListener('canplaythrough', () => {});
        audio?.removeEventListener('play', () => {});
        audio?.removeEventListener('pause', () => {});
        audio?.removeEventListener('ended', () => {});
        audio?.pause();
        globalAudioInstance = null;
        isAudioInitialized = false;
      }
    };
  }, [hasPlayed, isLoaded]);

  const playMusic = () => {
    if (audioRef.current && !hasPlayed && isLoaded) {
      audioRef.current.play().catch(() => {
        // Silent fail for autoplay restrictions
      });
    }
  };

  return { isPlaying, isLoaded, hasPlayed, playMusic };
};
