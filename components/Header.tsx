import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Menu, X, ChevronDown, LayoutGrid, FolderHeart, Tv } from 'lucide-react';
import { GENRES, MOCK_MOVIES } from '../mockData';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Đóng menu khi chuyển trang
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Thể loại', path: '#', isGenre: true },
    { name: 'Phim của tôi', path: '/my-movies', isSpecial: true },
    { name: 'TV Shows', path: '/under-development', isPlaceholder: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/movies?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 px-6 lg:px-12 py-4 flex items-center justify-between ${isScrolled ? 'bg-neutral-950/95 backdrop-blur-md shadow-lg py-3' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-1 group">
            <span className="text-2xl font-heading font-black tracking-tighter text-yellow-400">TUAN<span className="text-white group-hover:text-yellow-400 transition-colors">PHIM</span></span>
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group py-2">
                {link.isGenre ? (
                  <div className="flex items-center gap-1 text-[13px] font-semibold text-neutral-300 hover:text-yellow-400 cursor-pointer transition-colors uppercase tracking-wide">
                    {link.name} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </div>
                ) : (
                  <Link to={link.path} className={`text-[13px] font-semibold transition-all flex items-center gap-2 uppercase tracking-wide ${isActive(link.path) ? 'text-yellow-400' : link.isSpecial ? 'text-yellow-400/80 hover:text-yellow-400' : 'text-neutral-300 hover:text-yellow-400'}`}>
                    {link.isPlaceholder && <Tv size={16} className="opacity-50" />}
                    {link.isSpecial && <FolderHeart size={16} />}
                    {link.name}
                  </Link>
                )}
                {link.isGenre && (
                  <div className="absolute top-full left-0 mt-1 w-[450px] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top translate-y-4 group-hover:translate-y-0 p-6 z-[100]">
                    <div className="flex items-center gap-2 mb-4 text-yellow-400 font-heading font-black uppercase tracking-widest text-[11px]"><LayoutGrid size={18} /><span>Danh mục phim</span></div>
                    <div className="grid grid-cols-3 gap-2">
                      {GENRES.map(genre => <Link key={genre} to={`/movies?genre=${genre}`} className="px-3 py-2 text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-all">{genre}</Link>)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 text-neutral-300 hover:text-yellow-400 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5">
            <Search size={18} />
            <span className="hidden md:inline text-xs font-bold uppercase tracking-widest">Tìm kiếm</span>
          </button>
          <button className="lg:hidden text-white p-2 bg-white/5 rounded-xl" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <Link to="/under-development" className="hidden sm:flex w-10 h-10 rounded-full bg-neutral-800 items-center justify-center text-yellow-400 border border-neutral-700 hover:bg-neutral-700 transition-colors">
            <User size={20} />
          </Link>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] transition-all duration-500 ${mobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-neutral-950 shadow-2xl border-l border-white/5 transition-transform duration-500 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full p-8">
            <div className="flex items-center justify-between mb-12">
              <span className="text-xl font-heading font-black text-yellow-400 tracking-tighter">TUAN<span className="text-white">MENU</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-full text-white">
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-6 mb-auto">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.isGenre ? (
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Thể loại</p>
                      <div className="grid grid-cols-2 gap-2">
                        {GENRES.slice(0, 6).map(g => (
                          <Link key={g} to={`/movies?genre=${g}`} className="text-sm font-bold text-neutral-400 py-1">{g}</Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link to={link.path} className={`text-lg font-black uppercase tracking-tight flex items-center gap-3 ${isActive(link.path) ? 'text-yellow-400' : 'text-white'}`}>
                       {link.isSpecial && <FolderHeart size={20} className="text-yellow-400" />}
                       {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="pt-8 border-t border-white/5">
               <Link to="/playlist" className="flex items-center gap-3 text-neutral-400 font-bold mb-6">
                 <Bell size={20} /> Thông báo
               </Link>
               <button className="w-full bg-yellow-400 text-black py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-yellow-400/20">
                 Đăng nhập ngay
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search UI */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-neutral-950/98 flex flex-col p-6 lg:p-12 animate-in fade-in duration-300">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-12">
              <span className="text-2xl font-heading font-black text-yellow-400 tracking-tighter uppercase">TUAN<span className="text-white">SEARCH</span></span>
              <button onClick={() => setSearchOpen(false)} className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-white">
                <X size={32} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative mb-12">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500" size={32} />
              <input 
                ref={searchInputRef} 
                type="text" 
                placeholder="Tên phim hoặc diễn viên..." 
                className="w-full bg-transparent border-b-2 border-neutral-800 focus:border-yellow-400 py-6 pl-20 pr-6 text-3xl md:text-5xl font-heading font-black outline-none transition-all placeholder:text-neutral-800 text-white" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;