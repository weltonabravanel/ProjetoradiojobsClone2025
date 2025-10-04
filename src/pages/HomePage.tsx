import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { Radio, Heart, Globe, Headphones, TrendingUp, Star, Music } from 'lucide-react';
import StationList from '../components/StationList';
import { useRadio } from '../contexts/RadioContext';
import { fetchStations } from '../services/api';
import { RadioStation } from '../types/station';
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

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
    <div className="space-y-20">
      {/* Banner Hero Responsivo */}
      <section className="w-full mx-auto relative rounded-3xl overflow-hidden shadow-xl text-white aspect-video">
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
              alt: "Rádio antiga",
              title: "🎵 Sintonize Emoções",
              text: "Cada estação é uma porta para novas descobertas. Explore músicas, histórias e culturas que atravessam o tempo e o país.",
            },
            {
              href: "https://radiojobs.com.br",
              img: "https://97fmnatal.com.br/images/vitrine.png",
              alt: "Estúdio de rádio",
              title: "📻 Rádio É Companhia",
              text: "De manhã à noite, a rádio acompanha sua rotina com trilhas sonoras que embalam momentos únicos da sua vida.",
            },
            {
              href: "https://radioliberdade.com.br/",
              img: "https://radioliberdade.com.br/imagens/upload/destaquehome/1200x400-6749fa9bdbac2-1732901531.png",
              alt: "Música sertaneja",
              title: "🤠 Sertanejo Raiz",
              text: "O melhor do sertanejo brasileiro, das raízes aos sucessos atuais. Música que toca o coração.",
            },
          ].map((slide, index) => (
            <SwiperSlide key={index}>
              <a
                href={slide.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative h-full w-full group"
              >
                <img
                  src={slide.img}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-center h-full max-w-2xl">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-3 sm:mb-4 group-hover:scale-105 transition-transform duration-300">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-lg md:text-xl text-white/90 drop-shadow-lg leading-relaxed">
                    {slide.text}
                  </p>
                  <div className="mt-4 sm:mt-6">
                    <span className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/20 backdrop-blur-sm rounded-2xl text-white font-semibold hover:bg-white/30 transition-all duration-300">
                      Explorar →
                    </span>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </div>
  );
};

export default HomePage;
