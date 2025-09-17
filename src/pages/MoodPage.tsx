import React, { useState, useEffect } from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { Heart, PlayCircle, Sun, Moon, Coffee, Zap, Smile, Music } from 'lucide-react';
import { musicApi } from '../services/musicApi';

interface MoodPageProps {
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  currentSong: Song | null;
  isLoading: boolean;
}

const MoodPage: React.FC<MoodPageProps> = ({
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  currentSong,
  isLoading,
}) => {
  const [moodSongs, setMoodSongs] = useState<{ [key: string]: Song[] }>({});
  const [loading, setLoading] = useState(false);
  const [activeMood, setActiveMood] = useState('happy');

  const moods = [
    {
      id: 'happy',
      name: 'Feliz & Animado',
      description: 'Músicas para celebrar e se divertir',
      color: 'from-yellow-400 to-orange-500',
      emoji: '😄',
      icon: Smile,
      query: 'música alegre animada festa brasileira',
      keywords: ['festa', 'alegria', 'animação', 'dança', 'celebração'],
      genres: ['Funk', 'Axé', 'Pagode', 'Forró']
    },
    {
      id: 'romantic',
      name: 'Romântico',
      description: 'Para momentos especiais a dois',
      color: 'from-pink-500 to-red-500',
      emoji: '💕',
      icon: Heart,
      query: 'música romântica amor brasileira sertanejo',
      keywords: ['amor', 'romance', 'paixão', 'coração', 'saudade'],
      genres: ['Sertanejo Romântico', 'MPB', 'Bossa Nova', 'Pagode Romântico']
    },
    {
      id: 'chill',
      name: 'Relaxante',
      description: 'Para relaxar e descontrair',
      color: 'from-blue-400 to-cyan-500',
      emoji: '😌',
      icon: Moon,
      query: 'música relaxante chill brasileira bossa nova',
      keywords: ['relaxar', 'calma', 'paz', 'tranquilidade', 'descanso'],
      genres: ['Bossa Nova', 'MPB Suave', 'Jazz Brasileiro', 'Instrumental']
    },
    {
      id: 'energetic',
      name: 'Energético',
      description: 'Para treinar e se motivar',
      color: 'from-red-500 to-orange-600',
      emoji: '⚡',
      icon: Zap,
      query: 'música energética treino motivação brasileira',
      keywords: ['energia', 'força', 'motivação', 'treino', 'adrenalina'],
      genres: ['Funk', 'Rock Nacional', 'Eletrônica', 'Rap Nacional']
    },
    {
      id: 'nostalgic',
      name: 'Nostálgico',
      description: 'Clássicos que trazem lembranças',
      color: 'from-purple-500 to-indigo-600',
      emoji: '🌅',
      icon: Sun,
      query: 'música nostálgica clássicos brasileiros anos 80 90',
      keywords: ['nostalgia', 'lembranças', 'saudade', 'clássicos', 'memórias'],
      genres: ['MPB Clássica', 'Rock Nacional', 'Sertanejo Raiz', 'Axé Clássico']
    },
    {
      id: 'focus',
      name: 'Foco & Concentração',
      description: 'Para estudar e trabalhar',
      color: 'from-green-500 to-teal-600',
      emoji: '🎯',
      icon: Coffee,
      query: 'música instrumental brasileira concentração estudo',
      keywords: ['foco', 'concentração', 'estudo', 'trabalho', 'produtividade'],
      genres: ['Instrumental', 'Bossa Nova', 'Jazz Brasileiro', 'MPB Instrumental']
    },
    {
      id: 'party',
      name: 'Festa & Balada',
      description: 'Para animar qualquer festa',
      color: 'from-purple-600 to-pink-600',
      emoji: '🎉',
      icon: Music,
      query: 'música festa balada funk brasileiro',
      keywords: ['festa', 'balada', 'dança', 'diversão', 'night'],
      genres: ['Funk', 'Eletrônica Nacional', 'Pop Nacional', 'Axé']
    },
    {
      id: 'sad',
      name: 'Melancólico',
      description: 'Para momentos de reflexão',
      color: 'from-gray-500 to-blue-600',
      emoji: '😢',
      icon: Moon,
      query: 'música triste melancólica brasileira mpb',
      keywords: ['tristeza', 'melancolia', 'reflexão', 'solidão', 'saudade'],
      genres: ['MPB', 'Sertanejo Sofrência', 'Bossa Nova', 'Rock Alternativo']
    }
  ];

  useEffect(() => {
    loadMoodMusic();
  }, []);

  const loadMoodMusic = async () => {
    setLoading(true);
    try {
      const moodData: { [key: string]: Song[] } = {};
      
      for (const mood of moods) {
        const songs = await musicApi.searchSongs(mood.query, 25);
        moodData[mood.id] = songs;
      }
      
      setMoodSongs(moodData);
    } catch (error) {
      console.error('Error loading mood music:', error);
    } finally {
      setLoading(false);
    }
  };

  const playMood = (moodId: string) => {
    const songs = moodSongs[moodId];
    if (songs && songs.length > 0) {
      onPlaySong(songs[0], songs);
    }
  };

  const currentMoodData = moods.find(m => m.id === activeMood);
  const currentMoodSongs = moodSongs[activeMood] || [];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl h-48"></div>
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                💫 Música por Humor
              </h1>
              <p className="text-xl text-purple-100">
                Encontre a trilha sonora perfeita para cada momento
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Selection */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <Smile className="w-6 md:w-8 h-6 md:h-8 text-yellow-400" />
          😊 Como você está se sentindo?
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setActiveMood(mood.id)}
              className={`
                bg-gradient-to-br ${mood.color}
                rounded-2xl p-4 text-white shadow-lg hover:shadow-xl
                transition-all duration-200 cursor-pointer
                ${activeMood === mood.id ? 'ring-4 ring-white/30 scale-105' : 'hover:scale-105'}
              `}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{mood.emoji}</div>
                <h3 className="text-xs font-bold mb-1">{mood.name}</h3>
                <p className="text-xs text-white/60">{moodSongs[mood.id]?.length || 0} músicas</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Active Mood Details */}
      {currentMoodData && (
        <section>
          <div className={`bg-gradient-to-r ${currentMoodData.color} rounded-2xl p-6 mb-8`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">{currentMoodData.emoji}</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  {currentMoodData.name}
                </h2>
                <p className="text-white/80">{currentMoodData.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">🎵 Gêneros Recomendados:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentMoodData.genres.map((genre) => (
                    <span key={genre} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">🏷️ Palavras-chave:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentMoodData.keywords.map((keyword) => (
                    <span key={keyword} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => playMood(activeMood)}
                className="flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              >
                <PlayCircle className="w-5 h-5" />
                Tocar {currentMoodData.name}
              </button>
              
              <div className="flex items-center gap-2 text-white/80">
                <Music className="w-5 h-5" />
                <span>{currentMoodSongs.length} músicas selecionadas</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Current Mood Songs */}
      {currentMoodSongs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <currentMoodData.icon className="w-6 md:w-8 h-6 md:h-8 text-purple-400" />
              {currentMoodData?.emoji} Playlist {currentMoodData?.name}
            </h2>
            <button 
              onClick={() => playMood(activeMood)}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <PlayCircle className="w-5 h-5" />
              Tocar Tudo
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {currentMoodSongs.slice(0, 18).map((song, index) => (
              <SongCard
                key={song.id}
                song={song}
                isPlaying={currentSong?.id === song.id}
                isFavorite={isFavorite(song.id)}
                showIndex={true}
                index={index + 1}
                badge={currentMoodData?.name.toUpperCase()}
                badgeColor={`bg-gradient-to-r ${currentMoodData?.color}`}
                onClick={() => onPlaySong(song, currentMoodSongs)}
                onToggleFavorite={() => onToggleFavorite(song)}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Moods Overview */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <Music className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
          🎭 Todos os Humores
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {moods.map((mood) => {
            const songs = moodSongs[mood.id] || [];
            return (
              <div
                key={mood.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${mood.color} rounded-full flex items-center justify-center`}>
                    <span className="text-xl">{mood.emoji}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white">
                      {mood.name}
                    </h3>
                    <p className="text-sm text-gray-400">{songs.length} músicas</p>
                  </div>
                  <button
                    onClick={() => playMood(mood.id)}
                    className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <PlayCircle className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-300 mb-4">{mood.description}</p>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-medium text-gray-400">Gêneros: </span>
                    <span className="text-xs text-gray-300">{mood.genres.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-400">Palavras-chave: </span>
                    <span className="text-xs text-gray-300">{mood.keywords.join(', ')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mood Science */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🧠 A Ciência da Música e Humor
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">🎵 Impacto Emocional</h4>
            <p>A música tem o poder de influenciar diretamente nosso humor e estado emocional, liberando neurotransmissores como dopamina e serotonina.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🧘 Terapia Musical</h4>
            <p>Diferentes ritmos e melodias podem ajudar a reduzir stress, aumentar foco, melhorar o humor e até mesmo auxiliar na recuperação física.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🎯 Personalização</h4>
            <p>Cada pessoa responde de forma única à música. Nossas playlists por humor são curadas para maximizar o impacto emocional positivo.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🌟 Bem-estar</h4>
            <p>Usar música de acordo com seu humor atual pode melhorar significativamente seu bem-estar mental e qualidade de vida.</p>
          </div>
        </div>
      </div>

      {/* Mood Statistics */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📊 Estatísticas por Humor
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {moods.map((mood) => (
            <div key={mood.id} className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {moodSongs[mood.id]?.length || 0}
              </div>
              <div className="text-xs text-gray-400">{mood.name}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {Object.values(moodSongs).reduce((total, songs) => total + songs.length, 0)}
          </div>
          <div className="text-sm text-gray-400">Total de Músicas por Humor</div>
        </div>
      </div>
    </div>
  );
};

export default MoodPage;