import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { id: 'feed', label: 'Ana Sayfa', icon: <Home size={18} />, path: '/' },
    { id: 'profile', label: 'Profil & Analiz', icon: <User size={18} />, path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  if (!user) return null;

  const sidebarContent = (
    <div className="sidebar-inner flex flex-col h-full p-6">
      <div className="brand flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="brand-badge w-12 h-12 flex items-center justify-center font-extrabold text-white text-2xl rounded-[24px] bg-gradient-to-br from-[#4ea1ff] to-[#ff6fb3] shadow-[0_10px_30px_rgba(143,114,255,0.24)]">
            S
          </div>
          <div>
            <h1 className="text-[28px] font-extrabold tracking-[-0.06em] font-display text-white m-0">
              Sentiment
            </h1>
          </div>
        </div>
        

      </div>



      <nav className="menu flex flex-col gap-2.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { navigate(item.path); }}
            className={`menu-item tactile flex items-center gap-3 px-4 py-[14px] rounded-[18px] border border-transparent font-bold text-[14px] transition-all text-left ${
              isActive(item.path) 
                ? 'bg-gradient-to-b from-[rgba(255,255,255,0.065)] to-[rgba(255,255,255,0.03)] border-[#ffffff14] text-white' 
                : 'text-[#e8eefc] hover:bg-white/5'
            }`}
          >
            <span className="menu-icon opacity-90">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <button 
          onClick={handleSignOut}
          className="menu-item tactile flex items-center gap-3 px-4 py-[14px] rounded-[18px] border border-transparent font-bold text-[14px] text-red-400 hover:bg-red-500/10 w-full text-left"
        >
          <LogOut size={18} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </div>
  );

  return (
    <aside className="sidebar h-screen sticky top-0 z-50 border-r border-[#ffffff14] bg-[#070a10cc] backdrop-blur-3xl hidden lg:flex shrink-0 w-[280px]">
      {sidebarContent}
    </aside>
  );
}
