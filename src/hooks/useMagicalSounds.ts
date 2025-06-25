
import { useRef, useCallback } from 'react';

const MAGICAL_SOUNDS = [
  'https://www.dropbox.com/scl/fi/oboi15a6bqispczyhazlz/espectro-patrono.mp3?rlkey=1osnu3u0gs143yrs5e9uiyq4e&st=lnkhxygh&dl=1',
  'https://www.dropbox.com/scl/fi/llrn68sfozt0206sno5s9/leviosa-e-n-o-leviosa.mp3?rlkey=bngtely1m9km5eniggeheocqf&st=asx4fp50&dl=1',
  'https://www.dropbox.com/scl/fi/q1emakb4ng5nm0mc9i8sj/leviosa.mp3?rlkey=hwqroakd8dupc3ntizgyp53lb&st=ceri1dr1&dl=1',
  'https://www.dropbox.com/scl/fi/xabqbuofmg3dabws578ew/avadaqub.mp3?rlkey=ny15g8832nzngpwu9sxpmpes8&st=mtswqo9p&dl=1'
];

// Additional magical sound effects
const INTERACTION_SOUNDS = {
  hover: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmhZCzOM1O/SgiMAE0DL9Nlt', // Hover whoosh
  click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmhZCzOM1O/SgiMAE0DL9Nlt', // Click sparkle
  modal: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmhZCzOM1O/SgiMAE0DL9Nlt' // Portal/Modal open
};

export const useMagicalSounds = () => {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastPlayedRef = useRef<number>(0);
  const cooldownMs = 500; // Reduced cooldown for more responsive feedback

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
    audio.volume = 0.12; // Slightly reduced volume
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

  const playMagicalEffect = useCallback((type: 'hover' | 'click' | 'modal') => {
    const now = Date.now();
    
    // Shorter cooldown for interaction sounds
    if (now - lastPlayedRef.current < 200) {
      return;
    }

    // Stop current audio if playing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    try {
      const audio = new Audio(INTERACTION_SOUNDS[type]);
      audio.volume = 0.08; // Lower volume for interaction sounds
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
    } catch (error) {
      // Silent fail if sound creation fails
    }
  }, []);

  const playHoverSound = useCallback(() => playMagicalEffect('hover'), [playMagicalEffect]);
  const playClickSound = useCallback(() => playMagicalEffect('click'), [playMagicalEffect]);
  const playModalSound = useCallback(() => playMagicalEffect('modal'), [playMagicalEffect]);

  return { 
    playRandomMagicalSound,
    playHoverSound,
    playClickSound,
    playModalSound
  };
};
