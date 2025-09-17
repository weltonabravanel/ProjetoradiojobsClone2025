import { Song } from '../types/music';

export const getImageUrl = (song: Song): string => {
  if (!song.image || song.image.length === 0) {
    return 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop';
  }
  
  return song.image.find((img) => img.quality === '500x500')?.url || 
         song.image.find((img) => img.quality === '150x150')?.url || 
         song.image[0]?.url ||
         'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=500&h=500&fit=crop';
};

export const getThumbnailUrl = (song: Song): string => {
  if (!song.image || song.image.length === 0) {
    return 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
  }
  
  return song.image.find((img) => img.quality === '150x150')?.url || 
         song.image[0]?.url ||
         'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';
};

export const getAudioUrl = (song: Song): string => {
  return song.downloadUrl.find((url) => url.quality === '320kbps')?.url ||
         song.downloadUrl.find((url) => url.quality === '160kbps')?.url ||
         song.downloadUrl[0]?.url || '';
};

export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const generatePlaylist = (songs: Song[], currentSong: Song, isShuffled: boolean): Song[] => {
  if (isShuffled) {
    const otherSongs = songs.filter(song => song.id !== currentSong.id);
    const shuffledOthers = shuffleArray(otherSongs);
    return [currentSong, ...shuffledOthers];
  }
  return songs;
};

export const getNextSong = (
  currentSong: Song,
  playlist: Song[],
  isShuffled: boolean,
  repeatMode: 'none' | 'one' | 'all'
): Song | null => {
  if (repeatMode === 'one') {
    return currentSong;
  }

  const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
  
  if (isShuffled) {
    // Em modo shuffle, escolhe uma música aleatória diferente da atual
    const availableSongs = playlist.filter(song => song.id !== currentSong.id);
    if (availableSongs.length === 0) return null;
    return availableSongs[Math.floor(Math.random() * availableSongs.length)];
  }

  const nextIndex = currentIndex + 1;
  
  if (nextIndex >= playlist.length) {
    // Se chegou ao fim da playlist
    if (repeatMode === 'all') {
      return playlist[0]; // Volta para o início
    } else {
      // Modo 'none' - continua com música aleatória da mesma playlist
      return playlist[Math.floor(Math.random() * playlist.length)];
    }
  }
  
  return playlist[nextIndex];
};

export const getPreviousSong = (
  currentSong: Song,
  playlist: Song[],
  isShuffled: boolean
): Song | null => {
  if (isShuffled) {
    const availableSongs = playlist.filter(song => song.id !== currentSong.id);
    if (availableSongs.length === 0) return null;
    return availableSongs[Math.floor(Math.random() * availableSongs.length)];
  }

  const currentIndex = playlist.findIndex(song => song.id === currentSong.id);
  const prevIndex = currentIndex - 1;
  
  if (prevIndex < 0) {
    return playlist[playlist.length - 1];
  }
  
  return playlist[prevIndex];
};

export const calculatePlaylistDuration = (songs: Song[]): number => {
  return songs.reduce((total, song) => total + song.duration, 0);
};

// Commercial System
export interface Commercial {
  id: string;
  title: string;
  advertiser: string;
  audioUrl: string;
  duration: number;
  image: string;
}

export const brazilianCommercials: Commercial[] = [
  {
    id: 'comm_1',
    title: 'Coca-Cola Brasil - Abra a Felicidade',
    advertiser: 'Coca-Cola',
    audioUrl: 'https://comerciais.netlify.app/mercadolivre.mp3',
    duration: 30,
    image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
   {
    id: 'comm_2',
    title: 'Bradesco - Banco do Brasil',
    advertiser: 'Bradesco',
    audioUrl: 'https://comerciais.netlify.app/claroprezao.mp3',
    duration: 25,
    image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'comm_3',
    title: 'Bradesco - Banco do Brasil',
    advertiser: 'Bradesco',
    audioUrl: 'https://comerciais.netlify.app/vacina.mp3',
    duration: 25,
    image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'comm_4',
    title: 'Skol - A Cerveja que Desce Redondo',
    advertiser: 'Skol',
    audioUrl: 'https://comerciais.netlify.app/trivago.mp3',
    duration: 20,
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'comm_5',
    title: 'Magazine Luiza - Vem ser Feliz',
    advertiser: 'Magazine Luiza',
    audioUrl: 'https://comerciais.netlify.app/mercadolivre19reais.mp3',
    duration: 35,
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'comm_6',
    title: 'Itaú - Feito para Você',
    advertiser: 'Itaú',
    audioUrl: 'https://comerciais.netlify.app/caixa.mp3',
    duration: 30,
    image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'comm_7',
    title: 'Casas Bahia - Quer Pagar Quanto?',
    advertiser: 'Casas Bahia',
    audioUrl: 'https://comerciais.netlify.app/pagbank.mp3',
    duration: 25,
    image: 'https://images.pexels.com/photos/1005638/pexels-photo-1005638.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'comm_8',
    title: 'Natura - Bem Estar Bem',
    advertiser: 'Natura',
    audioUrl: 'https://comerciais.netlify.app/bradesco.mp3',
    duration: 30,
    image: 'https://images.pexels.com/photos/1029896/pexels-photo-1029896.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'comm_9',
    title: 'Spotify Premium - Música sem Limites',
    advertiser: 'Spotify',
    audioUrl: 'hhttps://comerciais.netlify.app/claro.mp3',
    duration: 20,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
  {
    id: 'comm_10',
    title: 'Spotify Premium - Música sem Limites',
    advertiser: 'Spotify',
    audioUrl: 'https://comerciais.netlify.app/sky.mp3',
    duration: 20,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  },
  {
    id: 'comm_11',
    title: 'Spotify Premium - Música sem Limites',
    advertiser: 'Spotify',
    audioUrl: 'https://comerciais.netlify.app/itau.mp3',
    duration: 20,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'

  },
  {
    id: 'comm_12',
    title: 'Spotify Premium - Música sem Limites',
    advertiser: 'Spotify',
    audioUrl: 'https://comerciais.netlify.app/google.mp3',
    duration: 20,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
  }
];

export const getRandomCommercial = (): Commercial => {
  const randomIndex = Math.floor(Math.random() * brazilianCommercials.length);
  return brazilianCommercials[randomIndex];
};

export const shouldPlayCommercial = (): boolean => {
  // Play commercial before every song (100% chance)
  // You can adjust this logic to play commercials less frequently
  return true;

};
