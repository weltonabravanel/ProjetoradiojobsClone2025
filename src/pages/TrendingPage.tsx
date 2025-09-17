import React from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { TrendingUp, PlayCircle, Siren as Fire } from 'lucide-react';

interface TrendingPageProps {
  trendingSongs: Song[];
  currentSong: Song | null;
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  isLoading: boolean;
}

const TrendingPage: React.FC<TrendingPageProps> = ({
  trendingSongs,
  currentSong,
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  isLoading,
}) => {
  const playAllTrending = () => {
    if (trendingSongs.length > 0) {
      onPlaySong(trendingSongs[0], trendingSongs);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl h-48"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white/10 aspect-square rounded-lg mb-3"></div>
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-3 bg-white/10 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Fire className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                🔥 Em Alta no Brasil
              </h1>
              <p className="text-xl text-red-100">
                As músicas brasileiras mais ouvidas do momento
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={playAllTrending}
              className="flex items-center gap-3 bg-white text-red-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <PlayCircle className="w-5 h-5" />
              Tocar Top Trending
            </button>
            <div className="flex items-center gap-2 text-white/80">
              <TrendingUp className="w-5 h-5" />
              <span>Atualizado diariamente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Charts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <TrendingUp className="w-6 md:w-8 h-6 md:h-8 text-red-400" />
            📈 Top 50 Brasil
          </h2>
          <div className="text-sm text-gray-400">
            Baseado em reproduções e engajamento
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trendingSongs.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              showIndex={true}
              index={index + 1}
              badge={index < 3 ? "TOP" : index < 10 ? "HOT" : "TRENDING"}
              badgeColor={
                index < 3 ? "bg-yellow-600" : 
                index < 10 ? "bg-red-600" : 
                "bg-orange-600"
              }
              onClick={() => onPlaySong(song, trendingSongs)}
              onToggleFavorite={() => onToggleFavorite(song)}
            />
          ))}
        </div>
      </div>

      {/* Trending Stats */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📊 Estatísticas do Trending
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{trendingSongs.length}</div>
            <div className="text-sm text-gray-400">Músicas em Alta</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {new Set(trendingSongs.flatMap(s => s.artists.primary.map(a => a.name))).size}
            </div>
            <div className="text-sm text-gray-400">Artistas Únicos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Math.floor(trendingSongs.reduce((acc, song) => acc + song.duration, 0) / 60)}
            </div>
            <div className="text-sm text-gray-400">Minutos de Música</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">🇧🇷</div>
            <div className="text-sm text-gray-400">100% Brasil</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;