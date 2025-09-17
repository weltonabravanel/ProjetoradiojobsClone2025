import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Radio, Heart, Clock, Globe, Menu, X, Search, Sparkles } from 'lucide-react';
import { useRadio } from '../contexts/RadioContext';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { filters, setFilters, applyFilters } = useRadio();
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <>
      {/* Header Principal */}
      <header className="relative z-40">
        <div className="hero-gradient">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-white to-blue-100 p-3 rounded-2xl shadow-xl">
                    <Radio className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-black text-white">Rádio</span>
                  <span className="text-2xl font-black text-gradient bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Jobs</span>
                  <div className="text-xs text-blue-200 font-medium">Sua música, seu mundo</div>
                </div>
              </Link>
              
              {/* Search Bar Desktop */}
              <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative max-w-2xl flex-1 mx-8">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Busque por rádios, gêneros, países..."
                    className="w-full py-4 px-6 pr-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-white/30 transition-all duration-300 text-lg"
                    value={filters.search}
                    onChange={(e) => setFilters({ search: e.target.value })}
                  />
                  <button 
                    type="submit" 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-xl hover:scale-110 transition-transform duration-200"
                  >
                    <Search size={20} className="text-white" />
                  </button>
                </div>
              </form>
              
              {/* Mobile menu button */}
              <button 
                className="lg:hidden bg-white/20 backdrop-blur-sm p-3 rounded-2xl border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            {/* Mobile Search */}
            {mobileMenuOpen && (
              <form onSubmit={handleSearchSubmit} className="lg:hidden mt-6 animate-slide-up">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar rádios..."
                    className="w-full py-4 px-6 pr-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/20 text-lg"
                    value={filters.search}
                    onChange={(e) => setFilters({ search: e.target.value })}
                  />
                  <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-xl">
                    <Search size={20} className="text-white" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Navigation Bar Flutuante */}
      <nav className="floating-nav hidden lg:flex items-center space-x-2">
        {[
          { to: '/', label: 'Início', icon: Radio },
          { to: '/browse', label: 'Explorar', icon: Globe },
          { to: '/favorites', label: 'Favoritos', icon: Heart },
          { to: '/countries', label: 'Países', icon: Globe },
        ].map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              isActive(to)
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                : 'text-gray-700 hover:bg-white/80 hover:scale-105'
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
        
        {/* Links Externos */}
        <a
          href="https://radiojobs.netlify.app/aplicativo.html"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 hover:text-white transition-all duration-300 hover:scale-105"
        >
          <Sparkles size={18} />
          <span>Apps</span>
        </a>
        
        <a
          href="https://wa.me/5531982845056?text=Quero%20adicionar%20minha%20R%C3%A1dio"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 shadow-lg"
        >
          + Adicionar Rádio
        </a>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="glass-card-dark m-4 p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Menu</h3>
              <button onClick={toggleMobileMenu} className="text-white">
                <X size={24} />
              </button>
            </div>
            
            <nav className="space-y-4">
              {[
                { to: '/', label: 'Início', icon: Radio },
                { to: '/browse', label: 'Explorar', icon: Globe },
                { to: '/favorites', label: 'Favoritos', icon: Heart },
                { to: '/history', label: 'Histórico', icon: Clock },
              ].map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center space-x-3 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
              
              <div className="border-t border-white/20 pt-4 space-y-4">
                <a
                  href="https://radiojobs.netlify.app/aplicativo.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300 text-white"
                >
                  <Sparkles size={20} />
                  <span className="font-medium">Aplicativos</span>
                </a>
                
                <a
                  href="https://wa.me/5531982845056?text=Quero%20adicionar%20minha%20R%C3%A1dio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold"
                >
                  <span>+ Adicionar Rádio</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
