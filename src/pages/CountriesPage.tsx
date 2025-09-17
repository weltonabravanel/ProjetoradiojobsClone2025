import React, { useEffect, useState } from 'react';
import { Globe, ChevronRight, Loader, MapPin, Users } from 'lucide-react';
import { fetchCountries, fetchStations } from '../services/api';
import { useRadio } from '../contexts/RadioContext';
import StationList from '../components/StationList';

interface CountryData {
  name: string;
  stationcount: number;
}

const CountriesPage: React.FC = () => {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const { setStations, stations, isLoading: stationsLoading } = useRadio();
  
  useEffect(() => {
    document.title = selectedCountry 
      ? `${selectedCountry} - Rádios por País - Rádio Jobs `
      : 'Rádios por País - Rádio Jobs ';
  }, [selectedCountry]);
  
  useEffect(() => {
    const loadCountries = async () => {
      setLoading(true);
      try {
        const data = await fetchCountries();
        const filtered = data
          .filter(country => country.name && country.stationcount > 5)
          .sort((a, b) => b.stationcount - a.stationcount);
        setCountries(filtered);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar países');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCountries();
  }, []);
  
  const handleCountrySelect = async (country: string) => {
    setSelectedCountry(country);
    try {
      const data = await fetchStations({ country });
      setStations(data);
    } catch (err) {
      console.error('Erro ao carregar estações do país:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="glass-card p-12 text-center animate-slide-up">
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"></div>
            <Globe className="absolute inset-0 m-auto h-8 w-8 text-blue-500 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Carregando países...</h3>
          <p className="text-gray-600">Preparando a lista de países disponíveis</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="glass-card p-8 border-l-4 border-red-500 animate-slide-up">
        <div className="flex items-start">
          <div className="bg-red-100 p-3 rounded-2xl mr-4">
            <Globe size={24} className="text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800 mb-2">Erro ao carregar países</h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (selectedCountry) {
    return (
      <div className="space-y-8 animate-slide-up">
        {/* Header do País Selecionado */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => setSelectedCountry(null)}
                className="mr-6 p-3 rounded-2xl hover:bg-gray-100 transition-colors duration-300 text-gray-600 hover:text-gray-800"
              >
                ← Voltar
              </button>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl mr-4">
                <MapPin size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-800">{selectedCountry}</h1>
                <p className="text-xl text-gray-600 mt-2">Estações de rádio disponíveis</p>
              </div>
            </div>
          </div>
        </div>
        
        <StationList 
          stations={stations} 
          isLoading={stationsLoading}
          emptyMessage={`Nenhuma estação encontrada para ${selectedCountry}`}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="glass-card p-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl mr-4">
              <Globe size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-800">Rádios por País</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Explore estações de rádio de todo o mundo. Descubra a música e cultura de diferentes países.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">{countries.length}</div>
              <div className="text-gray-600 font-medium">Países Disponíveis</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {countries.reduce((sum, country) => sum + country.stationcount, 0).toLocaleString()}
              </div>
              <div className="text-gray-600 font-medium">Total de Estações</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de Países */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Users className="mr-3 text-blue-500" />
            Países Mais Populares
          </h2>
          <p className="text-gray-600 mt-2">Clique em um país para ver suas estações</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {countries.slice(0, 30).map((country, index) => (
            <button
              key={country.name}
              onClick={() => handleCountrySelect(country.name)}
              className="flex items-center justify-between p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-left group hover:scale-[1.02] transform"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">
                    {country.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {country.name}
                  </span>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <Users size={14} className="mr-1" />
                    {country.stationcount} estações
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountriesPage;