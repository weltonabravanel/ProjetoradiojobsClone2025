import React, { useEffect } from 'react';
import { Clock, Music, RotateCcw } from 'lucide-react';
import StationList from '../components/StationList';
import { useRadio } from '../contexts/RadioContext';

const HistoryPage: React.FC = () => {
  const { recentlyPlayed } = useRadio();
  
  useEffect(() => {
    document.title = 'Histórico - Rádio Jobs ';
  }, []);
  
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="glass-card p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-4 rounded-2xl mr-4">
              <Clock size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-800">Histórico</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Suas estações tocadas recentemente. Continue de onde parou ou redescubra suas favoritas.
            {recentlyPlayed.length > 0 && ` Você ouviu ${recentlyPlayed.length} estação${recentlyPlayed.length !== 1 ? 'ões' : ''} recentemente.`}
          </p>
          
          {recentlyPlayed.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-2xl">
                <div className="flex items-center justify-center mb-2">
                  <Music className="text-indigo-600 mr-2" size={24} />
                  <span className="text-2xl font-bold text-indigo-600">{recentlyPlayed.length}</span>
                </div>
                <div className="text-gray-600 font-medium">Estações no Histórico</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
                <div className="flex items-center justify-center mb-2">
                  <RotateCcw className="text-purple-600 mr-2" size={24} />
                  <span className="text-2xl font-bold text-purple-600">∞</span>
                </div>
                <div className="text-gray-600 font-medium">Sempre Disponível</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Lista do Histórico */}
      <StationList 
        stations={recentlyPlayed} 
        emptyMessage="Você ainda não ouviu nenhuma estação. Explore as rádios e comece a criar seu histórico!"
      />
      
      {recentlyPlayed.length === 0 && (
        <div className="glass-card p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Clock size={40} className="text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Comece a ouvir!</h3>
            <p className="text-gray-600 mb-6">
              Seu histórico de estações aparecerá aqui conforme você for ouvindo diferentes rádios.
            </p>
            <button
              onClick={() => window.location.href = '/browse'}
              className="btn-primary"
            >
              Explorar Rádios
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;