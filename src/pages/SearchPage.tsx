import React, { useState, useMemo, useCallback } from 'react';
import { Song } from '../types/music';
import SongCard from '../components/SongCard';
import { Search, PlayCircle, Filter, Grid, List, ChevronDown } from 'lucide-react';
// IMPORTANTE: Importar os componentes de virtualização
import { FixedSizeList } from 'react-window';

// =========================================================================
// Tipos e Interfaces (sem mudanças)
// =========================================================================

interface SearchPageProps {
  searchQuery: string;
  searchResults: Song[];
  currentSong: Song | null;
  onPlaySong: (song: Song, playlist?: Song[]) => void;
  onToggleFavorite: (song: Song) => void;
  isFavorite: (songId: string) => boolean;
  isLoading: boolean;
}

// =========================================================================
// Componente de Renderização de Linha para Virtualização
// =========================================================================

interface SongRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    displayedResults: Song[];
    currentSong: Song | null;
    isFavorite: (songId: string) => boolean;
    onPlaySong: (song: Song, playlist?: Song[]) => void;
    onToggleFavorite: (song: Song) => void;
    searchResults: Song[];
  };
}

// Componente isolado para a linha, crucial para a performance da virtualização
const SongRow: React.FC<SongRowProps> = React.memo(({ index, style, data }) => {
  const {
    displayedResults,
    currentSong,
    isFavorite,
    onPlaySong,
    onToggleFavorite,
    searchResults
  } = data;

  const song = displayedResults[index];
  if (!song) return null; // Prevenção de erro

  return (
    // 'style' é **obrigatório** para posicionar o item corretamente na virtualização
    <div style={style}>
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
          console.log('Add to queue:', song.name);
        }}
      />
    </div>
  );
});
SongRow.displayName = 'SongRow';

// =========================================================================
// Componente Principal SearchPage
// =========================================================================

