import React from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { TrendingUp, Calendar, Award, Clock, PlayCircle, Star } from 'lucide-react';

interface HomePageProps {
  trendingSongs: Song[];
  newReleases: Song[];
  classicSongs: Song[];
  recentSongs: Song[];
  currentSong: Song | null;
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  isLoading: boolean;
}

const HomePage: React.FC<HomePageProps> = ({
  trendingSongs,
  newReleases,
  classicSongs,
  recentSongs,
  currentSong,
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  isLoading,
}) => {
  const playPlaylist = (songs: Song[], startIndex: number = 0) => {
    if (songs.length > 0) {
      onPlaySong(songs[startIndex], songs);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="bg-gradient-to-r from-green-600 to-yellow-600 rounded-2xl h-48"></div>
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
      <div className="bg-gradient-to-r from-green-600 to-yellow-600 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-white drop-shadow-lg">
            Bem-vindo ao Music Brasil!
          </h1>
          <p className="text-xl text-green-100 mb-6 drop-shadow">
            Descubra o melhor da música brasileira - dos clássicos aos hits do momento
          </p>
          {recentSongs.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onPlaySong(recentSongs[0], recentSongs)}
                className="flex items-center gap-3 bg-white text-green-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <PlayCircle className="w-5 h-5" />
                Continuar ouvindo
              </button>
              <button className="flex items-center gap-3 bg-black/20 text-white hover:bg-black/30 px-6 py-3 rounded-xl font-semibold transition-all duration-200 border border-white/20">
                <Star className="w-5 h-5" />
                Explorar descobertas
              </button>
              <section className="mt-8">
          <h2 className="text-3xl font-semibold mb-4 text-yellow-400"></h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {[{ name: 'Ana Castela', logo: 'https://www.eldoradofm.com.br/wp-content/uploads/2024/12/channels4_profile-1.jpg', url: 'https://jovempan.com.br' },
              { name: 'Leonardo', logo: 'https://imagem.natelinha.uol.com.br/original/leonardo-lanca-dvd-em-homenagem-a-leandro-e-fala-de-emocao-vou-me-segurar_9717.jpeg', url: 'https://cbn.globoradio.globo.com' },
              { name: 'Zezê de Camargo', logo: 'https://veja.abril.com.br/wp-content/uploads/2017/01/zeze-di-camargo-amarelas.jpg?crop=1&resize=1212,909', url: 'https://bandnewsfm.band.uol.com.br' },
              { name: 'Paula fernandes', logo: 'https://s2.glbimg.com/jv3e89_AtGsMcJcyCL_-1KRJ34I=/e.glbimg.com/og/ed/f/original/2019/08/28/paula-fernandes.jpg', url: 'https://antena1.com.br' },
              { name: 'Marília Mendonça', logo: 'https://ogimg.infoglobo.com.br/in/25267458-480-fc7/FT1086A/95939655_RE-Rio-de-Janeiro-RJ-29102021Retomada-dos-sertanejos-aos-palcos-com-caches-inflaci.jpg', url: 'https://transamerica.com.br' },
              { name: 'Alok', logo: 'https://static.ndmais.com.br/2022/08/alok.png', url: 'https://massafm.com.br' },
              { name: 'Gustavo Lima', logo: 'https://www.diariodecontagem.com.br/fotos/materias/22072024093142_gusttavo-lima-credito-augusto-albuquerque-1-1.jpg', url: 'https://radioglobo.globo.com' },
              { name: 'Luan Santana', logo: 'https://f.i.uol.com.br/fotografia/2022/01/14/164218087461e1b10ab0d32_1642180874_3x4_md.jpg', url: 'https://kissfm.com.br' },
              { name: 'Lady Gaga', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGfzvCg7dgk-2DB7HdaBX3BnzyIBQvIwTPR8ekSqEbZ7jFLdwaB9IXxE4Ka730dU0otrk0aKUYLzYTgujBqLBkBA', url: 'https://kiisfm.iheart.com/' },
              { name: 'Beyoncé', logo: 'https://forbes.com.br/wp-content/uploads/2024/11/beyonce-curso-yale.jpg', url: 'https://bandfm.band.uol.com.br' },
              { name: 'Michael Jackson', logo: 'https://s.rfi.fr/media/display/8a033dc0-0d8a-11ea-89f1-005056a9aa4d/w:1280/p:1x1/michael-jackson-xscape-album-cover.jpg', url: 'https://clubefm.com.br' },
              { name: 'Caetano Veloso', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Caetano_Veloso_entrevista_Haddad_%C2%B7_23-06-2022_%C2%B7_S%C3%A3o_Paulo_%28SP%29_%2852433690124%29_%28cropped%29.jpg', url: 'https://felizfm.fm' }].map((station, index) => (
              <a
                key={index}
                href={station.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center hover:scale-105 transition-transform duration-200 min-w-[70px] sm:min-w-[80px]"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-yellow-400 overflow-hidden shadow-md">
                  <img src={station.logo} alt={station.name} className="object-cover w-full h-full" />
                </div>
                <span className="text-xs sm:text-sm text-center mt-1 max-w-[80px] truncate">{station.name}</span>
              </a>
            ))}
          </div>
        </section>
            </div>
          )}
        </div>
      </div>

      {/* Recent Songs */}
      {recentSongs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Clock className="w-6 md:w-8 h-6 md:h-8 text-blue-400" />
              🎵 Tocadas Recentemente
            </h2>
            <button 
              onClick={() => playPlaylist(recentSongs)}
              className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <PlayCircle className="w-5 h-5" />
              Tocar Todas
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentSongs.slice(0, 6).map((song) => (
              <div
                key={song.id}
                className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer group rounded-xl p-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={song.image?.[0]?.url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'}
                    alt={song.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{song.name}</h3>
                    <p className="text-sm text-gray-400 truncate">
                      {song.artists.primary.map((a) => a.name).join(', ')}
                    </p>
                  </div>
                  <button 
                    onClick={() => onPlaySong(song, recentSongs)}
                    className="opacity-0 group-hover:opacity-100 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-all duration-200"
                  >
                    <PlayCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Brasil */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <TrendingUp className="w-6 md:w-8 h-6 md:h-8 text-red-400" />
            🔥 Em Alta no Brasil
          </h2>
          <button 
            onClick={() => playPlaylist(trendingSongs)}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Tocar Tudo
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trendingSongs.slice(0, 12).map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              showIndex={true}
              index={index + 1}
              badge="TRENDING"
              badgeColor="bg-red-600"
              onClick={() => onPlaySong(song, trendingSongs)}
              onToggleFavorite={() => onToggleFavorite(song)}
            />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Calendar className="w-6 md:w-8 h-6 md:h-8 text-blue-400" />
            🆕 Novos Lançamentos
          </h2>
          <button 
            onClick={() => playPlaylist(newReleases)}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Ver Mais
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {newReleases.slice(0, 10).map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              badge="NOVO"
              badgeColor="bg-blue-600"
              onClick={() => onPlaySong(song, newReleases)}
              onToggleFavorite={() => onToggleFavorite(song)}
            />
          ))}
        </div>
      </section>

      {/* Classics */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Award className="w-6 md:w-8 h-6 md:h-8 text-yellow-400" />
            🏆 Clássicos Brasileiros
          </h2>
          <button 
            onClick={() => playPlaylist(classicSongs)}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
          >
            <PlayCircle className="w-5 h-5" />
            Tocar Tudo
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {classicSongs.slice(0, 10).map((song) => (
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
    </div>
  );
};

export default HomePage;