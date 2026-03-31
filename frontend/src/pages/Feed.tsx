import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  sentiment_prediction: string;
  created_at: string;
  profiles: { username: string; avatar_url: string };
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  profiles: { username: string; full_name: string; avatar_url: string };
  comments: Comment[];
}

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'global' | 'following'>('global');

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/posts');
      setPosts(res.data.data);
    } catch (err) {
      console.error('Fetch posts error:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setLoading(true);

    try {
      const { data: { session } } = await (await import('../supabaseClient')).supabase.auth.getSession();
      
      await axios.post('http://localhost:5000/api/posts', 
        { content: newPost },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      );
      setNewPost('');
      fetchPosts();
    } catch (err) {
      console.error('Create post error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async (postId: string) => {
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      const { data: { session } } = await (await import('../supabaseClient')).supabase.auth.getSession();
      await axios.post('http://localhost:5000/api/comments', 
        { post_id: postId, content: newComment },
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      );
      setNewComment('');
      setCommentingOn(null);
      fetchPosts();
    } catch (err) {
      console.error('Create comment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feed-layout flex flex-col xl:flex-row gap-6 items-start">
      {/* Main Feed Content */}
      <section className="feed-main glass-panel h-fit w-full xl:max-w-none flex-1 p-4 sm:p-6 rounded-[28px] sm:rounded-[36px]">
        <div className="feed-switch premium-surface flex mb-6 p-1.5 rounded-[18px] w-fit overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('global')}
            className={`switch-btn px-4 sm:px-5 py-2.5 sm:py-3 rounded-[14px] font-extrabold transition-all text-sm whitespace-nowrap ${activeTab === 'global' ? 'active bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-white'}`}
          >
            Global
          </button>
          <button 
            onClick={() => setActiveTab('following')}
            className={`switch-btn px-4 sm:px-5 py-2.5 sm:py-3 rounded-[14px] font-extrabold transition-all text-sm whitespace-nowrap ${activeTab === 'following' ? 'active bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-white'}`}
          >
            Takip Edilenler
          </button>
        </div>

        {/* Post Creator */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="composer-inline premium-surface tactile flex items-center gap-3 p-3 sm:p-3.5 rounded-[20px] sm:rounded-[24px] mb-6 border border-white/10"
        >
          <div className="avatar w-9 h-9 sm:w-10.5 sm:h-10.5 rounded-[12px] sm:rounded-[16px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-extrabold text-sm sm:text-base text-white shrink-0">
            {user?.user_metadata.username?.[0].toUpperCase()}
          </div>
          <input 
            type="text"
            placeholder="Ne paylaşmak istersin?" 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreatePost(e)}
            className="flex-1 bg-transparent border-none outline-none text-white font-semibold placeholder:text-slate-500 text-sm sm:text-base"
          />
          <button 
            onClick={handleCreatePost}
            disabled={loading || !newPost.trim()}
            className="composer-action bg-white/5 border border-white/10 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-[12px] sm:rounded-[14px] font-extrabold text-xs sm:text-sm hover:bg-white/10 transition-all disabled:opacity-50"
          >
            Paylaş
          </button>
        </motion.div>

        {/* Global/Following List */}
        <div className="feed-list flex flex-col gap-4 sm:gap-5">
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.article 
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="post-card premium-surface p-4 sm:p-5 rounded-[22px] sm:rounded-[28px] border border-white/10"
              >
                <div className="post-head flex justify-between items-center mb-4">
                  <div className="user-block flex items-center gap-3">
                    <img 
                      src={post.profiles.avatar_url} 
                      className="avatar w-9 h-9 sm:w-10.5 sm:h-10.5 rounded-[12px] sm:rounded-[16px] object-cover"
                      alt="Avatar"
                    />
                    <div>
                      <strong className="block text-white font-bold text-sm sm:text-base">{post.profiles.full_name}</strong>
                      <span className="text-[10px] sm:text-xs text-slate-400 font-medium">@{post.profiles.username}</span>
                    </div>
                  </div>
                  <button className="ghost-icon w-8 h-8 sm:w-10 sm:h-10 border border-white/10 rounded-[12px] sm:rounded-[16px] grid place-items-center bg-white/5 text-slate-400">•••</button>
                </div>
                
                <p className="post-text text-sm sm:text-[15px] leading-relaxed text-[#edf2fe] mb-4">
                  {post.content}
                </p>

                <div className="post-actions flex gap-2">
                  <button className="action-btn tactile flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[12px] sm:rounded-[14px] border border-white/10 bg-white/5 text-white font-bold text-xs sm:text-sm">
                    ♡ <span className="opacity-80">0</span>
                  </button>
                  <button 
                    onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                    className={`action-btn tactile flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-[12px] sm:rounded-[14px] border border-white/10 font-bold text-xs sm:text-sm ${commentingOn === post.id ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-white/5 text-white'}`}
                  >
                    💬 <span className="opacity-80">{post.comments.length}</span>
                  </button>
                </div>

                <AnimatePresence>
                  {commentingOn === post.id && (
                    <motion.div 
                      key="comments-section"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-white/10 space-y-4">
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            autoFocus
                            placeholder="Bir yorum yaz..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreateComment(post.id)}
                            className="flex-1 bg-[#0b1018] border border-white/10 rounded-[14px] px-4 py-2 text-xs sm:text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600 shadow-inner"
                          />
                          <button 
                             onClick={() => handleCreateComment(post.id)}
                             disabled={loading || !newComment.trim()}
                             className="p-2 sm:p-2.5 bg-indigo-600 rounded-[14px] text-white hover:bg-indigo-700 transition-all disabled:opacity-50"
                          >
                            <Send size={16} />
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {post.comments.map(comment => (
                            <div key={comment.id} className="bg-white/[0.02] p-3 rounded-[18px] border border-white/5">
                              <div className="flex justify-between items-center mb-1.5">
                                <div className="flex items-center gap-2">
                                  <img src={comment.profiles.avatar_url} className="w-5 h-5 rounded-md object-cover" alt="" />
                                  <span className="text-[10px] font-bold text-slate-300">@{comment.profiles.username}</span>
                                </div>
                                <div className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  comment.sentiment_prediction === 'positive' ? 'bg-green-500/20 text-green-400' :
                                  comment.sentiment_prediction === 'negative' ? 'bg-red-500/20 text-red-400' :
                                  'bg-slate-500/20 text-slate-400'
                                }`}>
                                  {comment.sentiment_prediction}
                                </div>
                              </div>
                              <p className="text-xs text-slate-400 italic">"{comment.content}"</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Side Panels */}
      <aside className="feed-side hidden xl:flex flex-col gap-6 w-[320px] sticky top-[110px]">
        <section className="glass-panel side-panel p-6 rounded-[32px]">
          <div className="side-head mb-4">
            <span className="card-label">Akış</span>
            <h3 className="mt-3 font-display text-[26px] tracking-[-0.06em] text-white">Alanlar</h3>
          </div>
          <div className="stack-list flex flex-col gap-3">
            <button className="stack-item tactile flex justify-between items-center p-4.5 rounded-[20px] bg-white/[0.03] border border-white/5 text-white font-bold text-sm">
              <span>Hakkımızda</span><em>›</em>
            </button>
            <button className="stack-item tactile flex justify-between items-center p-4.5 rounded-[20px] bg-white/[0.03] border border-white/5 text-white font-bold text-sm">
              <span>Kurallar</span><em>›</em>
            </button>
          </div>
        </section>

        <section className="glass-panel side-panel trend-panel p-6 rounded-[32px]">
          <div className="side-head mb-4">
            <span className="card-label">Gündem</span>
            <h3 className="mt-3 font-display text-[26px] tracking-[-0.06em] text-white">Trendler</h3>
          </div>
          <div className="trend-list flex flex-col gap-3">
             {['#yazılım', '#analiz', '#ai', '#nlp'].map(tag => (
               <div key={tag} className="trend-item p-4 rounded-[20px] bg-white/[0.03] border border-white/5 flex justify-between items-center">
                 <strong className="text-xs text-white uppercase tracking-wider">{tag}</strong>
                 <small className="text-[10px] text-slate-500 font-bold">2.1k</small>
               </div>
             ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
