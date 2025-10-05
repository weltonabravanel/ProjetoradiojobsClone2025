import React from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { Search, PlayCircle } from 'lucide-react';

interface SearchPageProps {
  searchQuery: string;
  searchResults: Song[];
  currentSong: Song | null;
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  isLoading: boolean;
}

const SearchPage: React.FC<SearchPageProps> = ({
  searchQuery,
  searchResults,
  currentSong,
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  isLoading,
}) => {
  const playAllResults = () => {
    if (searchResults.length > 0) {
      onPlaySong(searchResults[0], searchResults);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-lg">Buscando músicas brasileiras...</p>
          <p className="text-gray-400">Procurando por "{searchQuery}"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 mb-2">
            <Search className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
            🔍 Resultados da Busca
          </h1>
          <p className="text-gray-400">
            {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para "{searchQuery}"
          </p>
        </div>
        
        {searchResults.length > 0 && (
          <button 
            onClick={playAllResults}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
          >
            <PlayCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Tocar Tudo</span>
          </button>
        )}
      </div>

      {searchResults.length === 0 && !isLoading ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
          <p className="text-gray-400 mb-6">
            Não encontramos nenhuma música para "{searchQuery}"
          </p>
          <div className="space-y-2 text-sm text-gray-400">
            <p>Dicas de busca:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Verifique a ortografia</li>
              <li>Tente termos mais específicos</li>
              <li>Busque por artistas brasileiros conhecidos</li>
              <li>Experimente gêneros musicais como "sertanejo", "funk", "MPB"</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {searchResults.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={currentSong?.id === song.id}
              isFavorite={isFavorite(song.id)}
              showIndex={true}
              index={index + 1}
              layout="list"
              onClick={() => onPlaySong(song, searchResults)}
              onToggleFavorite={() => onToggleFavorite(song)}
              onAddToQueue={() => {
                // TODO: Implement add to queue functionality
                console.log('Add to queue:', song.name);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
