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
    document.title = 'Rádio Jobs - Sua música, seu mundo';

    const CACHE_TTL = 1000 * 60 * 10; // 10 minutos
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
    <div className="bg-white min-h-screen relative">
      {/* Barra superior fixa */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex items-center justify-between px-4 sm:px-6 py-3">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-gray-800">🎧 Rádio Jobs</h1>
        <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition">🔍</button>
      </header>

      {/* Conteúdo com padding top para compensar header */}
      <main className="pt-20 space-y-20 px-4 sm:px-6 lg:px-10">
        {/* Stories de Rádios Famosas */}
        <section className="animate-slide-up">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
            {[ /* ... lista de estações famosas ... */ ].map((station, idx) => (
              <a key={idx} href={station.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center cursor-pointer hover:scale-110 transition-all duration-300 group min-w-[100px]">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-gradient-to-r from-yellow-400 to-orange-400 overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                    <img src={station.logo} alt={station.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-700 mt-3 text-center max-w-[90px] truncate group-hover:text-blue-600 transition-colors duration-300">{station.name}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Banner Slider */}
        <section className="w-full mx-auto relative rounded-2xl overflow-hidden shadow-xl text-white aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5] max-h-[720px]">
          <Swiper modules={[Navigation, Pagination, Autoplay]} navigation pagination={{ clickable: true }} autoplay={{ delay: 5000 }} loop={true} className="w-full h-full">
            {[ /* ... slides ... */ ].map((slide, index) => (
              <SwiperSlide key={index}>
                <a href={slide.href} target="_blank" rel="noopener noreferrer" className="block relative w-full h-full group">
                  <img src={slide.img} alt={slide.alt} className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                  <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-center h-full max-w-2xl">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-4 group-hover:scale-105 transition-transform duration-300">{slide.title}</h2>
                    <p className="text-base sm:text-lg md:text-xl text-white/90 drop-shadow-lg leading-relaxed">{slide.text}</p>
                    <div className="mt-6">
                      <span className="inline-flex items-center px-5 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300">Explorar →</span>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Funcionalidades */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-slide-up">
          {[ /* ... funcionalidades ... */ ].map((item, i) => (
            <div key={i} className="glass-card p-8 hover-lift group cursor-pointer" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${item.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </section>

        {/* Rádios do Brasil */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <div className="glass-card p-6 flex-1 mr-4">
              <h2 className="text-3xl font-bold flex items-center text-gray-800">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-2xl mr-4"><Globe className="text-white" size={28} /></div>
                Rádios do Brasil
              </h2>
              <p className="text-gray-600 mt-2">As melhores estações brasileiras</p>
            </div>
            <button onClick={() => navigate('/browse?country=Brazil')} className="btn-secondary whitespace-nowrap">Ver Todas</button>
          </div>
          <StationList stations={brazilStations} isLoading={loadingBrazil} emptyMessage="Nenhuma estação brasileira disponível no momento." />
        </section>

        {/* Estações Populares */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <div className="glass-card p-6 flex-1 mr-4">
              <h2 className="text-3xl font-bold flex items-center text-gray-800">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-2xl mr-4"><TrendingUp className="text-white" size={28} /></div>
                Mais Ouvidas
              </h2>
              <p className="text-gray-600 mt-2">As estações mais populares do momento</p>
            </div>
            <button onClick={() => navigate('/browse')} className="btn-primary whitespace-nowrap">Explorar Todas</button>
          </div>
          <StationList stations={popularStations} isLoading={loadingPopular} emptyMessage="Carregando estações populares..." />
        </section>

        {/* Estações em Destaque */}
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <div className="glass-card p-6 flex-1 mr-4">
              <h2 className="text-3xl font-bold flex items-center text-gray-800">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl mr-4"><Star className="text-white" size={28} /></div>
                Em Destaque
              </h2>
              <p className="text-gray-600 mt-2">Seleção especial da nossa equipe</p>
            </div>
          </div>
          <StationList stations={featuredStations} isLoading={loadingPopular} emptyMessage="Nenhuma estação em destaque agora." />
        </section>

        {/* Estações Recentes */}
        {recentlyPlayed.length > 0 && (
          <section className="animate-slide-up">
            <div className="flex items-center justify-between mb-8">
              <div className="glass-card p-6 flex-1 mr-4">
                <h2 className="text-3xl font-bold flex items-center text-gray-800">
                  <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-3 rounded-2xl mr-4"><Music className="text-white" size={28} /></div>
                  Ouvidas Recentemente
                </h2>
                <p className="text-gray-600 mt-2">Continue de onde parou</p>
              </div>
              <button onClick={() => navigate('/history')} className="btn-ghost text-gray-700 border-gray-300 hover:border-gray-400">Ver Histórico</button>
            </div>
            <StationList stations={recentlyPlayed.slice(0, 9)} emptyMessage="Nenhuma estação recente." />
          </section>
        )}
      </main>
    </div>
  );
};

export default HomePage;
