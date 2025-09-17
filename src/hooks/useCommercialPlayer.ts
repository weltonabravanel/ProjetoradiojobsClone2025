import { useState, useRef, useCallback } from 'react';
import { Commercial, getRandomCommercial, shouldPlayCommercial } from '../utils/audioUtils';

interface UseCommercialPlayerProps {
  onCommercialEnded: () => void;
  volume: number;
}

export const useCommercialPlayer = ({ onCommercialEnded, volume }: UseCommercialPlayerProps) => {
  const [currentCommercial, setCurrentCommercial] = useState<Commercial | null>(null);
  const [isPlayingCommercial, setIsPlayingCommercial] = useState(false);
  const [commercialTime, setCommercialTime] = useState(0);
  const [commercialDuration, setCommercialDuration] = useState(0);
  const [canSkipCommercial, setCanSkipCommercial] = useState(false);
  
  const commercialAudioRef = useRef<HTMLAudioElement>(null);

  const playCommercial = useCallback(async () => {
    if (!shouldPlayCommercial()) {
      onCommercialEnded();
      return;
    }

    const commercial = getRandomCommercial();
    setCurrentCommercial(commercial);
    setIsPlayingCommercial(false); // Start as false
    setCommercialTime(0);
    setCanSkipCommercial(false);

    if (commercialAudioRef.current) {
      // Stop any current playback
      commercialAudioRef.current.pause();
      commercialAudioRef.current.currentTime = 0;
      
      // Set new commercial
      commercialAudioRef.current.src = commercial.audioUrl;
      commercialAudioRef.current.volume = volume / 100;
      commercialAudioRef.current.autoplay = false; // Prevent auto-play
      
      try {
        // Load the commercial first
        await new Promise((resolve, reject) => {
          const handleCanPlay = () => {
            commercialAudioRef.current?.removeEventListener('canplay', handleCanPlay);
            commercialAudioRef.current?.removeEventListener('error', handleError);
            resolve(true);
          };
          
          const handleError = () => {
            commercialAudioRef.current?.removeEventListener('canplay', handleCanPlay);
            commercialAudioRef.current?.removeEventListener('error', handleError);
            reject(new Error('Failed to load commercial'));
          };
          
          commercialAudioRef.current?.addEventListener('canplay', handleCanPlay);
          commercialAudioRef.current?.addEventListener('error', handleError);
          commercialAudioRef.current?.load();
        });

        // Now play the commercial
        await commercialAudioRef.current.play();
        setIsPlayingCommercial(true);
        
        // Allow skipping after 5 seconds
        setTimeout(() => {
          setCanSkipCommercial(true);
        }, 5000);
        
      } catch (error) {
        console.error('Error playing commercial:', error);
        // If commercial fails to play, skip to song immediately
        setCurrentCommercial(null);
        setIsPlayingCommercial(false);
        onCommercialEnded();
      }
    }
  }, [volume, onCommercialEnded]);

  const skipCommercial = useCallback(() => {
    if (canSkipCommercial && commercialAudioRef.current) {
      commercialAudioRef.current.pause();
      commercialAudioRef.current.currentTime = 0;
      setIsPlayingCommercial(false);
      setCurrentCommercial(null);
      setCommercialTime(0);
      setCommercialDuration(0);
      setCanSkipCommercial(false);
      onCommercialEnded();
    }
  }, [canSkipCommercial, onCommercialEnded]);

  const pauseCommercial = useCallback(() => {
    if (commercialAudioRef.current) {
      commercialAudioRef.current.pause();
      setIsPlayingCommercial(false);
    }
  }, []);

  const resumeCommercial = useCallback(async () => {
    if (commercialAudioRef.current) {
      try {
        await commercialAudioRef.current.play();
        setIsPlayingCommercial(true);
      } catch (error) {
        console.error('Error resuming commercial:', error);
      }
    }
  }, []);

  // Set up commercial audio event listeners
  const setupCommercialAudio = useCallback(() => {
    const audio = commercialAudioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCommercialTime(audio.currentTime);
    const handleLoadedMetadata = () => setCommercialDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlayingCommercial(false);
      setCurrentCommercial(null);
      setCommercialTime(0);
      setCommercialDuration(0);
      setCanSkipCommercial(false);
      onCommercialEnded();
    };
    const handleError = () => {
      console.error('Commercial audio error');
      setIsPlayingCommercial(false);
      setCurrentCommercial(null);
      setCommercialTime(0);
      setCommercialDuration(0);
      setCanSkipCommercial(false);
      onCommercialEnded();
    };

    // Prevent any auto-play of commercials
    const handleCanPlay = () => {
      // Don't auto-play, wait for explicit play command
      if (audio.autoplay) {
        audio.autoplay = false;
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [onCommercialEnded]);

  return {
    currentCommercial,
    isPlayingCommercial,
    commercialTime,
    commercialDuration,
    canSkipCommercial,
    commercialAudioRef,
    playCommercial,
    skipCommercial,
    pauseCommercial,
    resumeCommercial,
    setupCommercialAudio,
  };
};