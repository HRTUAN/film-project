
import React from 'react';
import { GENRES, COUNTRIES, YEARS } from '../mockData';

interface FilterBarProps {
  onFilterChange: (type: string, value: string) => void;
  activeFilters: any;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, activeFilters }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 mb-8">
      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Thể loại</label>
        <select 
          onChange={(e) => onFilterChange('genre', e.target.value)}
          value={activeFilters.genre}
          className="bg-neutral-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-yellow-400/50 min-w-[140px] px-3 py-2 cursor-pointer"
        >
          <option value="all">Tất cả thể loại</option>
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Quốc gia</label>
        <select 
          onChange={(e) => onFilterChange('country', e.target.value)}
          value={activeFilters.country}
          className="bg-neutral-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-yellow-400/50 min-w-[140px] px-3 py-2 cursor-pointer"
        >
          <option value="all">Tất cả quốc gia</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Năm</label>
        <select 
          onChange={(e) => onFilterChange('year', e.target.value)}
          value={activeFilters.year}
          className="bg-neutral-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-yellow-400/50 min-w-[120px] px-3 py-2 cursor-pointer"
        >
          <option value="all">Mọi năm</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="ml-auto space-y-1.5">
        <label className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest pl-1">Sắp xếp</label>
        <select 
          onChange={(e) => onFilterChange('sort', e.target.value)}
          value={activeFilters.sort}
          className="bg-yellow-400 text-black border-none rounded-lg text-sm font-bold focus:ring-2 focus:ring-white min-w-[160px] px-3 py-2 cursor-pointer"
        >
          <option value="newest">Mới nhất</option>
          <option value="popular">Xem nhiều</option>
          <option value="rating">Rating cao</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
