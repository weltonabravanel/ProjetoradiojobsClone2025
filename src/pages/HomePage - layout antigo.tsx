import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Heart, Globe, Headphones, TrendingUp, Star } from 'lucide-react';
import StationList from '../components/StationList';
import { useRadio } from '../contexts/RadioContext';
import { fetchStations } from '../services/api';
import { RadioStation } from '../types/station';
import { Link } from 'react-router-dom';


const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { stations, isLoading, error, recentlyPlayed } = useRadio();
  const [popularStations, setPopularStations] = useState<RadioStation[]>([]);
  const [featuredStations, setFeaturedStations] = useState<RadioStation[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(false);
  const [brazilStations, setBrazilStations] = useState<RadioStation[]>([]);
  const [loadingBrazil, setLoadingBrazil] = useState(false);

  useEffect(() => {
  document.title = 'Rádio Jobs - Ouça rádios brasileiras';

  const CACHE_TTL = 1000 * 60 * 60; // 1 hora

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
        setPopularStations(cached.slice(0, 48));
        setFeaturedStations(cached.slice(12, 48));
      } else {
        const data = await fetchStations({}, 50);
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setPopularStations(shuffled.slice(0, 48));
        setFeaturedStations(shuffled.slice(12, 48));
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
        setBrazilStations(cached.slice(0, 24));
      } else {
        const data = await fetchStations({ country: 'Brazil' }, 50);
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setBrazilStations(shuffled.slice(0, 24));
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
    <div className="space-y-16">


    {/* STORIES DE RÁDIOS - ESTILO INSTAGRAM */}


<section className="px-4 mt-8">
  <h2 className="text-2xl font-bold text-gray-900 mb-4"></h2>
  <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
    {[
      { name: 'Jovem Pan', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Jovem_Pan_FM_logo_2018_%282%29.png', url: 'https://jovempan.com.br' },
      { name: 'CBN', logo: 'https://s3.glbimg.com/v1/AUTH_3ec28e89a5754c7b937cbc7ade6b1ace/assets/common/cbn-1024x1024.svg', url: 'https://cbn.globoradio.globo.com' },
      { name: 'BandNews', logo: 'https://img.band.com.br/image/2025/03/28/lofo-ao-vivo-bandnews-91316_300x300.png', url: 'https://bandnewsfm.band.uol.com.br' },
      { name: 'Antena 1', logo: 'https://img.radios.com.br/radio/xl/radio9505_1574106966.jpg', url: 'https://antena1.com.br' },
      { name: 'Transamérica', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/32/Rede_Transam%C3%A9rica_logo.png', url: 'https://transamerica.com.br' },
      { name: 'Massa FM', logo: 'https://radioamantes.com/wp-content/uploads/2019/09/massa-fm.jpg', url: 'https://massafm.com.br' },
      { name: 'Rádio Globo', logo: 'https://thumbnail.anii.io/br/radio-globo-98-1-fm-rio-de-janeiro-brazil.webp', url: 'https://radioglobo.globo.com' },
      { name: 'Kiss FM', logo: 'https://kissfm.com.br/wp-content/uploads/2024/08/Madrugada_Kiss.png', url: 'https://kissfm.com.br' },
      { name: 'Kiis FM', logo: 'https://img.radios.com.br/radio/xl/radio72023_1702994214.jpeg', url: 'https://kiisfm.iheart.com/' },
      { name: 'Band FM', logo: 'https://upload.wikimedia.org/wikipedia/pt/1/1f/Logotipo_da_BandNews_FM.png', url: 'https://bandfm.band.uol.com.br' },
      { name: 'Clube FM', logo: 'https://yt3.googleusercontent.com/gAgCvOpnliRNhl7zfEVESJTnHt6ucQjxJDG7R-OAE78R6wz1IGbTEiln6gp4HpBdVU1S8EIAduc=s900-c-k-c0x00ffffff-no-rj', url: 'https://clubefm.com.br' },
      { name: 'Feliz FM', logo: 'https://tudoradio.com/img/uploads/radios/63ad97b8191c6.png', url: 'https://felizfm.fm' },
      { name: 'Nativa FM', logo: 'https://play-lh.googleusercontent.com/wjb4ogU4G9GC-ckpP0FwH-g8djFPPM1yCHedYBBIPruY3MmpAsR2xVa-kTZXLb4BmQ', url: 'https://nativa.fm' },
      { name: 'BH FM', logo: 'https://play-lh.googleusercontent.com/NtWriUQSnawi2s9DD9wvujyeFgYbVsn9buq_8VomcBSgIDR0iP2XPT-SuM7JynSW-c0', url: 'https://bhfm.com.br' },
      { name: 'Top FM', logo: 'https://upload.wikimedia.org/wikipedia/pt/thumb/1/10/Logotipo_da_Top_FM.png/250px-Logotipo_da_Top_FM.png', url: 'https://topfm.com.br' },
    ].map((station, idx) => (
      <a
        key={idx}
        href={station.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform duration-200"
      >
        <div className="w-20 h-20 rounded-full border-4 border-yellow-400 overflow-hidden shadow-md">
          <img
            src={station.logo}
            alt={station.name}
            className="object-cover w-full h-full"
          />
        </div>
        <span className="text-sm text-gray-700 mt-2 text-center max-w-[80px] truncate">
          {station.name}
        </span>
      </a>
    ))}
  </div>
</section>






      {/* HERO BRASILEIRO */}
      <section className="relative bg-gradient-to-tr from-green-800 via-blue-800 to-blue-500 text-white rounded-3xl shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://thinkmarketingmagazine.com/wp-content/uploads/2013/06/steve-jobs.jpg')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
        <div className="relative z-10 px-8 py-20 sm:px-16 lg:px-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-2xl">
            Conecte-se com as <span className="text-yellow-300">melhores rádios</span> do Brasil
          </h1>
          <p className="mt-6 text-xl sm:text-2xl max-w-3xl text-white/90 drop-shadow-md">
            Descubra uma seleção única de rádios brasileiras com estilos para todos os gostos. Música, informação e cultura nacional, tudo ao seu alcance.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/browse')}
              className="bg-yellow-400 text-black hover:bg-yellow-500 transition-all font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 duration-300"
            >
              Descobrir Estações
            </button>
            <button
              onClick={() => navigate('/countries/')}
              className="bg-white/20 hover:bg-white/30 text-white border border-white font-semibold py-3 px-8 rounded-full transition-all duration-300"
            >
              Rádios Por Países
            </button>
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {[
          { icon: <Radio size={36} className="text-green-600" />, title: 'Rádios para todos', text: 'Milhares de estações do Brasil e do mundo à sua disposição.' },
          { icon: <Headphones size={36} className="text-yellow-600" />, title: 'Fácil de usar', text: 'Clique, escute e curta sua estação preferida, sem complicações.' },
          { icon: <Heart size={36} className="text-red-500" />, title: 'Favoritas salvas', text: 'Guarde suas rádios preferidas para ouvir sempre que quiser.' },
          { icon: <Globe size={36} className="text-blue-500" />, title: 'Cobertura global', text: 'Além do Brasil, explore estações de todo o planeta.' },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.text}</p>
          </div>
        ))}
      </section>

      {/* RÁDIOS DO BRASIL */}
      <section>
        <div className="flex items-center justify-between mb-6 px-4">
          <h2 className="text-3xl font-bold flex items-center text-gray-900">
            <Globe className="text-green-600 mr-2" /> Rádios do Brasil
          </h2>
          <button
            onClick={() => navigate('/countries/Brazil')}
            className="text-sm font-semibold text-green-600 hover:text-green-800 transition"
          >
            Ver todas
          </button>
        </div>
        <StationList
          stations={brazilStations}
          isLoading={loadingBrazil}
          emptyMessage="Nenhuma estação brasileira disponível no momento."
        />
      </section>

      {/* ESTAÇÕES POPULARES */}
      <section>
        <div className="flex items-center justify-between mb-6 px-4">
          <h2 className="text-3xl font-bold flex items-center text-gray-900">
            <TrendingUp className="text-yellow-500 mr-2" /> Mais Ouvidas
          </h2>
          <button
            onClick={() => navigate('/browse')}
            className="text-sm font-semibold text-yellow-600 hover:text-yellow-800 transition"
          >
            Ver todas
          </button>
        </div>
        <StationList
          stations={popularStations}
          isLoading={loadingPopular}
          emptyMessage="Carregando estações populares..."
        />
      </section>

      {/* ESTAÇÕES EM DESTAQUE */}
      <section>
        <div className="flex items-center justify-between mb-6 px-4">
          <h2 className="text-3xl font-bold flex items-center text-gray-900">
            <Star className="text-red-500 mr-2" /> Em Destaque
          </h2>
        </div>
        <StationList
          stations={featuredStations}
          isLoading={loadingPopular}
          emptyMessage="Nenhuma estação em destaque agora."
        />
      </section>

      {/* ESTAÇÕES RECENTES */}
      {recentlyPlayed.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6 px-4">
            <h2 className="text-3xl font-bold text-gray-900">Ouvidas Recentemente</h2>
            <button
              onClick={() => navigate('/history')}
              className="text-sm font-semibold text-yellow-600 hover:text-yellow-800 transition"
            >
              Ver todas
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