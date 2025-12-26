import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Heart, Star, Calendar, Clock, Globe, Share2, ArrowLeft } from 'lucide-react';
import { MOCK_MOVIES } from '../mockData';
import CatalogSlider from '../components/CatalogSlider';
import { useStore } from '../store/useStore';

const MovieDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const movie = MOCK_MOVIES.find(m => m.slug === slug);
  const { playlist, addToPlaylist } = useStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h2 className="text-3xl font-heading font-black uppercase">Phim không tồn tại</h2>
        <Link to="/" className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-black">QUAY LẠI TRANG CHỦ</Link>
      </div>
    );
  }

  const isSaved = playlist.includes(movie.id);

  return (
    <div className="pb-20 animate-in fade-in duration-700">
      <div className="relative h-[65vh] w-full">
        <img 
          src={movie.banner} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent"></div>
        <Link to="/movies" className="absolute top-8 left-8 lg:left-12 p-3 bg-black/50 hover:bg-yellow-400 hover:text-black rounded-2xl backdrop-blur-md transition-all z-20">
          <ArrowLeft size={24} />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="w-72 flex-shrink-0 mx-auto md:mx-0">
            <div className="rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-neutral-900 ring-1 ring-white/10 group">
              <img src={movie.poster} alt={movie.title} className="w-full h-auto transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="mt-8 space-y-4">
              <Link 
                to={`/watch/${movie.slug}`}
                className="w-full bg-yellow-400 text-black py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-yellow-400/20"
              >
                <Play size={24} fill="currentColor" /> XEM NGAY
              </Link>
              <button 
                onClick={() => addToPlaylist(movie.id)}
                className={`w-full py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all border ${
                  isSaved ? 'bg-neutral-800 text-yellow-400 border-yellow-400/30' : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                <Heart size={24} fill={isSaved ? "currentColor" : "none"} /> 
                {isSaved ? "ĐÃ LƯU" : "DANH SÁCH XEM"}
              </button>
            </div>
          </div>

          <div className="flex-grow pt-10 md:pt-48">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {movie.genres.map(g => (
                <span key={g} className="px-4 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-full text-[10px] font-black uppercase tracking-widest">{g}</span>
              ))}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading font-black mb-8 leading-[0.9] tracking-tighter drop-shadow-2xl">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-10 mb-12 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">
              <div className="flex items-center gap-2 text-yellow-400">
                <Star size={24} fill="currentColor" />
                <span className="text-3xl font-heading font-black">{movie.rating}</span>
              </div>
              <div className="flex items-center gap-2"><Calendar size={20} className="text-yellow-400" /> {movie.year}</div>
              <div className="flex items-center gap-2"><Clock size={20} className="text-yellow-400" /> {movie.duration}</div>
              <div className="flex items-center gap-2"><Globe size={20} className="text-yellow-400" /> {movie.country}</div>
            </div>

            <div className="mb-14 max-w-3xl">
              <h3 className="text-xl font-heading font-black mb-6 flex items-center gap-3 uppercase tracking-tight">
                <span className="w-1.5 h-6 bg-yellow-400 rounded-full"></span>
                Cốt truyện
              </h3>
              <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                {movie.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-heading font-black mb-8 flex items-center gap-3 uppercase tracking-tight">
                <span className="w-1.5 h-6 bg-yellow-400 rounded-full"></span>
                Dàn diễn viên
              </h3>
              <div className="flex flex-wrap gap-10">
                {movie.cast.map(person => (
                  <div key={person.name} className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 rounded-full overflow-hidden mb-4 ring-2 ring-neutral-800 transition-all group-hover:ring-yellow-400 group-hover:scale-110 shadow-xl">
                      <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm font-bold block text-white mb-1">{person.name}</span>
                    <span className="text-[10px] text-neutral-500 font-black uppercase tracking-tighter">{person.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <CatalogSlider title="Có thể bạn quan tâm" movies={MOCK_MOVIES.filter(m => m.id !== movie.id).slice(0, 5)} />
      </div>
    </div>
  );
};

export default MovieDetails;