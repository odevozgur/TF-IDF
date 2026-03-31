import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-transparent">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-panel premium-surface w-full max-w-md p-10 text-center rounded-[36px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
        >
          <div className="w-20 h-20 rounded-[28px] bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-6 border border-green-500/20">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-[34px] font-display font-extrabold text-white mb-4">Kayıt Başarılı!</h1>
          <p className="text-slate-400 font-medium italic">Email adresinizi doğrulayın ve giriş yapın.</p>
          <p className="text-xs text-slate-500 mt-4 font-mono">Giriş sayfasına yönlendiriliyorsunuz...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative overflow-hidden py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel premium-surface w-full max-w-md p-10 rounded-[36px] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative z-20"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#ff6fb3] to-[#8f72ff] flex items-center justify-center text-white shadow-[0_15px_35px_rgba(255,111,179,0.3)] mb-6">
            <UserPlus size={32} />
          </div>
          <h1 className="text-[34px] font-display font-extrabold tracking-[-0.06em] text-white m-0">Hesap Oluştur</h1>
          <p className="text-slate-400 mt-3 text-center font-medium">Platformumuza katılın ve analize başlayın</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 ml-1">Kullanıcı Adı</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-3.5 rounded-[20px] bg-[#0b1018]/80 border border-white/10 text-white focus:border-[#ff6fb3]/50 outline-none transition-all shadow-inner placeholder:text-slate-600"
              placeholder="kullanici_adi"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 ml-1">Ad Soyad</label>
            <input 
              type="text" 
              required
              className="w-full px-5 py-3.5 rounded-[20px] bg-[#0b1018]/80 border border-white/10 text-white focus:border-[#ff6fb3]/50 outline-none transition-all shadow-inner placeholder:text-slate-600"
              placeholder="Ad Soyad"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-300 ml-1">E-posta</label>
            <input 
              type="email" 
              required
              className="w-full px-5 py-3.5 rounded-[20px] bg-[#0b1018]/80 border border-white/10 text-white focus:border-[#ff6fb3]/50 outline-none transition-all shadow-inner placeholder:text-slate-600"
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
              className="w-full px-5 py-3.5 rounded-[20px] bg-[#0b1018]/80 border border-white/10 text-white focus:border-[#ff6fb3]/50 outline-none transition-all shadow-inner placeholder:text-slate-600"
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
            style={{ background: 'linear-gradient(135deg, #ff6fb3, #8f72ff)' }}
          >
            {loading ? 'Kaydolunuyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-slate-400 font-medium">
          Zaten hesabınız var mı?{' '}
          <Link to="/login" className="text-[#8f72ff] font-bold hover:underline inline-flex items-center gap-1.5 transition-all">
            Giriş Yapın →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
