import React, { useState, useEffect } from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { Calendar, PlayCircle, Star, TrendingUp, Music } from 'lucide-react';
import { musicApi } from '../services/musicApi';

interface NewReleasesPageProps {
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  currentSong: Song | null;
  isLoading: boolean;
}

const NewReleasesPage: React.FC<NewReleasesPageProps> = ({
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  currentSong,
  isLoading,
}) => {
  const [newReleases, setNewReleases] = useState<Song[]>([]);
  const [weeklyReleases, setWeeklyReleases] = useState<Song[]>([]);
  const [monthlyReleases, setMonthlyReleases] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNewReleases();
  }, []);

  const loadNewReleases = async () => {
    setLoading(true);
    try {
      // Load different categories of new releases
      const [weekly, monthly, general] = await Promise.all([
        musicApi.searchSongs('lançamentos semana brasil 2024', 20),
        musicApi.searchSongs('lançamentos mês brasil 2024', 30),
        musicApi.getNewReleases(),
      ]);

      setWeeklyReleases(weekly);
      setMonthlyReleases(monthly);
      setNewReleases(general);
    } catch (error) {
      console.error('Error loading new releases:', error);
    } finally {
      setLoading(false);
    }
  };

  const playAllReleases = () => {
    if (newReleases.length > 0) {
      onPlaySong(newReleases[0], newReleases);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl h-48"></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 bg-white/10 rounded-lg w-1/3 animate-pulse"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="animate-pulse">
                  <div className="bg-white/10 aspect-square rounded-lg mb-3"></div>
                  <div className="h-4 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 bg-white/10 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                🆕 Novos Lançamentos
              </h1>
              <p className="text-xl text-blue-100">
                As mais novas músicas brasileiras que acabaram de sair
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={playAllReleases}
              className="flex items-center gap-3 bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <PlayCircle className="w-5 h-5" />
              Tocar Novidades
            </button>
            <div className="flex items-center gap-2 text-white/80">
              <Star className="w-5 h-5" />
              <span>Atualizado diariamente</span>
            </div>
          </div>
        </div>
      </div>

      {/* This Week's Releases */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <TrendingUp className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
            🔥 Lançamentos da Semana
          </h2>
          <button 
            onClick={() => {
              if (weeklyReleases.length > 0) {
                onPlaySong(weeklyReleases[0], weeklyReleases);
              }
            }}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Tocar Tudo
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {weeklyReleases.slice(0, 12).map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              showIndex={true}
              index={index + 1}
              badge="ESTA SEMANA"
              badgeColor="bg-green-600"
              onClick={() => onPlaySong(song, weeklyReleases)}
              onToggleFavorite={() => onToggleFavorite(song)}
            />
          ))}
        </div>
      </section>

      {/* This Month's Releases */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Calendar className="w-6 md:w-8 h-6 md:h-8 text-blue-400" />
            📅 Lançamentos do Mês
          </h2>
          <button 
            onClick={() => {
              if (monthlyReleases.length > 0) {
                onPlaySong(monthlyReleases[0], monthlyReleases);
              }
            }}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Ver Mais
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {monthlyReleases.slice(0, 15).map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              badge="ESTE MÊS"
              badgeColor="bg-blue-600"
              onClick={() => onPlaySong(song, monthlyReleases)}
              onToggleFavorite={() => onToggleFavorite(song)}
            />
          ))}
        </div>
      </section>

      {/* All New Releases */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Music className="w-6 md:w-8 h-6 md:h-8 text-purple-400" />
            🎵 Todos os Lançamentos
          </h2>
          <button 
            onClick={playAllReleases}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Tocar Tudo
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {newReleases.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              badge="NOVO"
              badgeColor="bg-purple-600"
              onClick={() => onPlaySong(song, newReleases)}
              onToggleFavorite={() => onToggleFavorite(song)}
            />
          ))}
        </div>
      </section>

      {/* Release Stats */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📊 Estatísticas dos Lançamentos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{weeklyReleases.length}</div>
            <div className="text-sm text-gray-400">Esta Semana</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{monthlyReleases.length}</div>
            <div className="text-sm text-gray-400">Este Mês</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{newReleases.length}</div>
            <div className="text-sm text-gray-400">Total de Novidades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">🇧🇷</div>
            <div className="text-sm text-gray-400">100% Nacional</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReleasesPage;