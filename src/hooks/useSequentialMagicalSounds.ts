
import { useRef, useCallback, useState } from 'react';

const MAGICAL_SOUNDS = [
  'https://www.dropbox.com/scl/fi/oboi15a6bqispczyhazlz/espectro-patrono.mp3?rlkey=1osnu3u0gs143yrs5e9uiyq4e&st=lnkhxygh&dl=1',
  'https://www.dropbox.com/scl/fi/llrn68sfozt0206sno5s9/leviosa-e-n-o-leviosa.mp3?rlkey=bngtely1m9km5eniggeheocqf&st=asx4fp50&dl=1',
  'https://www.dropbox.com/scl/fi/q1emakb4ng5nm0mc9i8sj/leviosa.mp3?rlkey=hwqroakd8dupc3ntizgyp53lb&st=ceri1dr1&dl=1',
  'https://www.dropbox.com/scl/fi/xabqbuofmg3dabws578ew/avadaqub.mp3?rlkey=ny15g8832nzngpwu9sxpmpes8&st=mtswqo9p&dl=1'
];

export const useSequentialMagicalSounds = () => {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentIndexRef = useRef<number>(0);
  const lastPlayedRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const cooldownMs = 1000;

  const playNextSequentialSound = useCallback(() => {
    const now = Date.now();
    
    if (now - lastPlayedRef.current < cooldownMs || isPlaying) {
      return;
    }
    
    // Stop current audio if playing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    // Get current sound
    const currentSound = MAGICAL_SOUNDS[currentIndexRef.current];
    
    // Create and play audio
    const audio = new Audio(currentSound);
    audio.volume = 0.15;
    audio.preload = 'auto';
    
    setIsPlaying(true);
    
    audio.play().catch(() => {
      setIsPlaying(false);
    });
    
    currentAudioRef.current = audio;
    lastPlayedRef.current = now;
    
    // Move to next sound
    currentIndexRef.current = (currentIndexRef.current + 1) % MAGICAL_SOUNDS.length;
    
    // Clean up when audio ends
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      if (currentAudioRef.current === audio) {
        currentAudioRef.current = null;
      }
    });
    
  }, [isPlaying]);

  const resetSequence = useCallback(() => {
    currentIndexRef.current = 0;
  }, []);

  return { 
    playNextSequentialSound,
    resetSequence,
    isPlaying,
    currentIndex: currentIndexRef.current
  };
};
