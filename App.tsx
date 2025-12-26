
import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Header from './components/Header';

// Lazy load pages để tối ưu hiệu năng
const Home = lazy(() => import('./pages/Home'));
const MoviesList = lazy(() => import('./pages/MoviesList'));
const MovieDetails = lazy(() => import('./pages/MovieDetails'));
const Watch = lazy(() => import('./pages/Watch'));
const Playlist = lazy(() => import('./pages/Playlist'));
const MyMovies = lazy(() => import('./pages/MyMovies'));
const UnderDevelopment = lazy(() => import('./pages/UnderDevelopment'));

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-neutral-950 text-white selection:bg-yellow-400 selection:text-black font-sans">
        <Header />
        
        <main className="flex-grow pt-16">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
              <Loader2 className="animate-spin text-yellow-400" size={48} />
              <p className="text-neutral-500 text-xs font-black uppercase tracking-widest">Đang tải tuanporm...</p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<MoviesList />} />
              <Route path="/movies/:slug" element={<MovieDetails />} />
              <Route path="/watch/:slug" element={<Watch />} />
              <Route path="/playlist" element={<Playlist />} />
              <Route path="/my-movies" element={<MyMovies />} />
              <Route path="/under-development" element={<UnderDevelopment />} />
            </Routes>
          </Suspense>
        </main>
        
        <footer className="py-12 px-6 lg:px-12 border-t border-neutral-800 bg-neutral-950">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <Link to="/" className="text-2xl font-black text-yellow-400 tracking-tighter">
                TUAN<span className="text-white">PORM</span>
              </Link>
              <p className="text-neutral-500 text-xs font-medium">Trải nghiệm điện ảnh đỉnh cao mỗi ngày.</p>
            </div>
            
            <p className="text-neutral-400 text-sm order-3 md:order-2">© 2024 tuanporm Studio. All rights reserved.</p>
            
            <div className="flex gap-6 text-neutral-400 text-sm font-bold order-2 md:order-3 uppercase tracking-widest text-[10px]">
              <Link to="/under-development" className="hover:text-yellow-400 transition-colors">Điều khoản</Link>
              <Link to="/under-development" className="hover:text-yellow-400 transition-colors">Bảo mật</Link>
              <Link to="/under-development" className="hover:text-yellow-400 transition-colors">Hỗ trợ</Link>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;
