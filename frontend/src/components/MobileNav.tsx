import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Sparkles, User, Settings, Plus } from 'lucide-react';

export default function MobileNav() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'feed', icon: <Home size={22} />, path: '/' },
    { id: 'dashboard', icon: <Sparkles size={22} />, path: '/profile' },
    { id: 'plus', icon: <Plus size={24} />, path: '/', isPlus: true },
    { id: 'profile', icon: <User size={22} />, path: '/profile' },
    { id: 'settings', icon: <Settings size={22} />, path: '#' },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-[60] lg:hidden">
      <div className="glass-panel flex items-center justify-around px-4 pb-6 pt-4 border-t border-white/10 shadow-[0_-15px_40px_rgba(0,0,0,0.4)] backdrop-blur-3xl rounded-t-[32px] bg-[#070a10cc]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`tactile flex items-center justify-center p-2 rounded-[14px] transition-all ${
              item.isPlus 
                ? 'bg-gradient-to-br from-[#8f72ff] to-[#4ea1ff] text-white w-14 h-14 -translate-y-8 shadow-[0_15px_35px_rgba(143,114,255,0.4)] border border-white/20' 
                : isActive(item.path) 
                  ? 'text-white' 
                  : 'text-slate-400 opacity-80'
            }`}
          >
            {item.icon}
          </button>
        ))}
      </div>
    </nav>
  );
}
