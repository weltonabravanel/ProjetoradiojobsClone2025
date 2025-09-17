import React from 'react';
import { Play, Pause, Heart, MoreVertical, Clock, Plus } from 'lucide-react';
import { Song } from '../types/music';
import { getImageUrl, formatTime } from '../utils/audioUtils';

interface SongCardProps {
  song: Song;
  isPlaying?: boolean;
  isFavorite?: boolean;
  showIndex?: boolean;
  index?: number;
  size?: 'small' | 'medium' | 'large';
  layout?: 'card' | 'list';
  onClick: () => void;
  onToggleFavorite: () => void;
  onAddToQueue?: () => void;
  badge?: string;
  badgeColor?: string;
}

const SongCard: React.FC<SongCardProps> = ({
  song,
  isPlaying = false,
  isFavorite = false,
  showIndex = false,
  index,
  size = 'medium',
  layout = 'card',
  onClick,
  onToggleFavorite,
  onAddToQueue,
  badge,
  badgeColor = 'bg-blue-600',
}) => {
  const sizeClasses = {
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6',
  };

  const imageClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20',
  };

  if (layout === 'list') {
    return (
      <div className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 rounded-xl p-4 group">
        <div className="flex items-center gap-4">
          {showIndex && (
            <div className={`text-gray-400 w-6 text-center text-sm ${isPlaying ? 'text-green-400' : ''}`}>
              {isPlaying ? '♪' : index}
            </div>
          )}
          
          <div className="relative cursor-pointer" onClick={onClick}>
            <img
              src={getImageUrl(song)}
              alt={song.name}
              className={`${imageClasses[size]} rounded-lg object-cover`}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
            <h3 className={`font-medium text-white truncate ${isPlaying ? 'text-green-400' : ''}`}>
              {song.name}
            </h3>
            <p className="text-sm text-gray-400 truncate">
              {song.artists.primary.map((artist) => artist.name).join(', ')}
            </p>
          </div>

          <div className="hidden md:block max-w-32">
            <p className="text-sm text-gray-400 truncate">{song.album.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            {onAddToQueue && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToQueue();
                }}
                className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}

            <span className="text-xs text-gray-400 hidden sm:inline w-12 text-right">
              {formatTime(song.duration)}
            </span>

            <button className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={`
        bg-white/5 border border-white/10 hover:bg-white/10 
        transition-all duration-200 cursor-pointer group rounded-xl
        hover:scale-105 hover:shadow-lg hover:shadow-green-500/10
        ${sizeClasses[size]}
      `}
    >
      <div className="relative mb-3">
        <img
          src={getImageUrl(song)}
          alt={song.name}
          className="w-full aspect-square rounded-lg object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop';
          }}
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </div>

        {/* Play Button */}
        <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-green-500 hover:bg-green-600 rounded-full p-2 shadow-lg hover:scale-110">
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Badge */}
        {badge && (
          <div className={`absolute top-2 left-2 ${badgeColor} text-white text-xs px-2 py-1 rounded-full font-medium`}>
            {badge}
          </div>
        )}

        {/* Index */}
        {showIndex && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            #{index}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h4 className={`font-medium truncate text-sm md:text-base ${isPlaying ? 'text-green-400' : 'text-white'}`}>
          {song.name}
        </h4>
        <p className="text-xs md:text-sm text-gray-400 truncate">
          {song.artists.primary.map((artist) => artist.name).join(', ')}
        </p>
        
        {size === 'large' && (
          <p className="text-xs text-gray-500 truncate">{song.album.name}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`p-1 rounded-full transition-colors ${
            isFavorite 
              ? 'text-red-400 hover:text-red-300' 
              : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        <span className="text-xs text-gray-400">
          {formatTime(song.duration)}
        </span>
      </div>
    </div>
  );
};

export default SongCard;