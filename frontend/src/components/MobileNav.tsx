import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Sparkles, User, Settings, Plus, LogOut } from 'lucide-react';

export default function MobileNav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'feed', icon: <Home size={20} />, label: 'Akış', path: '/' },
    { id: 'profile', icon: <User size={20} />, label: 'Profil', path: '/profile' },
    { id: 'logout', icon: <LogOut size={20} />, label: 'Çıkış', path: '/login', isLogout: true },
  ];

  const handleAction = async (item: any) => {
    if (item.isLogout) {
      await signOut();
    }
    navigate(item.path);
  };

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="mobile-nav fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] lg:hidden w-[calc(100%-48px)] max-w-[340px]">
      <div className="glass-panel flex items-center justify-around px-2 py-2.5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl rounded-[22px] bg-[#070a10cc]">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleAction(item)}
            className={`tactile flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-[16px] transition-all ${
              isActive(item.path) && !item.isLogout
                ? 'bg-white/10 text-white shadow-inner border border-white/10' 
                : item.isLogout ? 'text-red-400 opacity-80' : 'text-slate-400 opacity-60'
            }`}
          >
            {item.icon}
            <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
