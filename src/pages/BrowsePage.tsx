import React, { useEffect } from 'react';
import { Radio, Search, Filter } from 'lucide-react';
import StationList from '../components/StationList';
import FilterBar from '../components/FilterBar';
import { useRadio } from '../contexts/RadioContext';

const BrowsePage: React.FC = () => {
  const { stations, isLoading, error } = useRadio();
  
  useEffect(() => {
    document.title = 'Explorar Rádios - Rádio Jobs ';
  }, []);
  
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="glass-card p-8 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl mr-4">
              <Search size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-800">Explorar Rádios</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Descubra milhares de estações de rádio do mundo todo. Use os filtros para encontrar exatamente o que você procura.
          </p>
          
          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Estações Disponíveis</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
              <div className="text-gray-600 font-medium">Países</div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-orange-600 mb-2">100+</div>
              <div className="text-gray-600 font-medium">Gêneros Musicais</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtros */}
      <FilterBar />
      
      {/* Lista de Estações */}
      <StationList 
        stations={stations} 
        isLoading={isLoading} 
        error={error}
        emptyMessage="Nenhuma estação encontrada com os critérios selecionados. Tente ajustar os filtros."
      />
    </div>
  );
};

export default BrowsePage;