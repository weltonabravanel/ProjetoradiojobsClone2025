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
    // Fundo suave para dar destaque ao glassmorphism
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 lg:space-y-20">

        {/* Stories de Rádios Famosas (Ajuste para Mobile e Cores Brasileiras) */}
        <section className="animate-slide-up">
          <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4">
            {[
              { name: 'Jovem Pan', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Jovem_Pan_FM_logo_2018_%282%29.png', url: 'https://jovempan.com.br' },
              { name: 'CBN', logo: 'https://s3.glbimg.com/v1/AUTH_3ec28e89a5754c7b937cbc7ade6b1ace/assets/common/cbn-1024x1024.svg', url: 'https://cbn.globoradio.globo.com' },
              { name: 'BandNews', logo: 'https://img.band.com.br/image/2025/03/28/lofo-ao-vivo-bandnews-91316_300x300.png', url: 'https://bandnewsfm.band.uol.com.br' },
              { name: 'Antena 1', logo: 'https://img.radios.com.br/radio/xl/radio9505_1574106966.jpg', url: 'https://antena1.com.br' },
              { name: 'Transamérica', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Rede_Transam%C3%A9rica_logo.png', url: 'https://transamerica.com.br' },
              { name: 'Massa FM', logo: 'https://radioamantes.com/wp-content/uploads/2019/09/massa-fm.jpg', url: 'https://massafm.com.br' },
              { name: 'Rádio Globo', logo: 'https://thumbnail.anii.io/br/radio-globo-98-1-fm-rio-de-janeiro-brazil.webp', url: 'https://radioglobo.globo.com' },
              { name: '89 FM', logo: 'https://static.mytuner.mobi/media/radios-150px/698/89-fm-a-radio-rock.a64f6d05.png', url: 'https://www.radiorock.com.br/' },
              { name: 'Kiss FM', logo: 'https://kissfm.com.br/wp-content/uploads/2024/08/Madrugada_Kiss.png', url: 'https://kissfm.com.br' },
              { name: 'Band FM', logo: 'https://upload.wikimedia.org/wikipedia/pt/1/1f/Logotipo_da_BandNews_FM.png', url: 'https://bandfm.band.uol.com.br' },
              { name: 'Clube FM', logo: 'https://clubefm.com.br/uploads/radio-img/logo-clube-fm-98-1.png', url: 'https://clubefm.com.br' },
            ].map((station, idx) => (
              <a
                key={idx}
                href={station.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 group min-w-[80px] sm:min-w-[100px]"
              >
                <div className="relative">
                  {/* Borda verde e amarela com foco no border-4 e no tamanho w-16/h-16 para mobile */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-brazil-green ring-2 ring-brazil-yellow overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                    <img
                      src={station.logo}
                      alt={station.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  {/* "Ao Vivo" com cor de destaque */}
                  <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 mt-2 text-center max-w-[90px] truncate group-hover:text-primary transition-colors duration-300">
                  {station.name}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Banner Principal (Swiper) */}
        <section className="w-full mx-auto relative rounded-2xl overflow-hidden shadow-2xl text-white 
          aspect-[16/10] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5] max-h-[720px] animate-slide-up">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
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
                href: "https://apple.com.br",
                img: "https://thinkmarketingmagazine.com/wp-content/uploads/2013/06/steve-jobs.jpg",
                alt: "Estúdio de rádio",
                title: "📻 Rádio Jobs, Homenagem a um Visionário",
                text: "A única maneira de fazer um trabalho excelente é amar o que você faz. - Steve Jobs",
              },
              {
                href: "https://otimafm.com.br/",
                img: "https://otimafm.com.br/uploads/banner/IBOPEBANNER_1695757570.jpg",
                alt: "Música sertaneja",
                title: "🎶 Sertanejo que Toca a Alma Brasileira",
                text: "O melhor do sertanejo, das raízes aos sucessos atuais. Música que toca o coração do Brasil.",
              },
            ].map((slide, index) => (
              <SwiperSlide key={index}>
                <a
                  href={slide.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative w-full h-full group"
                >
                  <img
                    src={slide.img}
                    alt={slide.alt}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradiente com azul da bandeira */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brazil-blue/70 via-black/50 to-transparent"></div>
                  <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-center h-full max-w-lg">
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-brazil-yellow drop-shadow-2xl mb-4 group-hover:scale-105 transition-transform duration-300">
                      {slide.title}
                    </h2>
                    <p className="text-base sm:text-lg text-white drop-shadow-lg leading-relaxed">
                      {slide.text}
                    </p>
                    <div className="mt-6">
                      {/* Botão com cores brasileiras */}
                      <span className="inline-flex items-center px-5 py-3 bg-brazil-green/80 backdrop-blur-sm rounded-xl text-brazil-yellow font-semibold hover:bg-brazil-green transition-all duration-300 shadow-lg">
                        Explorar →
                      </span>
                    </div>
                  </div>
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        <div className="space-y-12 sm:space-y-16 lg:space-y-20">

          {/* Funcionalidades (Glassmorphism e Cores Brasileiras) */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Adaptação para mobile: grid 1 coluna no menor, depois 2, depois 4 */}
            {[
              { 
                icon: <Radio size={32} className="text-white" />, 
                title: 'Milhares de Rádios', 
                text: 'Acesso a mais de 50.000 estações do Brasil e do mundo inteiro.',
                color: 'from-brazil-blue to-primary' // Azul e Verde
              },
              { 
                icon: <Headphones size={32} className="text-white" />, 
                title: 'Busca Inteligente', 
                text: 'Encontre rádios por nome, gênero, país ou idioma com nossa busca avançada.',
                color: 'from-brazil-yellow to-orange-500' // Amarelo e Laranja
              },
              { 
                icon: <Heart size={32} className="text-white" />, 
                title: 'Favoritas Salvas', 
                text: 'Guarde suas rádios preferidas para ouvir sempre que quiser.',
                color: 'from-red-600 to-pink-500' // Vermelho e Rosa
              },
              { 
                icon: <Globe size={32} className="text-white" />, 
                title: 'Cobertura Global', 
                text: 'Explore estações de todos os continentes e descubra novos sons.',
                color: 'from-primary to-brazil-blue' // Verde e Azul
              },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card p-6 sm:p-8 hover-lift group cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${item.color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </section>

          {/* Rádios do Brasil */}
          <section className="animate-slide-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div className="glass-card p-4 sm:p-6 flex-1 w-full">
                <h2 className="text-2xl sm:text-3xl font-bold flex items-center text-gray-800">
                  <div className="bg-gradient-to-r from-primary to-brazil-blue p-2 sm:p-3 rounded-xl mr-3 sm:mr-4 shadow-md">
                    <Globe className="text-brazil-yellow" size={24} /> {/* Globo Amarelo no Fundo Verde/Azul */}
                  </div>
                  Rádios do Brasil 🇧🇷
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">As melhores estações brasileiras</p>
              </div>
              <button
                onClick={() => navigate('/browse?country=Brazil')}
                className="btn-secondary w-full sm:w-auto"
              >
                Ver Todas
              </button>
            </div>
            <StationList
              stations={brazilStations}
              isLoading={loadingBrazil}
              emptyMessage="Nenhuma estação brasileira disponível no momento."
              // Adicione prop para grid de 2 colunas em mobile
              gridCols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
            />
          </section>

          {/* Estações Populares */}
          <section className="animate-slide-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <div className="glass-card p-4 sm:p-6 flex-1 w-full">
                <h2 className="text-2xl sm:text-3xl font-bold flex items-center text-gray-800">
                  <div className="bg-gradient-to-r from-brazil-yellow to-orange-500 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4 shadow-md">
                    <TrendingUp className="text-brazil-blue" size={24} /> {/* Icone Azul no Fundo Amarelo/Laranja */}
                  </div>
                  Mais Ouvidas 🔥
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">As estações mais populares do momento</p>
              </div>
              <button
                onClick={() => navigate('/browse')}
                className="btn-primary w-full sm:w-auto"
              >
                Explorar Todas
              </button>
            </div>
            <StationList
              stations={popularStations}
              isLoading={loadingPopular}
              emptyMessage="Carregando estações populares..."
              gridCols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
            />
          </section>

          {/* Estações em Destaque */}
          <section className="animate-slide-up">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="glass-card p-4 sm:p-6 flex-1 w-full">
                <h2 className="text-2xl sm:text-3xl font-bold flex items-center text-gray-800">
                  <div className="bg-gradient-to-r from-brazil-blue to-primary p-2 sm:p-3 rounded-xl mr-3 sm:mr-4 shadow-md">
                    <Star className="text-brazil-yellow" size={24} />
                  </div>
                  Em Destaque ⭐
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Seleção especial da nossa equipe</p>
              </div>
            </div>
            <StationList
              stations={featuredStations}
              isLoading={loadingPopular}
              emptyMessage="Nenhuma estação em destaque agora."
              gridCols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
            />
          </section>

          {/* Estações Recentes */}
          {recentlyPlayed.length > 0 && (
            <section className="animate-slide-up">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div className="glass-card p-4 sm:p-6 flex-1 w-full">
                  <h2 className="text-2xl sm:text-3xl font-bold flex items-center text-gray-800">
                    <div className="bg-gradient-to-r from-primary to-brazil-blue p-2 sm:p-3 rounded-xl mr-3 sm:mr-4 shadow-md">
                      <Music className="text-brazil-white" size={24} />
                    </div>
                    Ouvidas Recentemente 🎧
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Continue de onde parou</p>
                </div>
                <button
                  onClick={() => navigate('/history')}
                  className="btn-ghost text-gray-700 border-primary hover:bg-primary/10 w-full sm:w-auto"
                >
                  Ver Histórico
                </button>
              </div>
              <StationList
                stations={recentlyPlayed.slice(0, 9)}
                emptyMessage="Nenhuma estação recente."
                gridCols="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
