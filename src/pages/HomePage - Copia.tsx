import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Heart, Globe, Headphones, TrendingUp } from 'lucide-react';
import StationList from '../components/StationList';
import { useRadio } from '../contexts/RadioContext';
import { fetchStations } from '../services/api';
import { RadioStation } from '../types/station';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { stations, isLoading, error, recentlyPlayed } = useRadio();
  const [popularStations, setPopularStations] = useState<RadioStation[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(false);
  
  useEffect(() => {
    document.title = 'Rádio Jobs - Ouça rádios online';
    
    const loadPopularStations = async () => {
      setLoadingPopular(true);
      try {
        // Sort by votes
        const data = await fetchStations({}, 20);
        const sorted = [...data].sort((a, b) => b.votes - a.votes);
        setPopularStations(sorted.slice(0, 12));
      } catch (err) {
        console.error('Error loading popular stations:', err);
      } finally {
        setLoadingPopular(false);
      }
    };
    
    loadPopularStations();
  }, []);
  
  return (
    <div className="space-y-10">
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-primary-800 to-primary-900 text-white rounded-xl overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center"></div>
        </div>
        <div className="relative z-10 px-6 py-12 md:py-16 md:px-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Descubra milhares de <br className="hidden md:block" />
            <span className="text-primary-200">estações de rádio online gratuitas
</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
            Ouça música, notícias, esportes e programas de rádio do mundo todo.
Não é necessário cadastro. Basta clicar e ouvir!
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => navigate('/browse')}
              className="bg-white text-primary-900 hover:bg-gray-100 font-medium py-2 px-6 rounded-full transition-colors shadow-md"
            >
              Navegar pelas estações

            </button>
            <button 
              onClick={() => navigate('/countries')}
              className="bg-transparent hover:bg-white/10 border border-white text-white font-medium py-2 px-6 rounded-full transition-colors"
            >
              Explorar por país

            </button>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
           <Radio size={32} className="text-green-500 mb-4" />
<Headphones size={32} className="text-yellow-500 mb-4" />
<Heart size={32} className="text-green-500 mb-4" />
<Globe size={32} className="text-yellow-500 mb-4" />

            <h3 className="text-lg font-semibold mb-2">Milhares de Estações
</h3>
            <p className="text-gray-600">
              Acesse mais de 1.000.000 estações de rádio do mundo todo em um só lugar.

            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Headphones size={32} className="text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Escuta fácil
</h3>
            <p className="text-gray-600">
              Basta clicar e jogar. Não é necessário cadastro ou assinatura.

            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Heart size={32} className="text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Salvar Favoritos
</h3>
            <p className="text-gray-600">
              Acompanhe suas estações favoritas para acesso rápido a qualquer momento.

            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Globe size={32} className="text-primary-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Cobertura Global
</h3>
            <p className="text-gray-600">
              Descubra estações locais e internacionais de todos os continentes.

            </p>
          </div>
        </div>
      </section>
      
      {/* Seção de estações populares
 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold flex items-center">
            <TrendingUp size={24} className="text-primary-600 mr-2" />
            Estações Populares
          </h2>
          <button 
            onClick={() => navigate('/browse')}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            Ver tudo

          </button>
        </div>
        <StationList 
          stations={popularStations} 
          isLoading={loadingPopular} 
          emptyMessage="Carregando estações populares...
"
        />
      </section>
      
      {/* Recently played section */}
      {recentlyPlayed.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Jogado recentemente
</h2>
            <button 
              onClick={() => navigate('/history')}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              Ver tudo

            </button>
          </div>
          <StationList 
            stations={recentlyPlayed.slice(0, 6)} 
            emptyMessage="No recently played stations"
          />
        </section>
      )}
    </div>
  );
};

export default HomePage;