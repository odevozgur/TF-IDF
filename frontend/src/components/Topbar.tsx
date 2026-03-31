import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopbarProps {
  onMenuToggle?: () => void;
}

export default function Topbar({ onMenuToggle }: TopbarProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="topbar flex items-center justify-between mb-8 lg:mb-10 lg:pt-2">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Toggle */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-[14px] bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all active:scale-95"
        >
          <Menu size={24} />
        </button>

        <div className="search-wrapper relative hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Ara..." 
            className="search-input py-3 pl-12 pr-6 bg-white/[0.04] border border-[#ffffff14] rounded-[18px] text-[14px] font-medium text-white focus:bg-white/[0.08] focus:border-indigo-500/50 outline-none transition-all w-[240px] lg:w-[320px]"
          />
        </div>
        
        {/* Mobile Brand Small */}
        <div className="sm:hidden flex items-center gap-2">
           <div className="w-8 h-8 rounded-[12px] bg-gradient-to-br from-[#4ea1ff] to-[#ff6fb3] flex items-center justify-center text-white font-black text-xs">S</div>
           <span className="font-extrabold text-white tracking-tighter">Sentiment</span>
        </div>
      </div>

      <div className="topbar-actions flex items-center gap-2 sm:gap-4">
        <button className="icon-btn-premium p-3 rounded-[16px] bg-white/[0.04] border border-[#ffffff14] text-slate-400 hover:text-white transition-all">
          <Bell size={20} />
        </button>
        
        <div className="user-profile-lite flex items-center gap-3 p-1.5 pr-4 rounded-[20px] bg-white/[0.04] border border-[#ffffff14] hover:bg-white/[0.08] transition-all cursor-pointer">
          <div className="avatar-small w-8 h-8 rounded-[12px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
            {user?.user_metadata.username?.[0].toUpperCase()}
          </div>
          <span className="hidden sm:inline font-bold text-[13px] text-[#e8eefc]">{user?.user_metadata.username}</span>
        </div>
      </div>
    </header>
  );
}
