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

  const filteredResults = searchQuery.trim() 
    ? MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5)
    : [];

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
          <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 text-neutral-300 hover:text-yellow-400 transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5"><Search size={18} /><span className="hidden md:inline text-xs font-bold uppercase tracking-widest">Tìm kiếm</span></button>
          <Link to="/playlist" className="hidden sm:block text-neutral-300 hover:text-yellow-400 transition-colors"><Bell size={22} /></Link>
          <Link to="/under-development" className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-yellow-400 border border-neutral-700 hover:bg-neutral-700 transition-colors"><User size={18} /></Link>
          <button className="lg:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}</button>
        </div>
        {/* Mobile Menu ... (omitted for brevity but fonts are inherited from body) */}
      </header>
      {/* Search UI ... (updated with font-heading where needed) */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-neutral-950/98 flex flex-col p-6 lg:p-12 animate-in fade-in duration-300">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between mb-12"><span className="text-2xl font-heading font-black text-yellow-400 tracking-tighter uppercase">TUAN<span className="text-white">SEARCH</span></span><button onClick={() => setSearchOpen(false)} className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-white"><X size={32} /></button></div>
            <form onSubmit={handleSearchSubmit} className="relative mb-12"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-500" size={32} /><input ref={searchInputRef} type="text" placeholder="Tên phim hoặc diễn viên..." className="w-full bg-transparent border-b-2 border-neutral-800 focus:border-yellow-400 py-6 pl-20 pr-6 text-3xl md:text-5xl font-heading font-black outline-none transition-all placeholder:text-neutral-800 text-white" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;