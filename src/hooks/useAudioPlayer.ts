import { useRef, useEffect, useCallback } from 'react';
import { Song } from '../types/music';
import { getAudioUrl } from '../utils/audioUtils';

interface UseAudioPlayerProps {
  currentSong: Song | null;
  volume: number;
  onTimeUpdate: (currentTime: number) => void;
  onLoadedMetadata: (duration: number) => void;
  onEnded: () => void;
  onError: () => void;
  onPlay: () => void;
  onPause: () => void;
}

export const useAudioPlayer = ({
  currentSong,
  volume,
  onTimeUpdate,
  onLoadedMetadata,
  onEnded,
  onError,
  onPlay,
  onPause,
}: UseAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Load new song but DON'T auto-play
  useEffect(() => {
    if (audioRef.current && currentSong) {
      const audioUrl = getAudioUrl(currentSong);
      if (audioUrl && audioRef.current.src !== audioUrl) {
        // Pause any current playback first
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        
        // Set new source and load
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        
        // Ensure it doesn't auto-play
        audioRef.current.autoplay = false;
      }
    }
  }, [currentSong]);

  // Event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => onTimeUpdate(audio.currentTime);
    const handleLoadedMetadata = () => onLoadedMetadata(audio.duration || 0);
    const handleEnded = () => onEnded();
    const handleError = () => onError();
    const handlePlay = () => onPlay();
    const handlePause = () => onPause();

    // Prevent any automatic playback
    const handleCanPlay = () => {
      // Ensure the audio is paused when it's ready to play
      if (!audio.paused) {
        audio.pause();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [onTimeUpdate, onLoadedMetadata, onEnded, onError, onPlay, onPause]);

  const play = useCallback(async () => {
    if (audioRef.current) {
      try {
        // Ensure we're starting from the beginning if needed
        if (audioRef.current.currentTime === 0) {
          audioRef.current.currentTime = 0;
        }
        await audioRef.current.play();
        return true;
      } catch (error) {
        console.error('Error playing audio:', error);
        return false;
      }
    }
    return false;
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return {
    audioRef,
    play,
    pause,
    seek,
    setMuted,
    stop,
  };
};