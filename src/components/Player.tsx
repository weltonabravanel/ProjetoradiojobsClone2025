import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Heart, SkipBack, Radio } from 'lucide-react';
import { useRadio } from '../contexts/RadioContext';
import CommercialPlayer from './CommercialPlayer';

const Player: React.FC = () => {
  const {
    currentStation,
    isPlaying,
    togglePlay,
    volume,
    setVolume,
    toggleFavorite,
    isFavorite,
    recentlyPlayed,
    setCurrentStation
  } = useRadio();

  // Lista expandida de comerciais em MP3
  const commercialUrls = [
    'https://comerciais.netlify.app/mercadopago.mp3',
    'https://comerciais.netlify.app/claroprezao.mp3',
    'https://comerciais.netlify.app/mercadolivre19reais.mp3',
    'https://comerciais.netlify.app/caixa.mp3',
    'https://comerciais.netlify.app/timblack.mp3',
    'https://comerciais.netlify.app/mercadolivre.mp3',
    'https://comerciais.netlify.app/vacina.mp3',
    'https://comerciais.netlify.app/trivago.mp3',
    'https://comerciais.netlify.app/pagbank.mp3',
    'https://comerciais.netlify.app/bradesco.mp3',
    'https://comerciais.netlify.app/claro.mp3',
    'https://comerciais.netlify.app/sky.mp3',
    'https://comerciais.netlify.app/itau.mp3',
    'https://comerciais.netlify.app/google.mp3',
    'https://comerciais.netlify.app/google2.mp3',
    'https://comerciais.netlify.app/google3.mp3'
  ];

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const [isPlayingCommercial, setIsPlayingCommercial] = useState(false);
  const [pendingStation, setPendingStation] = useState<typeof currentStation>(null);
  const [userRequestedPlay, setUserRequestedPlay] = useState(false);
  const [currentTrackTitle, setCurrentTrackTitle] = useState('');
  const [commercialTimeLeft, setCommercialTimeLeft] = useState(0);
  const [canSkipCommercial, setCanSkipCommercial] = useState(false);
  const [currentCommercial, setCurrentCommercial] = useState<{
    title: string;
    advertiser: string;
    image: string;
  } | null>(null);
  const [commercialProgress, setCommercialProgress] = useState(0);
  const [commercialDuration, setCommercialDuration] = useState(0);

  // Dados dos comerciais com informações visuais
  const commercialData: { [key: string]: { title: string; advertiser: string; image: string } } = {
    'https://www.radiojobs.com.br/claroprezao.mp3': {
      title: 'Claro Prezão - Internet que Conecta',
      advertiser: 'Claro',
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    'https://www.radiojobs.com.br/mercadolivre19reais.mp3': {
      title: 'Mercado Livre - Frete Grátis',
      advertiser: 'Mercado Livre',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    'https://www.radiojobs.com.br/caixa.mp3': {
      title: 'Caixa Econômica Federal',
      advertiser: 'Caixa',
      image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    'https://www.radiojobs.com.br/timblack.mp3': {
      title: 'Tim Black - Conecte-se',
      advertiser: 'Tim',
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    'https://www.radiojobs.com.br/mercadolivre.mp3': {
      title: 'Mercado Livre - Compre e Venda',
      advertiser: 'Mercado Livre',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    'https://www.radiojobs.com.br/vacina.mp3': {
      title: 'Campanha de Vacinação',
      advertiser: 'Ministério da Saúde',
      image: 'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    'https://www.radiojobs.com.br/trivago.mp3': {
      title: 'Trivago - Compare Hotéis',
      advertiser: 'Trivago',
      image: 'https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    'https://www.radiojobs.com.br/pagbank.mp3': {
      title: 'PagBank - Banco Digital',
      advertiser: 'PagBank',
      image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    'https://www.radiojobs.com.br/bradesco.mp3': {
      title: 'Bradesco - Banco do Futuro',
      advertiser: 'Bradesco',
      image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    'https://www.radiojobs.com.br/claro.mp3': {
      title: 'Claro - Conecte-se ao Melhor',
      advertiser: 'Claro',
      image: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    'https://www.radiojobs.com.br/sky.mp3': {
      title: 'Sky - TV por Assinatura',
      advertiser: 'Sky',
      image: 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    'https://www.radiojobs.com.br/itau.mp3': {
      title: 'Itaú - Feito para Você',
      advertiser: 'Itaú',
      image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    'https://www.radiojobs.com.br/google.mp3': {
      title: 'Google - Pesquise Tudo',
      advertiser: 'Google',
      image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    'https://www.radiojobs.com.br/google3.mp3': {
      title: 'Google Ads - Anuncie Aqui',
      advertiser: 'Google Ads',
      image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    }
  };

  // Função para selecionar comercial aleatório
  const getRandomCommercial = (): string => {
    const randomIndex = Math.floor(Math.random() * commercialUrls.length);
    return commercialUrls[randomIndex];
  };

  // Função para obter dados do comercial
  const getCommercialInfo = (url: string) => {
    const fileName = url.split('/').pop() || '';
    return commercialData[fileName] || {
      title: 'Comercial',
      advertiser: 'Anunciante',
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    };
  };

  // Sempre que uma nova estação for selecionada, tocar comercial primeiro
  useEffect(() => {
    if (!currentStation) return;
    
    // Se não há requisição do usuário ou já está tocando comercial, apenas armazena a estação pendente
    if (!userRequestedPlay || isPlayingCommercial) {
      setPendingStation(currentStation);
      return;
    }
    
    // Inicia o comercial antes da rádio
    playCommercialBeforeStation(currentStation);
  }, [currentStation]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (isPlayingCommercial && pendingStation) {
        // Comercial terminou, tocar a rádio
        playRadioStation(pendingStation);
      } else {
        // Rádio parou
        setUserRequestedPlay(false);
      }
    };

    const handleMetadata = () => {
      if (audioRef.current && !isPlayingCommercial) {
        setCurrentTrackTitle(audioRef.current.title || '');
      }
    };

    const handleTimeUpdate = () => {
      if (isPlayingCommercial && audio.duration && !isNaN(audio.duration)) {
        const progress = (audio.currentTime / audio.duration) * 100;
        setCommercialProgress(progress);
        setCommercialTimeLeft(Math.max(0, Math.ceil(audio.duration - audio.currentTime)));
        
        // Permitir pular após 5 segundos
        if (audio.currentTime >= 5 && !canSkipCommercial) {
          setCanSkipCommercial(true);
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (isPlayingCommercial && audio.duration && !isNaN(audio.duration)) {
        setCommercialDuration(audio.duration);
      }
    };

    const handleError = (event: Event) => {
      console.error('Erro no áudio:', audio.error);
      if (isPlayingCommercial && pendingStation) {
        // Se o comercial falhar, pular direto para a rádio
        console.log('Comercial falhou, pulando para rádio...');
        playRadioStation(pendingStation);
      }
    };

    const handleCanPlay = () => {
      // Não fazer nada especial aqui, deixar o controle manual
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [isPlayingCommercial, pendingStation, canSkipCommercial]);

  const playCommercialBeforeStation = async (station: typeof currentStation) => {
    if (!audioRef.current || !station) return;
    
    const randomCommercialUrl = getRandomCommercial();
    const commercialInfo = getCommercialInfo(randomCommercialUrl);
    
    console.log(`Tocando comercial: ${commercialInfo.title} (${randomCommercialUrl})`);
    
    try {
      // Para qualquer reprodução atual
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Configura o comercial
      audioRef.current.src = randomCommercialUrl;
      setIsPlayingCommercial(true);
      setPendingStation(station);
      setCurrentCommercial(commercialInfo);
      setCommercialProgress(0);
      setCommercialDuration(0);
      setCanSkipCommercial(false);
      setCommercialTimeLeft(0);
      
      // Carrega e toca o comercial
      audioRef.current.load();
      await audioRef.current.play();
      
      console.log('Comercial iniciado com sucesso');
      
    } catch (error) {
      console.error('Erro ao tocar comercial:', error);
      // Se falhar, pular direto para a rádio
      playRadioStation(station);
    }
  };

  const playRadioStation = async (station: typeof currentStation) => {
    if (!audioRef.current || !station) return;

    console.log(`Tocando rádio: ${station.name}`);
    
    try {
      // Para o áudio atual
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      // Limpa estado do comercial
      setIsPlayingCommercial(false);
      setCanSkipCommercial(false);
      setCurrentCommercial(null);
      setCommercialProgress(0);
      setCommercialDuration(0);
      setCommercialTimeLeft(0);
      
      // Configura a rádio
      audioRef.current.src = station.url_resolved || station.url;
      audioRef.current.volume = volume;
      
      // Carrega e toca a rádio
      audioRef.current.load();
      await audioRef.current.play();
      
      console.log('Rádio iniciada com sucesso');
      
    } catch (error) {
      console.error('Erro ao tocar rádio:', error);
    }
  };

  const skipCommercial = async () => {
    if (!canSkipCommercial || !pendingStation) return;
    
    console.log('Pulando comercial...');
    playRadioStation(pendingStation);
  };

  const handlePlay = () => {
    if (!currentStation || !audioRef.current) return;
    
    if (isPlaying || isPlayingCommercial) {
      // Pausar
      audioRef.current.pause();
      setUserRequestedPlay(false);
      togglePlay();
      return;
    }
    
    // Iniciar reprodução (sempre com comercial primeiro)
    setUserRequestedPlay(true);
    playCommercialBeforeStation(currentStation);
    togglePlay();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume || 0.5);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const playPreviousStation = () => {
    if (recentlyPlayed.length > 1) {
      const previousStation = recentlyPlayed[1];
      setCurrentStation(previousStation);
    }
  };

  const getStationLogo = () => {
    if (!currentStation) return null;
    if (currentStation.favicon && currentStation.favicon !== '') {
      return (
        <img
          src={currentStation.favicon}
          alt={currentStation.name}
          className="h-16 w-16 rounded-2xl object-cover border-4 border-white/30 shadow-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://via.placeholder.com/64/3b82f6/ffffff?text=${currentStation.name.charAt(0)}`;
          }}
        />
      );
    }
    return (
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-xl border-4 border-white/30">
        {currentStation.name.charAt(0)}
      </div>
    );
  };

  if (!currentStation) return null;

  return (
    <div>
      {/* Audio element is always rendered to prevent DOM removal during playback */}
      <audio ref={audioRef} />
      
      {/* Conditional rendering only applies to the UI, not the audio element */}
      {isPlayingCommercial && currentCommercial ? (
        <CommercialPlayer
          commercial={currentCommercial}
          isPlaying={isPlaying}
          currentTime={commercialProgress}
          duration={commercialDuration}
          canSkip={canSkipCommercial}
          onPlayPause={handlePlay}
          onSkip={skipCommercial}
        />
      ) : (
        <div className="glass-card-dark p-6 max-w-6xl mx-auto animate-pulse-glow">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Info da Estação */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {getStationLogo()}
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold truncate text-white">{currentStation.name}</h3>
                <div className="flex items-center gap-2 text-blue-200 text-sm">
                  <span>{currentStation.country}</span>
                  {currentStation.tags && (
                    <>
                      <span>•</span>
                      <span className="truncate">{currentStation.tags.split(',')[0]}</span>
                    </>
                  )}
                </div>
                {currentTrackTitle && !isPlayingCommercial && (
                  <p className="text-xs text-purple-300 truncate mt-1">
                    ♪ {currentTrackTitle}
                  </p>
                )}
                {pendingStation && !isPlaying && (
                  <p className="text-xs text-yellow-300 truncate mt-1 animate-pulse">
                    📻 Próxima: {pendingStation.name}
                  </p>
                )}
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-4">
              <button
                onClick={playPreviousStation}
                disabled={recentlyPlayed.length <= 1}
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  recentlyPlayed.length <= 1 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'hover:bg-white/20 hover:scale-110'
                }`}
              >
                <SkipBack size={24} className="text-white" />
              </button>

              <button
                onClick={handlePlay}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-4 rounded-2xl shadow-xl hover:scale-110 transition-all duration-300 relative overflow-hidden"
              >
                {(isPlaying || isPlayingCommercial) ? (
                  <Pause size={28} className="text-white relative z-10" />
                ) : (
                  <Play size={28} className="text-white relative z-10" />
                )}
                <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => toggleFavorite(currentStation)}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                  isFavorite(currentStation.stationuuid)
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white'
                    : 'hover:bg-white/20 text-white'
                }`}
              >
                <Heart size={24} fill={isFavorite(currentStation.stationuuid) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Volume e Visualizador */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <button 
                onClick={toggleMute}
                className="p-2 rounded-xl hover:bg-white/20 transition-all duration-300 text-white"
              >
                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 lg:w-32 h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 ${volume * 100}%, rgba(255,255,255,0.2) ${volume * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />

              {(isPlaying || isPlayingCommercial) && (
                <div className="wave-animation ml-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="wave-bar"></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;
