import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Rss, LogOut, Activity } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 py-4 mb-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform">
            <Activity size={24} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Sentiment Pro
          </span>
        </Link>

        <div className="flex items-center gap-8">
          <Link 
            to="/" 
            className={`flex items-center gap-2 font-semibold transition-colors ${isActive('/') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Rss size={20} />
            Akış
          </Link>
          <Link 
            to="/profile" 
            className={`flex items-center gap-2 font-semibold transition-colors ${isActive('/profile') ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-sm font-bold text-slate-900">{user.user_metadata.full_name}</span>
            <span className="text-xs text-slate-400">@{user.user_metadata.username}</span>
          </div>
          <button 
            onClick={handleSignOut}
            className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 hover:text-red-600 transition-all active:scale-90"
            title="Çıkış Yap"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
