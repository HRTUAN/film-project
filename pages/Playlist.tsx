
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Trash2, Heart, History, Trash } from 'lucide-react';
import { MOCK_MOVIES } from '../mockData';
import { useStore } from '../store/useStore';
import MovieCard from '../components/MovieCard';

const Playlist: React.FC = () => {
  const { playlist, history, clearHistoryItem, addToPlaylist } = useStore();

  const savedMovies = MOCK_MOVIES.filter(m => playlist.includes(m.id));
  const continueWatching = history.map(h => {
    const movie = MOCK_MOVIES.find(m => m.id === h.movieId);
    return movie ? { ...movie, percent: h.percent } : null;
  }).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
      <h1 className="text-4xl font-black mb-12 flex items-center gap-4">
         Danh sách cá nhân
      </h1>

      {/* Continue Watching Section */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold flex items-center gap-3">
             <History className="text-yellow-400" /> Tiếp tục xem
           </h2>
        </div>

        {continueWatching.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {continueWatching.map((movie: any) => (
              <div key={movie.id} className="group relative bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-yellow-400/50 transition-all">
                <div className="aspect-video relative">
                  <img src={movie.banner} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                    <Link 
                      to={`/watch/${movie.slug}`}
                      className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0"
                    >
                      <Play size={24} fill="currentColor" />
                    </Link>
                  </div>
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-800">
                    <div className="h-full bg-yellow-400" style={{ width: `${movie.percent}%` }}></div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm mb-1">{movie.title}</h3>
                    <p className="text-xs text-neutral-500">Đã xem {movie.percent}%</p>
                  </div>
                  <button 
                    onClick={() => clearHistoryItem(movie.id)}
                    className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-900/50 rounded-2xl p-12 text-center border border-dashed border-neutral-800">
            <p className="text-neutral-500">Bạn chưa xem phim nào gần đây.</p>
          </div>
        )}
      </section>

      {/* Saved Playlist Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-2xl font-bold flex items-center gap-3">
             <Heart className="text-yellow-400" fill="currentColor" /> Playlist của tôi
           </h2>
        </div>

        {savedMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {savedMovies.map(movie => (
              <div key={movie.id} className="relative group">
                <MovieCard movie={movie} />
                <button 
                  onClick={() => addToPlaylist(movie.id)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-neutral-800 text-red-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-red-500 hover:text-white"
                >
                  <Trash size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-900/50 rounded-2xl p-20 text-center border border-dashed border-neutral-800">
            <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
               <Heart size={32} className="text-neutral-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Playlist đang trống</h3>
            <p className="text-neutral-500 mb-8">Hãy thêm những bộ phim bạn yêu thích để xem sau nhé!</p>
            <Link to="/movies" className="bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors">
              Khám phá phim ngay
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Playlist;
