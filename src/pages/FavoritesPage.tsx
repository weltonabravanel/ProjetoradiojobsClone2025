import React, { useEffect } from 'react';
import { Heart, Music, Star } from 'lucide-react';
import StationList from '../components/StationList';
import { useRadio } from '../contexts/RadioContext';

const FavoritesPage: React.FC = () => {
  const { favorites } = useRadio();
  
  useEffect(() => {
    document.title = 'Favoritos - Rádio Jobs ';
  }, []);
  
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="glass-card p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-2xl mr-4">
              <Heart size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-800">Suas Favoritas</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Suas estações de rádio favoritas, sempre ao seu alcance. 
            {favorites.length > 0 && ` Você tem ${favorites.length} estação${favorites.length !== 1 ? 'ões' : ''} salva${favorites.length !== 1 ? 's' : ''}.`}
          </p>
          
          {favorites.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-gradient-to-r from-pink-50 to-red-50 p-6 rounded-2xl">
                <div className="flex items-center justify-center mb-2">
                  <Music className="text-pink-600 mr-2" size={24} />
                  <span className="text-2xl font-bold text-pink-600">{favorites.length}</span>
                </div>
                <div className="text-gray-600 font-medium">Estações Favoritas</div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl">
                <div className="flex items-center justify-center mb-2">
                  <Star className="text-yellow-600 mr-2" size={24} />
                  <span className="text-2xl font-bold text-yellow-600">★★★★★</span>
                </div>
                <div className="text-gray-600 font-medium">Sua Coleção</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Lista de Favoritas */}
      <StationList 
        stations={favorites} 
        emptyMessage="Você ainda não adicionou nenhuma estação aos favoritos. Explore as rádios e clique no ❤️ para salvá-las aqui!"
      />
      
      {favorites.length === 0 && (
        <div className="glass-card p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-br from-pink-100 to-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-pink-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Comece sua coleção!</h3>
            <p className="text-gray-600 mb-6">
              Adicione suas rádios favoritas para ter acesso rápido sempre que quiser ouvir.
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

export default FavoritesPage;