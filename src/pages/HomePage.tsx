import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Heart, Globe, Headphones, TrendingUp, Star, Music } from 'lucide-react';
import StationList from '../components/StationList';
import { useRadio } from '../contexts/RadioContext';
import { fetchStations } from '../services/api';
import { RadioStation } from '../types/station';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { stations, isLoading, error, recentlyPlayed } = useRadio();
  const [popularStations, setPopularStations] = useState<RadioStation[]>([]);
  const [featuredStations, setFeaturedStations] = useState<RadioStation[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [brazilStations, setBrazilStations] = useState<RadioStation[]>([]);
  const [loadingBrazil, setLoadingBrazil] = useState(false);

  useEffect(() => {
    document.title = 'Rádio Jobs - A batida do Brasil 🇧🇷';

    const CACHE_TTL = 1000 * 60 * 10;

    const getFromCache = (key: string) => {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      const isValid = Date.now() - parsed.timestamp < CACHE_TTL;
      return isValid ? parsed.data : null;
    };

    const saveToCache = (key: string, data: any) => {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    };

    const loadStations = async () => {
      setLoadingPopular(true);
      try {
        const cached = getFromCache('popularStations');
        if (cached) {
          setPopularStations(cached.slice(0, 12));
          setFeaturedStations(cached.slice(12, 24));
        } else {
          const data = await fetchStations({}, 100);
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          setPopularStations(shuffled.slice(0, 12));
          setFeaturedStations(shuffled.slice(12, 24));
          saveToCache('popularStations', shuffled);
        }
      } catch (err) {
        console.error('Erro ao carregar estações:', err);
      } finally {
        setLoadingPopular(false);
      }
    };

    const loadBrazilStations = async () => {
      setLoadingBrazil(true);
      try {
        const cached = getFromCache('brazilStations');
        if (cached) {
          setBrazilStations(cached.slice(0, 12));
        } else {
          const data = await fetchStations({ country: 'Brazil' }, 50);
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          setBrazilStations(shuffled.slice(0, 12));
          saveToCache('brazilStations', shuffled);
        }
      } catch (err) {
        console.error('Erro ao carregar rádios do Brasil:', err);
      } finally {
        setLoadingBrazil(false);
      }
    };

    loadStations();
    loadBrazilStations();
  }, []);

  return (
    <div className="space-y-20 bg-gradient-to-b from-green-600 via-yellow-400 to-blue-600 min-h-screen pb-20">
      {/* Cabeçalho estilo Brasil */}
      <header className="bg-gradient-to-r from-green-700 via-yellow-500 to-blue-700 text-white text-center py-10 shadow-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-md tracking-wide">
          🎧 Rádio Jobs - A Batida do Brasil 🇧🇷
        </h1>
        <p className="mt-3 text-lg font-medium">
          Conectando o Brasil através da música e da energia nacional!
        </p>
      </header>

      {/* Stories */}
      <section className="animate-slide-up px-4">
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {[
            { name: 'Jovem Pan', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Jovem_Pan_FM_logo_2018_%282%29.png', url: 'https://jovempan.com.br' },
            { name: 'CBN', logo: 'https://s3.glbimg.com/v1/AUTH_3ec28e89a5754c7b937cbc7ade6b1ace/assets/common/cbn-1024x1024.svg', url: 'https://cbn.globoradio.globo.com' },
            { name: 'BandNews', logo: 'https://img.band.com.br/image/2025/03/28/lofo-ao-vivo-bandnews-91316_300x300.png', url: 'https://bandnewsfm.band.uol.com.br' },
            { name: 'Transamérica', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Rede_Transam%C3%A9rica_logo.png', url: 'https://transamerica.com.br' },
          ].map((station, idx) => (
            <a
              key={idx}
              href={station.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center cursor-pointer hover:scale-110 transition-all duration-300 group min-w-[100px]"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-white">
                  <img
                    src={station.logo}
                    alt={station.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <span className="text-sm font-semibold text-white mt-2 text-center max-w-[90px] truncate">
                {station.name}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Banner com tema Brasil */}
      <section className="w-full mx-auto relative rounded-2xl overflow-hidden shadow-2xl text-white aspect-[16/9] max-h-[720px] border-4 border-yellow-300">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
          className="w-full h-full"
        >
          {[
            {
              href: "https://radiojobs.com.br",
              img: "https://i0.wp.com/radio98fm.com/wp-content/uploads/2024/11/banner-site-98FM-1.png?fit=1920%2C560&ssl=1",
              title: "🇧🇷 Viva a Música Brasileira!",
              text: "Do samba ao sertanejo, da MPB ao funk — o Brasil tem ritmo, tem alma e tem Rádio Jobs!",
            },
            {
              href: "https://radioliberdade.com.br/",
              img: "https://radioliberdade.com.br/imagens/upload/destaquehome/1200x400-679137a3e2a9b-1737570211.jpg",
              title: "🎶 Ritmo que Une o Brasil",
              text: "Descubra estações que levam o calor e a alegria do nosso povo pra todo o mundo.",
            },
          ].map((slide, index) => (
            <SwiperSlide key={index}>
              <a href={slide.href} target="_blank" rel="noopener noreferrer" className="block relative w-full h-full group">
                <img src={slide.img} alt={slide.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-800/70 via-yellow-600/50 to-blue-700/40"></div>
                <div className="relative z-10 p-10 max-w-xl">
                  <h2 className="text-4xl font-extrabold text-white drop-shadow-lg mb-4">{slide.title}</h2>
                  <p className="text-lg text-yellow-100">{slide.text}</p>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Rádios do Brasil */}
      <section className="px-4 animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Globe className="text-yellow-300" size={32} /> Rádios do Brasil
          </h2>
          <button
            onClick={() => navigate('/browse?country=Brazil')}
            className="px-6 py-3 bg-yellow-400 text-green-900 font-bold rounded-xl shadow-md hover:bg-yellow-500 transition-all"
          >
            Ver Todas
          </button>
        </div>
        <StationList stations={brazilStations} isLoading={loadingBrazil} emptyMessage="Nenhuma estação brasileira disponível." />
      </section>

      {/* Estações Populares */}
      <section className="px-4 animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <TrendingUp className="text-green-300" size={32} /> Mais Ouvidas
          </h2>
        </div>
        <StationList stations={popularStations} isLoading={loadingPopular} emptyMessage="Carregando estações..." />
      </section>

      {/* Em Destaque */}
      <section className="px-4 animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Star className="text-blue-300" size={32} /> Em Destaque
          </h2>
        </div>
        <StationList stations={featuredStations} isLoading={loadingPopular} emptyMessage="Nenhuma estação em destaque." />
      </section>

      {/* Rodapé */}
      <footer className="bg-green-800 text-yellow-300 py-8 text-center font-semibold shadow-inner">
        <p>🇧🇷 Rádio Jobs — O Som do Brasil, onde quer que você esteja!</p>
      </footer>
    </div>
  );
};

export default HomePage;

