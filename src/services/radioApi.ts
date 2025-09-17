const API_ENDPOINTS = [
  
  'https://de2.api.radio-browser.info/json',
  'https://de1.api.radio-browser.info/json',
  'https://fi1.api.radio-browser.info/json',
  'https://all.api.radio-browser.info/json'
];

class RadioApiService {
  private currentEndpointIndex = 0;

  private async fetchWithFallback(path: string, params?: URLSearchParams): Promise<any> {
    let lastError: Error | null = null;

    for (let i = 0; i < API_ENDPOINTS.length; i++) {
      const endpoint = API_ENDPOINTS[this.currentEndpointIndex];
      const url = params 
        ? `${endpoint}${path}?${params.toString()}`
        : `${endpoint}${path}`;

      try {
        const response = await fetch(url, {
          method: 'GET'
        });

        if (response.ok) {
          return await response.json();
        }
        throw new Error(`HTTP ${response.status}`);
      } catch (error) {
        lastError = error as Error;
        this.currentEndpointIndex = (this.currentEndpointIndex + 1) % API_ENDPOINTS.length;
      }
    }

    throw lastError || new Error('All API endpoints failed');
  }

  async getTopStations(limit: number = 100) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      order: 'clickcount',
      reverse: 'true'
    });
    return this.fetchWithFallback('/stations/topvote', params);
  }

  async searchStations(filters: Partial<{
    name: string;
    country: string;
    state: string;
    tag: string;
    language: string;
    limit: number;
    offset: number;
  }>) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });

    if (!params.has('limit')) {
      params.append('limit', '100');
    }

    return this.fetchWithFallback('/stations/search', params);
  }

  async getStationsByCountry(country: string, limit: number = 50) {
    const params = new URLSearchParams({
      country,
      limit: limit.toString(),
      order: 'clickcount',
      reverse: 'true'
    });
    return this.fetchWithFallback('/stations/bycountry/' + encodeURIComponent(country), params);
  }

  async getStationsByState(state: string, limit: number = 50) {
    const params = new URLSearchParams({
      state,
      limit: limit.toString(),
      order: 'clickcount',
      reverse: 'true'
    });
    return this.fetchWithFallback('/stations/bystate/' + encodeURIComponent(state), params);
  }

  async getStationsByTag(tag: string, limit: number = 50) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      order: 'clickcount',
      reverse: 'true'
    });
    return this.fetchWithFallback('/stations/bytag/' + encodeURIComponent(tag), params);
  }

  async getCountries() {
    return this.fetchWithFallback('/countries');
  }

  async getStates() {
    return this.fetchWithFallback('/states');
  }

  async getTags(limit: number = 100) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      order: 'stationcount',
      reverse: 'true'
    });
    return this.fetchWithFallback('/tags', params);
  }

  async getLanguages() {
    return this.fetchWithFallback('/languages');
  }

  async clickStation(stationUuid: string) {
    try {
      await this.fetchWithFallback(`/url/${stationUuid}`);
    } catch (error) {
      console.warn('Failed to register click:', error);
    }
  }
}

export const radioApi = new RadioApiService();