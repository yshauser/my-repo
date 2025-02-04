import React, { useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, CalendarCheck2, Pill, Users, ScrollText, Settings } from 'lucide-react';
import { useAuth } from '../Users/AuthContext';
import LoginDialog from './LoginDialog';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { icon: Home, label: 'בית', path: '/' },
    { icon: ScrollText, label: 'תיעוד', path: '/log' },
    { icon: CalendarCheck2, label: 'תקופתי', path: '/scheduled' },
    { icon: Pill, label: 'תרופות', path: '/medicines' },
    { icon: Users, label: 'ילדים', path: '/kids' },
    { icon: Settings, label: 'הגדרות', path: '/settings' }
  ];

  const handleLogout = () => {
    // logout();
    console.log ('*** handle logout', {user})
    setShowLoginModal(true);
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
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-1">
                {menuItems.map(({ icon: Icon, label, path }) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
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
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Users size={16} />
                  <span>החלף משתמש</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="text-emerald-600 text-xl font-medium absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        תרופותי
      </div>
      <div className="text-emerald-600">{user?.username || 'אורח'}</div>

      {/* Show Login Modal when logged out */}
      {showLoginModal && <LoginDialog onClose={() => setShowLoginModal(false)} />}
    </header>
  );
};

export default Header;
