// src/components/Header.tsx
import { Menu } from 'lucide-react';

export const Header = () => (
  <header className="p-4 border-b flex justify-between items-center bg-white">
    <div className="text-emerald-600">שם משתמש</div>
    <div className="text-emerald-600 text-xl font-medium">תרופותי</div>
    <button className="text-emerald-600" aria-label="תפריט">
      <Menu size={24} />
    </button>
  </header>
);