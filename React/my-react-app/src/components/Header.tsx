import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CalendarCheck2, Pill, Users, ScrollText } from 'lucide-react';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'בית', path: '/' },
    { icon: ScrollText, label: 'תיעוד', path: '/log' },
    { icon: CalendarCheck2, label: 'תקופתי', path: '/scheduled' },
    { icon: Pill, label: 'תרופות', path: '/medicines' },
    { icon: Users, label: 'ילדים', path: '/kids' }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header className="p-4 border-b flex justify-between items-center bg-white relative">
      <div className="relative">
        <button 
          className="text-emerald-600 p-1 hover:bg-emerald-50 rounded-full transition-colors"
          aria-label="תפריט"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
        </button>
        
        {isOpen && (
          <>
            {/* Overlay to close menu when clicking outside */}
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown menu */}
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-1">
                {menuItems.map(({ icon: Icon, label, path }) => (
                  <button
                    key={path}
                    onClick={() => handleNavigation(path)}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                      location.pathname === path
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-emerald-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="text-emerald-600 text-xl font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
       תרופותי
      </div>
      <div className="text-emerald-600">שם משתמש</div>
    </header>
  );
};

export default Header;