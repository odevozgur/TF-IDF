import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import MobileNav from './components/MobileNav';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import { AnimatePresence, motion } from 'framer-motion';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full shadow-lg shadow-indigo-100"
      />
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  // Sayfa değiştiğinde en üste kaydır
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen text-white relative bg-[#06080d]">
      {/* Background Decor */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-grid"></div>



      <div className={!isAuthPage && user ? "app-shell relative z-10 lg:grid lg:grid-cols-[280px_1fr] min-h-screen" : "relative z-10 min-h-screen"}>
        {!isAuthPage && user && (
          <Sidebar />
        )}
        
        <main className={!isAuthPage && user ? "main min-w-0 p-4 sm:p-6 lg:p-8 lg:pt-5 pb-28 lg:pb-10 overflow-x-hidden" : "min-h-screen"}>
          {!isAuthPage && user && (
            <Topbar />
          )}
          
          <div className={!isAuthPage && user ? "max-w-7xl mx-auto w-full" : ""}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {!isAuthPage && user && <MobileNav />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
