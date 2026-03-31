import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, TrendingUp } from 'lucide-react';

interface PostAnalysis {
  id: string;
  content: string;
  created_at: string;
  stats: {
    positive: number;
    neutral: number;
    negative: number;
    total_comments: number;
  } | null;
  comments: any[]; // Analiz edilen tekil yorumlar
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Profile() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<PostAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      const postsRes = await axios.get(`${API_URL}/posts`);
      const myPosts = postsRes.data.data.filter((p: any) => p.user_id === user?.id);

      const detailedAnalyses = await Promise.all(
        myPosts.map(async (post: any) => {
          const analysisRes = await axios.get(`${API_URL}/posts/${post.id}/analysis`);
          return {
            ...post,
            stats: analysisRes.data.stats,
            comments: analysisRes.data.comments || []
          };
        })
      );

      setAnalyses(detailedAnalyses);
    } catch (err) {
      console.error('Fetch profile data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchProfileData();
  }, [user]);

  const COLORS = ['#22c55e', '#94a3b8', '#ef4444']; // Positive, Neutral, Negative

  if (loading) return <div className="flex justify-center py-20 text-slate-400">Yükleniyor...</div>;
  return (
    <div className="profile-wrap insta-style max-w-[1040px] mx-auto flex flex-col gap-6 sm:gap-8 overflow-x-hidden">
      {/* Profile Hero Section */}
      <section className="glass-panel profile-hero premium-surface p-6 sm:p-8 rounded-[28px] sm:rounded-[36px] flex flex-col md:flex-row gap-6 sm:gap-10 items-center md:items-start transition-all duration-500">
        <div className="avatar xxl w-20 h-20 sm:w-[110px] sm:h-[110px] text-2xl sm:text-[44px] font-extrabold rounded-[28px] sm:rounded-[36px] bg-gradient-to-br from-[#4ea1ff] to-[#ff6fb3] grid place-items-center text-white shadow-[0_15px_40px_rgba(78,161,255,0.3)] shrink-0">
          {user?.user_metadata.username?.[0].toUpperCase()}
        </div>
        
        <div className="profile-main flex-1 w-full text-center md:text-left">
          <div className="profile-row top-profile-row flex flex-col sm:flex-row items-center gap-4 mb-6">
            <h3 className="text-[28px] sm:text-[34px] font-display font-extrabold tracking-[-0.05em] m-0 text-white leading-none">
              {user?.user_metadata.full_name}
            </h3>
            <button className="ghost-btn tactile px-5 py-2.5 rounded-[16px] border border-white/10 bg-white/5 text-white font-bold text-xs sm:text-sm h-fit">
              Profili Düzenle
            </button>
          </div>

          <div className="stats profile-stats flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4 mb-6">
            <span className="px-4 sm:px-5 py-2 sm:py-3 rounded-[12px] sm:rounded-[14px] bg-white/5 border border-white/10 text-white text-xs sm:text-sm">
              <strong className="text-base sm:text-lg mr-1">{analyses.length}</strong> Gönderi
            </span>
            <span className="px-4 sm:px-5 py-2 sm:py-3 rounded-[12px] sm:rounded-[14px] bg-white/5 border border-white/10 text-white text-xs sm:text-sm">
              <strong className="text-base sm:text-lg mr-1">0</strong> Takipçi
            </span>
            <span className="px-4 sm:px-5 py-2 sm:py-3 rounded-[12px] sm:rounded-[14px] bg-white/5 border border-white/10 text-white text-xs sm:text-sm">
              <strong className="text-base sm:text-lg mr-1">12</strong> Takip
            </span>
          </div>

          <div className="profile-bio-box premium-surface p-4 sm:p-5 rounded-[18px] sm:rounded-[20px] bg-white/5 border border-white/10 max-w-lg mx-auto md:mx-0">
             <label className="block mb-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">Hakkımda</label>
             <p className="text-xs sm:text-sm text-slate-200 leading-relaxed m-0 italic opacity-80">
               "Sosyal medya duygu analizi ve veri bilimi ile uğraşıyorum."
             </p>
          </div>
        </div>
      </section>

      {/* Analysis Content Section */}
      <section className="glass-panel profile-content premium-surface p-4 sm:p-8 rounded-[28px] sm:rounded-[36px] bg-[#121722d6]">
        <div className="profile-tabs flex gap-2 mb-6 sm:mb-8 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
          <button className="profile-tab active px-4 sm:px-5 py-2 sm:py-2.5 rounded-[12px] sm:rounded-[14px] bg-white/10 text-white font-extrabold text-xs sm:text-sm transition-all border border-white/20 whitespace-nowrap">
            Analizler
          </button>
          <button className="profile-tab px-4 sm:px-5 py-2 sm:py-2.5 rounded-[12px] sm:rounded-[14px] text-slate-400 font-extrabold text-xs sm:text-sm hover:bg-white/5 transition-all whitespace-nowrap">
            Kaydedilenler
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <AnimatePresence>
            {analyses.map((post) => (
              <motion.div 
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-surface p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] border border-white/10 bg-[#0b1018] flex flex-col h-full shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
              >
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">
                    <TrendingUp size={12} className="text-indigo-400" />
                    Gönderi Etkileşim Analizi
                  </div>
                  <p className="text-[#edf2fe] font-medium leading-relaxed italic text-xs sm:text-sm">"{post.content}"</p>
                </div>

                {post.stats && post.stats.total_comments > 0 ? (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="h-[200px] sm:h-[240px] relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Pozitif', value: post.stats.positive },
                              { name: 'Nötr', value: post.stats.neutral },
                              { name: 'Negatif', value: post.stats.negative },
                            ]}
                            cx="50%" cy="50%"
                            innerRadius={50} outerRadius={70}
                            paddingAngle={5} stroke="none"
                            dataKey="value"
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ background: '#0b1018', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '12px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="pt-5 sm:pt-6 border-t border-white/5">
                      <h4 className="text-[11px] font-bold text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-wide">
                         <MessageSquare size={12} className="text-[#ff6fb3]" />
                         Yorum Detayları ({post.stats.total_comments})
                      </h4>
                      <div className="space-y-2.5 max-h-[180px] sm:max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="p-3 bg-white/[0.02] rounded-[16px] border border-white/5 flex items-start justify-between gap-3">
                            <p className="text-[10px] sm:text-[11px] text-slate-400 leading-relaxed italic flex-1 m-0">
                              "{comment.content}"
                            </p>
                            <div className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                              comment.sentiment_prediction === 'positive' ? 'bg-green-500/20 text-green-400' :
                              comment.sentiment_prediction === 'negative' ? 'bg-red-500/20 text-red-400' :
                              'bg-slate-500/20 text-slate-400'
                            }`}>
                              {comment.sentiment_prediction}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-10 text-slate-600 text-center gap-3 bg-white/5 rounded-2xl border border-dashed border-white/10">
                    <TrendingUp size={28} className="opacity-10" />
                    <p className="text-xs sm:text-sm">Henüz analiz verisi yok.<br/>Yorumların gelmesini bekleyin.</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {analyses.length === 0 && (
        <div className="text-center py-20 text-slate-600 italic text-sm">
          Henüz bir gönderi paylaşmamışsınız.
        </div>
      )}
    </div>
  );
}
