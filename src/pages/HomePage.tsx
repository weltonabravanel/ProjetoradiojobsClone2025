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
  // stations, isLoading, error não estão sendo usados neste trecho, mas mantidos para contexto
  const { recentlyPlayed } = useRadio(); 
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
          // MODIFICAÇÃO: Aumentando o número de estações mostradas (de 12 para 18 e de 12-24 para 18-36)
          setPopularStations(cached.slice(0, 18));
          setFeaturedStations(cached.slice(18, 36)); 
        } else {
          // MODIFICAÇÃO: Aumentando o fetch para 150 para garantir mais dados
          const data = await fetchStations({}, 150);
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          setPopularStations(shuffled.slice(0, 18));
          setFeaturedStations(shuffled.slice(18, 36));
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
          // MODIFICAÇÃO: Aumentando o número de estações brasileiras mostradas (de 12 para 18)
          setBrazilStations(cached.slice(0, 18));
        } else {
          // MODIFICAÇÃO: Aumentando o fetch para 70 para garantir mais dados
          const data = await fetchStations({ country: 'Brazil' }, 70);
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          setBrazilStations(shuffled.slice(0, 18));
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
      {/* Stories de Rádios Famosas */}
      <section className="animate-slide-up">
        {/* Mantido o scroll horizontal, ideal para mobile e eficiente em desktop */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4">
          {[
            { name: 'Jovem Pan', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Jovem_Pan_FM_logo_2018_%282%29.png', url: 'https://jovempan.com.br' },
            { name: 'CBN', logo: 'https://s3.glbimg.com/v1/AUTH_3ec28e89a5754c7b937cbc7ade6b1ace/assets/common/cbn-1024x1024.svg', url: 'https://cbn.globoradio.globo.com' },
            { name: 'BandNews', logo: 'https://img.band.com.br/image/2025/03/28/lofo-ao-vivo-bandnews-91316_300x300.png', url: 'https://bandnewsfm.band.uol.com.br' },
            { name: 'Antena 1', logo: 'https://img.radios.com.br/radio/xl/radio9505_1574106966.jpg', url: 'https://antena1.com.br' },
            { name: 'Transamérica', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Rede_Transam%C3%A9rica_logo.png', url: 'https://transamerica.com.br' },
            { name: 'Massa FM', logo: 'https://radioamantes.com/wp-content/uploads/2019/09/massa-fm.jpg', url: 'https://massafm.com.br' },
            { name: 'Rádio Globo', logo: 'https://img.radios.com.br/radio/xl/radio72023_1702994214.jpeg', url: 'https://kiisfm.iheart.com/' },
            { name: 'Rádio Globo', logo: 'https://thumbnail.anii.io/br/radio-globo-98-1-fm-rio-de-janeiro-brazil.webp', url: 'https://radioglobo.globo.com' },
            { name: 'Rádio Rock', logo: 'https://static.mytuner.mobi/media/radios-150px/698/89-fm-a-radio-rock.a64f6d05.png', url: 'https://www.radiorock.com.br/' }, // Ajustado nome
            { name: 'Kiss FM', logo: 'https://kissfm.com.br/wp-content/uploads/2024/08/Madrugada_Kiss.png', url: 'https://kissfm.com.br' },
            { name: 'Band FM', logo: 'https://upload.wikimedia.org/wikipedia/pt/1/1f/Logotipo_da_BandNews_FM.png', url: 'https://bandfm.band.uol.com.br' },
            { name: 'Clube FM', logo: 'https://yt3.googleusercontent.com/gAgCvOpnliRNhl7zfEVESJTnHt6ucQjxJDG7R-OAE78R6wz1IGbTEiln6gp4HpBdVU1S8EIAduc=s900-c-k-c0x00ffffff-no-rj', url: 'https://clubefm.com.br' },
            // MODIFICAÇÃO: Adicionar mais rádios aqui pode forçar o scroll horizontal, mostrando mais itens.
            { name: 'Alpha FM', logo: 'https://i.scdn.co/image/ab67656300005f1f237938927018d9ef672f518b', url: 'https://alphafm.com.br' },
            { name: 'Mix FM', logo: 'https://mixfm.com.br/wp-content/uploads/2020/07/mix_fm_logo.png', url: 'https://mixfm.com.br' },
          ].map((station, idx) => (
            <a
              key={idx}
              href={station.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center cursor-pointer hover:scale-110 transition-all duration-300 group min-w-[100px]"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-gradient-to-r from-yellow-400 to-orange-400 overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <img
                    src={station.logo}
                    alt={station.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-700 mt-3 text-center max-w-[90px] truncate group-hover:text-blue-600 transition-colors duration-300">
                {station.name}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Slider Principal (Swiper) */}
      <section className="w-full mx-auto relative rounded-2xl overflow-hidden shadow-xl text-white aspect-[16/9] sm:aspect-[16/7] md:aspect-[16/6] lg:aspect-[16/5] max-h-[720px]">
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
              href: "https://apple.com.br",
              img: "https://thinkmarketingmagazine.com/wp-content/uploads/2013/06/steve-jobs.jpg",
              alt: "Estúdio de rádio",
              title: "📻 Site em Homenagem a Steve Jobs",
              text: "A única maneira de fazer um trabalho excelente é amar o que você faz.",
            },
            {
              href: "https://otimafm.com.br/",
              img: "https://otimafm.com.br/uploads/banner/IBOPEBANNER_1695757570.jpg",
              alt: "Música sertaneja",
              title: "🤠 Sertanejo Raiz",
              text: "O melhor do sertanejo brasileiro, das raízes aos sucessos atuais. Música que toca o coração.",
            },
            {
              href: "https://www.radioliberdade.com.br/",
              img: "https://radioliberdade.com.br/imagens/upload/destaquehome/1200x400-679137a3e2a9b-1737570211.jpg",
              alt: "Música sertaneja",
              title: "🤠 Sertanejo Raiz",
              text: "O melhor do sertanejo brasileiro, das raízes aos sucessos atuais. Música que toca o coração.",
            },
            {
              href: "https://www.radioliberdade.com.br/",
              img: "https://radioliberdade.com.br/imagens/upload/destaquehome/1200x400-679107f1ee01e-1737558001.jpg",
              alt: "Música sertaneja",
              title: "🤠 Promoção Alexa",
              text: "Quer ganhar um Alexa n liberdade FM.",
            },
            {
              href: "https://radioliberdade.com.br/",
              img: "https://radioliberdade.com.br/imagens/upload/destaquehome/1200x400-6749fa9bdbac2-1732901531.png",
              alt: "Música e tecnologia",
              title: "📻 Escute a Rádio Sertaneja do Brasil",
              text: "Uma mistura de músicas sertanejas Brasileiras ",
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                {/* MODIFICAÇÃO: Ajuste de max-width para telas maiores, mantendo o texto bem visível */}
                <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-center h-full max-w-lg md:max-w-xl lg:max-w-2xl">
                  {/* MODIFICAÇÃO: Fontes que escalam bem em telas maiores */}
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-2xl mb-4 group-hover:scale-105 transition-transform duration-300">
                    {slide.title}
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-white/90 drop-shadow-lg leading-relaxed">
                    {slide.text}
                  </p>
                  <div className="mt-6">
                    <span className="inline-flex items-center px-5 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300">
                      Explorar →
                    </span>
                  </div>
                </div>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>


      {/* Funcionalidades (Grid 4 colunas em telas grandes) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-slide-up">
        {[
          {
            icon: <Radio size={40} className="text-blue-500" />,
            title: 'Milhares de Rádios',
            text: 'Acesso a mais de 50.000 estações do Brasil e do mundo inteiro.',
            color: 'from-blue-500 to-cyan-500'
          },
          {
            icon: <Headphones size={40} className="text-purple-500" />,
            title: 'Busca Inteligente',
            text: 'Encontre rádios por nome, gênero, país ou idioma com nossa busca avançada.',
            color: 'from-purple-500 to-pink-500'
          },
          {
            icon: <Heart size={40} className="text-red-500" />,
            title: 'Favoritas Salvas',
            text: 'Guarde suas rádios preferidas para ouvir sempre que quiser.',
            color: 'from-red-500 to-orange-500'
          },
          {
            icon: <Globe size={40} className="text-green-500" />,
            title: 'Cobertura Global',
            text: 'Explore estações de todos os continentes e descubra novos sons.',
            color: 'from-green-500 to-emerald-500'
          },
        ].map((item, i) => (
          <div
            key={i}
            className="glass-card p-8 hover-lift group cursor-pointer"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${item.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300">
              {item.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </section>

      {/* Rádios do Brasil */}
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div className="glass-card p-6 flex-1 mr-4">
            <h2 className="text-3xl font-bold flex items-center text-gray-800">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-2xl mr-4">
                <Globe className="text-white" size={28} />
              </div>
              Rádios do Brasil
            </h2>
            <p className="text-gray-600 mt-2">As melhores estações brasileiras</p>
          </div>
          <button
            onClick={() => navigate('/browse?country=Brazil')}
            className="btn-secondary whitespace-nowrap"
          >
            Ver Todas
          </button>
        </div>
        <StationList
          stations={brazilStations}
          isLoading={loadingBrazil}
          emptyMessage="Nenhuma estação brasileira disponível no momento."
          // NOTA: É fundamental que StationList internamente use um grid com muitas colunas (lg:grid-cols-6 xl:grid-cols-8)
        />
      </section>

      {/* Estações Populares */}
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div className="glass-card p-6 flex-1 mr-4">
            <h2 className="text-3xl font-bold flex items-center text-gray-800">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-2xl mr-4">
                <TrendingUp className="text-white" size={28} />
              </div>
              Mais Ouvidas
            </h2>
            <p className="text-gray-600 mt-2">As estações mais populares do momento</p>
          </div>
          <button
            onClick={() => navigate('/browse')}
            className="btn-primary whitespace-nowrap"
          >
            Explorar Todas
          </button>
        </div>
        <StationList
          stations={popularStations}
          isLoading={loadingPopular}
          emptyMessage="Carregando estações populares..."
        />
      </section>

      {/* Estações em Destaque */}
      <section className="animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div className="glass-card p-6 flex-1 mr-4">
            <h2 className="text-3xl font-bold flex items-center text-gray-800">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-2xl mr-4">
                <Star className="text-white" size={28} />
              </div>
              Em Destaque
            </h2>
            <p className="text-gray-600 mt-2">Seleção especial da nossa equipe</p>
          </div>
        </div>
        <StationList
          stations={featuredStations}
          isLoading={loadingPopular}
          emptyMessage="Nenhuma estação em destaque agora."
        />
      </section>

      {/* Estações Recentes */}
      {recentlyPlayed.length > 0 && (
        <section className="animate-slide-up">
          <div className="flex items-center justify-between mb-8">
            <div className="glass-card p-6 flex-1 mr-4">
              <h2 className="text-3xl font-bold flex items-center text-gray-800">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-3 rounded-2xl mr-4">
                  <Music className="text-white" size={28} />
                </div>
                Ouvidas Recentemente
              </h2>
              <p className="text-gray-600 mt-2">Continue de onde parou</p>
            </div>
            <button
              onClick={() => navigate('/history')}
              className="btn-ghost text-gray-700 border-gray-300 hover:border-gray-400"
            >
              Ver Histórico
            </button>
          </div>
          <StationList
            // MODIFICAÇÃO: Aumentando o número de itens recentes de 9 para 12 (ou mais)
            stations={recentlyPlayed.slice(0, 12)}
            emptyMessage="Nenhuma estação recente."
          />
        </section>
      )}
    </div>
  );
};

export default HomePage;
