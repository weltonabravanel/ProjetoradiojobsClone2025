import React from 'react';
import StationCard from './StationCard';
import { RadioStation } from '../types/station';
import { Loader, AlertCircle, Radio, Sparkles } from 'lucide-react';

interface StationListProps {
  stations: RadioStation[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

const StationList: React.FC<StationListProps> = ({ 
  stations, 
  isLoading = false, 
  error = null,
  emptyMessage = "Nenhuma estação encontrada"
}) => {
  if (isLoading) {
    return (
      <div className="glass-card p-12 text-center animate-slide-up">
        <div className="flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"></div>
            <Radio className="absolute inset-0 m-auto h-8 w-8 text-blue-500 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Carregando estações...</h3>
          <p className="text-gray-600">Buscando as melhores rádios para você</p>
          <div className="mt-4 flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="glass-card p-8 border-l-4 border-red-500 animate-slide-up">
        <div className="flex items-start">
          <AlertCircle size={24} className="text-red-500 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-red-800 mb-2">Erro ao carregar estações</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="bg-red-50 p-4 rounded-xl">
              <p className="text-sm text-red-700">
                💡 <strong>Dicas:</strong> Tente ajustar os filtros, verificar sua conexão ou recarregar a página
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (stations.length === 0) {
    return (
      <div className="glass-card p-12 text-center animate-slide-up">
        <div className="max-w-md mx-auto">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Radio size={40} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{emptyMessage}</h3>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
            <p className="text-gray-600 mb-4">
              🎵 <strong>Dicas para encontrar rádios:</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-2 text-left">
              <li>• Tente termos mais gerais (ex: "rock", "brasil")</li>
              <li>• Verifique a ortografia</li>
              <li>• Use filtros diferentes</li>
              <li>• Explore por países ou gêneros</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header com estatísticas */}
      <div className="glass-card p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {stations.length} estação{stations.length !== 1 ? 'ões' : ''} encontrada{stations.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-gray-600">Ordenadas por popularidade e relevância</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Ao vivo</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Alta qualidade</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Grid de estações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {stations.map((station, index) => (
          <div
            key={station.stationuuid}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <StationCard station={station} />
          </div>
        ))}
      </div>
      
      {/* Footer informativo */}
      {stations.length >= 500 && (
        <div className="glass-card p-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h4 className="font-bold text-gray-800 mb-2">
              🎯 Mostrando as primeiras {stations.length} estações
            </h4>
            <p className="text-gray-600 text-sm">
              Use filtros mais específicos para refinar sua busca e encontrar exatamente o que procura.
              Temos milhares de estações disponíveis!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationList;