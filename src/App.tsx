import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { RadioProvider } from './contexts/RadioContext';
import Layout from './components/Layout';

function App() {
  return (
    <RadioProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </RadioProvider>
  );
}

export default App;