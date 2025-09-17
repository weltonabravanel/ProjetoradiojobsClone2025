import React from 'react';
import { Heart, Play, Pause, MapPin, Users, Zap } from 'lucide-react';
import { RadioStation } from '../types/station';
import { useRadio } from '../contexts/RadioContext';

interface StationCardProps {
  station: RadioStation;
}

const StationCard: React.FC<StationCardProps> = ({ station }) => {
  const { 
    currentStation, 
    setCurrentStation, 
    isPlaying, 
    togglePlay,
    toggleFavorite,
    isFavorite
  } = useRadio();
  
  const isCurrentStation = currentStation?.stationuuid === station.stationuuid;
  
  const handlePlay = () => {
    if (isCurrentStation) {
      togglePlay();
    } else {
      setCurrentStation(station);
    }
  };
  
  const getTags = () => {
    if (!station.tags) return [];
    return station.tags.split(',').slice(0, 2);
  };
  
  const getStationImage = () => {
    if (station.favicon && station.favicon !== '') {
      return (
        <img 
          src={station.favicon} 
          alt={station.name} 
          className="h-20 w-20 object-cover rounded-2xl shadow-lg border-2 border-white/20"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = `https://via.placeholder.com/80/3b82f6/ffffff?text=${station.name.charAt(0)}`;
          }}
        />
      );
    }
    
    return (
      <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl rounded-2xl shadow-lg border-2 border-white/20">
        {station.name.charAt(0)}
      </div>
    );
  };
  
  return (
    <div className={`station-card group hover-lift ${isCurrentStation ? 'ring-4 ring-blue-500/50 bg-white/95' : ''}`}>
      <div className="flex gap-4">
        <div className="relative">
          {getStationImage()}
          {isCurrentStation && isPlaying && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full p-1">
              <div className="wave-animation">
                <div className="wave-bar bg-white"></div>
                <div className="wave-bar bg-white"></div>
                <div className="wave-bar bg-white"></div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {station.name}
          </h3>
          
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
            <MapPin size={14} className="text-blue-500" />
            <span>{station.country}</span>
            {station.language && (
              <>
                <span className="text-gray-400">•</span>
                <span>{station.language}</span>
              </>
            )}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-2">
            {getTags().map((tag, index) => (
              <span key={index} className="tag text-xs">
                {tag.trim()}
              </span>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePlay}
                className={`relative overflow-hidden p-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-110 shadow-lg ${
                  isCurrentStation && isPlaying 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse-glow' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                }`}
              >
                {isCurrentStation && isPlaying ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} />
                )}
                <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button 
                onClick={() => toggleFavorite(station)}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isFavorite(station.stationuuid) 
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <Heart size={18} fill={isFavorite(station.stationuuid) ? "currentColor" : "none"} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {station.votes > 0 && (
                <div className="flex items-center gap-1">
                  <Zap size={12} className="text-yellow-500" />
                  <span>{station.votes}</span>
                </div>
              )}
              {station.clickcount > 0 && (
                <div className="flex items-center gap-1">
                  <Users size={12} className="text-blue-500" />
                  <span>{station.clickcount}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationCard;