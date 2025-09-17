import { useState, useCallback, useEffect } from 'react';
import { Song, PlaybackState } from '../types/music';
import { generatePlaylist, getNextSong, getPreviousSong } from '../utils/audioUtils';
import { storage } from '../utils/storageUtils';

const initialPlaybackState: PlaybackState = {
  currentSong: null,
  currentPlaylist: [],
  currentIndex: 0,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 80,
  isMuted: false,
  isShuffled: false,
  repeatMode: 'none',
  playbackQueue: [],
  originalPlaylist: [],
};

export const usePlayback = () => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(initialPlaybackState);
  const [autoPlay, setAutoPlay] = useState(true); // Auto-play habilitado por padrão

  const updatePlaybackState = useCallback((updates: Partial<PlaybackState>) => {
    setPlaybackState(prev => ({ ...prev, ...updates }));
  }, []);

  const playSong = useCallback((song: Song, playlist: Song[] = []) => {
    const newPlaylist = playlist.length > 0 ? playlist : [song];
    const generatedPlaylist = generatePlaylist(newPlaylist, song, playbackState.isShuffled);
    
    updatePlaybackState({
      currentSong: song,
      currentPlaylist: generatedPlaylist,
      originalPlaylist: newPlaylist,
      currentIndex: generatedPlaylist.findIndex(s => s.id === song.id),
      playbackQueue: generatedPlaylist,
      isPlaying: false, // Will be set to true when audio starts playing
    });

    // Add to recent songs
    storage.addToRecent(song);
  }, [playbackState.isShuffled, updatePlaybackState]);

  const playNext = useCallback(() => {
    const { currentSong, currentPlaylist, isShuffled, repeatMode } = playbackState;
    
    if (!currentSong || currentPlaylist.length === 0) return;

    const nextSong = getNextSong(currentSong, currentPlaylist, isShuffled, repeatMode);
    
    if (nextSong) {
      const nextIndex = currentPlaylist.findIndex(s => s.id === nextSong.id);
      updatePlaybackState({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: false, // Will be set when audio starts
      });
      
      storage.addToRecent(nextSong);
    } else if (repeatMode === 'none' && autoPlay) {
      // Se chegou ao fim da playlist e auto-play está ativo, continua com música aleatória
      const randomSong = currentPlaylist[Math.floor(Math.random() * currentPlaylist.length)];
      if (randomSong) {
        updatePlaybackState({
          currentSong: randomSong,
          currentIndex: currentPlaylist.findIndex(s => s.id === randomSong.id),
          isPlaying: false,
        });
        storage.addToRecent(randomSong);
      }
    } else {
      updatePlaybackState({ isPlaying: false });
    }
  }, [playbackState, updatePlaybackState, autoPlay]);

  const playPrevious = useCallback(() => {
    const { currentSong, currentPlaylist, isShuffled } = playbackState;
    
    if (!currentSong || currentPlaylist.length === 0) return;

    const prevSong = getPreviousSong(currentSong, currentPlaylist, isShuffled);
    
    if (prevSong) {
      const prevIndex = currentPlaylist.findIndex(s => s.id === prevSong.id);
      updatePlaybackState({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: false,
      });
      
      storage.addToRecent(prevSong);
    }
  }, [playbackState, updatePlaybackState]);

  const toggleShuffle = useCallback(() => {
    const newShuffled = !playbackState.isShuffled;
    const { currentSong, originalPlaylist } = playbackState;
    
    if (currentSong && originalPlaylist.length > 0) {
      const newPlaylist = generatePlaylist(originalPlaylist, currentSong, newShuffled);
      updatePlaybackState({
        isShuffled: newShuffled,
        currentPlaylist: newPlaylist,
        playbackQueue: newPlaylist,
        currentIndex: newPlaylist.findIndex(s => s.id === currentSong.id),
      });
    } else {
      updatePlaybackState({ isShuffled: newShuffled });
    }
  }, [playbackState, updatePlaybackState]);

  const toggleRepeat = useCallback(() => {
    const modes: ('none' | 'one' | 'all')[] = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(playbackState.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    
    updatePlaybackState({ repeatMode: nextMode });
  }, [playbackState.repeatMode, updatePlaybackState]);

  const addToQueue = useCallback((song: Song) => {
    updatePlaybackState({
      playbackQueue: [...playbackState.playbackQueue, song],
    });
  }, [playbackState.playbackQueue, updatePlaybackState]);

  const removeFromQueue = useCallback((songId: string) => {
    updatePlaybackState({
      playbackQueue: playbackState.playbackQueue.filter(s => s.id !== songId),
    });
  }, [playbackState.playbackQueue, updatePlaybackState]);

  const clearQueue = useCallback(() => {
    updatePlaybackState({
      playbackQueue: playbackState.currentSong ? [playbackState.currentSong] : [],
    });
  }, [playbackState.currentSong, updatePlaybackState]);

  const skipToIndex = useCallback((index: number) => {
    if (index >= 0 && index < playbackState.currentPlaylist.length) {
      const song = playbackState.currentPlaylist[index];
      updatePlaybackState({
        currentSong: song,
        currentIndex: index,
        isPlaying: false,
      });
      
      storage.addToRecent(song);
    }
  }, [playbackState.currentPlaylist, updatePlaybackState]);

  // Handle audio ended event - reprodução automática contínua
  const handleSongEnded = useCallback(() => {
    const { repeatMode, currentPlaylist, currentSong } = playbackState;
    
    if (repeatMode === 'one') {
      // Repetir a mesma música - não fazer nada, o player vai repetir automaticamente
      return;
    } else if (repeatMode === 'all' || autoPlay) {
      // Tocar próxima música automaticamente
      playNext();
    } else {
      // Parar reprodução
      updatePlaybackState({ isPlaying: false });
    }
  }, [playbackState, playNext, autoPlay, updatePlaybackState]);

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay(prev => !prev);
  }, []);

  // Salvar preferências de auto-play
  useEffect(() => {
    const savedAutoPlay = localStorage.getItem('musicbrasil_autoplay');
    if (savedAutoPlay !== null) {
      setAutoPlay(JSON.parse(savedAutoPlay));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('musicbrasil_autoplay', JSON.stringify(autoPlay));
  }, [autoPlay]);

  return {
    ...playbackState,
    autoPlay,
    playSong,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    toggleAutoPlay,
    addToQueue,
    removeFromQueue,
    clearQueue,
    skipToIndex,
    handleSongEnded,
    updatePlaybackState,
  };
};