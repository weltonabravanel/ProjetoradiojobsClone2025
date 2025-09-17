import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Player from './Player';
import { useRadio } from '../contexts/RadioContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentStation } = useRadio();
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-mesh relative overflow-x-hidden">
      {/* Partículas de fundo */}
      <div className="particles fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      <Header />
      
      {/* Espaçamento para navegação flutuante */}
      <div className="h-20 hidden lg:block"></div>
      
      <main className="container mx-auto px-6 py-12 relative z-10">
        <div className="animate-slide-up">
          {children}
        </div>
      </main>
      
      {currentStation && (
        <div className="fixed bottom-6 left-6 right-6 z-50 animate-slide-up">
          <Player />
        </div>
      )}
      
      <div className={currentStation ? 'pb-32' : 'pb-0'}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;