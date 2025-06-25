
import { useRef, useCallback } from 'react';

const MAGICAL_SOUNDS = [
  'https://www.dropbox.com/scl/fi/oboi15a6bqispczyhazlz/espectro-patrono.mp3?rlkey=1osnu3u0gs143yrs5e9uiyq4e&st=lnkhxygh&dl=1',
  'https://www.dropbox.com/scl/fi/llrn68sfozt0206sno5s9/leviosa-e-n-o-leviosa.mp3?rlkey=bngtely1m9km5eniggeheocqf&st=asx4fp50&dl=1',
  'https://www.dropbox.com/scl/fi/q1emakb4ng5nm0mc9i8sj/leviosa.mp3?rlkey=hwqroakd8dupc3ntizgyp53lb&st=ceri1dr1&dl=1',
  'https://www.dropbox.com/scl/fi/xabqbuofmg3dabws578ew/avadaqub.mp3?rlkey=ny15g8832nzngpwu9sxpmpes8&st=mtswqo9p&dl=1'
];

export const useMagicalSounds = () => {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef<number>(0);
  const cooldownMs = 1000; // 1 second cooldown between sounds

  const playRandomMagicalSound = useCallback(() => {
    const now = Date.now();
    
    // Prevent spam clicking
    if (now - lastPlayedRef.current < cooldownMs) {
      return;
    }
    
    // Stop current audio if playing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    // Select random sound
    const randomIndex = Math.floor(Math.random() * MAGICAL_SOUNDS.length);
    const selectedSound = MAGICAL_SOUNDS[randomIndex];
    
    // Create and play audio
    const audio = new Audio(selectedSound);
    audio.volume = 0.15; // Reduced volume from 0.3 to 0.15
    audio.preload = 'auto';
    
    audio.play().catch(() => {
      // Silent fail for autoplay restrictions
    });
    
    currentAudioRef.current = audio;
    lastPlayedRef.current = now;
    
    // Clean up when audio ends
    audio.addEventListener('ended', () => {
      if (currentAudioRef.current === audio) {
        currentAudioRef.current = null;
      }
    });
    
  }, []);

  // Add missing sound functions that were being called in the code
  const playHoverSound = useCallback(() => {
    playRandomMagicalSound();
  }, [playRandomMagicalSound]);

  const playClickSound = useCallback(() => {
    playRandomMagicalSound();
  }, [playRandomMagicalSound]);

  const playModalSound = useCallback(() => {
    playRandomMagicalSound();
  }, [playRandomMagicalSound]);

  return { 
    playRandomMagicalSound,
    playHoverSound,
    playClickSound,
    playModalSound
  };
};
