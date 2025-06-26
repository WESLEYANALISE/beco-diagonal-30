
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface MusicTrack {
  id: number;
  intro: string;
  'explorar-categoria': string;
}

type MusicContext = 'intro' | 'explorar-categoria';

export const useAdvancedBackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [context, setContext] = useState<MusicContext>('intro');
  const [volume, setVolume] = useState(0.3);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [playedTracks, setPlayedTracks] = useState<Set<number>>(new Set());
  const [shuffledPlaylist, setShuffledPlaylist] = useState<MusicTrack[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch music tracks from database
  const fetchTracks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('musicasharrypotter')
        .select('id, intro, "explorar-categoria"')
        .not('intro', 'is', null)
        .not('"explorar-categoria"', 'is', null);

      if (error) {
        console.error('Error fetching music tracks:', error);
        return;
      }

      if (data && data.length > 0) {
        setTracks(data);
        createShuffledPlaylist(data, 'intro');
      }
    } catch (error) {
      console.error('Error fetching music tracks:', error);
    }
  }, []);

  // Create shuffled playlist for current context
  const createShuffledPlaylist = useCallback((trackList: MusicTrack[], newContext: MusicContext) => {
    const validTracks = trackList.filter(track => {
      const url = newContext === 'intro' ? track.intro : track['explorar-categoria'];
      return url && url.trim() !== '';
    });

    // Shuffle array using Fisher-Yates algorithm
    const shuffled = [...validTracks];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setShuffledPlaylist(shuffled);
    setCurrentIndex(0);
    setPlayedTracks(new Set());
  }, []);

  // Get next track from shuffled playlist
  const getNextTrack = useCallback(() => {
    if (shuffledPlaylist.length === 0) return null;

    // If all tracks have been played, reshuffle and start over
    if (playedTracks.size >= shuffledPlaylist.length) {
      createShuffledPlaylist(tracks, context);
      return shuffledPlaylist[0];
    }

    // Find next unplayed track
    let nextIndex = currentIndex;
    let attempts = 0;
    
    while (attempts < shuffledPlaylist.length) {
      const track = shuffledPlaylist[nextIndex];
      if (track && !playedTracks.has(track.id)) {
        setCurrentIndex(nextIndex);
        return track;
      }
      nextIndex = (nextIndex + 1) % shuffledPlaylist.length;
      attempts++;
    }

    return shuffledPlaylist[0];
  }, [shuffledPlaylist, playedTracks, currentIndex, tracks, context, createShuffledPlaylist]);

  // Play next track
  const playNextTrack = useCallback(() => {
    const nextTrack = getNextTrack();
    if (!nextTrack) return;

    const url = context === 'intro' ? nextTrack.intro : nextTrack['explorar-categoria'];
    if (!url || url.trim() === '') return;

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => {
        setCurrentTrack(nextTrack);
        setIsPlaying(true);
        setPlayedTracks(prev => new Set([...prev, nextTrack.id]));
      }).catch(error => {
        console.error('Error playing music:', error);
        // Try next track if current fails
        setTimeout(playNextTrack, 1000);
      });
    }
  }, [getNextTrack, context, volume]);

  // Change music context
  const changeContext = useCallback((newContext: MusicContext) => {
    if (newContext === context) return;
    
    setContext(newContext);
    createShuffledPlaylist(tracks, newContext);
    
    // Play new context music immediately if currently playing
    if (isPlaying) {
      setTimeout(playNextTrack, 100);
    }
  }, [context, tracks, isPlaying, playNextTrack, createShuffledPlaylist]);

  // Start playing music
  const startMusic = useCallback((musicContext: MusicContext = 'intro') => {
    if (tracks.length === 0) return;
    
    changeContext(musicContext);
    
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('ended', playNextTrack);
      audioRef.current.addEventListener('error', () => {
        console.error('Audio error, trying next track');
        setTimeout(playNextTrack, 1000);
      });
    }
    
    if (!isPlaying) {
      playNextTrack();
    }
  }, [tracks, changeContext, isPlaying, playNextTrack]);

  // Stop music
  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  // Toggle play/pause
  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic(context);
    }
  }, [isPlaying, stopMusic, startMusic, context]);

  // Change volume
  const changeVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  // Auto-start intro music when tracks are loaded
  useEffect(() => {
    if (tracks.length > 0 && !isPlaying) {
      startMusic('intro');
    }
  }, [tracks, isPlaying, startMusic]);

  // Initialize
  useEffect(() => {
    fetchTracks();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', playNextTrack);
      }
    };
  }, [fetchTracks, playNextTrack]);

  return {
    isPlaying,
    currentTrack,
    context,
    volume,
    startMusic,
    stopMusic,
    toggleMusic,
    changeVolume,
    changeContext,
    playNextTrack
  };
};
