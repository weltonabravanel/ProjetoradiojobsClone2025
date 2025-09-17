import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { RadioStation, RadioFilters } from '../types/station';
import { fetchStations, searchStationsAdvanced } from '../services/api';

interface RadioContextType {
  stations: RadioStation[];
  isLoading: boolean;
  error: string | null;
  currentStation: RadioStation | null;
  isPlaying: boolean;
  volume: number;
  favorites: RadioStation[];
  recentlyPlayed: RadioStation[];
  filters: RadioFilters;
  setStations: (stations: RadioStation[]) => void;
  setCurrentStation: (station: RadioStation | null) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleFavorite: (station: RadioStation) => void;
  isFavorite: (stationId: string) => boolean;
  setFilters: (filters: Partial<RadioFilters>) => void;
  applyFilters: () => Promise<void>;
}

const defaultFilters: RadioFilters = {
  search: '',
  country: '',
  language: '',
  tag: '',
};

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export const RadioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [favorites, setFavorites] = useState<RadioStation[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<RadioStation[]>([]);
  const [filters, updateFilters] = useState<RadioFilters>(defaultFilters);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStations({}, 500);
        setStations(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar estações de rádio.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load from localStorage
  useEffect(() => {
    try {
      const favs = localStorage.getItem('radio-favorites');
      if (favs) setFavorites(JSON.parse(favs));
    } catch (e) {
      console.warn('Erro ao carregar favoritos do localStorage');
    }

    try {
      const recents = localStorage.getItem('radio-recently-played');
      if (recents) setRecentlyPlayed(JSON.parse(recents));
    } catch (e) {
      console.warn('Erro ao carregar tocadas recentemente do localStorage');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('radio-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('radio-recently-played', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  useEffect(() => {
    if (currentStation) {
      setRecentlyPlayed(prev => {
        const filtered = prev.filter(s => s.stationuuid !== currentStation.stationuuid);
        return [currentStation, ...filtered].slice(0, 10);
      });
    }
  }, [currentStation]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const toggleFavorite = useCallback((station: RadioStation) => {
    setFavorites(prev => {
      const exists = prev.some(s => s.stationuuid === station.stationuuid);
      return exists ? prev.filter(s => s.stationuuid !== station.stationuuid) : [...prev, station];
    });
  }, []);

  const isFavorite = useCallback((stationId: string) => {
    return favorites.some(s => s.stationuuid === stationId);
  }, [favorites]);

  const setFilters = useCallback((newFilters: Partial<RadioFilters>) => {
    updateFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const applyFilters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let data: RadioStation[] = [];
      
      // Busca direta pelo termo
      if (filters.search && filters.search.trim()) {
        console.log('Buscando por:', filters.search.trim());
        data = await searchStationsAdvanced(filters.search.trim(), 1000);
        
        // Aplicar filtros adicionais se especificados
        if (filters.country || filters.language || filters.tag) {
          data = data.filter(station => {
            if (filters.country && station.country.toLowerCase() !== filters.country.toLowerCase()) return false;
            if (filters.language && station.language.toLowerCase() !== filters.language.toLowerCase()) return false;
            if (filters.tag && !station.tags?.toLowerCase().includes(filters.tag.toLowerCase())) return false;
            return true;
          });
        }
      } else {
        // Busca com filtros específicos
        const searchFilters: Partial<RadioFilters> = {};
        if (filters.country) searchFilters.country = filters.country;
        if (filters.language) searchFilters.language = filters.language;
        if (filters.tag) searchFilters.tag = filters.tag;
        
        data = await fetchStations(searchFilters, 1000);
      }
      
      console.log('Resultados encontrados:', data.length);
      setStations(data);
      
      if (data.length === 0) {
        setError('Nenhuma estação encontrada. Tente um termo de busca diferente.');
      }
    } catch (err) {
      console.error('Erro ao aplicar filtros:', err);
      setError('Erro ao buscar estações. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  return (
    <RadioContext.Provider value={{
      stations,
      isLoading,
      error,
      currentStation,
      isPlaying,
      volume,
      favorites,
      recentlyPlayed,
      filters,
      setStations,
      setCurrentStation,
      togglePlay,
      setVolume,
      toggleFavorite,
      isFavorite,
      setFilters,
      applyFilters,
    }}>
      {children}
    </RadioContext.Provider>
  );
};

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (!context) {
    throw new Error('useRadio precisa estar dentro de um RadioProvider');
  }
  return context;
};