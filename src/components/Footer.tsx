import React from 'react';
import { Radio, Github, Heart, Globe, Music, Headphones } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-20">
      <div className="glass-card-dark mx-6 mb-6 p-8 lg:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl">
                <Radio className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black text-white">Rádio</span>
                <span className="text-2xl font-black text-gradient bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> BR</span>
              </div>
            </div>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed max-w-md">
              Conecte-se com o mundo através da música. Descubra, ouça e compartilhe as melhores estações de rádio do Brasil e do mundo inteiro.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://radiojobs.com.br" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 p-3 rounded-2xl transition-all duration-300 hover:scale-110 text-white"
              >
                <Globe size={24} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 p-3 rounded-2xl transition-all duration-300 hover:scale-110 text-white"
              >
                <Github size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center">
              <Music className="mr-2 text-blue-400" size={20} />
              Navegação
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Início" },
                { href: "/browse", label: "Explorar Rádios" },
                { href: "/favorites", label: "Favoritas" },
                { href: "/countries", label: "Por Países" }
              ].map((link) => (
                <li key={link.href}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-white flex items-center">
              <Headphones className="mr-2 text-purple-400" size={20} />
              Recursos
            </h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://radiojobs.netlify.app/aplicativo.html" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block"
                >
                  Aplicativos Mobile
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/5531982845056?text=Quero%20adicionar%20minha%20R%C3%A1dio" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block"
                >
                  Adicionar Rádio
                </a>
              </li>
              <li>
                <span className="text-gray-300">API Gratuita</span>
              </li>
              <li>
                <span className="text-gray-300">Suporte 24/7</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="flex items-center justify-center text-gray-400 text-lg">
            Feito com
            <Heart size={20} className="mx-2 text-red-500 animate-pulse" /> 
            para os amantes da música
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2024 Rádio Jobs . Conectando você ao mundo através da música.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;