import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, Loader2, AlertCircle, Film, Share2 } from 'lucide-react';
import { MOCK_MOVIES } from '../mockData';
import { Movie } from '../types';
import VideoPlayer from '../components/VideoPlayer';
import CommentSection from '../components/CommentSection';
import { useStore } from '../store/useStore';
import { createMovieSlug } from './MyMovies';

const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1VirXIP4wglBTW-7n_yANlSG42V5WkhJ9iO3jRcvf_w8/export?format=csv&gid=0";

const Watch: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'comments'>('info');

  const { history, updateHistory } = useStore();
  const currentProgress = history.find(h => h.movieId === movie?.id)?.percent || 0;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadMovie();
  }, [slug]);

  const loadMovie = async () => {
    setLoading(true);
    setError(null);

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
          if (!name || name.toLowerCase() === 'name') return;
          const currentItemSlug = createMovieSlug(name, index);
          if (currentItemSlug === slug) {
            matchedMovie = {
              id: `sheet-${index}`,
              title: name,
              slug: currentItemSlug,
              poster: `https://picsum.photos/seed/${index * 999}/400/600`,
              banner: `https://picsum.photos/seed/${index * 999}/1920/1080`,
              description: `Phim "${name}" được phát trực tiếp từ link Cloud cá nhân.`,
              year: 2024,
              duration: "Full HD",
              country: "Cloud",
              genres: ["Phim của tôi"],
              rating: 10,
              cast: [],
              embedUrl: url
            };
          }
        }
      });

      if (matchedMovie) setMovie(matchedMovie);
      else setError("Không tìm thấy link phim.");
    } catch (err: any) {
      setError("Lỗi kết nối dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
      <div className="relative">
        <Loader2 size={64} className="text-yellow-400 animate-spin" />
        <Film className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20" size={24} />
      </div>
      <p className="text-neutral-500 font-black uppercase tracking-widest text-[10px]">Đang chuẩn bị phòng chiếu...</p>
    </div>
  );

  if (error || !movie) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <AlertCircle size={80} className="text-red-500/20 mb-8" />
      <h2 className="text-3xl font-black mb-4 tracking-tight">Phòng chiếu đang bảo trì</h2>
      <p className="text-neutral-500 max-w-md mb-10 font-medium">{error}</p>
      <Link to="/" className="bg-yellow-400 text-black px-10 py-4 rounded-2xl font-black shadow-xl shadow-yellow-400/20">QUAY LẠI TRANG CHỦ</Link>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 animate-in fade-in duration-1000">
      <nav className="flex items-center gap-3 text-[10px] text-neutral-500 mb-8 font-black uppercase tracking-[0.2em]">
        <Link to="/" className="hover:text-yellow-400 transition-colors">Trang chủ</Link>
        <ChevronRight size={12} className="opacity-30" />
        <Link to="/movies" className="hover:text-yellow-400 transition-colors">Phim</Link>
        <ChevronRight size={12} className="opacity-30" />
        <span className="text-yellow-400 truncate max-w-[200px]">{movie.title}</span>
      </nav>

      <div className="mb-12">
        <div className="rounded-[2rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/5">
          <VideoPlayer 
            embedUrl={movie.embedUrl} 
            initialPercent={currentProgress}
            onProgress={(p) => updateHistory(movie.id, p)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">{movie.title}</h1>
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-xl font-black shadow-lg shadow-yellow-400/20">
                    <Star size={18} fill="currentColor" /> {movie.rating}
                 </div>
                 <span className="text-neutral-500 font-black text-xs uppercase tracking-widest">{movie.year} • {movie.duration}</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl font-bold border border-neutral-800 transition-all text-sm">
               <Share2 size={18} className="text-yellow-400" /> CHIA SẺ
            </button>
          </div>

          <div className="flex gap-10 border-b border-neutral-800/50 mb-10 overflow-x-auto scrollbar-hide">
            {['info', 'comments'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 text-xs font-black uppercase tracking-[0.2em] border-b-2 transition-all ${
                  activeTab === tab ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-neutral-500 hover:text-white'
                }`}
              >
                {tab === 'info' ? 'Mô tả phim' : 'Cộng đồng'}
              </button>
            ))}
          </div>

          <div className="min-h-[300px]">
            {activeTab === 'info' && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 bg-neutral-900/30 rounded-[2rem] border border-neutral-800/50 mb-10">
                  <p className="text-neutral-400 text-lg leading-relaxed font-medium">{movie.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
                      <p className="text-[10px] text-neutral-500 font-black uppercase mb-2 tracking-widest">Định dạng</p>
                      <p className="font-black text-white">4K ULTRA HD</p>
                   </div>
                   <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
                      <p className="text-[10px] text-neutral-500 font-black uppercase mb-2 tracking-widest">Âm thanh</p>
                      <p className="font-black text-white">DOLBY ATMOS</p>
                   </div>
                   <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
                      <p className="text-[10px] text-neutral-500 font-black uppercase mb-2 tracking-widest">Nguồn phát</p>
                      <p className="font-black text-yellow-400 uppercase">SERVER VIP</p>
                   </div>
                   <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800">
                      <p className="text-[10px] text-neutral-500 font-black uppercase mb-2 tracking-widest">Tình trạng</p>
                      <p className="font-black text-green-500 uppercase">STABLE</p>
                   </div>
                </div>
              </div>
            )}
            {activeTab === 'comments' && <CommentSection />}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-2">
             <span className="w-1.5 h-6 bg-yellow-400 rounded-full"></span>
             <h3 className="text-xl font-black uppercase tracking-tight">Phim đề xuất</h3>
          </div>
          <div className="flex flex-col gap-5">
            {MOCK_MOVIES.slice(0, 5).map(rec => (
              <Link to={`/watch/${rec.slug}`} key={rec.id} className="group flex gap-5 p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/5">
                <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-neutral-800 shadow-xl">
                   <img src={rec.poster} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="font-black text-sm leading-snug group-hover:text-yellow-400 transition-colors line-clamp-2 mb-2">{rec.title}</h4>
                  <div className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-3">{rec.year} • {rec.genres[0]}</div>
                  <div className="flex items-center gap-1.5 text-yellow-400 text-xs font-black">
                    <Star size={14} fill="currentColor" /> {rec.rating}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;