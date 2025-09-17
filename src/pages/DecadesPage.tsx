import React, { useState, useEffect } from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { Clock, PlayCircle, Calendar, Star, Music, Award } from 'lucide-react';
import { musicApi } from '../services/musicApi';

interface DecadesPageProps {
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  currentSong: Song | null;
  isLoading: boolean;
}

const DecadesPage: React.FC<DecadesPageProps> = ({
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  currentSong,
  isLoading,
}) => {
  const [decadesSongs, setDecadesSongs] = useState<{ [key: string]: Song[] }>({});
  const [loading, setLoading] = useState(false);
  const [activeDecade, setActiveDecade] = useState('2020s');

  const decades = [
    {
      id: '2020s',
      name: 'Anos 2020',
      period: '2020-2024',
      description: 'A era do streaming, piseiro, funk melody e sertanejo universitário',
      color: 'from-green-500 to-emerald-600',
      emoji: '🚀',
      query: 'música brasileira 2020 2021 2022 2023 2024',
      highlights: ['Piseiro', 'Funk Melody', 'Sertanejo Universitário', 'Pop Nacional'],
      artists: ['Gusttavo Lima', 'Anitta', 'Barões da Pisadinha', 'Luísa Sonza']
    },
    {
      id: '2010s',
      name: 'Anos 2010',
      period: '2010-2019',
      description: 'Explosão do sertanejo universitário e consolidação do funk',
      color: 'from-blue-500 to-cyan-600',
      emoji: '📱',
      query: 'música brasileira anos 2010 sertanejo universitário funk',
      highlights: ['Sertanejo Universitário', 'Funk Ostentação', 'Axé Pop', 'Rock Indie'],
      artists: ['Henrique e Juliano', 'Jorge e Mateus', 'Anitta', 'Ivete Sangalo']
    },
    {
      id: '2000s',
      name: 'Anos 2000',
      period: '2000-2009',
      description: 'Era do axé, pagode romântico e rock nacional alternativo',
      color: 'from-purple-500 to-pink-600',
      emoji: '💿',
      query: 'música brasileira anos 2000 axé pagode rock nacional',
      highlights: ['Axé Music', 'Pagode Romântico', 'Rock Nacional', 'Pop Rock'],
      artists: ['Ivete Sangalo', 'Thiaguinho', 'Capital Inicial', 'Skank']
    },
    {
      id: '1990s',
      name: 'Anos 90',
      period: '1990-1999',
      description: 'Explosão do axé, consolidação do rock nacional e pagode',
      color: 'from-orange-500 to-red-600',
      emoji: '📻',
      query: 'música brasileira anos 90 axé rock nacional pagode',
      highlights: ['Axé Baiano', 'Rock Nacional', 'Pagode', 'Sertanejo Romântico'],
      artists: ['Chiclete com Banana', 'Legião Urbana', 'Raça Negra', 'Leandro e Leonardo']
    },
    {
      id: '1980s',
      name: 'Anos 80',
      period: '1980-1989',
      description: 'Rock nacional, new wave brasileiro e música romântica',
      color: 'from-pink-500 to-purple-600',
      emoji: '🎸',
      query: 'música brasileira anos 80 rock nacional new wave',
      highlights: ['Rock Nacional', 'New Wave', 'Música Romântica', 'Pop Nacional'],
      artists: ['Legião Urbana', 'Cazuza', 'Roberto Carlos', 'Paralamas']
    },
    {
      id: '1970s',
      name: 'Anos 70',
      period: '1970-1979',
      description: 'MPB, disco brasileiro, rock progressivo e música de protesto',
      color: 'from-yellow-500 to-orange-600',
      emoji: '🌻',
      query: 'música brasileira anos 70 mpb disco rock progressivo',
      highlights: ['MPB', 'Disco Nacional', 'Rock Progressivo', 'Música de Protesto'],
      artists: ['Elis Regina', 'Milton Nascimento', 'Secos e Molhados', 'Rita Lee']
    },
    {
      id: '1960s',
      name: 'Anos 60',
      period: '1960-1969',
      description: 'Bossa nova, tropicália e jovem guarda',
      color: 'from-teal-500 to-blue-600',
      emoji: '🎷',
      query: 'música brasileira anos 60 bossa nova tropicália jovem guarda',
      highlights: ['Bossa Nova', 'Tropicália', 'Jovem Guarda', 'MPB Inicial'],
      artists: ['Tom Jobim', 'Caetano Veloso', 'Roberto Carlos', 'Elis Regina']
    },
    {
      id: 'classics',
      name: 'Clássicos',
      period: '1930-1959',
      description: 'Samba, marchinha, bolero e os primórdios da música popular',
      color: 'from-amber-500 to-yellow-600',
      emoji: '🎺',
      query: 'música brasileira clássica samba marchinha bolero',
      highlights: ['Samba', 'Marchinha', 'Bolero', 'Música Caipira'],
      artists: ['Carmen Miranda', 'Dorival Caymmi', 'Ary Barroso', 'Orlando Silva']
    }
  ];

  useEffect(() => {
    loadDecadesMusic();
  }, []);

  const loadDecadesMusic = async () => {
    setLoading(true);
    try {
      const decadesData: { [key: string]: Song[] } = {};
      
      for (const decade of decades) {
        const songs = await musicApi.searchSongs(decade.query, 25);
        decadesData[decade.id] = songs;
      }
      
      setDecadesSongs(decadesData);
    } catch (error) {
      console.error('Error loading decades music:', error);
    } finally {
      setLoading(false);
    }
  };

  const playDecade = (decadeId: string) => {
    const songs = decadesSongs[decadeId];
    if (songs && songs.length > 0) {
      onPlaySong(songs[0], songs);
    }
  };

  const currentDecadeData = decades.find(d => d.id === activeDecade);
  const currentDecadeSongs = decadesSongs[activeDecade] || [];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl h-48"></div>
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                ⏰ Viagem no Tempo
              </h1>
              <p className="text-xl text-indigo-100">
                Explore a evolução da música brasileira através das décadas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decades Timeline */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <Calendar className="w-6 md:w-8 h-6 md:h-8 text-purple-400" />
          📅 Linha do Tempo Musical
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {decades.map((decade) => (
            <button
              key={decade.id}
              onClick={() => setActiveDecade(decade.id)}
              className={`
                bg-gradient-to-br ${decade.color}
                rounded-2xl p-4 text-white shadow-lg hover:shadow-xl
                transition-all duration-200 cursor-pointer
                ${activeDecade === decade.id ? 'ring-4 ring-white/30 scale-105' : 'hover:scale-105'}
              `}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{decade.emoji}</div>
                <h3 className="text-sm font-bold mb-1">{decade.name}</h3>
                <p className="text-xs text-white/80">{decade.period}</p>
                <p className="text-xs text-white/60 mt-1">{decadesSongs[decade.id]?.length || 0} músicas</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Active Decade Details */}
      {currentDecadeData && (
        <section>
          <div className={`bg-gradient-to-r ${currentDecadeData.color} rounded-2xl p-6 mb-8`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">{currentDecadeData.emoji}</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {currentDecadeData.name} ({currentDecadeData.period})
                </h2>
                <p className="text-white/80">{currentDecadeData.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">🎵 Gêneros em Destaque:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentDecadeData.highlights.map((highlight) => (
                    <span key={highlight} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">🌟 Artistas Icônicos:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentDecadeData.artists.map((artist) => (
                    <span key={artist} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                      {artist}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => playDecade(activeDecade)}
                className="flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              >
                <PlayCircle className="w-5 h-5" />
                Tocar {currentDecadeData.name}
              </button>
              
              <div className="flex items-center gap-2 text-white/80">
                <Music className="w-5 h-5" />
                <span>{currentDecadeSongs.length} músicas da época</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Current Decade Songs */}
      {currentDecadeSongs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Star className="w-6 md:w-8 h-6 md:h-8 text-yellow-400" />
              ⭐ Sucessos dos {currentDecadeData?.name}
            </h2>
            <button 
              onClick={() => playDecade(activeDecade)}
              className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
            >
              <PlayCircle className="w-5 h-5" />
              Tocar Tudo
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {currentDecadeSongs.slice(0, 18).map((song, index) => (
              <SongCard
                key={song.id}
                song={song}
                isPlaying={currentSong?.id === song.id}
                isFavorite={isFavorite(song.id)}
                showIndex={true}
                index={index + 1}
                badge={currentDecadeData?.name.toUpperCase()}
                badgeColor={`bg-gradient-to-r ${currentDecadeData?.color}`}
                onClick={() => onPlaySong(song, currentDecadeSongs)}
                onToggleFavorite={() => onToggleFavorite(song)}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Decades Overview */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <Award className="w-6 md:w-8 h-6 md:h-8 text-gold-400" />
          🏆 Todas as Décadas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {decades.map((decade) => {
            const songs = decadesSongs[decade.id] || [];
            return (
              <div
                key={decade.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${decade.color} rounded-full flex items-center justify-center`}>
                    <span className="text-xl">{decade.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">
                      {decade.name} ({decade.period})
                    </h3>
                    <p className="text-sm text-gray-400">{songs.length} músicas</p>
                  </div>
                  <button
                    onClick={() => playDecade(decade.id)}
                    className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <PlayCircle className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-300 mb-4">{decade.description}</p>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-gray-400">Gêneros: </span>
                    <span className="text-xs text-gray-300">{decade.highlights.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-400">Artistas: </span>
                    <span className="text-xs text-gray-300">{decade.artists.join(', ')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Musical Evolution Timeline */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📈 Evolução Musical Brasileira
        </h3>
        <div className="space-y-4 text-sm text-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-white mb-2">🎵 Transformações Musicais</h4>
              <p>Cada década trouxe inovações únicas: dos ritmos tradicionais aos beats eletrônicos, a música brasileira sempre se reinventou.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">📻 Influência da Tecnologia</h4>
              <p>Do rádio ao streaming, as mudanças tecnológicas moldaram como criamos, distribuímos e consumimos música no Brasil.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">🌍 Contexto Social</h4>
              <p>A música brasileira sempre refletiu os momentos históricos e sociais do país, sendo espelho da sociedade em cada época.</p>
            </div>
            <div>
              <h4 className="font-medium text-white mb-2">🎤 Novos Talentos</h4>
              <p>Cada geração trouxe novos artistas que definiram o som de sua época e influenciaram as gerações seguintes.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decades Statistics */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📊 Estatísticas por Década
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {decades.map((decade) => (
            <div key={decade.id} className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {decadesSongs[decade.id]?.length || 0}
              </div>
              <div className="text-xs text-gray-400">{decade.name}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {Object.values(decadesSongs).reduce((total, songs) => total + songs.length, 0)}
          </div>
          <div className="text-sm text-gray-400">Total de Músicas Históricas</div>
        </div>
      </div>
    </div>
  );
};

export default DecadesPage;