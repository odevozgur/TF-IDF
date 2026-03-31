import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel premium-surface w-full max-w-md p-10 rounded-[36px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative z-20"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#8f72ff] to-[#4ea1ff] flex items-center justify-center text-white shadow-[0_15px_35px_rgba(143,114,255,0.3)] mb-6">
            <LogIn size={32} />
          </div>
          <h1 className="text-[34px] font-display font-extrabold tracking-[-0.06em] text-white m-0">Hoş Geldiniz</h1>
          <p className="text-slate-400 mt-3 text-center font-medium">Hesabınıza giriş yapın ve analize başlayın</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 ml-1">E-posta</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-4 rounded-[20px] bg-[#0b1018]/80 border border-white/10 text-white focus:border-[#8f72ff]/50 outline-none transition-all shadow-inner placeholder:text-slate-600"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 ml-1">Şifre</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 rounded-[20px] bg-[#0b1018]/80 border border-white/10 text-white focus:border-[#8f72ff]/50 outline-none transition-all shadow-inner placeholder:text-slate-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-[18px] flex items-center gap-3 text-sm font-medium"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="primary-btn tactile w-full py-4.5 rounded-[20px] font-extrabold text-[15px] flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-slate-400 font-medium">
          Hesabınız yok mu?{' '}
          <Link to="/register" className="text-[#4ea1ff] font-bold hover:underline inline-flex items-center gap-1.5 transition-all">
            Hemen Kayıt Olun →
          </Link>
        </div>
      </motion.div>
      
      {/* Decorative localized effects for login page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] -z-10 rounded-full" />
    </div>
  );
}
