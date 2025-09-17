import React, { useState, useEffect } from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { Music, PlayCircle, Star, TrendingUp, Heart, Guitar, Mic, Drum } from 'lucide-react';
import { musicApi } from '../services/musicApi';

interface StylesPageProps {
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  currentSong: Song | null;
  isLoading: boolean;
}

const StylesPage: React.FC<StylesPageProps> = ({
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  currentSong,
  isLoading,
}) => {
  const [stylesSongs, setStylesSongs] = useState<{ [key: string]: Song[] }>({});
  const [loading, setLoading] = useState(false);
  const [activeStyle, setActiveStyle] = useState('sertanejo');

  const musicStyles = [
    {
      id: 'sertanejo',
      name: 'Sertanejo',
      description: 'Do universitário ao raiz, o melhor do sertanejo brasileiro',
      color: 'from-green-500 to-emerald-600',
      emoji: '🤠',
      icon: Guitar,
      query: 'sertanejo brasileiro universitário raiz',
      subgenres: ['Sertanejo Universitário', 'Sertanejo Raiz', 'Sertanejo Romântico', 'Feminejo'],
      artists: ['Gusttavo Lima', 'Henrique e Juliano', 'Jorge e Mateus', 'Marília Mendonça']
    },
    {
      id: 'funk',
      name: 'Funk Brasileiro',
      description: 'Funk carioca, ostentação e melody que fazem o Brasil dançar',
      color: 'from-yellow-500 to-orange-500',
      emoji: '🎵',
      icon: Drum,
      query: 'funk brasileiro carioca ostentação melody',
      subgenres: ['Funk Carioca', 'Funk Ostentação', 'Funk Melody', 'Funk 150 BPM'],
      artists: ['Anitta', 'MC Kevinho', 'MC Hariel', 'Ludmilla']
    },
    {
      id: 'pagode',
      name: 'Pagode & Samba',
      description: 'Pagode romântico, samba de raiz e partido alto',
      color: 'from-red-500 to-pink-500',
      emoji: '🥁',
      icon: Music,
      query: 'pagode samba brasileiro partido alto',
      subgenres: ['Pagode Romântico', 'Samba de Raiz', 'Partido Alto', 'Samba Rock'],
      artists: ['Thiaguinho', 'Grupo Revelação', 'Turma do Pagode', 'Exaltasamba']
    },
    {
      id: 'forro',
      name: 'Forró',
      description: 'Forró pé de serra, eletrônico e universitário do Nordeste',
      color: 'from-orange-500 to-red-500',
      emoji: '🪗',
      icon: Guitar,
      query: 'forró brasileiro pé de serra eletrônico',
      subgenres: ['Forró Pé de Serra', 'Forró Eletrônico', 'Forró Universitário', 'Xote'],
      artists: ['Wesley Safadão', 'Xand Avião', 'Solange Almeida', 'Aviões do Forró']
    },
    {
      id: 'mpb',
      name: 'MPB',
      description: 'Música Popular Brasileira clássica e contemporânea',
      color: 'from-blue-500 to-purple-500',
      emoji: '🎼',
      icon: Music,
      query: 'mpb música popular brasileira contemporânea',
      subgenres: ['MPB Clássica', 'MPB Contemporânea', 'Nova MPB', 'MPB Alternativa'],
      artists: ['Caetano Veloso', 'Gilberto Gil', 'Djavan', 'Marisa Monte']
    },
    {
      id: 'rock',
      name: 'Rock Nacional',
      description: 'Rock brasileiro de todas as épocas e vertentes',
      color: 'from-gray-600 to-gray-800',
      emoji: '🎸',
      icon: Guitar,
      query: 'rock nacional brasileiro alternativo',
      subgenres: ['Rock Clássico', 'Rock Alternativo', 'Pop Rock', 'Rock Indie'],
      artists: ['Legião Urbana', 'Capital Inicial', 'Skank', 'Jota Quest']
    },
    {
      id: 'axe',
      name: 'Axé Music',
      description: 'Axé baiano, carnaval e música de Salvador',
      color: 'from-pink-500 to-purple-500',
      emoji: '🎊',
      icon: Drum,
      query: 'axé música baiana carnaval salvador',
      subgenres: ['Axé Clássico', 'Axé Pop', 'Pagodão Baiano', 'Arrocha'],
      artists: ['Ivete Sangalo', 'Claudia Leitte', 'Bell Marques', 'Chiclete com Banana']
    },
    {
      id: 'bossa',
      name: 'Bossa Nova',
      description: 'Bossa nova clássica e contemporânea',
      color: 'from-purple-500 to-indigo-500',
      emoji: '🎷',
      icon: Music,
      query: 'bossa nova brasileiro clássica contemporânea',
      subgenres: ['Bossa Nova Clássica', 'Nova Bossa', 'Bossa Eletrônica', 'Jazz Brasileiro'],
      artists: ['Tom Jobim', 'João Gilberto', 'Norah Jones', 'Thiago Brava']
    },
    {
      id: 'eletronica',
      name: 'Eletrônica Brasileira',
      description: 'House, techno e música eletrônica nacional',
      color: 'from-cyan-500 to-blue-500',
      emoji: '🎧',
      icon: Music,
      query: 'música eletrônica brasileira house techno',
      subgenres: ['Brazilian Bass', 'Tech House', 'Progressive House', 'Techno Brasileiro'],
      artists: ['Alok', 'Vintage Culture', 'KVSH', 'Cat Dealers']
    },
    {
      id: 'rap',
      name: 'Rap Nacional',
      description: 'Hip hop, rap e trap brasileiro',
      color: 'from-indigo-500 to-purple-600',
      emoji: '🎤',
      icon: Mic,
      query: 'rap brasileiro hip hop nacional trap',
      subgenres: ['Rap Consciente', 'Trap Nacional', 'Hip Hop Brasileiro', 'Rap Melodico'],
      artists: ['Emicida', 'Criolo', 'Racionais MCs', 'Matuê']
    },
    {
      id: 'piseiro',
      name: 'Piseiro',
      description: 'O ritmo que conquistou o Brasil',
      color: 'from-teal-500 to-green-500',
      emoji: '🎺',
      icon: Guitar,
      query: 'piseiro brasileiro pisa pisadinha',
      subgenres: ['Piseiro Clássico', 'Pisadinha', 'Pisa Romântico', 'Pisa Melody'],
      artists: ['Barões da Pisadinha', 'Os Feras do Pizeiro', 'Zé Vaqueiro', 'João Gomes']
    },
    {
      id: 'gospel',
      name: 'Gospel Brasileiro',
      description: 'Música gospel e cristã contemporânea',
      color: 'from-yellow-400 to-orange-400',
      emoji: '🙏',
      icon: Music,
      query: 'gospel brasileiro música cristã contemporânea',
      subgenres: ['Gospel Pop', 'Gospel Rock', 'Gospel Sertanejo', 'Worship'],
      artists: ['Aline Barros', 'Fernandinho', 'Gabriela Rocha', 'Thalles Roberto']
    }
  ];

  useEffect(() => {
    loadStylesMusic();
  }, []);

  const loadStylesMusic = async () => {
    setLoading(true);
    try {
      const stylesData: { [key: string]: Song[] } = {};
      
      for (const style of musicStyles) {
        const songs = await musicApi.searchSongs(style.query, 30);
        stylesData[style.id] = songs;
      }
      
      setStylesSongs(stylesData);
    } catch (error) {
      console.error('Error loading styles music:', error);
    } finally {
      setLoading(false);
    }
  };

  const playStyle = (styleId: string) => {
    const songs = stylesSongs[styleId];
    if (songs && songs.length > 0) {
      onPlaySong(songs[0], songs);
    }
  };

  const currentStyleData = musicStyles.find(s => s.id === activeStyle);
  const currentStyleSongs = stylesSongs[activeStyle] || [];

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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Music className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                🎵 Estilos Musicais
              </h1>
              <p className="text-xl text-purple-100">
                Explore a diversidade dos gêneros musicais brasileiros
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Styles Navigation */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <Star className="w-6 md:w-8 h-6 md:h-8 text-purple-400" />
          🎼 Gêneros Musicais
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
          {musicStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setActiveStyle(style.id)}
              className={`
                bg-gradient-to-br ${style.color}
                rounded-2xl p-4 text-white shadow-lg hover:shadow-xl
                transition-all duration-200 cursor-pointer
                ${activeStyle === style.id ? 'ring-4 ring-white/30 scale-105' : 'hover:scale-105'}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <style.icon className="w-5 h-5" />
                </div>
                <span className="text-xl">{style.emoji}</span>
              </div>
              
              <h3 className="text-sm font-bold mb-1 truncate">{style.name}</h3>
              <p className="text-white/80 text-xs truncate">{stylesSongs[style.id]?.length || 0} músicas</p>
            </button>
          ))}
        </div>
      </section>

      {/* Active Style Details */}
      {currentStyleData && (
        <section>
          <div className={`bg-gradient-to-r ${currentStyleData.color} rounded-2xl p-6 mb-8`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <currentStyleData.icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">{currentStyleData.emoji}</span>
                  {currentStyleData.name}
                </h2>
                <p className="text-white/80">{currentStyleData.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">🎵 Subgêneros:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentStyleData.subgenres.map((subgenre) => (
                    <span key={subgenre} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                      {subgenre}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-2">🎤 Principais Artistas:</h4>
                <div className="flex flex-wrap gap-2">
                  {currentStyleData.artists.map((artist) => (
                    <span key={artist} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                      {artist}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => playStyle(activeStyle)}
                className="flex items-center gap-2 bg-white text-gray-800 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              >
                <PlayCircle className="w-5 h-5" />
                Tocar {currentStyleData.name}
              </button>
              
              <div className="flex items-center gap-2 text-white/80">
                <Music className="w-5 h-5" />
                <span>{currentStyleSongs.length} músicas disponíveis</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Current Style Songs */}
      {currentStyleSongs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <TrendingUp className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
              🔥 Top {currentStyleData?.name}
            </h2>
            <button 
              onClick={() => playStyle(activeStyle)}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <PlayCircle className="w-5 h-5" />
              Tocar Tudo
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {currentStyleSongs.slice(0, 18).map((song, index) => (
              <SongCard
                key={song.id}
                song={song}
                isPlaying={currentSong?.id === song.id}
                isFavorite={isFavorite(song.id)}
                showIndex={true}
                index={index + 1}
                badge={currentStyleData?.name.toUpperCase()}
                badgeColor={`bg-gradient-to-r ${currentStyleData?.color}`}
                onClick={() => onPlaySong(song, currentStyleSongs)}
                onToggleFavorite={() => onToggleFavorite(song)}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Styles Overview */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <Heart className="w-6 md:w-8 h-6 md:h-8 text-red-400" />
          🎶 Todos os Estilos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {musicStyles.map((style) => {
            const songs = stylesSongs[style.id] || [];
            return (
              <div
                key={style.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${style.color} rounded-full flex items-center justify-center`}>
                    <style.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{style.emoji}</span>
                      {style.name}
                    </h3>
                    <p className="text-sm text-gray-400">{songs.length} músicas</p>
                  </div>
                  <button
                    onClick={() => playStyle(style.id)}
                    className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                  >
                    <PlayCircle className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                <p className="text-sm text-gray-300 mb-4">{style.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {style.subgenres.slice(0, 3).map((subgenre) => (
                    <span key={subgenre} className="bg-white/10 text-xs px-2 py-1 rounded text-gray-300">
                      {subgenre}
                    </span>
                  ))}
                  {style.subgenres.length > 3 && (
                    <span className="bg-white/10 text-xs px-2 py-1 rounded text-gray-300">
                      +{style.subgenres.length - 3}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Styles Statistics */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📊 Estatísticas por Estilo
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {musicStyles.slice(0, 6).map((style) => (
            <div key={style.id} className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {stylesSongs[style.id]?.length || 0}
              </div>
              <div className="text-xs text-gray-400">{style.name}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {Object.values(stylesSongs).reduce((total, songs) => total + songs.length, 0)}
          </div>
          <div className="text-sm text-gray-400">Total de Músicas por Estilo</div>
        </div>
      </div>

      {/* Musical Culture Info */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🇧🇷 Diversidade Musical Brasileira
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">🎵 Riqueza de Gêneros</h4>
            <p>O Brasil possui uma das maiores diversidades musicais do mundo, com gêneros únicos que nasceram da mistura de culturas africanas, indígenas e europeias.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🌟 Evolução Constante</h4>
            <p>Novos estilos surgem constantemente, como o piseiro e o funk melody, mostrando a criatividade e inovação da música brasileira.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🎤 Influência Global</h4>
            <p>Artistas brasileiros como Anitta, Alok e outros levam nossa música para o mundo, conquistando charts internacionais.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🎼 Tradição e Modernidade</h4>
            <p>A música brasileira consegue manter suas raízes tradicionais enquanto abraça tecnologias e tendências modernas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylesPage;