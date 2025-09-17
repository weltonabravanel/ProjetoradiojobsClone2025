import React, { useState, useEffect } from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { Award, PlayCircle, Star, Clock, Music } from 'lucide-react';
import { musicApi } from '../services/musicApi';

interface ClassicsPageProps {
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  currentSong: Song | null;
  isLoading: boolean;
}

const ClassicsPage: React.FC<ClassicsPageProps> = ({
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  currentSong,
  isLoading,
}) => {
  const [classicSongs, setClassicSongs] = useState<Song[]>([]);
  const [bossaNovaClassics, setBossaNovaClassics] = useState<Song[]>([]);
  const [mpbClassics, setMpbClassics] = useState<Song[]>([]);
  const [sambaClassics, setSambaClassics] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  const classicArtists = [
    'Tom Jobim', 'Vinicius de Moraes', 'João Gilberto', 'Elis Regina',
    'Milton Nascimento', 'Chico Buarque', 'Caetano Veloso', 'Gilberto Gil',
    'Maria Bethânia', 'Gal Costa', 'Roberto Carlos', 'Djavan',
    'Tim Maia', 'Jorge Ben Jor', 'Dorival Caymmi', 'Carmen Miranda'
  ];

  useEffect(() => {
    loadClassics();
  }, []);

  const loadClassics = async () => {
    setLoading(true);
    try {
      // Load different categories of classics
      const [general, bossaNova, mpb, samba] = await Promise.all([
        musicApi.getClassicSongs(),
        musicApi.searchSongs('bossa nova clássicos brasileiros', 20),
        musicApi.searchSongs('mpb clássicos música popular brasileira', 25),
        musicApi.searchSongs('samba clássicos brasileiros', 20),
      ]);

      setClassicSongs(general);
      setBossaNovaClassics(bossaNova);
      setMpbClassics(mpb);
      setSambaClassics(samba);
    } catch (error) {
      console.error('Error loading classics:', error);
    } finally {
      setLoading(false);
    }
  };

  const playAllClassics = () => {
    if (classicSongs.length > 0) {
      onPlaySong(classicSongs[0], classicSongs);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl h-48"></div>
        </div>
        {[...Array(4)].map((_, i) => (
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
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                🏆 Clássicos Brasileiros
              </h1>
              <p className="text-xl text-yellow-100">
                Os maiores sucessos atemporais da música brasileira
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={playAllClassics}
              className="flex items-center gap-3 bg-white text-yellow-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <PlayCircle className="w-5 h-5" />
              Tocar Clássicos
            </button>
            <div className="flex items-center gap-2 text-white/80">
              <Star className="w-5 h-5" />
              <span>Sucessos de todas as épocas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bossa Nova Classics */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Music className="w-6 md:w-8 h-6 md:h-8 text-purple-400" />
            🎷 Clássicos da Bossa Nova
          </h2>
          <button 
            onClick={() => {
              if (bossaNovaClassics.length > 0) {
                onPlaySong(bossaNovaClassics[0], bossaNovaClassics);
              }
            }}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Tocar Tudo
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {bossaNovaClassics.slice(0, 12).map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              showIndex={true}
              index={index + 1}
              badge="BOSSA NOVA"
              badgeColor="bg-purple-600"
              onClick={() => onPlaySong(song, bossaNovaClassics)}
              onToggleFavorite={() => onToggleFavorite(song)}
            />
          ))}
        </div>
      </section>

      {/* MPB Classics */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Star className="w-6 md:w-8 h-6 md:h-8 text-blue-400" />
            🎼 Clássicos da MPB
          </h2>
          <button 
            onClick={() => {
              if (mpbClassics.length > 0) {
                onPlaySong(mpbClassics[0], mpbClassics);
              }
            }}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Ver Mais
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mpbClassics.slice(0, 15).map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              badge="MPB"
              badgeColor="bg-blue-600"
              onClick={() => onPlaySong(song, mpbClassics)}
              onToggleFavorite={() => onToggleFavorite(song)}
            />
          ))}
        </div>
      </section>

      {/* Samba Classics */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Clock className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
            🥁 Clássicos do Samba
          </h2>
          <button 
            onClick={() => {
              if (sambaClassics.length > 0) {
                onPlaySong(sambaClassics[0], sambaClassics);
              }
            }}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Tocar Tudo
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sambaClassics.slice(0, 15).map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              badge="SAMBA"
              badgeColor="bg-green-600"
              onClick={() => onPlaySong(song, sambaClassics)}
              onToggleFavorite={() => onToggleFavorite(song)}
            />
          ))}
        </div>
      </section>

      {/* All Classics */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Award className="w-6 md:w-8 h-6 md:h-8 text-yellow-400" />
            🏆 Todos os Clássicos
          </h2>
          <button 
            onClick={playAllClassics}
            className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Tocar Tudo
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {classicSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              badge="CLÁSSICO"
              badgeColor="bg-yellow-600"
              onClick={() => onPlaySong(song, classicSongs)}
              onToggleFavorite={() => onToggleFavorite(song)}
            />
          ))}
        </div>
      </section>

      {/* Classic Artists Hall of Fame */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🌟 Hall da Fama - Artistas Clássicos
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {classicArtists.slice(0, 8).map((artist) => (
            <div
              key={artist}
              className="text-center p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              onClick={() => {
                // Could implement artist search here
                console.log('Search for artist:', artist);
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xs font-medium text-white truncate">{artist}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Classics Stats */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📊 Estatísticas dos Clássicos
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{bossaNovaClassics.length}</div>
            <div className="text-sm text-gray-400">Bossa Nova</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{mpbClassics.length}</div>
            <div className="text-sm text-gray-400">MPB</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{sambaClassics.length}</div>
            <div className="text-sm text-gray-400">Samba</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{classicArtists.length}</div>
            <div className="text-sm text-gray-400">Artistas Lendários</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicsPage;