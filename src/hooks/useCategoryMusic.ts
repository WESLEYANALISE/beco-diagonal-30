
import { useRef, useCallback } from 'react';

const CATEGORY_MUSIC = {
  'Itens Colecionáveis': [
    'https://www.dropbox.com/scl/fi/oboi15a6bqispczyhazlz/espectro-patrono.mp3?rlkey=1osnu3u0gs143yrs5e9uiyq4e&st=lnkhxygh&dl=1',
  ],
  'Bonecas e Brinquedos de Pelúcia': [
    'https://www.dropbox.com/scl/fi/llrn68sfozt0206sno5s9/leviosa-e-n-o-leviosa.mp3?rlkey=bngtely1m9km5eniggeheocqf&st=asx4fp50&dl=1',
  ],
  'Luminária': [
    'https://www.dropbox.com/scl/fi/q1emakb4ng5nm0mc9i8sj/leviosa.mp3?rlkey=hwqroakd8dupc3ntizgyp53lb&st=ceri1dr1&dl=1',
  ],
  'Colares': [
    'https://www.dropbox.com/scl/fi/xabqbuofmg3dabws578ew/avadaqub.mp3?rlkey=ny15g8832nzngpwu9sxpmpes8&st=mtswqo9p&dl=1',
  ],
  'Moletons e Suéteres': [
    'https://www.dropbox.com/scl/fi/oboi15a6bqispczyhazlz/espectro-patrono.mp3?rlkey=1osnu3u0gs143yrs5e9uiyq4e&st=lnkhxygh&dl=1',
  ],
  'Capinhas': [
    'https://www.dropbox.com/scl/fi/llrn68sfozt0206sno5s9/leviosa-e-n-o-leviosa.mp3?rlkey=bngtely1m9km5eniggeheocqf&st=asx4fp50&dl=1',
  ],
  'Canecas': [
    'https://www.dropbox.com/scl/fi/q1emakb4ng5nm0mc9i8sj/leviosa.mp3?rlkey=hwqroakd8dupc3ntizgyp53lb&st=ceri1dr1&dl=1',
  ]
};

export const useCategoryMusic = () => {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const playedSongsRef = useRef<Set<string>>(new Set());

  const playCategoryMusic = useCallback((category: string) => {
    // Stop current audio if playing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    const categoryMusic = CATEGORY_MUSIC[category as keyof typeof CATEGORY_MUSIC];
    if (!categoryMusic || categoryMusic.length === 0) return;

    // Find an unplayed song
    const unplayedSongs = categoryMusic.filter(song => !playedSongsRef.current.has(song));
    
    // If all songs have been played, reset the played list
    if (unplayedSongs.length === 0) {
      playedSongsRef.current.clear();
      unplayedSongs.push(...categoryMusic);
    }

    // Select a random unplayed song
    const selectedSong = unplayedSongs[Math.floor(Math.random() * unplayedSongs.length)];
    playedSongsRef.current.add(selectedSong);

    // Create and play audio
    const audio = new Audio(selectedSong);
    audio.volume = 0.15;
    audio.preload = 'auto';
    
    audio.play().catch(() => {
      // Silent fail for autoplay restrictions
    });
    
    currentAudioRef.current = audio;
    
    // Clean up when audio ends
    audio.addEventListener('ended', () => {
      if (currentAudioRef.current === audio) {
        currentAudioRef.current = null;
      }
    });
  }, []);

  const stopMusic = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
  }, []);

  return { playCategoryMusic, stopMusic };
};
