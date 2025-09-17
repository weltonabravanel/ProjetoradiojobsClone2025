export interface Song {
  id: string;
  name: string;
  artists: {
    primary: Array<{
      name: string;
      id: string;
    }>;
  };
  image: Array<{
    quality: string;
    url: string;
  }>;
  downloadUrl: Array<{
    quality: string;
    url: string;
  }>;
  duration: number;
  album: {
    name: string;
    id: string;
  };
  playCount?: number;
  year?: string;
  language?: string;
  genre?: string;
}

export interface SearchResponse {
  success: boolean;
  data: {
    results: Song[];
  };
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  totalDuration: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  preferences: {
    favoriteGenres: string[];
    language: string;
    audioQuality: 'low' | 'medium' | 'high';
  };
  stats: {
    totalListeningTime: number;
    songsPlayed: number;
    favoriteSongs: number;
    playlistsCreated: number;
  };
}

export interface PlaybackState {
  currentSong: Song | null;
  currentPlaylist: Song[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  playbackQueue: Song[];
  originalPlaylist: Song[];
}

export interface AppState {
  playback: PlaybackState;
  favorites: Set<string>;
  recentSongs: Song[];
  playlists: Playlist[];
  searchHistory: string[];
  activeTab: string;
  sidebarOpen: boolean;
  playerExpanded: boolean;
  isLoading: boolean;
  user: UserProfile | null;
}