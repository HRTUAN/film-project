import { useState, useEffect } from 'react';
import { WatchingProgress } from '../types';

export const useStore = () => {
  const [playlist, setPlaylist] = useState<string[]>([]);
  const [history, setHistory] = useState<WatchingProgress[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedPlaylist = localStorage.getItem('playlist');
    const savedHistory = localStorage.getItem('history');
    if (savedPlaylist) setPlaylist(JSON.parse(savedPlaylist));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  const addToPlaylist = (movieId: string) => {
    const newPlaylist = playlist.includes(movieId) 
      ? playlist.filter(id => id !== movieId)
      : [...playlist, movieId];
    setPlaylist(newPlaylist);
    localStorage.setItem('playlist', JSON.stringify(newPlaylist));
  };

  const updateHistory = (movieId: string, percent: number) => {
    const newHistory = history.filter(h => h.movieId !== movieId);
    newHistory.unshift({ movieId, percent, lastUpdated: Date.now() });
    const limitedHistory = newHistory.slice(0, 20);
    setHistory(limitedHistory);
    localStorage.setItem('history', JSON.stringify(limitedHistory));
  };

  const clearHistoryItem = (movieId: string) => {
    const newHistory = history.filter(h => h.movieId !== movieId);
    setHistory(newHistory);
    localStorage.setItem('history', JSON.stringify(newHistory));
  };

  return { playlist, history, addToPlaylist, updateHistory, clearHistoryItem, mounted };
};