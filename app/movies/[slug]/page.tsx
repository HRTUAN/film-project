
"use client";

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Heart, Star, Calendar, Clock, Globe, Share2 } from 'lucide-react';
import { MOCK_MOVIES } from '@/mockData';
import CatalogSlider from '@/components/CatalogSlider';
import { useStore } from '@/store/useStore';

export default function MovieDetails() {
  const { slug } = useParams();
  const movie = MOCK_MOVIES.find(m => m.slug === slug);
  const { playlist, addToPlaylist } = useStore();

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold">Không tìm thấy phim</h2>
        <Link to="/" className="text-yellow-400 mt-4 underline">Về trang chủ</Link>
      </div>
    );
  }

  const isSaved = playlist.includes(movie.id);

  return (
    <div className="pb-20 animate-in fade-in duration-500">
      <div className="relative h-[60vh] w-full">
        <img src={movie.banner} alt={movie.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"></div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-64 flex-shrink-0 mx-auto md:mx-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-neutral-900">
              <img src={movie.poster} alt={movie.title} className="w-full h-auto" />
            </div>
            <div className="mt-6 space-y-3">
              <Link to={`/watch/${movie.slug}`} className="w-full bg-yellow-400 text-black py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95"><Play size={20} fill="currentColor" /> XEM PHIM NGAY</Link>
              <button onClick={() => addToPlaylist(movie.id)} className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isSaved ? 'bg-neutral-800 text-yellow-400' : 'bg-white/10 hover:bg-white/20'}`}><Heart size={20} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? "ĐÃ LƯU" : "PLAYLIST"}</button>
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-3 mb-4">{movie.genres.map(g => <span key={g} className="px-3 py-1 bg-neutral-800 text-neutral-300 rounded-full text-xs font-bold uppercase tracking-wider">{g}</span>)}</div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-8 mb-10 text-sm font-medium text-neutral-400">
              <div className="flex items-center gap-2 text-yellow-400"><Star size={20} fill="currentColor" /><span className="text-lg font-black">{movie.rating}</span></div>
              <div className="flex items-center gap-2"><Calendar size={18} /> {movie.year}</div>
              <div className="flex items-center gap-2"><Clock size={18} /> {movie.duration}</div>
              <div className="flex items-center gap-2"><Globe size={18} /> {movie.country}</div>
              <Link to="/under-development" className="flex items-center gap-2 hover:text-white transition-colors"><Share2 size={18} /> Chia sẻ</Link>
            </div>
            <div className="mb-10"><h3 className="text-xl font-bold mb-4 border-l-4 border-yellow-400 pl-3 uppercase tracking-tighter">Nội dung phim</h3><p className="text-neutral-300 text-lg leading-relaxed">{movie.description}</p></div>
            <div className="mb-10"><h3 className="text-xl font-bold mb-6 border-l-4 border-yellow-400 pl-3 uppercase tracking-tighter">Dàn diễn viên</h3><div className="flex flex-wrap gap-8">{movie.cast.map(person => (<div key={person.name} className="flex flex-col items-center text-center group"><div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-2 ring-neutral-800 transition-all group-hover:ring-yellow-400 group-hover:scale-110"><img src={person.avatar} alt={person.name} className="w-full h-full object-cover" /></div><span className="text-sm font-bold block">{person.name}</span><span className="text-[10px] text-neutral-500 uppercase">{person.role}</span></div>))}</div></div>
          </div>
        </div>
      </div>
      <div className="mt-20"><CatalogSlider title="Phim tương tự" movies={MOCK_MOVIES.filter(m => m.id !== movie.id).slice(0, 5)} /></div>
    </div>
  );
}
