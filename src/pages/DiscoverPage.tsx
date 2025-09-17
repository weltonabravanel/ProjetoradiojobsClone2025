import React from 'react';
import { Song } from '../types/music';
import { Compass, Music, Radio, Users, Guitar, Drum, Mic } from 'lucide-react';

interface DiscoverPageProps {
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  currentSong: Song | null;
  onSearch: () => void;
  setSearchQuery: (query: string) => void;
}

const DiscoverPage: React.FC<DiscoverPageProps> = ({
  onSearch,
  setSearchQuery,
}) => {
  const genres = [
    { name: 'Sertanejo', query: 'sertanejo brasileiro', color: 'from-green-500 to-green-700', icon: Guitar, emoji: '🤠' },
    { name: 'Funk', query: 'funk brasileiro', color: 'from-yellow-500 to-yellow-700', icon: Drum, emoji: '🎵' },
    { name: 'MPB', query: 'mpb música popular brasileira', color: 'from-blue-500 to-blue-700', icon: Music, emoji: '🎼' },
    { name: 'Pagode', query: 'pagode samba brasileiro', color: 'from-red-500 to-red-700', icon: Mic, emoji: '🥁' },
    { name: 'Forró', query: 'forró brasileiro', color: 'from-orange-500 to-orange-700', icon: Guitar, emoji: '🪗' },
    { name: 'Bossa Nova', query: 'bossa nova brasileiro', color: 'from-purple-500 to-purple-700', icon: Music, emoji: '🎷' },
    { name: 'Rock Nacional', query: 'rock nacional brasileiro', color: 'from-gray-500 to-gray-700', icon: Guitar, emoji: '🎸' },
    { name: 'Axé', query: 'axé música baiana', color: 'from-pink-500 to-pink-700', icon: Drum, emoji: '🎊' },
    { name: 'Rap Nacional', query: 'rap hip hop brasileiro', color: 'from-indigo-500 to-indigo-700', icon: Mic, emoji: '🎤' },
    { name: 'Piseiro', query: 'piseiro brasileiro', color: 'from-teal-500 to-teal-700', icon: Guitar, emoji: '🎺' },
    { name: 'Reggae Nacional', query: 'reggae brasileiro', color: 'from-emerald-500 to-emerald-700', icon: Music, emoji: '🌿' },
    { name: 'Pop Nacional', query: 'pop brasileiro', color: 'from-rose-500 to-rose-700', icon: Music, emoji: '✨' },
  ];

  const brazilianArtists = [
    { name: 'Anitta', genre: 'Pop/Funk', color: 'from-pink-500 to-purple-500' },
    { name: 'Gusttavo Lima', genre: 'Sertanejo', color: 'from-green-500 to-blue-500' },
    { name: 'Marília Mendonça', genre: 'Sertanejo', color: 'from-purple-500 to-pink-500' },
    { name: 'Jorge e Mateus', genre: 'Sertanejo', color: 'from-blue-500 to-green-500' },
    { name: 'Henrique e Juliano', genre: 'Sertanejo', color: 'from-orange-500 to-red-500' },
    { name: 'Wesley Safadão', genre: 'Forró', color: 'from-yellow-500 to-orange-500' },
    { name: 'Alok', genre: 'Eletrônica', color: 'from-cyan-500 to-blue-500' },
    { name: 'Pabllo Vittar', genre: 'Pop', color: 'from-rainbow-500 to-rainbow-700' },
    { name: 'Ludmilla', genre: 'Funk/Pop', color: 'from-red-500 to-pink-500' },
    { name: 'Emicida', genre: 'Rap', color: 'from-gray-500 to-black' },
    { name: 'Caetano Veloso', genre: 'MPB', color: 'from-blue-500 to-indigo-500' },
    { name: 'Gilberto Gil', genre: 'MPB', color: 'from-green-500 to-yellow-500' },
  ];

  const handleGenreClick = (query: string) => {
    setSearchQuery(query);
    onSearch();
  };

  const handleArtistClick = (artist: string) => {
    setSearchQuery(artist);
    onSearch();
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Compass className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Descobrir Música Brasileira
              </h1>
              <p className="text-xl text-purple-100">
                Explore a diversidade musical do Brasil
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Brazilian Genres */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <Music className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
          🎵 Gêneros Brasileiros
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <div
              key={genre.name}
              onClick={() => handleGenreClick(genre.query)}
              className={`
                bg-gradient-to-br ${genre.color} 
                cursor-pointer hover:scale-105 transition-all duration-200 
                rounded-2xl p-6 text-white shadow-lg hover:shadow-xl
                group relative overflow-hidden
              `}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <genre.icon className="w-8 h-8" />
                  <span className="text-2xl">{genre.emoji}</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-1">{genre.name}</h3>
                <p className="text-white/80 text-sm">Explorar gênero</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Artists */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <Users className="w-6 md:w-8 h-6 md:h-8 text-blue-400" />
          🎤 Artistas em Destaque
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brazilianArtists.map((artist) => (
            <div
              key={artist.name}
              onClick={() => handleArtistClick(artist.name)}
              
              className={`
                bg-gradient-to-br ${artist.color}
                cursor-pointer hover:scale-105 transition-all duration-200
                rounded-2xl p-4 text-white text-center shadow-lg hover:shadow-xl
                group relative overflow-hidden
              `}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Mic className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-sm md:text-base mb-1 truncate">{artist.name}</h3>
                <p className="text-white/80 text-xs">{artist.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Discovery */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          <Radio className="w-6 md:w-8 h-6 md:h-8 text-yellow-400" />
          ⚡ Descoberta Rápida
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[
            {
              title: '🔥 Hits do Momento',
              description: 'As músicas mais tocadas agora',
              query: 'hits brasileiros 2024',
              color: 'from-red-500 to-orange-500',
            },
            {
              title: '🆕 Lançamentos',
              description: 'Novidades da música brasileira',
              query: 'lançamentos brasileiros 2024',
              color: 'from-blue-500 to-purple-500',
            },
            {
              title: '🏆 Clássicos',
              description: 'Sucessos atemporais do Brasil',
              query: 'clássicos música brasileira',
              color: 'from-yellow-500 to-green-500',
            },
            {
              title: '🎭 Regional',
              description: 'Sons de cada região do Brasil',
              query: 'música regional brasileira',
              color: 'from-green-500 to-teal-500',
            },
            {
              title: '🎸 Instrumental',
              description: 'Música brasileira instrumental',
              query: 'instrumental brasileiro',
              color: 'from-purple-500 to-pink-500',
            },
            {
              title: '🎤 Ao Vivo',
              description: 'Performances ao vivo incríveis',
              query: 'ao vivo brasileiro',
              color: 'from-indigo-500 to-blue-500',
            },
          ].map((category) => (
            <div
              key={category.title}
              onClick={() => handleGenreClick(category.query)}
              className={`
                bg-gradient-to-br ${category.color}
                cursor-pointer hover:scale-105 transition-all duration-200
                rounded-2xl p-6 text-white shadow-lg hover:shadow-xl
                group relative overflow-hidden
              `}
            >
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                <p className="text-white/80 mb-4">{category.description}</p>
                <div className="flex items-center text-white/60">
                  <span className="text-sm">Explorar →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Discovery Tips */}
      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          💡 Dicas de Descoberta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <h4 className="font-medium text-white mb-2">🎵 Explore por Gênero</h4>
            <p>Cada região do Brasil tem seus ritmos únicos. Experimente diferentes gêneros para descobrir novos sons.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🎤 Siga os Artistas</h4>
            <p>Descubra novos artistas através das colaborações e influências dos seus favoritos.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">📅 Acompanhe Lançamentos</h4>
            <p>Fique por dentro das novidades musicais brasileiras que saem toda semana.</p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">🌟 Use as Favoritas</h4>
            <p>Suas músicas favoritas ajudam a descobrir artistas e gêneros similares.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DiscoverPage;