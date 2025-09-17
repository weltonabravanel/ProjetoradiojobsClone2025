import React, { useState, useEffect } from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { Users, PlayCircle, MapPin, Music } from 'lucide-react';
import { musicApi } from '../services/musicApi';

interface RegionalPageProps {
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  currentSong: Song | null;
  isLoading: boolean;
}

const RegionalPage: React.FC<RegionalPageProps> = ({
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  currentSong,
  isLoading,
}) => {
  const [regionalSongs, setRegionalSongs] = useState<{ [key: string]: Song[] }>({});
  const [loading, setLoading] = useState(false);

  const regions = [
    {
      id: 'nordeste',
      name: 'Nordeste',
      description: 'Forró, axé, baião e repente',
      color: 'from-orange-500 to-red-500',
      emoji: '🌵',
      query: 'música nordestina brasileira forró axé',
      states: ['PE', 'BA', 'CE', 'RN', 'PB', 'SE', 'AL', 'MA', 'PI'],
    },
    {
      id: 'sudeste',
      name: 'Sudeste',
      description: 'Samba, bossa nova, funk carioca',
      color: 'from-blue-500 to-purple-500',
      emoji: '🏙️',
      query: 'música sudeste brasil samba bossa nova funk carioca',
      states: ['SP', 'RJ', 'MG', 'ES'],
    },
    {
      id: 'sul',
      name: 'Sul',
      description: 'Música gaúcha, vaneira, chamamé',
      color: 'from-green-500 to-teal-500',
      emoji: '🐎',
      query: 'música gaúcha sulista vaneira chamamé',
      states: ['RS', 'SC', 'PR'],
    },
    {
      id: 'centro-oeste',
      name: 'Centro-Oeste',
      description: 'Sertanejo, música pantaneira',
      color: 'from-yellow-500 to-orange-500',
      emoji: '🌾',
      query: 'música centro oeste brasil sertanejo pantaneira',
      states: ['MT', 'MS', 'GO', 'DF'],
    },
    {
      id: 'norte',
      name: 'Norte',
      description: 'Boi-bumbá, carimbó, música amazônica',
      color: 'from-emerald-500 to-green-500',
      emoji: '🌳',
      query: 'música amazônica norte brasil boi bumbá carimbó',
      states: ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO'],
    },
  ];

  useEffect(() => {
    loadRegionalMusic();
  }, []);

  const loadRegionalMusic = async () => {
    setLoading(true);
    try {
      const regionalData: { [key: string]: Song[] } = {};
      
      for (const region of regions) {
        const songs = await musicApi.searchSongs(region.query, 30);
        regionalData[region.id] = songs;
      }
      
      setRegionalSongs(regionalData);
    } catch (error) {
      console.error('Error loading regional music:', error);
    } finally {
      setLoading(false);
    }
  };

  const playRegion = (regionId: string) => {
    const songs = regionalSongs[regionId];
    if (songs && songs.length > 0) {
      onPlaySong(songs[0], songs);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl h-48"></div>
        </div>
        {[...Array(5)].map((_, i) => (
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
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                🗺️ Música Regional
              </h1>
              <p className="text-xl text-green-100">
                Explore os sons únicos de cada região do Brasil
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Regions Overview */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <MapPin className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
           Regiões do Brasil
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {regions.map((region) => (
            <div
              key={region.id}
              className={`
                bg-gradient-to-br ${region.color}
                rounded-2xl p-6 text-white shadow-lg hover:shadow-xl
                transition-all duration-200 cursor-pointer hover:scale-105
              `}
              onClick={() => playRegion(region.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <span className="text-2xl">{region.emoji}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{region.name}</h3>
              <p className="text-white/80 text-sm mb-4">{region.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {region.states.slice(0, 4).map((state) => (
                    <span key={state} className="bg-white/20 text-xs px-2 py-1 rounded">
                      {state}
                    </span>
                  ))}
                  {region.states.length > 4 && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded">
                      +{region.states.length - 4}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 text-white/60">
                  <Music className="w-4 h-4" />
                  <span className="text-sm">
                    {regionalSongs[region.id]?.length || 0} músicas
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Regional Music Sections */}
      {regions.map((region) => {
        const songs = regionalSongs[region.id] || [];
        if (songs.length === 0) return null;

        return (
          <section key={region.id}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <span className="text-2xl">{region.emoji}</span>
                {region.name}
              </h2>
              <button 
                onClick={() => playRegion(region.id)}
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
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
                  badge={region.name.toUpperCase()}
                  badgeColor={`bg-gradient-to-r ${region.color}`}
                  onClick={() => onPlaySong(song, songs)}
                  onToggleFavorite={() => onToggleFavorite(song)}
                />
              ))}
            </div>
          </section>
        );
      })}

      {/* Regional Stats */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📊 Estatísticas Regionais
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {regions.map((region) => (
            <div key={region.id} className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {regionalSongs[region.id]?.length || 0}
              </div>
              <div className="text-sm text-gray-400">{region.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cultural Info */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🎭 Diversidade Cultural Brasileira
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">🌟 Riqueza Musical</h4>
            <p>Cada região do Brasil possui características musicais únicas, influenciadas pela geografia, história e cultura local.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🎵 Instrumentos Típicos</h4>
            <p>Desde a sanfona nordestina até o acordeão gaúcho, cada região tem seus instrumentos característicos.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🎤 Sotaques Musicais</h4>
            <p>A diversidade linguística se reflete na música, criando estilos únicos em cada canto do país.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🎊 Festivais Regionais</h4>
            <p>Cada região celebra sua música através de festivais tradicionais que preservam a cultura local.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionalPage;