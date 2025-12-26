import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Calendar, Clock, Star } from 'lucide-react';
import CatalogSlider from '../components/CatalogSlider';
import { MOCK_MOVIES } from '../mockData';

const Home: React.FC = () => {
  const featured = MOCK_MOVIES[0];

  return (
    <div className="pb-20 overflow-hidden">
      <section className="relative h-[85vh] w-full flex items-end pb-24 px-6 lg:px-12">
        <div className="absolute inset-0 z-0">
          <img 
            src={featured.banner} 
            alt={featured.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <div className="flex items-center gap-3 mb-6">
             <span className="px-4 py-1.5 bg-yellow-400 text-black text-[10px] font-black rounded-full uppercase tracking-tighter shadow-lg shadow-yellow-400/20">SIÊU PHẨM TUẦN NÀY</span>
             <div className="flex items-center gap-1.5 text-yellow-400 text-sm font-black">
               <Star size={18} fill="currentColor" /> {featured.rating}
             </div>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-heading font-black mb-6 leading-[0.85] tracking-tighter">
            {featured.title}
          </h1>
          
          <div className="flex items-center gap-8 mb-8 text-neutral-300 font-bold uppercase tracking-[0.15em] text-[10px]">
            <span className="flex items-center gap-2"><Calendar size={16} className="text-yellow-400" /> {featured.year}</span>
            <span className="flex items-center gap-2"><Clock size={16} className="text-yellow-400" /> {featured.duration}</span>
            <span className="px-2 py-0.5 border border-white/20 rounded-md">{featured.genres[0]}</span>
          </div>
          
          <p className="text-lg text-neutral-400 mb-10 line-clamp-3 leading-relaxed max-w-2xl font-medium">
            {featured.description}
          </p>
          
          <div className="flex flex-wrap items-center gap-5">
            <Link 
              to={`/watch/${featured.slug}`}
              className="bg-yellow-400 text-black px-12 py-5 rounded-2xl text-lg font-black flex items-center gap-3 hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-yellow-400/30"
            >
              <Play size={24} fill="currentColor" /> XEM NGAY
            </Link>
            <Link 
              to={`/movies/${featured.slug}`}
              className="bg-white/10 backdrop-blur-xl text-white px-10 py-5 rounded-2xl text-lg font-black flex items-center gap-3 hover:bg-white/20 transition-all border border-white/10"
            >
              <Info size={24} /> THÔNG TIN
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-[-100px] relative z-20 space-y-4">
        <CatalogSlider title="Phim mới cập nhật" movies={MOCK_MOVIES} />
        <CatalogSlider title="Phim hành động kịch tính" movies={MOCK_MOVIES.filter(m => m.genres.includes('Hành động'))} />
        <CatalogSlider title="Phim bộ đặc sắc" movies={[...MOCK_MOVIES].reverse()} />
      </div>
    </div>
  );
};

export default Home;