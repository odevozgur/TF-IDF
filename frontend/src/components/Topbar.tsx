import { useAuth } from '../context/AuthContext';
import { Search, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Topbar() {
  const { user } = useAuth();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Ana Sayfa';
      case '/profile': return 'Profil';
      default: return 'Sentiment';
    }
  };

  if (!user) return null;

  return (
    <header className="topbar glass-panel flex justify-between items-center px-4 sm:px-5 py-3.5 sm:py-4.5 rounded-[20px] sm:rounded-[24px] sticky top-[10px] sm:top-[18px] z-[55] mb-6">
      <div className="flex items-center gap-4">
        {/* Mobile Brand Badge */}
        <div className="brand-badge lg:hidden w-10 h-10 flex items-center justify-center font-extrabold text-white text-lg rounded-[16px] bg-gradient-to-br from-[#4ea1ff] to-[#ff6fb3] shadow-[0_8px_25px_rgba(143,114,255,0.3)] shrink-0">
          S
        </div>
        <h2 className="m-0 font-display text-[24px] sm:text-[34px] tracking-[-0.06em] text-white truncate max-w-[150px] sm:max-w-none">
          {getPageTitle()}
        </h2>
      </div>

      <div className="topbar-right flex items-center gap-2 sm:gap-3">
        <div className="search-box hidden md:flex items-center gap-2.5 px-3.5 min-w-[200px] lg:min-w-[260px] rounded-[16px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Ara..." 
            className="bg-transparent border-none outline-none text-white w-full py-2.5 sm:py-3 text-[14px]"
          />
        </div>
        
        <button className="icon-btn tactile w-[40px] h-[40px] sm:w-[46px] sm:h-[46px] grid place-items-center rounded-[14px] sm:rounded-[16px] border border-white/10 bg-white/5 text-white">
          <Moon size={18} />
        </button>

        <button className="profile-chip tactile flex items-center gap-2 border border-white/10 bg-white/5 text-white px-2 py-1.5 sm:px-3 sm:py-2 rounded-[14px] sm:rounded-[18px] font-bold">
          <div className="avatar tiny w-7 h-7 sm:w-[30px] sm:h-[30px] rounded-[10px] sm:rounded-[12px] bg-gradient-to-br from-[#4ea1ff] to-[#ff6fb3] grid place-items-center text-[12px] sm:text-[14px]">
            {user.user_metadata.username?.[0].toUpperCase()}
          </div>
          <span className="hidden sm:inline text-sm">{user.user_metadata.full_name.split(' ')[0]}</span>
        </button>
      </div>
    </header>
  );
}
