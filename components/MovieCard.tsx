
"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Info } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="group relative bg-neutral-900 rounded-xl overflow-hidden shadow-xl transition-all duration-500 hover:scale-105 hover:z-10">
      <div className="aspect-[2/3] relative">
        <img 
          src={movie.poster} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg mb-1 leading-tight">{movie.title}</h3>
          <div className="flex items-center gap-2 mb-3 text-xs">
            <span className="text-yellow-400 flex items-center gap-1 font-bold"><Star size={12} fill="currentColor" /> {movie.rating}</span>
            <span className="text-neutral-300">{movie.year}</span>
          </div>
          <div className="flex gap-2">
            <Link to={`/watch/${movie.slug}`} className="flex-1 bg-yellow-400 text-black py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-yellow-300 transition-colors"><Play size={14} fill="currentColor" /> Xem ngay</Link>
            <Link to={`/movies/${movie.slug}`} className="w-10 bg-neutral-800 text-white py-2 rounded-lg flex items-center justify-center hover:bg-neutral-700 transition-colors"><Info size={16} /></Link>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-yellow-400 group-hover:opacity-0 transition-opacity uppercase tracking-wider">HD</div>
      </div>
    </div>
  );
};

export default MovieCard;
