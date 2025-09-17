import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Radio, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Page Not Found - WaveRadio';
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Radio size={64} className="text-primary-300 mb-4" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/"
        className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Back to Home</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;