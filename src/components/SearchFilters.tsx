import React, { useState } from 'react';
import { Filter, X, Music, User, MapPin, Calendar, Star, TrendingUp } from 'lucide-react';

interface SearchFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: SearchFilters) => void;
  currentFilters: SearchFilters;
}

export interface SearchFilters {
  type: 'all' | 'songs' | 'artists' | 'albums';
  region: string;
  genre: string;
  year: string;
  sortBy: 'relevance' | 'popularity' | 'recent' | 'alphabetical';
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<SearchFilters>(currentFilters);

  const regions = [
    { id: '', name: 'Todas as Regiões' },
    { id: 'nordeste', name: 'Nordeste' },
    { id: 'sudeste', name: 'Sudeste' },
    { id: 'sul', name: 'Sul' },
    { id: 'centro-oeste', name: 'Centro-Oeste' },
    { id: 'norte', name: 'Norte' },
  ];

  const genres = [
    { id: '', name: 'Todos os Gêneros' },
    { id: 'sertanejo', name: 'Sertanejo' },
    { id: 'funk', name: 'Funk' },
    { id: 'mpb', name: 'MPB' },
    { id: 'pagode', name: 'Pagode' },
    { id: 'forro', name: 'Forró' },
    { id: 'bossa-nova', name: 'Bossa Nova' },
    { id: 'rock', name: 'Rock Nacional' },
    { id: 'axe', name: 'Axé' },
    { id: 'rap', name: 'Rap Nacional' },
    { id: 'piseiro', name: 'Piseiro' },
    { id: 'reggae', name: 'Reggae Nacional' },
    { id: 'pop', name: 'Pop Nacional' },
  ];

  const years = [
    { id: '', name: 'Todos os Anos' },
    { id: '2024', name: '2024' },
    { id: '2023', name: '2023' },
    { id: '2022', name: '2022' },
    { id: '2021', name: '2021' },
    { id: '2020', name: '2020' },
    { id: '2010s', name: 'Anos 2010' },
    { id: '2000s', name: 'Anos 2000' },
    { id: '1990s', name: 'Anos 90' },
    { id: 'classics', name: 'Clássicos' },
  ];

  const sortOptions = [
    { id: 'relevance', name: 'Relevância', icon: Star },
    { id: 'popularity', name: 'Popularidade', icon: TrendingUp },
    { id: 'recent', name: 'Mais Recentes', icon: Calendar },
    { id: 'alphabetical', name: 'Alfabética', icon: Music },
  ];

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      type: 'all',
      region: '',
      genre: '',
      year: '',
      sortBy: 'relevance',
    };
    setFilters(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Filter className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">Filtros de Pesquisa</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tipo de Busca */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Music className="w-5 h-5 text-blue-400" />
              Tipo de Busca
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'all', name: 'Tudo', icon: '🔍' },
                { id: 'songs', name: 'Músicas', icon: '🎵' },
                { id: 'artists', name: 'Artistas', icon: '🎤' },
                { id: 'albums', name: 'Álbuns', icon: '💿' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFilters({ ...filters, type: type.id as any })}
                  className={`
                    p-3 rounded-xl border transition-all duration-200 text-center
                    ${filters.type === type.id
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="text-lg mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Região */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-400" />
              Região do Brasil
            </h3>
            <select
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-green-500 focus:bg-white/15"
            >
              {regions.map((region) => (
                <option key={region.id} value={region.id} className="bg-gray-800">
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          {/* Gênero */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-400" />
              Gênero Musical
            </h3>
            <select
              value={filters.genre}
              onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:bg-white/15"
            >
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id} className="bg-gray-800">
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ano */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-400" />
              Período
            </h3>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-yellow-500 focus:bg-white/15"
            >
              {years.map((year) => (
                <option key={year.id} value={year.id} className="bg-gray-800">
                  {year.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ordenação */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-red-400" />
              Ordenar por
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setFilters({ ...filters, sortBy: option.id as any })}
                  className={`
                    p-3 rounded-xl border transition-all duration-200 flex items-center gap-2
                    ${filters.sortBy === option.id
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10'
                    }
                  `}
                >
                  <option.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Limpar Filtros
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors font-medium"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFiltersComponent;