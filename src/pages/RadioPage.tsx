import React, { useState, useEffect } from 'react';
import { Song } from '../types/music';
import { Radio, Play, Pause, Volume2, Users, Clock, Music } from 'lucide-react';
import { musicApi } from '../services/musicApi';

interface RadioPageProps {
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  currentSong: Song | null;
  isLoading: boolean;
}

const RadioPage: React.FC<RadioPageProps> = ({
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  currentSong,
  isLoading,
}) => {
  const [radioStations, setRadioStations] = useState<{ [key: string]: Song[] }>({});
  const [activeStation, setActiveStation] = useState<string>('sertanejo');
  const [stationLoading, setStationLoading] = useState(false);

  const stations = [
    {
      id: 'sertanejo',
      name: 'Rádio Sertanejo',
      description: 'O melhor do sertanejo brasileiro 24h',
      color: 'from-green-500 to-green-700',
      emoji: '🤠',
      query: 'sertanejo brasileiro hits',
    },
    {
      id: 'funk',
      name: 'Rádio Funk Brasil',
      description: 'Funk carioca e brasileiro non-stop',
      color: 'from-yellow-500 to-orange-500',
      emoji: '🎵',
      query: 'funk brasileiro 2024',
    },
    {
      id: 'mpb',
      name: 'Rádio MPB',
      description: 'Música Popular Brasileira clássica e moderna',
      color: 'from-blue-500 to-purple-500',
      emoji: '🎼',
      query: 'mpb música popular brasileira',
    },
    {
      id: 'pagode',
      name: 'Rádio Pagode',
      description: 'Pagode e samba para animar o dia',
      color: 'from-red-500 to-pink-500',
      emoji: '🥁',
      query: 'pagode samba brasileiro',
    },
    {
      id: 'forro',
      name: 'Rádio Forró',
      description: 'Forró pé de serra e eletrônico',
      color: 'from-orange-500 to-red-500',
      emoji: '🪗',
      query: 'forró brasileiro',
    },
    {
      id: 'rock',
      name: 'Rádio Rock Nacional',
      description: 'Rock brasileiro de todas as épocas',
      color: 'from-gray-600 to-gray-800',
      emoji: '🎸',
      query: 'rock nacional brasileiro',
    },
    {
      id: 'axe',
      name: 'Rádio Axé',
      description: 'Axé music direto da Bahia',
      color: 'from-pink-500 to-purple-500',
      emoji: '🎊',
      query: 'axé música baiana',
    },
    {
      id: 'bossa',
      name: 'Rádio Bossa Nova',
      description: 'Bossa nova e jazz brasileiro',
      color: 'from-purple-500 to-indigo-500',
      emoji: '🎷',
      query: 'bossa nova brasileiro',
    },
  ];

  useEffect(() => {
    loadRadioStations();
  }, []);

  const loadRadioStations = async () => {
    setStationLoading(true);
    try {
      const stationData: { [key: string]: Song[] } = {};
      
      for (const station of stations) {
        const songs = await musicApi.searchSongs(station.query, 50);
        stationData[station.id] = songs;
      }
      
      setRadioStations(stationData);
    } catch (error) {
      console.error('Error loading radio stations:', error);
    } finally {
      setStationLoading(false);
    }
  };

  const playStation = (stationId: string) => {
    const songs = radioStations[stationId];
    if (songs && songs.length > 0) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      onPlaySong(songs[randomIndex], songs);
      setActiveStation(stationId);
    }
  };

  const currentStation = stations.find(s => s.id === activeStation);
  const currentStationSongs = radioStations[activeStation] || [];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Radio className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                📻 Rádio Brasil
              </h1>
              <p className="text-xl text-red-100">
                Estações de rádio brasileiras 24 horas no ar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Radio Stations Grid */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <Radio className="w-6 md:w-8 h-6 md:h-8 text-red-400" />
          📡 Estações Disponíveis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stations.map((station) => (
            <div
              key={station.id}
              className={`
                bg-gradient-to-br ${station.color}
                rounded-2xl p-6 text-white shadow-lg hover:shadow-xl
                transition-all duration-200 cursor-pointer
                ${activeStation === station.id ? 'ring-4 ring-white/30 scale-105' : 'hover:scale-105'}
              `}
              onClick={() => playStation(station.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Radio className="w-6 h-6" />
                </div>
                <span className="text-2xl">{station.emoji}</span>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{station.name}</h3>
              <p className="text-white/80 text-sm mb-4">{station.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">
                    {radioStations[station.id]?.length || 0} músicas
                  </span>
                </div>
                
                <button className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors">
                  {activeStation === station.id && currentSong ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Now Playing Station */}
      {currentStation && currentStationSongs.length > 0 && (
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
            <Music className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
            🎵 Tocando Agora: {currentStation.name}
          </h2>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Próximas Músicas</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {currentStationSongs.slice(0, 10).map((song, index) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => onPlaySong(song, currentStationSongs)}
                    >
                      <div className="text-gray-400 w-6 text-center text-sm">
                        {index + 1}
                      </div>
                      <img
                        src={song.image?.[0]?.url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                        alt={song.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{song.name}</h4>
                        <p className="text-sm text-gray-400 truncate">
                          {song.artists.primary.map(a => a.name).join(', ')}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(song);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isFavorite(song.id) 
                            ? 'text-red-400 hover:text-red-300' 
                            : 'text-gray-400 hover:text-red-400'
                        }`}
                      >
                        ❤️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-4">Informações da Estação</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${currentStation.color} rounded-full flex items-center justify-center`}>
                      <Radio className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">{currentStation.name}</h4>
                      <p className="text-sm text-gray-400">{currentStation.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total de Músicas:</span>
                      <span className="text-white">{currentStationSongs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duração Total:</span>
                      <span className="text-white">
                        {Math.floor(currentStationSongs.reduce((acc, song) => acc + song.duration, 0) / 3600)}h
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400">🔴 AO VIVO</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Loading State */}
      {stationLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
          <p className="text-lg">Carregando estações de rádio...</p>
        </div>
      )}
    </div>
  );
};

export default RadioPage;