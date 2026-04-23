
import { useAuth } from '../context/AuthContext';

export default function Topbar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="topbar flex items-center justify-between mb-8 lg:mb-10 lg:pt-2">
      <div className="flex items-center gap-4">


        {/* Mobile Brand Small */}
        <div className="lg:hidden flex items-center gap-2">
           <div className="w-8 h-8 rounded-[12px] bg-gradient-to-br from-[#4ea1ff] to-[#ff6fb3] flex items-center justify-center text-white font-black text-xs">S</div>
           <span className="font-extrabold text-white tracking-tighter">Sentiment</span>
        </div>
      </div>

      <div className="topbar-actions flex items-center gap-2 sm:gap-4">

        
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
