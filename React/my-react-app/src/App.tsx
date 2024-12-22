import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Home, Pill, Calendar, Users, Menu } from 'lucide-react';
import MedicinesPage from './Page-Medicines';
import LogPage from './Page-Log';
import KidsPage from './Page-Kids';



// Page components
const HomePage = () => (
  <main className="flex-1 flex flex-col items-center justify-center p-4 bg-white">
    <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-xs sm:max-w-md">
      <div className="bg-emerald-600 text-white p-4 rounded-lg shadow-md hover:bg-emerald-700 transition-colors text-center flex-1">
        ילד #2
      </div>
      <div className="bg-emerald-600 text-white p-4 rounded-lg shadow-md hover:bg-emerald-700 transition-colors text-center flex-1">
        ילד #1
      </div>
    </div>
    
    <button className="bg-emerald-600 text-white w-32 h-32 rounded-full shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center text-xl">
      תן תרופה
    </button>
  </main>
);


// Navigation component that will be shared across all pages
const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'בית', path: '/' },
    { icon: Calendar, label: 'יומן', path: '/log' },
    { icon: Pill, label: 'תרופות', path: '/medicines' },
    { icon: Users, label: 'ילדים', path: '/kids' }
  ];

  return (
    <footer className="border-t bg-white">
      <nav className="flex justify-between items-center p-4 max-w-md mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => (
          <button 
            key={label}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              location.pathname === path 
                ? 'text-emerald-700 font-medium' 
                : 'text-emerald-600 hover:text-emerald-700'
            }`}
            aria-label={label}
          >
            <Icon size={24} />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </nav>
    </footer>
  );
};

// Layout component that wraps all pages
const Layout = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto h-screen flex flex-col shadow-lg">
        <header className="p-4 border-b flex justify-between items-center bg-white">
          <div className="text-emerald-600">שם משתמש</div>
          <div className="text-emerald-600 text-xl font-medium">תרופותי</div>
          <button className="text-emerald-600" aria-label="תפריט">
            <Menu size={24} />
          </button>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/log" element={<LogPage />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route path="/kids" element={<KidsPage />} />
        </Routes>

        <Navigation />
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;