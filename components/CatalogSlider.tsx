
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { Movie } from '../types';

interface CatalogSliderProps {
  title: string;
  movies: Movie[];
}

const CatalogSlider: React.FC<CatalogSliderProps> = ({ title, movies }) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-12 relative group/slider">
      <div className="flex items-center justify-between mt-5 mb-4 px-6 lg:px-12">
        <h2 className="text-xl md:text-2xl font-bold border-l-4 border-yellow-400 pl-3 uppercase tracking-tighter">{title}</h2>
        <Link to="/under-development" className="text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-yellow-400 transition-colors">Xem tất cả</Link>
      </div>

      <div className="relative">
        <button 
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-yellow-400 hover:text-black p-2 rounded-full text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronLeft size={24} />
        </button>

        <div 
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x px-6 lg:px-12 py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none w-40 md:w-56 snap-start">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-yellow-400 hover:text-black p-2 rounded-full text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 backdrop-blur-sm"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default CatalogSlider;
