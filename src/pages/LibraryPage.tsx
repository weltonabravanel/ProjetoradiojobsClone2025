import React, { useState } from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { Library, Clock, Heart, PlayCircle, Download, Folder, Music, Star, Calendar } from 'lucide-react';

interface LibraryPageProps {
  recentSongs: Song[];
  favorites: {
    favoriteSongs: Song[];
    count: number;
  };
  currentSong: Song | null;
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
}

const LibraryPage: React.FC<LibraryPageProps> = ({
  recentSongs,
  favorites,
  currentSong,
  onPlaySong,
  onToggleFavorite,
  isFavorite,
}) => {
  const [activeSection, setActiveSection] = useState('recent');

  const sections = [
    { id: 'recent', name: 'Recentes', icon: Clock, count: recentSongs.length },
    { id: 'favorites', name: 'Favoritas', icon: Heart, count: favorites.count },
    { id: 'downloads', name: 'Downloads', icon: Download, count: 0 },
    { id: 'playlists', name: 'Playlists', icon: Folder, count: 0 },
  ];

  const playAllRecent = () => {
    if (recentSongs.length > 0) {
      onPlaySong(recentSongs[0], recentSongs);
    }
  };

  const playAllFavorites = () => {
    if (favorites.favoriteSongs.length > 0) {
      onPlaySong(favorites.favoriteSongs[0], favorites.favoriteSongs);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Library className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                📚 Sua Biblioteca
              </h1>
              <p className="text-xl text-purple-100">
                Todas as suas músicas brasileiras em um só lugar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`
              flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-200
              ${activeSection === section.id 
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' 
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }
            `}
          >
            <section.icon className="w-5 h-5" />
            <span>{section.name}</span>
            {section.count > 0 && (
              <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                {section.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Recent Songs */}
      {activeSection === 'recent' && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Clock className="w-6 md:w-8 h-6 md:h-8 text-blue-400" />
              🕒 Músicas Recentes
            </h2>
            {recentSongs.length > 0 && (
              <button
                onClick={playAllRecent}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              >
                <PlayCircle className="w-5 h-5" />
                Tocar Todas
              </button>
            )}
          </div>

          {recentSongs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Nenhuma música recente</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Comece a ouvir suas músicas brasileiras favoritas! 
                Elas aparecerão aqui conforme você as reproduzir.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSongs.map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  isPlaying={currentSong?.id === song.id}
                  isFavorite={isFavorite(song.id)}
                  showIndex={true}
                  index={index + 1}
                  layout="list"
                  onClick={() => onPlaySong(song, recentSongs)}
                  onToggleFavorite={() => onToggleFavorite(song)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Favorites */}
      {activeSection === 'favorites' && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <Heart className="w-6 md:w-8 h-6 md:h-8 text-red-400" />
              ❤️ Músicas Favoritas
            </h2>
            {favorites.favoriteSongs.length > 0 && (
              <button
                onClick={playAllFavorites}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
              >
                <PlayCircle className="w-5 h-5" />
                Tocar Todas
              </button>
            )}
          </div>

          {favorites.favoriteSongs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Nenhuma música favorita</h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                Adicione músicas aos seus favoritos clicando no ❤️ ao lado de qualquer música.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.favoriteSongs.map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  isPlaying={currentSong?.id === song.id}
                  isFavorite={true}
                  showIndex={true}
                  index={index + 1}
                  layout="list"
                  onClick={() => onPlaySong(song, favorites.favoriteSongs)}
                  onToggleFavorite={() => onToggleFavorite(song)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Downloads (Placeholder) */}
      {activeSection === 'downloads' && (
        <section>
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Downloads</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Funcionalidade de download em desenvolvimento. 
              Em breve você poderá baixar suas músicas favoritas para ouvir offline!
            </p>
          </div>
        </section>
      )}

      {/* Playlists (Placeholder) */}
      {activeSection === 'playlists' && (
        <section>
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Folder className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Playlists</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Funcionalidade de playlists em desenvolvimento. 
              Em breve você poderá criar e organizar suas próprias playlists!
            </p>
          </div>
        </section>
      )}

      {/* Library Stats */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          📊 Estatísticas da Biblioteca
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{recentSongs.length}</div>
            <div className="text-sm text-gray-400">Músicas Recentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{favorites.count}</div>
            <div className="text-sm text-gray-400">Favoritas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {Math.floor((recentSongs.reduce((acc, song) => acc + song.duration, 0) + 
                          favorites.favoriteSongs.reduce((acc, song) => acc + song.duration, 0)) / 60)}
            </div>
            <div className="text-sm text-gray-400">Minutos de Música</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">🇧🇷</div>
            <div className="text-sm text-gray-400">100% Brasil</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;