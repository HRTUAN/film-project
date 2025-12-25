import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Calendar, Clock, Star } from 'lucide-react';
import CatalogSlider from '@/components/CatalogSlider';
import { MOCK_MOVIES } from '@/mockData';

export default function Home() {
  const featured = MOCK_MOVIES[0];

  return (
    <div className="pb-20 overflow-hidden">
      <section className="relative h-[85vh] w-full flex items-end pb-20 px-6 lg:px-12">
        <div className="absolute inset-0 z-0">
          <img 
            src={featured.banner} 
            alt={featured.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex items-center gap-3 mb-4">
             <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-black rounded-full uppercase tracking-tighter">Nổi bật nhất</span>
             <div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
               <Star size={16} fill="currentColor" /> {featured.rating}
             </div>
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight">
            {featured.title}
          </h1>
          <div className="flex items-center gap-6 mb-8 text-neutral-300 font-medium">
            <span className="flex items-center gap-2"><Calendar size={18} /> {featured.year}</span>
            <span className="flex items-center gap-2"><Clock size={18} /> {featured.duration}</span>
            <span className="flex items-center gap-2">{featured.genres[0]}</span>
          </div>
          <p className="text-lg text-neutral-300 mb-10 line-clamp-3 leading-relaxed max-w-2xl">
            {featured.description}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link 
              to={`/watch/${featured.slug}`}
              className="bg-yellow-400 text-black px-10 py-4 rounded-xl text-lg font-black flex items-center gap-3 hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yellow-400/20"
            >
              <Play size={24} fill="currentColor" /> Xem phim ngay
            </Link>
            <Link 
              to={`/movies/${featured.slug}`}
              className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-xl text-lg font-black flex items-center gap-3 hover:bg-white/20 transition-all"
            >
              <Info size={24} /> Chi tiết
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-[-80px] relative z-20">
        <CatalogSlider title="Phim mới cập nhật" movies={MOCK_MOVIES} />
        <CatalogSlider title="Phim lẻ hot nhất" movies={[...MOCK_MOVIES].reverse()} />
        <CatalogSlider title="Phim hành động kịch tính" movies={MOCK_MOVIES.filter(m => m.genres.includes('Hành động'))} />
        <CatalogSlider title="Phim hoạt hình đặc sắc" movies={MOCK_MOVIES.filter(m => m.genres.includes('Hoạt hình'))} />
      </div>
    </div>
  );
}