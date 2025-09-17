import { useState, useEffect, useCallback } from 'react';
import { Song } from '../types/music';
import { storage } from '../utils/storageUtils';
import { musicApi } from '../services/musicApi';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites from storage on mount
  useEffect(() => {
    const storedFavorites = storage.getFavorites();
    setFavorites(storedFavorites);
  }, []);

  // Save to storage whenever favorites change
  useEffect(() => {
    storage.saveFavorites(favorites);
  }, [favorites]);

  const toggleFavorite = useCallback((song: Song) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      
      if (newFavorites.has(song.id)) {
        newFavorites.delete(song.id);
        // Remove from favorite songs list
        setFavoriteSongs(prevSongs => prevSongs.filter(s => s.id !== song.id));
      } else {
        newFavorites.add(song.id);
        // Add to favorite songs list if not already there
        setFavoriteSongs(prevSongs => {
          const exists = prevSongs.some(s => s.id === song.id);
          return exists ? prevSongs : [song, ...prevSongs];
        });
      }
      
      return newFavorites;
    });
  }, []);

  const isFavorite = useCallback((songId: string): boolean => {
    return favorites.has(songId);
  }, [favorites]);

  const addToFavorites = useCallback((song: Song) => {
    if (!favorites.has(song.id)) {
      setFavorites(prev => new Set([...prev, song.id]));
      setFavoriteSongs(prev => {
        const exists = prev.some(s => s.id === song.id);
        return exists ? prev : [song, ...prev];
      });
    }
  }, [favorites]);

  const removeFromFavorites = useCallback((songId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      newFavorites.delete(songId);
      return newFavorites;
    });
    setFavoriteSongs(prev => prev.filter(s => s.id !== songId));
  }, []);

  const clearAllFavorites = useCallback(() => {
    setFavorites(new Set());
    setFavoriteSongs([]);
  }, []);

  const getRecommendationsBasedOnFavorites = useCallback(async () => {
    if (favoriteSongs.length === 0) return [];
    
    setIsLoading(true);
    try {
      const recommendations = await musicApi.getRecommendations(favoriteSongs, 20);
      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [favoriteSongs]);

  const getFavoritesByGenre = useCallback(() => {
    const genreMap = new Map<string, Song[]>();
    
    favoriteSongs.forEach(song => {
      const genre = song.genre || 'Outros';
      if (!genreMap.has(genre)) {
        genreMap.set(genre, []);
      }
      genreMap.get(genre)!.push(song);
    });

    return genreMap;
  }, [favoriteSongs]);

  const exportFavorites = useCallback(() => {
    const exportData = {
      favorites: Array.from(favorites),
      songs: favoriteSongs,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `musicbrasil-favorites-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [favorites, favoriteSongs]);

  return {
    favorites,
    favoriteSongs,
    isLoading,
    toggleFavorite,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites,
    getRecommendationsBasedOnFavorites,
    getFavoritesByGenre,
    exportFavorites,
    count: favorites.size,
  };
};