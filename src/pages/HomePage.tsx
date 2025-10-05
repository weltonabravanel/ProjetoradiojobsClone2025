import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Heart, Globe, Headphones, TrendingUp, Star, Music, Zap, Volume2 } from 'lucide-react';
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
    // Título mais brasileiro e convidativo
    document.title = 'Sua Rádio Brasileira - Conecte-se com o Brasil!';

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
          // Prioriza estações brasileiras no cache
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

  // Dados das Rádios Famosas (Stories) - Focado em grandes marcas nacionais
  const famousBrazilianStations = [
    { name: 'Jovem Pan', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Jovem_Pan_FM_logo_2018_%282%29.png', url: 'https://jovempan.com.br' },
    { name: 'CBN', logo: 'https://s3.glbimg.com/v1/AUTH_3ec28e89a5754c7b937cbc7ade6b1ace/assets/common/cbn-1024x1024.svg', url: 'https://cbn.globoradio.globo.com' },
    { name: 'BandNews FM', logo: 'https://img.band.com.br/image/2025/03/28/lofo-ao-vivo-bandnews-91316_300x300.png', url: 'https://bandnewsfm.band.uol.com.br' },
    { name: 'Antena 1', logo: 'https://img.radios.com.br/radio/xl/radio9505_1574106966.jpg', url: 'https://antena1.com.br' },
    { name: 'Transamérica', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Rede_Transam%C3%A9rica_logo.png', url: 'https://transamerica.com.br' },
    { name: 'Massa FM', logo: 'https://radioamantes.com/wp-content/uploads/2019/09/massa-fm.jpg', url: 'https://massafm.com.br' },
    { name: 'Rádio Globo', logo: 'https://thumbnail.anii.io/br/radio-globo-98-1-fm-rio-de-janeiro-brazil.webp', url: 'https://radioglobo.globo.com' },
    { name: '89 FM (Rock)', logo: 'https://static.mytuner.mobi/media/radios-150px/698/89-fm-a-radio-rock.a64f6d05.png', url: 'https://www.radiorock.com.br/' },
    { name: 'Kiss FM', logo: 'https://kissfm.com.br/wp-content/uploads/2024/08/Madrugada_Kiss.png', url: 'https://kissfm.com.br' },
    { name: 'Band FM', logo: 'https://upload.wikimedia.org/wikipedia/pt/1/1f/Logotipo_da_BandNews_FM.png', url: 'https://bandfm.band.uol.com.br' },
  ];

  return (
    // Espaçamento mais generoso e foco em uma experiência de rolagem fluida
    <div className="space-y-16 lg:space-y-24">
      
      {/* Stories de Rádios Famosas (Estilo Rede Social) */}
      <section className="animate-slide-up">
        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <Volume2 className="text-yellow-500 mr-3" size={28} />
            Rádios no Ar (Stories)
        </h2>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4">
          {famousBrazilianStations.map((station, idx) => (
            <a
              key={idx}
              href={station.url}
              target="_blank"
              rel="noopener noreferrer"
              // Foco na animação e nas cores nacionais (Amarelo e Verde)
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition-all duration-300 group min-w-[80px] sm:min-w-[100px]"
            >
              <div className="relative">
                {/* Borda Verde/Amarelo para dar o toque brasileiro de destaque */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gradient-to-r from-yellow-500 to-green-500 overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 p-0.5">
                  <img
                    src={station.logo}
                    alt={station.name}
                    className="object-cover w-full h-full rounded-full group-hover:scale-105 transition-transform duration-300 bg-white"
                  />
                </div>
                {/* Indicador de AO VIVO (mais energético/comercial) */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-xs font-bold text-white leading-none">AO</span>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-700 mt-2 text-center max-w-[100px] truncate group-hover:text-red-600 transition-colors duration-300">
                {station.name}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Banner Principal - Destaque (Aumentado e com estilo marcante) */}
      <section className="w-full mx-auto relative rounded-3xl overflow-hidden shadow-2xl text-white 
        aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/6] max-h-[720px] transform hover:shadow-3xl transition-shadow duration-500">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full"
        >
          {[
            // Slide com cores e temas brasileiros (Sertanejo, Novidades)
            {
              href: "https://otimafm.com.br/",
              img: "https://otimafm.com.br/uploads/banner/IBOPEBANNER_1695757570.jpg",
              alt: "Música sertaneja",
              title: "🎶 Sertanejo Toca Aqui!",
              text: "Os lançamentos e clássicos que embalam o Brasil. Sintonize a emoção do interior!",
            },
            {
              href: "https://radiojobs.com.br",
              img: "https://i0.wp.com/radio98fm.com/wp-content/uploads/2024/11/banner-site-98FM-1.png?fit=1920%2C560&ssl=1",
              alt: "Rádio antiga",
              title: "🎵 Seu Momento Musical",
              text: "Novas ondas, novos sons. Descubra a trilha sonora do seu dia com a Rádio Jobs.",
            },
            {
              href: "https://www.radioliberdade.com.br/",
              img: "https://radioliberdade.com.br/imagens/upload/destaquehome/1200x400-679137a3e2a9b-1737570211.jpg",
              alt: "Promoção",
              title: "✨ Participe e Concorra!",
              text: "Fique ligado na nossa programação e concorra a prêmios exclusivos todos os dias.",
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
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
                />
                {/* Gradiente mais suave para destacar o texto */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
                <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col justify-center h-full max-w-3xl">
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-2xl mb-4 group-hover:scale-100 transition-transform duration-300">
                    {slide.title}
                  </h2>
                  <p className="text-lg sm:text-xl md:text-2xl text-white/95 drop-shadow-lg leading-relaxed">
                    {slide.text}
                  </p>
                  <div className="mt-8">
                    <span className="inline-flex items-center px-6 py-3 bg-yellow-500/90 text-black font-bold rounded-full shadow-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105">
                      Sintonizar Agora <Zap className="ml-2" size={20} />
                    </span>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Rádios do Brasil - PRIORIZADA NO TOPO */}
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          {/* Título com cores nacionais (Verde e Amarelo) e estilo mais chamativo */}
          <div className="glass-card p-6 flex-1 mr-4 border-l-4 border-green-500">
            <h2 className="text-3xl font-extrabold flex items-center text-gray-900">
              <div className="bg-gradient-to-r from-green-500 to-yellow-500 p-3 rounded-full mr-4 shadow-md">
                <Globe className="text-white" size={28} />
              </div>
              As Melhores do Brasil
            </h2>
            <p className="text-gray-600 mt-2 text-lg">As estações que tocam o nosso país!</p>
          </div>
          <button
            onClick={() => navigate('/browse?country=Brazil')}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300 whitespace-nowrap shadow-md"
          >
            Ver Todas Nacionais
          </button>
        </div>
        <StationList
          stations={brazilStations}
          isLoading={loadingBrazil}
          emptyMessage="Nenhuma estação brasileira disponível no momento. Tente recarregar!"
        />
      </section>
      
      {/* Funcionalidades - Layout "Card" mais moderno e brasileiro */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        {[
          { 
            icon: <Radio size={40} className="text-white" />, 
            title: 'Sua Rádio na Web', 
            text: 'Mais de 50.000 estações, do Forró ao Rock, do Brasil ao Japão.',
            color: 'from-green-500 to-blue-500' // Verde e Azul - Cores da bandeira
          },
          { 
            icon: <Headphones size={40} className="text-white" />, 
            title: 'O que Toca Agora?', 
            text: 'Encontre rádios por gênero musical, cidade ou até o DJ favorito.',
            color: 'from-purple-500 to-pink-500'
          },
          { 
            icon: <Heart size={40} className="text-white" />, 
            title: 'Salvas no Coração', 
            text: 'Crie sua lista de favoritas e acesse com um clique. Simples assim!',
            color: 'from-red-600 to-yellow-500' // Vermelho e Amarelo - Energia
          },
          { 
            icon: <Globe size={40} className="text-white" />, 
            title: 'Mundo na Antena', 
            text: 'Explore estações internacionais e aprenda novos idiomas ouvindo música.',
            color: 'from-orange-500 to-red-500'
          },
        ].map((item, i) => (
          <div
            key={i}
            // Card com sombra mais acentuada e fundo sutil para dar profundidade (estilo de design brasileiro)
            className="p-6 rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-gray-100 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${item.color} mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
              {item.title}
            </h3>
            <p className="text-gray-600 leading-snug text-sm">{item.text}</p>
          </div>
        ))}
      </section>

      {/* Estações Populares */}
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div className="glass-card p-6 flex-1 mr-4 border-l-4 border-yellow-500">
            <h2 className="text-3xl font-extrabold flex items-center text-gray-900">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-full mr-4 shadow-md">
                <TrendingUp className="text-white" size={28} />
              </div>
              O Que Tá Bombando
            </h2>
            <p className="text-gray-600 mt-2 text-lg">As estações mais sintonizadas da semana</p>
          </div>
          <button
            onClick={() => navigate('/browse')}
            className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors duration-300 whitespace-nowrap shadow-md"
          >
            Explorar Tudo
          </button>
        </div>
        <StationList
          stations={popularStations}
          isLoading={loadingPopular}
          emptyMessage="Carregando o que está bombando... Segura aê!"
        />
      </section>

      {/* Estações em Destaque */}
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div className="glass-card p-6 flex-1 mr-4 border-l-4 border-red-500">
            <h2 className="text-3xl font-extrabold flex items-center text-gray-900">
              <div className="bg-gradient-to-r from-red-600 to-pink-500 p-3 rounded-full mr-4 shadow-md">
                <Star className="text-white" size={28} />
              </div>
              Seleção da Casa
            </h2>
            <p className="text-gray-600 mt-2 text-lg">As joias raras que separamos pra você</p>
          </div>
        </div>
        <StationList
          stations={featuredStations}
          isLoading={loadingPopular}
          emptyMessage="Nenhuma estação em destaque agora. Aguarde novidades!"
        />
      </section>

      {/* Estações Recentes */}
      {recentlyPlayed.length > 0 && (
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <div className="glass-card p-6 flex-1 mr-4 border-l-4 border-indigo-500">
              <h2 className="text-3xl font-extrabold flex items-center text-gray-900">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-3 rounded-full mr-4 shadow-md">
                  <Music className="text-white" size={28} />
                </div>
                Ouvidas por Você
              </h2>
              <p className="text-gray-600 mt-2 text-lg">Continue sintonizado de onde parou</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="btn-ghost px-6 py-3 text-indigo-600 border-indigo-300 hover:border-indigo-400 font-semibold transition-colors duration-300 rounded-xl"
            >
              Ver Histórico
            </button>
          </div>
          <StationList
            stations={recentlyPlayed.slice(0, 9)}
            emptyMessage="Nenhuma estação recente."
          />
        </section>
      )}
    </div>
  );
};

export default HomePage;
