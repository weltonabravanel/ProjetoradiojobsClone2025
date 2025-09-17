import { Song, Playlist } from '../types/music';

const STORAGE_KEYS = {
  FAVORITES: 'musicbrasil_favorites',
  RECENT_SONGS: 'musicbrasil_recent',
  PLAYLISTS: 'musicbrasil_playlists',
  SEARCH_HISTORY: 'musicbrasil_search_history',
  USER_PREFERENCES: 'musicbrasil_preferences',
  PLAYBACK_STATE: 'musicbrasil_playback',
} as const;

export const storage = {
  // Favorites
  getFavorites: (): Set<string> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  },

  saveFavorites: (favorites: Set<string>): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(Array.from(favorites)));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  },

  // Recent Songs
  getRecentSongs: (): Song[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RECENT_SONGS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveRecentSongs: (songs: Song[]): void => {
    try {
      const recentSongs = songs.slice(0, 50); // Keep only last 50
      localStorage.setItem(STORAGE_KEYS.RECENT_SONGS, JSON.stringify(recentSongs));
    } catch (error) {
      console.error('Error saving recent songs:', error);
    }
  },

  addToRecent: (song: Song): Song[] => {
    const recent = storage.getRecentSongs();
    const filtered = recent.filter(s => s.id !== song.id);
    const updated = [song, ...filtered].slice(0, 50);
    storage.saveRecentSongs(updated);
    return updated;
  },

  // Playlists
  getPlaylists: (): Playlist[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  savePlaylists: (playlists: Playlist[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch (error) {
      console.error('Error saving playlists:', error);
    }
  },

  // Search History
  getSearchHistory: (): string[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveSearchHistory: (history: string[]): void => {
    try {
      const trimmed = history.slice(0, 20); // Keep only last 20 searches
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  },

  addToSearchHistory: (query: string): string[] => {
    const history = storage.getSearchHistory();
    const filtered = history.filter(h => h !== query);
    const updated = [query, ...filtered].slice(0, 20);
    storage.saveSearchHistory(updated);
    return updated;
  },

  // User Preferences
  getUserPreferences: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return stored ? JSON.parse(stored) : {
        theme: 'dark',
        language: 'pt-BR',
        audioQuality: 'high',
        autoPlay: true,
        notifications: true,
      };
    } catch {
      return {
        theme: 'dark',
        language: 'pt-BR',
        audioQuality: 'high',
        autoPlay: true,
        notifications: true,
      };
    }
  },

  saveUserPreferences: (preferences: any): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  },

  // Clear all data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};