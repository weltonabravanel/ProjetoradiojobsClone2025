import React, { useState, useEffect } from 'react';
import { Filter, X, Search, Sparkles, Globe, Music } from 'lucide-react';
import { useRadio } from '../contexts/RadioContext';
import { fetchCountries, fetchTags, fetchLanguages } from '../services/api';

const FilterBar: React.FC = () => {
  const { filters, setFilters, applyFilters } = useRadio();
  const [showFilters, setShowFilters] = useState(false);
  const [countries, setCountries] = useState<{name: string; stationcount: number}[]>([]);
  const [languages, setLanguages] = useState<{name: string; stationcount: number}[]>([]);
  const [tags, setTags] = useState<{name: string; stationcount: number}[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const loadFilterOptions = async () => {
      setLoading(true);
      try {
        const [countriesData, languagesData, tagsData] = await Promise.all([
          fetchCountries(),
          fetchLanguages(),
          fetchTags()
        ]);
        
        setCountries(countriesData.filter(c => c.name && c.stationcount > 0));
        setLanguages(languagesData.filter(l => l.name && l.stationcount > 0));
        setTags(tagsData.filter(t => t.name && t.stationcount > 0));
      } catch (error) {
        console.error('Error loading filter options:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFilterOptions();
  }, []);
  
  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };
  
  const resetFilters = () => {
    setFilters({
      search: '',
      country: '',
      language: '',
      tag: '',
    });
  };
  
  const handleApplyFilters = () => {
    applyFilters();
    setShowFilters(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buscando por:', filters.search);
    applyFilters();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters({ search: value });
  };
  
  const hasActiveFilters = filters.country || filters.language || filters.tag;
  
  return (
    <div className="mb-8">
      {/* Barra de busca principal */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative glass-card p-2">
          <input
            type="text"
            placeholder="🎵 Digite o nome da rádio, país, gênero ou idioma..."
            className="w-full py-4 px-6 pr-16 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none text-lg font-medium"
            value={filters.search}
            onChange={handleSearchChange}
          />
          <button 
            type="submit" 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-3 rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <Search size={20} className="text-white" />
          </button>
        </div>
      </form>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
            showFilters 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
              : 'glass-card text-gray-700 hover:bg-white/90'
          }`}
        >
          <Filter size={20} />
          <span>Filtros Avançados</span>
          {hasActiveFilters && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              {Object.values(filters).filter(v => v && v !== '').length - (filters.search ? 1 : 0)}
            </span>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors duration-300 font-medium"
          >
            <X size={16} />
            <span>Limpar filtros</span>
          </button>
        )}
      </div>
      
      {showFilters && (
        <div className="glass-card p-6 animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="text-blue-500" size={24} />
              <h3 className="text-xl font-bold text-gray-800">Filtrar Estações</h3>
            </div>
            <button 
              onClick={() => setShowFilters(false)}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-300 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <Globe size={16} className="text-blue-500" />
                <span>País ({countries.length} disponíveis)</span>
              </label>
              <select
                className="select-modern"
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                disabled={loading}
              >
                <option value="">🌍 Todos os Países</option>
                {countries.slice(0, 50).map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name} ({country.stationcount})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <Globe size={16} className="text-green-500" />
                <span>Idioma ({languages.length} disponíveis)</span>
              </label>
              <select
                className="select-modern"
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                disabled={loading}
              >
                <option value="">🗣️ Todos os Idiomas</option>
                {languages.slice(0, 30).map((language) => (
                  <option key={language.name} value={language.name}>
                    {language.name} ({language.stationcount})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <Music size={16} className="text-purple-500" />
                <span>Gênero/Tag ({tags.length} disponíveis)</span>
              </label>
              <select
                className="select-modern"
                value={filters.tag}
                onChange={(e) => handleFilterChange('tag', e.target.value)}
                disabled={loading}
              >
                <option value="">🎵 Todos os Gêneros</option>
                {tags.slice(0, 50).map((tag) => (
                  <option key={tag.name} value={tag.name}>
                    {tag.name} ({tag.stationcount})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
              disabled={loading}
            >
              Limpar Tudo
            </button>
            <button
              onClick={handleApplyFilters}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Aplicando...' : 'Aplicar Filtros'}
            </button>
          </div>
        </div>
      )}

      {/* Dicas de busca */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          💡 <strong>Dicas:</strong> Digite exatamente o que procura - nome da rádio, país (ex: "Brazil"), gênero (ex: "rock") ou idioma (ex: "portuguese")
        </p>
      </div>
    </div>
  );
};

export default FilterBar;