import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Sparkles, User, Settings, Plus, LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { id: 'feed', label: 'Ana Sayfa', icon: <Home size={18} />, path: '/' },
    { id: 'dashboard', label: 'Analizler', icon: <Sparkles size={18} />, path: '/profile' },
    { id: 'profile', label: 'Profil', icon: <User size={18} />, path: '/profile' },
    { id: 'settings', label: 'Ayarlar', icon: <Settings size={18} />, path: '#' },
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
        
        {/* Mobile Close Button */}
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-slate-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      <button 
        onClick={() => { navigate('/'); if(onClose) onClose(); }}
        className="create-btn tactile w-full py-[15px] px-[18px] rounded-[18px] font-extrabold text-[15px] mb-4 text-white bg-gradient-to-br from-[#8f72ff] to-[#4ea1ff] shadow-[0_14px_34px_rgba(78,161,255,0.18),inset_0_1px_0_rgba(255,255,255,0.16)] flex items-center justify-center gap-2"
      >
        <Plus size={20} /> Oluştur
      </button>

      <nav className="menu flex flex-col gap-2.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { navigate(item.path); if(onClose) onClose(); }}
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
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="sidebar h-screen sticky top-0 z-50 border-r border-[#ffffff14] bg-[#070a10cc] backdrop-blur-3xl hidden lg:flex shrink-0 w-[280px]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="sidebar fixed left-0 top-0 bottom-0 w-[85vw] max-w-[320px] z-[70] border-r border-[#ffffff14] bg-[#0b1018] shadow-2xl lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
