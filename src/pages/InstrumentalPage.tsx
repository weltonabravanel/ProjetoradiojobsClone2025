import React, { useState, useEffect } from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { Guitar, PlayCircle, Music, Piano, Drum } from 'lucide-react';
import { musicApi } from '../services/musicApi';

interface InstrumentalPageProps {
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  currentSong: Song | null;
  isLoading: boolean;
}

const InstrumentalPage: React.FC<InstrumentalPageProps> = ({
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  currentSong,
  isLoading,
}) => {
  const [instrumentalSongs, setInstrumentalSongs] = useState<{ [key: string]: Song[] }>({});
  const [loading, setLoading] = useState(false);

  const instrumentalCategories = [
    {
      id: 'violao',
      name: 'Violão Brasileiro',
      description: 'Violão clássico e fingerstyle brasileiro',
      color: 'from-amber-500 to-orange-500',
      emoji: '🎸',
      query: 'violão brasileiro instrumental',
      icon: Guitar,
    },
    {
      id: 'piano',
      name: 'Piano Brasileiro',
      description: 'Piano solo e música erudita brasileira',
      color: 'from-gray-600 to-gray-800',
      emoji: '🎹',
      query: 'piano brasileiro instrumental',
      icon: Piano,
    },
    {
      id: 'bossa-instrumental',
      name: 'Bossa Nova Instrumental',
      description: 'Bossa nova sem vocal, puro instrumental',
      color: 'from-purple-500 to-indigo-500',
      emoji: '🎷',
      query: 'bossa nova instrumental brasileiro',
      icon: Music,
    },
    {
      id: 'choro',
      name: 'Choro',
      description: 'Música instrumental brasileira tradicional',
      color: 'from-green-500 to-teal-500',
      emoji: '🪗',
      query: 'choro brasileiro instrumental',
      icon: Music,
    },
    {
      id: 'jazz-brasileiro',
      name: 'Jazz Brasileiro',
      description: 'Fusão de jazz com ritmos brasileiros',
      color: 'from-blue-500 to-cyan-500',
      emoji: '🎺',
      query: 'jazz brasileiro instrumental',
      icon: Music,
    },
    {
      id: 'percussao',
      name: 'Percussão Brasileira',
      description: 'Ritmos e percussão instrumental',
      color: 'from-red-500 to-pink-500',
      emoji: '🥁',
      query: 'percussão brasileira instrumental',
      icon: Drum,
    },
  ];

  useEffect(() => {
    loadInstrumentalMusic();
  }, []);

  const loadInstrumentalMusic = async () => {
    setLoading(true);
    try {
      const instrumentalData: { [key: string]: Song[] } = {};
      
      for (const category of instrumentalCategories) {
        const songs = await musicApi.searchSongs(category.query, 25);
        instrumentalData[category.id] = songs;
      }
      
      setInstrumentalSongs(instrumentalData);
    } catch (error) {
      console.error('Error loading instrumental music:', error);
    } finally {
      setLoading(false);
    }
  };

  const playCategory = (categoryId: string) => {
    const songs = instrumentalSongs[categoryId];
    if (songs && songs.length > 0) {
      onPlaySong(songs[0], songs);
    }
  };

  const playAllInstrumental = () => {
    const allSongs = Object.values(instrumentalSongs).flat();
    if (allSongs.length > 0) {
      onPlaySong(allSongs[0], allSongs);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl h-48"></div>
        </div>
        {[...Array(6)].map((_, i) => (
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
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Guitar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                🎸 Instrumental Brasileiro
              </h1>
              <p className="text-xl text-purple-100">
                A beleza da música brasileira sem palavras
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={playAllInstrumental}
              className="flex items-center gap-3 bg-white text-purple-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <PlayCircle className="w-5 h-5" />
              Tocar Instrumental
            </button>
            <div className="flex items-center gap-2 text-white/80">
              <Music className="w-5 h-5" />
              <span>Música pura, sem vocal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instrumental Categories */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <Music className="w-6 md:w-8 h-6 md:h-8 text-purple-400" />
          🎵 Categorias Instrumentais
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {instrumentalCategories.map((category) => (
            <div
              key={category.id}
              className={`
                bg-gradient-to-br ${category.color}
                rounded-2xl p-6 text-white shadow-lg hover:shadow-xl
                transition-all duration-200 cursor-pointer hover:scale-105
              `}
              onClick={() => playCategory(category.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <category.icon className="w-6 h-6" />
                </div>
                <span className="text-2xl">{category.emoji}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <p className="text-white/80 text-sm mb-4">{category.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <Music className="w-4 h-4" />
                  <span className="text-sm">
                    {instrumentalSongs[category.id]?.length || 0} músicas
                  </span>
                </div>
                
                <button className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors">
                  <PlayCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instrumental Music Sections */}
      {instrumentalCategories.map((category) => {
        const songs = instrumentalSongs[category.id] || [];
        if (songs.length === 0) return null;

        return (
          <section key={category.id}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <category.icon className="w-6 md:w-8 h-6 md:h-8 text-purple-400" />
                <span className="text-xl">{category.emoji}</span>
                {category.name}
              </h2>
              <button 
                onClick={() => playCategory(category.id)}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <PlayCircle className="w-5 h-5" />
                Tocar Tudo
              </button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {songs.slice(0, 12).map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  isPlaying={currentSong?.id === song.id}
                  isFavorite={isFavorite(song.id)}
                  showIndex={true}
                  index={index + 1}
                  badge="INSTRUMENTAL"
                  badgeColor="bg-purple-600"
                  onClick={() => onPlaySong(song, songs)}
                  onToggleFavorite={() => onToggleFavorite(song)}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Instrumental Info */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🎼 Sobre a Música Instrumental Brasileira
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">🎸 Tradição do Violão</h4>
            <p>O violão brasileiro tem uma tradição rica, com técnicas únicas desenvolvidas por mestres como Villa-Lobos e Baden Powell.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🎷 Choro - Patrimônio Cultural</h4>
            <p>O choro é considerado a primeira música popular urbana tipicamente brasileira, nascida no Rio de Janeiro no século XIX.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🎹 Fusão e Inovação</h4>
            <p>A música instrumental brasileira continua evoluindo, incorporando elementos do jazz, eletrônica e world music.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🥁 Ritmos Únicos</h4>
            <p>Os ritmos brasileiros como samba, bossa nova e baião criam uma base rítmica única para a música instrumental.</p>
          </div>
        </div>
      </div>

      {/* Instrumental Stats */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📊 Estatísticas Instrumentais
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {instrumentalCategories.map((category) => (
            <div key={category.id} className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {instrumentalSongs[category.id]?.length || 0}
              </div>
              <div className="text-xs text-gray-400">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstrumentalPage;