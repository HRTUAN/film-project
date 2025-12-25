import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import FilterBar from '../components/FilterBar';
import MovieCard from '../components/MovieCard';
import { MOCK_MOVIES } from '../mockData';

const MoviesList: React.FC = () => {
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
    const params = new URLSearchParams(location.search);
    if (value === 'all') params.delete(type);
    else params.set(type, value);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const filteredMovies = useMemo(() => {
    let result = [...MOCK_MOVIES];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
    }
    if (filters.genre !== 'all') result = result.filter(m => m.genres.includes(filters.genre));
    if (filters.country !== 'all') result = result.filter(m => m.country === filters.country);
    if (filters.year !== 'all') result = result.filter(m => m.year.toString() === filters.year);
    
    if (filters.sort === 'newest') result.sort((a, b) => b.year - a.year);
    else if (filters.sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    
    return result;
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-yellow-400 mb-2">
             <SlidersHorizontal size={20} />
             <span className="text-xs font-black uppercase tracking-[0.2em]">Khám phá kho phim</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter">
            {filters.search ? <>Kết quả: <span className="text-yellow-400">"{filters.search}"</span></> : 'Tất cả phim'}
          </h1>
          <p className="text-neutral-500 text-sm font-medium">Hiện có {filteredMovies.length} bộ phim sẵn sàng để xem.</p>
        </div>
      </div>

      <FilterBar onFilterChange={handleFilterChange} activeFilters={filters} />

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 lg:gap-8">
          {filteredMovies.map(movie => (
            <div key={movie.id} className="animate-in fade-in slide-in-from-bottom-5 duration-500">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-40 bg-neutral-900/20 rounded-[2.5rem] border-2 border-dashed border-neutral-800">
           <Search size={48} className="text-neutral-700 mb-6" />
           <h3 className="text-2xl font-black mb-2 tracking-tight">Không tìm thấy phim</h3>
           <p className="text-neutral-500 text-sm mb-8">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác.</p>
           <button 
            onClick={() => navigate('/movies')}
            className="bg-yellow-400 text-black px-10 py-4 rounded-2xl font-black text-sm hover:bg-yellow-300 transition-all active:scale-95"
           >
            LÀM MỚI BỘ LỌC
           </button>
        </div>
      )}
    </div>
  );
};

export default MoviesList;