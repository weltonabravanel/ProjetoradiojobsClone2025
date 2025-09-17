import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Globe, Users, Loader2, XCircle, Music } from 'lucide-react';
import { AudioPlayerState } from '../types/radio';

interface RadioPlayerProps {
  playerState: AudioPlayerState;
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onStop: () => void;
}

const commercials = [
  'https://radiojobs.com.br/claroprezao.mp3',
  'https://radiojobs.com.br/mercadolivre.mp3',
  'https://radiojobs.com.br/vacina.mp3',
  'https://radiojobs.com.br/trivago.mp3',
  'https://radiojobs.com.br/mercadolivre19reais.mp3',
  'https://radiojobs.com.br/caixa.mp3',
  'https://radiojobs.com.br/timblack.mp3',
  'https://radiojobs.com.br/pagbank.mp3',
  'https://radiojobs.com.br/bradesco.mp3',
  'https://radiojobs.com.br/claro.mp3',
  'https://radiojobs.com.br/sky.mp3',
  'https://radiojobs.com.br/itau.mp3',
  'https://radiojobs.com.br/google.mp3',
  'https://radiojobs.com.br/google2.mp3',
  'https://radiojobs.com.br/google3.mp3'
];

export const RadioPlayer: React.FC<RadioPlayerProps> = ({
  playerState,
  onTogglePlay,
  onVolumeChange,
  onToggleMute,
  onStop,
}) => {
  const { isPlaying, currentStation, volume, isMuted, isLoading, error } = playerState;

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [adTimeLeft, setAdTimeLeft] = useState(0);
  const [canSkipAd, setCanSkipAd] = useState(false);
  const [lastStationId, setLastStationId] = useState<string | null>(null);
  const skipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const adTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Effect to handle new station selection - always play commercial first
  useEffect(() => {
    if (!currentStation || !audioRef.current) return;
    
    // Check if this is a new station
    if (currentStation.stationuuid !== lastStationId) {
      setLastStationId(currentStation.stationuuid);
      playCommercialThenStation();
    }
  }, [currentStation?.stationuuid]);

  // Effect to handle volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isPlayingAd) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, isPlayingAd]);

  const playCommercialThenStation = async () => {
    const audio = audioRef.current;
    if (!audio || !currentStation) return;

    // Stop any current playback
    audio.pause();
    audio.src = '';

    // Select random commercial
    const randomAd = commercials[Math.floor(Math.random() * commercials.length)];
    
    // Set up commercial playback
    setIsPlayingAd(true);
    setCanSkipAd(false);
    setAdTimeLeft(0);

    // Clear any existing timers
    if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    if (adTimerRef.current) clearInterval(adTimerRef.current);

    try {
      // Load and play commercial
      audio.src = randomAd;
      audio.volume = 1; // Full volume for ads
      audio.load();
      
      await audio.play();

      // Set up skip timer (5 seconds)
      skipTimerRef.current = setTimeout(() => {
        setCanSkipAd(true);
      }, 5000);

      // Set up countdown timer
      adTimerRef.current = setInterval(() => {
        if (audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
          const timeLeft = Math.ceil(audio.duration - audio.currentTime);
          setAdTimeLeft(Math.max(0, timeLeft));
        }
      }, 1000);

      // Set up event listeners for commercial
      const handleAdEnded = () => {
        playRadioStation();
      };

      const handleAdError = () => {
        console.error('Commercial failed to load, playing station directly');
        playRadioStation();
      };

      audio.addEventListener('ended', handleAdEnded, { once: true });
      audio.addEventListener('error', handleAdError, { once: true });

    } catch (error) {
      console.error('Failed to play commercial:', error);
      playRadioStation();
    }
  };

  const playRadioStation = async () => {
    const audio = audioRef.current;
    if (!audio || !currentStation) return;

    // Clean up commercial state
    setIsPlayingAd(false);
    setCanSkipAd(false);
    setAdTimeLeft(0);
    
    if (skipTimerRef.current) {
      clearTimeout(skipTimerRef.current);
      skipTimerRef.current = null;
    }
    if (adTimerRef.current) {
      clearInterval(adTimerRef.current);
      adTimerRef.current = null;
    }

    try {
      // Stop current audio
      audio.pause();
      audio.src = '';

      // Load radio station
      const streamUrl = currentStation.url_resolved || currentStation.url;
      audio.src = streamUrl;
      audio.volume = isMuted ? 0 : volume;
      audio.load();

      // Play the station
      await audio.play();
    } catch (error) {
      console.error('Failed to play radio station:', error);
    }
  };

  const skipAd = () => {
    if (!canSkipAd) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    // Stop the commercial
    audio.pause();
    
    // Play the radio station
    playRadioStation();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
      if (adTimerRef.current) clearInterval(adTimerRef.current);
    };
  }, []);

  if (!currentStation) {
    return (
      <div className="bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border-t border-white/10 p-6 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-center text-white/60">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Nenhuma estação selecionada</p>
              <p className="text-sm text-white/40">Escolha uma rádio para começar a ouvir</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl border-t border-white/10 p-6 shadow-2xl">
      <audio ref={audioRef} />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Station Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="flex-shrink-0 relative">
              {currentStation.favicon ? (
                <img
                  src={currentStation.favicon}
                  alt={currentStation.name}
                  className="w-16 h-16 rounded-xl object-cover bg-white/10 shadow-lg"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <Radio className="w-8 h-8 text-white" />
                </div>
              )}
              
              {/* Playing indicator */}
              {isPlaying && !isPlayingAd && (
                <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full p-1.5 shadow-lg">
                  <Music className="w-3 h-3 text-white animate-pulse" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-white font-bold text-xl truncate mb-1">{currentStation.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-white/70">
                {currentStation.country && (
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span className="font-medium">{currentStation.country}</span>
                  </div>
                )}
                {currentStation.clickcount > 0 && (
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-green-400" />
                    <span className="font-medium">{currentStation.clickcount.toLocaleString()}</span>
                  </div>
                )}
                {currentStation.bitrate > 0 && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="font-medium">{currentStation.bitrate} kbps</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-6">
            {/* Play/Pause Button */}
            <button
              onClick={onTogglePlay}
              disabled={isLoading || isPlayingAd}
              className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 shadow-xl shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading || isPlayingAd ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-7 h-7" />
              ) : (
                <Play className="w-7 h-7 ml-0.5" />
              )}
            </button>

            {/* Volume Controls */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onToggleMute}
                className="text-white/80 hover:text-white transition-colors p-3 hover:bg-white/10 rounded-xl"
                disabled={isPlayingAd}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <div className="w-32">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted || isPlayingAd ? 0 : volume}
                  onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  disabled={isPlayingAd}
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(isMuted || isPlayingAd ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted || isPlayingAd ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ad Controls */}
        {isPlayingAd && (
          <div className="mt-6 flex flex-col items-center justify-center space-y-3 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-400/30">
            <div className="text-yellow-300 font-semibold flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-lg">
                Reproduzindo anúncio... {adTimeLeft > 0 ? `${adTimeLeft}s restantes` : 'Carregando...'}
              </span>
            </div>
            {canSkipAd && (
              <button
                onClick={skipAd}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black font-bold px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:scale-105"
              >
                <XCircle className="w-4 h-4" />
                <span>Pular Anúncio</span>
              </button>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-300 text-center bg-red-500/20 border border-red-400/30 rounded-xl p-3">
            {error}
          </div>
        )}

        {/* Live Status */}
        {!isPlayingAd && isPlaying && !isLoading && (
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl px-4 py-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="text-green-300 font-semibold">TRANSMISSÃO AO VIVO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};