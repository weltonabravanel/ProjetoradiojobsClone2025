import React from 'react';
import { Loader2, Radio } from 'lucide-react';
import { RadioStation } from '../types/radio';
import { StationCard } from './StationCard';

interface StationGridProps {
  stations: RadioStation[];
  isLoading: boolean;
  error: string | null;
  currentStation: RadioStation | null;
  onPlayStation: (station: RadioStation) => void;
  onToggleFavorite?: (station: RadioStation) => void;
  favorites?: string[];
}

export const StationGrid: React.FC<StationGridProps> = ({
  stations,
  isLoading,
  error,
  currentStation,
  onPlayStation,
  onToggleFavorite,
  favorites = []
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white/70 text-lg">Loading radio stations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Radio className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 text-lg font-medium mb-2">Failed to load stations</p>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Radio className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <p className="text-white/70 text-lg font-medium mb-2">No stations found</p>
          <p className="text-white/50">Try adjusting your search criteria</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stations.map((station) => (
        <StationCard
          key={station.stationuuid}
          station={station}
          isPlaying={currentStation?.stationuuid === station.stationuuid}
          onPlay={onPlayStation}
          onToggleFavorite={onToggleFavorite}
          isFavorite={favorites.includes(station.stationuuid)}
        />
      ))}
    </div>
  );
};