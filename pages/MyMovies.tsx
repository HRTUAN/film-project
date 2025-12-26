import React, { useState, useEffect } from 'react';
import { RefreshCcw, FolderHeart, AlertCircle } from 'lucide-react';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';

// Đường dẫn xuất CSV từ Google Sheet
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1VirXIP4wglBTW-7n_yANlSG42V5WkhJ9iO3jRcvf_w8/export?format=csv&gid=0";

// Hàm tạo slug chuẩn để dùng chung
export const createMovieSlug = (name: string, index: number) => {
  const cleanName = name.toLowerCase()
    .trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');
  return `${cleanName || 'phim'}-s${index}`;
};

const generateMovieFromSheet = (name: string, url: string, index: number): Movie => {
  const slug = createMovieSlug(name, index);
  const posterSeed = index * 777;
  
  return {
    id: `sheet-${index}`,
    title: name,
    slug: slug,
    poster: `https://picsum.photos/seed/${posterSeed}/400/600`,
    banner: `https://picsum.photos/seed/${posterSeed + 5}/1920/1080`,
    description: `Phim "${name}" được phát từ link cá nhân. Nội dung này được đồng bộ từ Google Sheets.`,
    year: 2024,
    duration: "HD",
    country: "Cá nhân",
    genres: ["Phim của tôi", "Sheet Video"],
    rating: 10,
    cast: [
      { name: "My Cloud", role: "Source", avatar: "" }
    ],
    embedUrl: url
  };
};

const MyMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSheetData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(GOOGLE_SHEET_CSV_URL);
      if (!response.ok) throw new Error("Không thể kết nối với Google Sheets.");
      
      const csvText = await response.text();
      const lines = csvText.split(/\r?\n/);
      const parsedMovies: Movie[] = [];
      
      lines.forEach((line, index) => {
        const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (parts.length >= 2) {
          const name = parts[0].replace(/"/g, '').trim();
          const url = parts[1].replace(/"/g, '').trim();
          
          if (!name || name.toLowerCase() === 'name' || name.toLowerCase() === 'tên phim') return;
          if (url.includes('http')) {
            parsedMovies.push(generateMovieFromSheet(name, url, index));
          }
        }
      });

      if (parsedMovies.length === 0) throw new Error("Sheet trống hoặc không có link hợp lệ.");
      setMovies(parsedMovies);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-black shadow-xl shadow-yellow-400/20">
             <FolderHeart size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-heading font-black mb-1 uppercase tracking-tight">Kho phim Sheet</h1>
            <p className="text-neutral-500 text-sm font-medium">Dữ liệu trực tiếp từ Google Spreadsheets</p>
          </div>
        </div>
        
        <button 
          onClick={fetchSheetData}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl text-sm font-black border border-neutral-800 transition-all disabled:opacity-50 uppercase tracking-widest"
        >
          <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          Đồng bộ lại
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
           <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-neutral-500 font-black text-[10px] uppercase tracking-widest">Đang đọc dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="py-20 text-center bg-red-500/5 rounded-3xl border border-red-500/20">
           <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
           <p className="text-white font-bold">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMovies;