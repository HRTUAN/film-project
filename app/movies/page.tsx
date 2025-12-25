
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import FilterBar from '@/components/FilterBar';
import MovieCard from '@/components/MovieCard';
import { MOCK_MOVIES } from '@/mockData';

export default function MoviesList() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const [filters, setFilters] = useState({
    genre: searchParams.get('genre') || 'all',
    country: searchParams.get('country') || 'all',
    year: searchParams.get('year') || 'all',
    sort: searchParams.get('sort') || 'newest',
    search: searchParams.get('q') || ''
  });

  useEffect(() => {
    setFilters({
      genre: searchParams.get('genre') || 'all',
      country: searchParams.get('country') || 'all',
      year: searchParams.get('year') || 'all',
      sort: searchParams.get('sort') || 'newest',
      search: searchParams.get('q') || ''
    });
  }, [location.search]);

  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => ({ ...prev, [type]: value }));
    const params = new URLSearchParams(location.search);
    if (value === 'all') params.delete(type);
    else params.set(type, value);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const filteredMovies = useMemo(() => {
    let result = [...MOCK_MOVIES];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q) || m.cast.some(c => c.name.toLowerCase().includes(q)));
    }
    if (filters.genre !== 'all') result = result.filter(m => m.genres.includes(filters.genre));
    if (filters.country !== 'all') result = result.filter(m => m.country === filters.country);
    if (filters.year !== 'all') result = result.filter(m => m.year.toString() === filters.year);
    if (filters.sort === 'newest') result.sort((a, b) => b.year - a.year);
    else if (filters.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (filters.sort === 'popular') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            {filters.search ? <>Tìm kiếm: <span className="text-yellow-400">"{filters.search}"</span></> : filters.genre !== 'all' ? <>Thể loại: <span className="text-yellow-400">"{filters.genre}"</span></> : 'Kho Phim TuanPhim'}
          </h1>
          <p className="text-neutral-400 text-sm font-medium">Tìm thấy {filteredMovies.length} bộ phim phù hợp với yêu cầu của bạn.</p>
        </div>
      </div>
      <FilterBar onFilterChange={handleFilterChange} activeFilters={filters} />
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 bg-neutral-900/30 rounded-3xl border-2 border-dashed border-neutral-800">
           <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6"><Search size={32} className="text-neutral-600" /></div>
           <h3 className="text-xl font-bold mb-2">Không tìm thấy kết quả</h3>
           <p className="text-neutral-500 text-sm max-w-xs text-center">Rất tiếc, chúng tôi không tìm thấy phim nào phù hợp.</p>
           <button onClick={() => { setFilters({ genre: 'all', country: 'all', year: 'all', sort: 'newest', search: '' }); navigate('/movies'); }} className="mt-8 bg-yellow-400 text-black px-8 py-3 rounded-xl font-black text-sm hover:bg-yellow-300">XÓA TẤT CẢ BỘ LỌC</button>
        </div>
      )}
    </div>
  );
}
