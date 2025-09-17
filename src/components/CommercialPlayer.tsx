import React from 'react';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';

interface Commercial {
  title: string;
  advertiser: string;
  image: string;
}

interface CommercialPlayerProps {
  commercial: Commercial;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  canSkip: boolean;
  onPlayPause: () => void;
  onSkip: () => void;
}

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const CommercialPlayer: React.FC<CommercialPlayerProps> = ({
  commercial,
  isPlaying,
  currentTime,
  duration,
  canSkip,
  onPlayPause,
  onSkip,
}) => {
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const remainingTime = Math.max(0, duration - currentTime);

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[60] flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Commercial Content */}
        <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl p-8 text-center mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Volume2 className="w-10 h-10 text-white" />
          </div>
          
          <div className="mb-4">
            <div className="bg-white/20 text-white text-xs px-3 py-1 rounded-full inline-block mb-2">
              📢 PUBLICIDADE
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{commercial.title}</h2>
            <p className="text-yellow-100">{commercial.advertiser}</p>
          </div>

          <img
            src={commercial.image}
            alt={commercial.advertiser}
            className="w-32 h-32 rounded-xl object-cover mx-auto mb-4"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
            }}
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mt-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <button
            onClick={onPlayPause}
            className="bg-white text-orange-600 hover:bg-gray-100 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          {canSkip && (
            <button
              onClick={onSkip}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <SkipForward className="w-5 h-5" />
              Pular Anúncio
            </button>
          )}
        </div>

        {/* Skip Timer */}
        {!canSkip && remainingTime > 0 && (
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Você pode pular este anúncio em {Math.ceil(Math.max(0, 5 - currentTime))} segundos
            </p>
          </div>
        )}

        {canSkip && (
          <div className="text-center">
            <p className="text-green-400 text-sm">
              ✅ Agora você pode pular este anúncio
            </p>
          </div>
        )}

        {/* Rádio BR Branding */}
        <div className="text-center mt-6 pt-6 border-t border-white/20">
          <p className="text-gray-400 text-xs">
            📻 Rádio Jobs - Sua música, seu mundo
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommercialPlayer;