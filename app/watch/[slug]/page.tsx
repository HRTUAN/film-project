
"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Info, Users, MessageSquare, ChevronRight, Star, Loader2, AlertCircle, Film } from 'lucide-react';
import { MOCK_MOVIES } from '@/mockData';
import { Movie } from '@/types';
import VideoPlayer from '@/components/VideoPlayer';
import CommentSection from '@/components/CommentSection';
import { useStore } from '@/store/useStore';
import { createMovieSlug } from '@/pages/MyMovies';

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1VirXIP4wglBTW-7n_yANlSG42V5WkhJ9iO3jRcvf_w8/export?format=csv&gid=0";

export default function WatchPage() {
  const { slug } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { history, updateHistory } = useStore();
  const [activeTab, setActiveTab] = useState<'info' | 'cast' | 'comments'>('info');

  const currentProgress = history.find(h => h.movieId === movie?.id)?.percent || 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadMovie();
  }, [slug]);

  const loadMovie = async () => {
    setLoading(true);
    setError(null);
    setMovie(null);

    const mockMatch = MOCK_MOVIES.find(m => m.slug === slug);
    if (mockMatch) {
      setMovie(mockMatch);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(GOOGLE_SHEET_CSV_URL);
      const csvText = await response.text();
      const lines = csvText.split(/\r?\n/);
      let matchedMovie: Movie | null = null;
      lines.forEach((line, index) => {
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length >= 2) {
          const name = parts[0].replace(/"/g, '').trim();
          const url = parts[1].replace(/"/g, '').trim();
          if (!name || name.toLowerCase() === 'name' || name.toLowerCase() === 'tên phim') return;
          const currentItemSlug = createMovieSlug(name, index);
          if (currentItemSlug === slug) {
            matchedMovie = {
              id: `sheet-${index}`,
              title: name,
              slug: currentItemSlug,
              poster: `https://picsum.photos/seed/${index * 777}/400/600`,
              banner: `https://picsum.photos/seed/${index * 777 + 5}/1920/1080`,
              description: `Phim "${name}" được phát trực tiếp từ link lưu trữ cá nhân.`,
              year: 2024,
              duration: "HD Private",
              country: "Cá nhân",
              genres: ["Phim của tôi", "Sheet"],
              rating: 10,
              cast: [{ name: "Owner", role: "Manager", avatar: "" }],
              embedUrl: url
            };
          }
        }
      });
      if (matchedMovie) setMovie(matchedMovie);
      else setError("Không tìm thấy thông tin phim này.");
    } catch (err: any) {
      setError("Lỗi đồng bộ dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4"><Loader2 size={40} className="text-yellow-400 animate-spin" /><p className="text-neutral-500 font-bold uppercase tracking-widest text-[10px]">Đang tải dữ liệu...</p></div>;
  if (error || !movie) return <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center"><AlertCircle size={64} className="text-red-500 mb-6" /><h2 className="text-2xl font-black mb-2">Không tìm thấy phim</h2><p className="text-neutral-500 max-w-md mb-8">{error}</p><Link to="/my-movies" className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold">Quay lại danh sách</Link></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
      <nav className="flex items-center gap-2 text-[10px] text-neutral-500 mb-6 font-black uppercase tracking-widest"><Link to="/">Home</Link><ChevronRight size={12} /><Link to="/my-movies">My Movies</Link><ChevronRight size={12} /><span className="text-neutral-300 truncate">{movie.title}</span></nav>
      <div className="mb-10 group relative"><div className="absolute -top-10 left-0 flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 rounded-t-lg text-[10px] font-black uppercase"><Film size={14} /> Đang phát từ Sheet</div><VideoPlayer embedUrl={movie.embedUrl} initialPercent={currentProgress} onProgress={(p) => updateHistory(movie.id, p)} /></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8"><h1 className="text-4xl font-black tracking-tighter">{movie.title}</h1><div className="flex items-center gap-2 px-4 py-2 bg-neutral-900 rounded-xl text-yellow-400 font-black border border-neutral-800 shadow-xl"><Star size={20} fill="currentColor" /> {movie.rating}</div></div>
          <div className="flex gap-8 border-b border-neutral-800/50 mb-8 overflow-x-auto scrollbar-hide">{['info', 'cast', 'comments'].map((tab) => (<button key={tab} onClick={() => setActiveTab(tab as any)} className={`py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${activeTab === tab ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-neutral-500'}`}>{tab === 'info' ? 'Nội dung' : tab === 'cast' ? 'Nguồn phim' : 'Bình luận'}</button>))}</div>
          <div className="min-h-[200px]">
            {activeTab === 'info' && <div className="text-neutral-300 leading-relaxed text-lg animate-in slide-in-from-bottom-2"><p className="mb-8 p-6 bg-neutral-900/30 rounded-2xl border border-neutral-800/50">{movie.description}</p></div>}
            {activeTab === 'comments' && <CommentSection />}
          </div>
        </div>
      </div>
    </div>
  );
}
