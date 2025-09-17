import React from 'react';
import {
  Home, Compass, Radio, Library, Calendar, Award, Users, Guitar,
  Heart, Plus, Settings, Music, X, TrendingUp, Clock, Star,
  Headphones, ListMusic, Palette, Timer, Smile
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  favoritesCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  favoritesCount,
}) => {
  const navigationItems = [
    { id: 'home', icon: Home, label: 'Início', badge: null },
    { id: 'discover', icon: Compass, label: 'Descobrir', badge: null },
    { id: 'trending', icon: TrendingUp, label: 'Em Alta', badge: 'HOT' },
    { id: 'radio', icon: Radio, label: 'Rádio Brasil', badge: null },
    { id: 'new-releases', icon: Calendar, label: 'Lançamentos', badge: 'NEW' },
    { id: 'classics', icon: Award, label: 'Clássicos', badge: null },
    { id: 'regional', icon: Users, label: 'Regional', badge: null },
    { id: 'instrumental', icon: Guitar, label: 'Instrumental', badge: null },
  ];

  const newSections = [
    { id: 'styles', icon: Palette, label: 'Estilos', badge: null },
    { id: 'decades', icon: Timer, label: 'Décadas', badge: null },
    { id: 'mood', icon: Smile, label: 'Por Humor', badge: null },
  ];

  const libraryItems = [
    { id: 'library', icon: Library, label: 'Biblioteca', badge: null },
    { id: 'recent', icon: Clock, label: 'Recentes', badge: null },
    { id: 'favorites', icon: Heart, label: 'Favoritas', badge: favoritesCount > 0 ? favoritesCount.toString() : null },
    { id: 'playlists', icon: ListMusic, label: 'Playlists', badge: null },
    { id: 'recommendations', icon: Star, label: 'Para Você', badge: null },
  ];

  const handleItemClick = (itemId: string) => {
    setActiveTab(itemId);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
        fixed md:relative top-0 left-0 h-full
        w-72 md:w-16 lg:w-72 
        bg-black/40 backdrop-blur-xl border-r border-white/10 
        transition-all duration-300 ease-in-out
        flex flex-col z-50
      `}>
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 via-yellow-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div className="md:hidden lg:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-400 to-yellow-400 bg-clip-text text-transparent">
                  Music Brasil
                </h1>
                <p className="text-xs text-gray-400">Sua música brasileira</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {/* Main Navigation */}
          <div className="space-y-1 mb-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 md:hidden lg:block px-3">
              Explorar
            </h3>
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${activeTab === item.id 
                    ? 'bg-gradient-to-r from-green-500/20 to-yellow-500/20 text-white border border-green-500/30 shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="md:hidden lg:block font-medium">{item.label}</span>
                {item.badge && (
                  <span className="md:hidden lg:block ml-auto text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* New Sections */}
          <div className="space-y-1 mb-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 md:hidden lg:block px-3">
              Categorias
            </h3>
            {newSections.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${activeTab === item.id 
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-500/30 shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="md:hidden lg:block font-medium">{item.label}</span>
                {item.badge && (
                  <span className="md:hidden lg:block ml-auto text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Library Section */}
          <div className="space-y-1 mb-8">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 md:hidden lg:block px-3">
              Minha Música
            </h3>
            {libraryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${activeTab === item.id 
                    ? 'bg-gradient-to-r from-green-500/20 to-yellow-500/20 text-white border border-green-500/30 shadow-lg' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${item.id === 'favorites' ? 'text-red-400' : ''}`} />
                <span className="md:hidden lg:block font-medium">{item.label}</span>
                {item.badge && (
                  <span className="md:hidden lg:block ml-auto text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 md:hidden lg:block px-3">
              Ações Rápidas
            </h3>
            <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
              <Plus className="w-5 h-5 shrink-0" />
              <span className="md:hidden lg:block font-medium">Criar Playlist</span>
            </button>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full flex items-center justify-center text-lg">
              BR
            </div>
            <div className="flex-1 min-w-0 md:hidden lg:block">
              <p className="text-sm font-medium text-white truncate">Usuário Brasil</p>
              <p className="text-xs text-gray-400">Premium Nacional</p>
            </div>
            <button className="text-gray-400 hover:text-white md:hidden lg:block">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;