const SearchPage: React.FC<SearchPageProps> = ({
  searchQuery,
  searchResults,
  currentSong,
  onPlaySong,
  onToggleFavorite,
  isFavorite,
  isLoading,
}) => {
  // Otimização: Remoção do state 'displayCount'
  // Com a virtualização, não precisamos do "Carregar Mais" no modo lista,
  // pois todos os resultados relevantes são carregados no objeto `searchResults`.
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'relevance' | 'name' | 'artist' | 'duration'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  
  // 🎯 MUDANÇA AQUI: Definição do valor inicial como 25 para o modo 'grid'
  const [gridDisplayCount, setGridDisplayCount] = useState(25); // Valor inicial: 25

  const playAllResults = useCallback(() => {
    if (searchResults.length > 0) {
      onPlaySong(searchResults[0], searchResults);
    }
  }, [searchResults, onPlaySong]);

  // Otimização: Uso de useMemo para resultados ordenados
  const sortedResults = useMemo(() => {
    let sorted = [...searchResults];

    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'artist':
        // Acesso seguro ao primeiro artista
        sorted.sort((a, b) =>
          a.artists.primary[0]?.name.localeCompare(b.artists.primary[0]?.name || '') || 0
        );
        break;
      case 'duration':
        sorted.sort((a, b) => a.duration - b.duration);
        break;
      default:
        // Se for "relevância", o backend deve ter retornado na ordem correta.
        // Se precisar de ordenação frontend para relevância, implemente aqui.
        break;
    }

    // Otimização: Garantir que a lista retornada seja estável se o sortBy não mudar.
    // Retorna a lista original se não houve ordenação para evitar re-render desnecessário.
    return sorted;
  }, [searchResults, sortBy]);


  // Resultados exibidos: Todos (para lista virtualizada) ou fatiados (para grid com "Carregar Mais")
  const displayedResults = viewMode === 'list'
    ? sortedResults
    : sortedResults.slice(0, gridDisplayCount);

  const loadMore = useCallback(() => {
    setGridDisplayCount(prev => Math.min(prev + 50, searchResults.length));
  }, [searchResults.length]);

  const totalResults = sortedResults.length;
  const itemsInView = viewMode === 'list' ? totalResults : displayedResults.length;


  // Otimização: Data para a virtualização, passando apenas o necessário
  const rowData = useMemo(() => ({
    displayedResults: sortedResults, // Passamos o sortedResults completo para a virtualização
    currentSong,
    isFavorite,
    onPlaySong,
    onToggleFavorite,
    searchResults,
  }), [sortedResults, currentSong, isFavorite, onPlaySong, onToggleFavorite, searchResults]);


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

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 mb-2">
            <Search className="w-6 md:w-8 h-6 md:h-8 text-green-400" />
            🔍 Resultados da Busca
          </h1>
          <p className="text-gray-400">
            {totalResults} resultado{totalResults !== 1 ? 's' : ''} para "{searchQuery}"
            {viewMode === 'grid' && itemsInView < totalResults && (
               <span> • Mostrando {itemsInView} de {totalResults}</span>
            )}
            {viewMode === 'list' && totalResults > 0 && (
               <span> • Virtualizando {totalResults} itens para performance.</span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Visualização em Lista (Otimizada)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
              title="Visualização em Grade"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(prev => !prev)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {/* Play All Button */}
          {totalResults > 0 && (
            <button
              onClick={playAllResults}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
            >
              <PlayCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Tocar Tudo</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-300">Ordenar por:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-green-500"
              >
                <option value="relevance">Relevância</option>
                <option value="name">Nome da Música</option>
                <option value="artist">Artista</option>
                <option value="duration">Duração</option>
              </select>
            </div>

            {/* O "Exibir" agora só é relevante para o modo 'grid' */}
            {viewMode === 'grid' && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-300">Exibir:</label>
                <select
                  value={gridDisplayCount}
                  onChange={(e) => setGridDisplayCount(Number(e.target.value))}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:border-green-500"
                >
                  <option value={25}>25 músicas</option>
                  <option value={50}>50 músicas</option>
                  <option value={100}>100 músicas</option>
                  <option value={200}>200 músicas</option>
                  <option value={totalResults}>Todas ({totalResults})</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {totalResults === 0 && !isLoading ? (
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
        <>
          {viewMode === 'list' ? (
            // APLICAÇÃO DA VIRTUALIZAÇÃO PARA O MODO LISTA
            <div className="h-[60vh] max-h-[800px]">
              <FixedSizeList
                height={window.innerHeight * 0.6} // 60% da altura da tela como altura de visualização
                itemCount={totalResults}
                itemSize={70} // Altura aproximada de um SongCard na lista (ajuste conforme seu CSS)
                width="100%"
                itemData={rowData} // Passa os dados necessários para o SongRow
              >
                {SongRow}
              </FixedSizeList>
            </div>
          ) : (
            // MODO GRID (sem virtualização, mantendo o "Carregar Mais" para controle)
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {displayedResults.map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  isPlaying={currentSong?.id === song.id}
                  isFavorite={isFavorite(song.id)}
                  showIndex={true}
                  index={index + 1}
                  layout="card"
                  onClick={() => onPlaySong(song, searchResults)}
                  onToggleFavorite={() => onToggleFavorite(song)}
                />
              ))}
            </div>
          )}

          {/* Load More Button - Apenas no modo GRID */}
          {viewMode === 'grid' && itemsInView < totalResults && (
            <div className="text-center py-8">
              <button
                onClick={loadMore}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                Carregar Mais ({totalResults - itemsInView} restantes)
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-3">📊 Resumo dos Resultados</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{totalResults}</div>
                <div className="text-sm text-gray-400">Total de Músicas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {useMemo(() => new Set(sortedResults.flatMap(s => s.artists.primary.map(a => a.name))).size, [sortedResults])}
                </div>
                <div className="text-sm text-gray-400">Artistas Únicos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">
                  {useMemo(() => Math.floor(sortedResults.reduce((acc, song) => acc + song.duration, 0) / 3600), [sortedResults])}h
                </div>
                <div className="text-sm text-gray-400">Horas de Música</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">🇧🇷</div>
                <div className="text-sm text-gray-400">100% Brasil</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchPage;
