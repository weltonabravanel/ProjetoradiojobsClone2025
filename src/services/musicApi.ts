import { Song, SearchResponse } from '../types/music';

const API_BASE_URL = 'https://jiosavan-api-with-playlist.vercel.app/api';

class MusicApiService {
  private cache = new Map<string, { data: Song[]; timestamp: number }>();
  private readonly CACHE_DURATION = 2 * 60 * 1000; // Reduzido para 2 minutos para mais variedade

  private getCacheKey(query: string, limit: number): string {
    return `${query}_${limit}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async searchSongs(query: string, limit = 150): Promise<Song[]> {
    const cacheKey = this.getCacheKey(query, limit);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isCacheValid(cached.timestamp)) {
      return this.shuffleArray(cached.data); // Sempre embaralha mesmo do cache
    }

    try {
      // Para buscas com mais de 100 resultados, fazemos múltiplas requisições
      const results: Song[] = [];
      const maxPerRequest = 50; // Limite por requisição da API
      const totalRequests = Math.ceil(limit / maxPerRequest);

      for (let page = 0; page < totalRequests; page++) {
        const response = await fetch(
          `${API_BASE_URL}/search/songs?query=${encodeURIComponent(query)}&limit=${maxPerRequest}&page=${page}`
        );
        
        if (!response.ok) {
          console.warn(`API request failed for page ${page}: ${response.status}`);
          continue;
        }

        const data: SearchResponse = await response.json();

        if (data.success && data.data.results) {
          results.push(...data.data.results);
          
          // Se recebemos menos resultados que o esperado, provavelmente chegamos ao fim
          if (data.data.results.length < maxPerRequest) {
            break;
          }
        }

        // Pequeno delay entre requisições para não sobrecarregar a API
        if (page < totalRequests - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      // Remove duplicatas baseado no ID
      const uniqueResults = this.removeDuplicates(results);
      
      // Se ainda não temos resultados suficientes, tenta variações da busca
      if (uniqueResults.length < limit && uniqueResults.length > 0) {
        const additionalResults = await this.getAdditionalSearchResults(query, limit - uniqueResults.length);
        uniqueResults.push(...additionalResults);
      }

      const finalResults = this.removeDuplicates(uniqueResults).slice(0, limit);
      this.cache.set(cacheKey, { data: finalResults, timestamp: Date.now() });
      return this.shuffleArray(finalResults);

    } catch (error) {
      console.error('Error searching songs:', error);
      return [];
    }
  }

  private async getAdditionalSearchResults(originalQuery: string, needed: number): Promise<Song[]> {
    // Gera variações da busca para obter mais resultados
    const variations = this.generateSearchVariations(originalQuery);
    const additionalResults: Song[] = [];

    for (const variation of variations) {
      if (additionalResults.length >= needed) break;

      try {
        const response = await fetch(
          `${API_BASE_URL}/search/songs?query=${encodeURIComponent(variation)}&limit=30`
        );
        
        if (response.ok) {
          const data: SearchResponse = await response.json();
          if (data.success && data.data.results) {
            additionalResults.push(...data.data.results);
          }
        }
      } catch (error) {
        console.warn('Error in additional search:', error);
      }

      // Delay entre variações
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    return additionalResults;
  }

  private generateSearchVariations(query: string): string[] {
    const variations: string[] = [];
    const words = query.toLowerCase().split(' ');

    // Adiciona termos relacionados à música brasileira
    const brazilianTerms = [
      'brasileiro', 'brasil', 'nacional', 'música', 'hit', 'sucesso',
      'sertanejo', 'funk', 'mpb', 'pagode', 'forró', 'axé', 'bossa nova',
      'rock nacional', 'pop brasileiro', 'rap nacional'
    ];

    // Variações com termos brasileiros
    brazilianTerms.forEach(term => {
      if (!query.toLowerCase().includes(term)) {
        variations.push(`${query} ${term}`);
      }
    });

    // Se a busca contém nome de artista, adiciona variações
    if (words.length <= 3) {
      variations.push(`${query} hits`);
      variations.push(`${query} melhores`);
      variations.push(`${query} sucessos`);
      variations.push(`${query} top`);
    }

    // Variações removendo palavras comuns
    const commonWords = ['música', 'brasileiro', 'brasil', 'hit', 'hits'];
    const filteredWords = words.filter(word => !commonWords.includes(word));
    if (filteredWords.length > 0 && filteredWords.length < words.length) {
      variations.push(filteredWords.join(' '));
    }

    return variations.slice(0, 5); // Limita a 5 variações para não sobrecarregar
  }

  async getTrendingSongs(): Promise<Song[]> {
    const trendingQueries = [
      // Sertanejo
      'sertanejo 2024 hits',
      'gusttavo lima henrique juliano',
      'marília mendonça maiara maraisa',
      'jorge mateus zé neto cristiano',
      'luan santana wesley safadão',
      
      // Funk
      'funk brasileiro 2024',
      'anitta ludmilla pabllo vittar',
      'mc kevinho mc hariel',
      'funk carioca hits',
      
      // Pop/MPB
      'música popular brasileira 2024',
      'iza luísa sonza',
      'caetano veloso gilberto gil',
      'djavan milton nascimento',
      
      // Forró/Nordeste
      'forró 2024 xand avião',
      'wesley safadão solange almeida',
      'banda magníficos',
      
      // Rock Nacional
      'rock nacional brasileiro',
      'legião urbana capital inicial',
      'skank jota quest',
      
      // Pagode/Samba
      'pagode 2024 thiaguinho',
      'samba brasileiro turma do pagode',
      'grupo revelação exaltasamba',
      
      // Eletrônica/Dance
      'alok vintage culture',
      'música eletrônica brasileira',
      
      // Rap Nacional
      'rap brasileiro emicida criolo',
      'hip hop nacional 2024'
    ];

    // Seleciona queries aleatórias para cada carregamento
    const selectedQueries = this.shuffleArray(trendingQueries).slice(0, 8);
    
    const allResults = await Promise.all(
      selectedQueries.map(query => this.searchSongs(query, 8))
    );

    const allSongs = allResults.flat();
    const uniqueSongs = this.removeDuplicates(allSongs);
    
    return this.shuffleArray(uniqueSongs).slice(0, 50);
  }

  async getNewReleases(): Promise<Song[]> {
    const queries = [
      // Lançamentos gerais
      'lançamentos 2024 brasil música',
      'novidades música brasileira 2024',
      'hits recentes brasil',
      'música nova brasileira',
      
      // Por gênero
      'sertanejo lançamentos 2024',
      'funk lançamentos 2024',
      'pop brasileiro lançamentos',
      'forró novidades 2024',
      'pagode lançamentos 2024',
      'rap brasileiro lançamentos',
      'rock nacional lançamentos',
      
      // Artistas específicos com lançamentos
      'anitta nova música 2024',
      'gusttavo lima lançamento',
      'henrique juliano nova',
      'wesley safadão lançamento',
      'luísa sonza nova música',
      'alok lançamento 2024'
    ];

    // Seleciona queries aleatórias
    const selectedQueries = this.shuffleArray(queries).slice(0, 6);

    const allResults = await Promise.all(
      selectedQueries.map(query => this.searchSongs(query, 8))
    );

    const uniqueSongs = this.removeDuplicates(allResults.flat());
    return this.shuffleArray(uniqueSongs).slice(0, 30);
  }

  async getClassicSongs(): Promise<Song[]> {
    const classicCategories = [
      // MPB Clássicos
      'tom jobim bossa nova clássicos',
      'elis regina mpb clássica',
      'chico buarque clássicos',
      'caetano veloso clássicos',
      'gilberto gil clássicos',
      'milton nascimento clássicos',
      'maria bethânia clássicos',
      'gal costa clássicos',
      
      // Samba Clássicos
      'cartola samba clássico',
      'nelson cavaquinho samba',
      'clara nunes samba',
      'beth carvalho samba',
      'martinho da vila samba',
      
      // Rock Nacional Clássico
      'legião urbana clássicos',
      'cazuza clássicos',
      'capital inicial clássicos',
      'titãs clássicos',
      'paralamas clássicos',
      
      // Bossa Nova
      'joão gilberto bossa nova',
      'stan getz bossa nova',
      'astrud gilberto bossa nova',
      
      // Música Romântica
      'roberto carlos clássicos',
      'erasmo carlos clássicos',
      'fábio jr clássicos',
      
      // Forró Clássico
      'luiz gonzaga forró clássico',
      'dominguinhos forró',
      'jackson do pandeiro',
      
      // Axé Clássico
      'ivete sangalo clássicos',
      'chiclete com banana',
      'banda eva clássicos'
    ];

    // Seleciona categorias aleatórias
    const selectedCategories = this.shuffleArray(classicCategories).slice(0, 8);

    const allResults = await Promise.all(
      selectedCategories.map(category => this.searchSongs(category, 6))
    );

    const uniqueSongs = this.removeDuplicates(allResults.flat());
    return this.shuffleArray(uniqueSongs).slice(0, 40);
  }

  async getSongsByGenre(genre: string, limit = 150): Promise<Song[]> {
    return this.searchSongs(genre, limit);
  }

  async getSongsByArtist(artist: string, limit = 100): Promise<Song[]> {
    return this.searchSongs(artist, limit);
  }

  async getRecommendations(basedOnSongs: Song[], limit = 50): Promise<Song[]> {
    if (basedOnSongs.length === 0) {
      return this.getTrendingSongs();
    }

    // Get recommendations based on artists and genres of favorite songs
    const artists = new Set(
      basedOnSongs.flatMap(song => song.artists.primary.map(a => a.name))
    );

    const recommendationQueries = Array.from(artists).slice(0, 5);
    
    const allResults = await Promise.all(
      recommendationQueries.map(query => this.searchSongs(query, 15))
    );

    const recommendations = this.removeDuplicates(allResults.flat())
      .filter(song => !basedOnSongs.some(baseSong => baseSong.id === song.id));

    return this.shuffleArray(recommendations).slice(0, limit);
  }

  private removeDuplicates(songs: Song[]): Song[] {
    const seen = new Set<string>();
    return songs.filter(song => {
      if (seen.has(song.id)) {
        return false;
      }
      seen.add(song.id);
      return true;
    });
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Método para forçar atualização das seções principais
  async refreshMainSections(): Promise<{
    trending: Song[];
    newReleases: Song[];
    classics: Song[];
  }> {
    // Limpa cache das seções principais
    this.clearMainSectionsCache();
    
    const [trending, newReleases, classics] = await Promise.all([
      this.getTrendingSongs(),
      this.getNewReleases(),
      this.getClassicSongs(),
    ]);

    return { trending, newReleases, classics };
  }

  private clearMainSectionsCache(): void {
    // Remove entradas específicas do cache relacionadas às seções principais
    const keysToRemove: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (key.includes('sertanejo') || 
          key.includes('funk') || 
          key.includes('lançamentos') || 
          key.includes('clássicos') ||
          key.includes('hits') ||
          key.includes('nova') ||
          key.includes('2024')) {
        keysToRemove.push(key);
      }
    });
    
    keysToRemove.forEach(key => this.cache.delete(key));
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const musicApi = new MusicApiService();