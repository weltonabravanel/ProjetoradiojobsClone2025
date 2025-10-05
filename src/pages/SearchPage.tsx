import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  Heart,
  Globe,
  Headphones,
  TrendingUp,
  Star,
  Music,
  Home,
  Search,
  Users,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// --------------------------------------------------
// HomePage - estilo app móvel (claro) — arquivo único
// - Pronto para usar com TailwindCSS
// - Menu inferior fixo estilo mobile
// - Cards arredondados, sombras suaves, toques animados
// - Comentários mostram onde integrar sua API (fetchStations / useRadio)
// --------------------------------------------------

type RadioStation = {
  id: string;
  name: string;
  country?: string;
  logo?: string;
  streamUrl?: string;
};

const MOCK_STATIONS: RadioStation[] = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i + 1),
  name: `Rádio Exemplo ${i + 1}`,
  country: 'Brazil',
  logo: `https://picsum.photos/seed/radio${i + 1}/200/200`,
  streamUrl: '#',
}));

const StationCard: React.FC<{ station: RadioStation; onOpen?: (s: RadioStation) => void }> = ({ station, onOpen }) => {
  return (
    <div
      onClick={() => onOpen && onOpen(station)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex items-center gap-4 cursor-pointer"
    >
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
        <img src={station.logo} alt={station.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-gray-800 truncate">{station.name}</div>
        <div className="text-xs text-gray-500 mt-1">{station.country ?? '—'}</div>
      </div>
      <div className="text-sm text-gray-400">▶</div>
    </div>
  );
};

const StationList: React.FC<{
  stations: RadioStation[];
  title?: string;
  subtitle?: string;
  onOpen?: (s: RadioStation) => void;
}> = ({ stations, title, subtitle, onOpen }) => {
  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {stations.map((s) => (
          <StationCard key={s.id} station={s} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
};

const BottomNav: React.FC<{ active?: string }> = ({ active = 'home' }) => {
  const items = [
    { id: 'home', label: 'Início', icon: <Home size={20} /> },
    { id: 'search', label: 'Buscar', icon: <Search size={20} /> },
    { id: 'favorites', label: 'Favoritos', icon: <Heart size={20} /> },
    { id: 'my', label: 'Minhas', icon: <Users size={20} /> },
  ];
  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(980px,96%)] bg-white/95 backdrop-blur-md rounded-3xl shadow-lg py-2 px-3 flex justify-between items-center z-50 border border-gray-100">
      {items.map((it) => (
        <button
          key={it.id}
          className={`flex flex-col items-center gap-1 text-xs focus:outline-none ${
            active === it.id ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          <div className={`p-2 rounded-lg ${active === it.id ? 'bg-blue-50' : ''}`}>{it.icon}</div>
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
};

const TopGradientCard: React.FC<{ title: string; desc?: string; cta?: string }> = ({ title, desc, cta }) => (
  <div className="relative rounded-2xl overflow-hidden shadow-md">
    <div className="p-6 md:p-8 flex flex-col justify-center min-h-[160px] bg-gradient-to-r from-white to-white">
      <div className="text-sm text-gray-500">{desc}</div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">{title}</h2>
      {cta && (
        <div className="mt-4">
          <button className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow-sm">
            {cta}
          </button>
        </div>
      )}
    </div>
  </div>
);

const HomePageAppStyle: React.FC = () => {
  const navigate = useNavigate();
  const [popularStations, setPopularStations] = useState<RadioStation[]>([]);
  const [brazilStations, setBrazilStations] = useState<RadioStation[]>([]);
  const [featuredStations, setFeaturedStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = 'Rádio Jobs - App';
    setIsLoading(true);
    // === Integração com sua API ===
    // Substitua este bloco pelo seu fetchStations / useRadio se preferir
    // Exemplo: const data = await fetchStations({ country: 'Brazil' }, 50);
    setTimeout(() => {
      setPopularStations(MOCK_STATIONS.slice(0, 8));
      setFeaturedStations(MOCK_STATIONS.slice(4, 12));
      setBrazilStations(MOCK_STATIONS.slice(0, 6));
      setIsLoading(false);
    }, 400);
  }, []);

  const handleOpenStation = (s: RadioStation) => {
    // navegue para player ou abra modal
    // navigate(`/station/${s.id}`);
    alert(`Abrindo: ${s.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-36">
      <div className="max-w-[980px] mx-auto px-4 pt-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Rádio Jobs</h1>
            <p className="text-sm text-gray-500">Sua música. Seu mundo.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg bg-white shadow-sm">
              <Radio size={18} />
            </button>
            <button className="p-2 rounded-lg bg-white shadow-sm">
              <Heart size={18} />
            </button>
          </div>
        </header>

        {/* Stories - círculos horizontais */}
        <section className="mb-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {MOCK_STATIONS.slice(0, 10).map((s) => (
              <div key={s.id} className="flex flex-col items-center min-w-[84px]">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <img src={s.logo} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-xs text-gray-700 mt-2 truncate w-20 text-center">{s.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Carousel */}
        <section className="mb-6">
          <div className="rounded-2xl overflow-hidden shadow-md">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              loop={true}
              className="h-44 rounded-2xl"
            >
              {[1, 2, 3].map((i) => (
                <SwiperSlide key={i}>
                  <div className="relative w-full h-44">
                    <img
                      src={`https://picsum.photos/seed/slide${i}/1200/400`}
                      alt={`slide-${i}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
                    <div className="absolute left-4 bottom-4 text-white">
                      <h3 className="text-lg font-bold">Sintonize Emoções</h3>
                      <p className="text-sm">Descubra estações, playlists e mais.</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-50">
              <Headphones size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">Busca Inteligente</div>
              <div className="text-xs text-gray-500">Encontre por nome, gênero ou país.</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-50">
              <Globe size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">Cobertura Global</div>
              <div className="text-xs text-gray-500">Estações do Brasil e do mundo.</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-lg bg-pink-50">
              <Heart size={20} className="text-pink-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">Favoritas</div>
              <div className="text-xs text-gray-500">Salve suas rádios preferidas.</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-lg bg-yellow-50">
              <TrendingUp size={20} className="text-yellow-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">Mais Ouvidas</div>
              <div className="text-xs text-gray-500">Rádios populares do momento.</div>
            </div>
          </div>
        </section>

        {/* Brazil Stations */}
        <section className="mb-6">
          <TopGradientCard title="Rádios do Brasil" desc="As melhores estações brasileiras" cta="Ver todas" />
          <div className="mt-4">
            <StationList stations={brazilStations} title={undefined} onOpen={handleOpenStation} />
          </div>
        </section>

        {/* Popular */}
        <section className="mb-6">
          <StationList stations={popularStations} title="Mais Ouvidas" subtitle="As estações mais populares" onOpen={handleOpenStation} />
        </section>

        {/* Featured */}
        <section className="mb-6">
          <StationList stations={featuredStations} title="Em Destaque" subtitle="Seleção especial" onOpen={handleOpenStation} />
        </section>

        {/* Recentes - exemplo */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Ouvidas Recentemente</h3>
          <div className="grid grid-cols-3 gap-3">
            {MOCK_STATIONS.slice(0, 3).map((s) => (
              <div key={s.id} className="bg-white rounded-xl p-3 shadow-sm">
                <img src={s.logo} alt={s.name} className="w-full h-20 object-cover rounded-lg mb-2" />
                <div className="text-sm font-semibold text-gray-800 truncate">{s.name}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default HomePageAppStyle;
