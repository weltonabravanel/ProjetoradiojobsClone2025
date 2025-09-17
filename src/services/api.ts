import axios from 'axios';
import { RadioStation, RadioFilters } from '../types/station';

// URLs base com suporte HTTP e HTTPS
const BASE_URLS = [
  'https://de2.api.radio-browser.info/json',
  'https://fi1.api.radio-browser.info/json',
  'https://all.api.radio-browser.info/json',
  'https://de1.api.radio-browser.info/json',
  'http://all.api.radio-browser.info/json',
  'http://de1.api.radio-browser.info/json',
];

// Cache simples em memória com TTL
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 2 * 60 * 1000; // 2 minutos para busca mais atualizada

// Gera chave única para cache com base no endpoint e parâmetros
const generateCacheKey = (endpoint: string, params?: any) => {
  const paramString = params ? JSON.stringify(params) : '';
  return `${endpoint}::${paramString}`;
};

// Verifica se o cache é válido
const isCacheValid = (timestamp: number) => {
  return Date.now() - timestamp < CACHE_TTL;
};

// Função genérica de fetch com fallback entre múltiplas bases
const fetchWithFallback = async <T>(
  endpoint: string,
  options: { params?: any; headers?: any } = {}
): Promise<T | null> => {
  const cacheKey = generateCacheKey(endpoint, options.params);

  // Verifica cache válido
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (isCacheValid(cached.timestamp)) {
      return cached.data as T;
    } else {
      cache.delete(cacheKey);
    }
  }

  for (const baseUrl of BASE_URLS) {
    try {
      const response = await axios.get(`${baseUrl}/${endpoint}`, {
        ...options,
        timeout: 8000, // 8 segundos de timeout
      });
      
      // Armazena no cache com timestamp
      cache.set(cacheKey, { 
        data: response.data, 
        timestamp: Date.now() 
      });
      
      return response.data;
    } catch (error: any) {
      console.warn(`Erro ao tentar ${baseUrl}/${endpoint}:`, error.message);
    }
  }

  console.error(`Todas as tentativas falharam para o endpoint ${endpoint}`);
  return null;
};

// Converte URLSearchParams para objeto plano
const paramsToObject = (params: URLSearchParams): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
};

export const fetchStations = async (
  filters: Partial<RadioFilters> = {},
  limit = 1000
): Promise<RadioStation[]> => {
  try {
    // Parâmetros básicos
    const params = new URLSearchParams({
      limit: limit.toString(),
      hidebroken: 'true',
      order: 'clickcount',
      reverse: 'true'
    });

    // Aplicar filtros exatos
    if (filters.country && filters.country.trim()) {
      params.append('country', filters.country.trim());
    }
    
    if (filters.language && filters.language.trim()) {
      params.append('language', filters.language.trim());
    }
    
    if (filters.tag && filters.tag.trim()) {
      params.append('tag', filters.tag.trim());
    }

    // Para busca por nome/texto, usar endpoint específico
    if (filters.search && filters.search.trim()) {
      params.append('name', filters.search.trim());
    }

    let data = await fetchWithFallback<RadioStation[]>('stations/search', {
      params: paramsToObject(params),
      headers: { 'User-Agent': 'RadioJobs-Browser/1.0' },
    });

    if (!data) return [];

    // Filtrar apenas estações válidas
    let filteredData = data.filter(station => {
      if (!station.name || station.name.trim() === '') return false;
      if (!station.url_resolved || station.url_resolved.trim() === '') return false;
      return true;
    });

    // Ordenar por relevância simples
    filteredData.sort((a, b) => {
      // Priorizar estações com mais cliques
      return b.clickcount - a.clickcount;
    });

    return filteredData.slice(0, limit);
  } catch (error) {
    console.error('Erro ao buscar estações:', error);
    return [];
  }
};

export const fetchCountries = async (): Promise<
  { name: string; stationcount: number }[]
> => {
  const data = await fetchWithFallback<{ name: string; stationcount: number }[]>(
    'countries',
    {
      headers: { 'User-Agent': 'RadioJobs-Browser/1.0' },
    }
  );
  
  if (!data) return [];
  
  return data.filter(country => 
    country.name && 
    country.name.trim() !== '' && 
    country.stationcount > 0
  ).sort((a, b) => b.stationcount - a.stationcount);
};

export const fetchTags = async (): Promise<
  { name: string; stationcount: number }[]
> => {
  const data = await fetchWithFallback<{ name: string; stationcount: number }[]>(
    'tags',
    {
      params: { limit: '200' },
      headers: { 'User-Agent': 'RadioJobs-Browser/1.0' },
    }
  );
  
  if (!data) return [];
  
  return data.filter(tag => 
    tag.name && 
    tag.name.trim() !== '' && 
    tag.stationcount > 0
  ).sort((a, b) => b.stationcount - a.stationcount);
};

export const fetchLanguages = async (): Promise<
  { name: string; stationcount: number }[]
> => {
  const data = await fetchWithFallback<{ name: string; stationcount: number }[]>(
    'languages',
    {
      params: { limit: '150' },
      headers: { 'User-Agent': 'RadioJobs-Browser/1.0' },
    }
  );
  
  if (!data) return [];
  
  return data.filter(language => 
    language.name && 
    language.name.trim() !== '' && 
    language.stationcount > 0
  ).sort((a, b) => b.stationcount - a.stationcount);
};

// Busca direta e simples por termo exato
export const searchStationsAdvanced = async (
  searchTerm: string,
  limit = 500
): Promise<RadioStation[]> => {
  if (!searchTerm || searchTerm.trim() === '') {
    return fetchStations({}, limit);
  }

  const term = searchTerm.trim();
  
  try {
    // Busca direta por nome da estação
    const params = new URLSearchParams({
      name: term,
      limit: limit.toString(),
      hidebroken: 'true',
      order: 'clickcount',
      reverse: 'true'
    });

    let data = await fetchWithFallback<RadioStation[]>('stations/search', {
      params: paramsToObject(params),
      headers: { 'User-Agent': 'RadioJobs-Browser/1.0' },
    });

    if (!data || data.length === 0) {
      // Se não encontrou por nome, tenta por tag
      const tagParams = new URLSearchParams({
        tag: term,
        limit: limit.toString(),
        hidebroken: 'true',
        order: 'clickcount',
        reverse: 'true'
      });

      data = await fetchWithFallback<RadioStation[]>('stations/search', {
        params: paramsToObject(tagParams),
        headers: { 'User-Agent': 'RadioJobs-Browser/1.0' },
      });
    }

    if (!data || data.length === 0) {
      // Se ainda não encontrou, tenta por país
      const countryParams = new URLSearchParams({
        country: term,
        limit: limit.toString(),
        hidebroken: 'true',
        order: 'clickcount',
        reverse: 'true'
      });

      data = await fetchWithFallback<RadioStation[]>('stations/search', {
        params: paramsToObject(countryParams),
        headers: { 'User-Agent': 'RadioJobs-Browser/1.0' },
      });
    }

    if (!data) return [];

    // Filtrar apenas estações válidas
    const filteredData = data.filter(station => {
      if (!station.name || station.name.trim() === '') return false;
      if (!station.url_resolved || station.url_resolved.trim() === '') return false;
      return true;
    });

    // Ordenar por cliques (mais populares primeiro)
    return filteredData
      .sort((a, b) => b.clickcount - a.clickcount)
      .slice(0, limit);

  } catch (error) {
    console.error('Erro na busca avançada:', error);
    return [];
  }
};