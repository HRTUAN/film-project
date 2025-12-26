
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Maximize, Settings, RefreshCcw, FastForward, Rewind,
  ChevronLeft, ChevronRight, SkipBack, SkipForward, Loader2
} from 'lucide-react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  embedUrl: string;
  onProgress?: (percent: number) => void;
  initialPercent?: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ embedUrl, onProgress, initialPercent = 0 }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(initialPercent);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState('1x');
  const [showSettings, setShowSettings] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState(0);
  const [swipeSeekTime, setSwipeSeekTime] = useState(0);

  const [skipFeedback, setSkipFeedback] = useState<{ 
    type: 'left' | 'right' | null; 
    text: string;
    visible: boolean 
  }>({ type: null, text: '', visible: false });

  // Refs để xử lý double tap mobile
  const lastTouchTime = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsReady(false);
    setIsPlaying(false);

    const isHls = embedUrl.includes('.m3u8');

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({ capLevelToPlayerSize: true, autoStartLoad: true });
      hls.loadSource(embedUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsReady(true);
        if (initialPercent > 0 && video.duration) {
          video.currentTime = (initialPercent / 100) * video.duration;
        }
      });
      return () => hls.destroy();
    } else {
      video.src = embedUrl;
      const handleLoadedMetadata = () => {
        setIsReady(true);
        if (initialPercent > 0) {
          video.currentTime = (initialPercent / 100) * video.duration;
        }
      };
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [embedUrl]);

  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement || (document as any).mozFullScreenElement || (document as any).msFullscreenElement);
      setIsFullscreen(isFs);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (showControls && isPlaying) {
      timer = setTimeout(() => setShowControls(false), 3500);
    }
    return () => timer && clearTimeout(timer);
  }, [showControls, isPlaying]);

  const togglePlay = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => console.log("Blocked:", err));
    }
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
    
    const side = seconds > 0 ? 'right' : 'left';
    const absSeconds = Math.abs(seconds);
    let text = `${absSeconds}s`;
    if (absSeconds >= 60) text = `${Math.floor(absSeconds / 60)}m`;
    
    setSkipFeedback({ type: side, text: `${seconds > 0 ? '+' : '-'}${text}`, visible: true });
    setTimeout(() => setSkipFeedback(prev => ({ ...prev, visible: false })), 600);
    setShowControls(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeStartX(e.touches[0].clientX);
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = currentX - swipeStartX;
    if (Math.abs(diff) > 40) {
      setIsSwiping(true);
      setSwipeSeekTime(Math.floor(diff / 8));
    }
  };

  const handleTouchEnd = () => {
    if (isSwiping && videoRef.current) {
      videoRef.current.currentTime += swipeSeekTime;
    }
    setIsSwiping(false);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setCurrentTime(current);
    setDuration(dur);
    const p = (current / dur) * 100;
    if (!isNaN(p)) {
      setProgress(p);
      onProgress?.(p);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const p = Math.max(0, Math.min(1, x / rect.width));
    videoRef.current.currentTime = p * duration;
  };

  const handleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;
    
    try {
      if (isFullscreen) {
        const exitFs = document.exitFullscreen || (document as any).webkitExitFullscreen || (document as any).mozCancelFullScreen || (document as any).msExitFullscreen;
        if (exitFs) await exitFs.call(document);
        if (window.screen.orientation && window.screen.orientation.unlock) {
          window.screen.orientation.unlock();
        }
      } else {
        const reqFs = container.requestFullscreen || (container as any).webkitRequestFullscreen || (container as any).mozRequestFullScreen || (container as any).msRequestFullscreen;
        
        if (reqFs) {
          await reqFs.call(container);
          if (window.screen.orientation && (window.screen.orientation as any).lock) {
            try {
              await (window.screen.orientation as any).lock('landscape');
            } catch (err) {
              console.warn("Orientation lock failed:", err);
            }
          }
        } else if (videoRef.current && (videoRef.current as any).webkitEnterFullscreen) {
          (videoRef.current as any).webkitEnterFullscreen();
        }
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time < 0) return "00:00";
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const changeSpeed = (s: string) => {
    setSpeed(s);
    if (videoRef.current) videoRef.current.playbackRate = parseFloat(s);
    setShowSettings(false);
  };

  // Logic xử lý Click/Tap thông minh
  const handleInteractionZone = (side: 'left' | 'center' | 'right', e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const now = Date.now();
    const isDouble = now - lastTouchTime.current < 300;
    lastTouchTime.current = now;

    if (isDouble) {
      if (side === 'left') skipTime(-10);
      if (side === 'right') skipTime(10);
    } else {
      // Đợi một chút để xem có phải double tap không, nếu không thì toggle play
      setTimeout(() => {
        if (Date.now() - lastTouchTime.current >= 300) {
          if (side === 'center' || side === 'left' || side === 'right') {
            togglePlay();
          }
        }
      }, 310);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden group shadow-2xl ring-1 ring-neutral-800 select-none ${isFullscreen ? 'rounded-none border-none h-screen w-screen fixed inset-0 z-[9999]' : ''}`}
      style={{ cursor: showControls ? 'default' : 'none' }}
      onMouseMove={() => setShowControls(true)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain pointer-events-none"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
      />

      {/* interaction zones - Nằm dưới controls nhưng trên video */}
      <div className="absolute inset-0 z-10 flex">
        <div 
          className="w-[30%] h-full cursor-pointer" 
          onClick={(e) => handleInteractionZone('left', e)}
          onDoubleClick={(e) => { e.stopPropagation(); skipTime(-10); }}
        ></div>
        <div 
          className="flex-grow h-full cursor-pointer" 
          onClick={(e) => handleInteractionZone('center', e)}
        ></div>
        <div 
          className="w-[30%] h-full cursor-pointer" 
          onClick={(e) => handleInteractionZone('right', e)}
          onDoubleClick={(e) => { e.stopPropagation(); skipTime(10); }}
        ></div>
      </div>

      {/* Swipe/Scrub Feedback Overlay */}
      {isSwiping && (
        <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
           <div className="bg-black/80 backdrop-blur-xl px-10 py-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center gap-3">
              <div className="flex items-center gap-4 text-white">
                {swipeSeekTime < 0 ? <Rewind fill="white" size={32} /> : <FastForward fill="white" size={32} />}
                <span className="text-5xl font-black tabular-nums">{swipeSeekTime > 0 ? '+' : ''}{swipeSeekTime}s</span>
              </div>
              <p className="text-yellow-400 font-bold text-xs uppercase tracking-[0.2em]">Kéo để tua phim</p>
           </div>
        </div>
      )}

      {/* Double Tap Feedback Icons */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-around">
        {skipFeedback.visible && (
          <div className={`flex flex-col items-center animate-ping-once bg-yellow-400/20 p-8 md:p-12 rounded-full backdrop-blur-md ${skipFeedback.type === 'left' ? 'mr-auto ml-10' : 'ml-auto mr-10'}`}>
            {skipFeedback.type === 'left' ? <Rewind className="w-10 h-10 text-yellow-400" fill="currentColor" /> : <FastForward className="w-10 h-10 text-yellow-400" fill="currentColor" />}
            <span className="text-xl font-black text-white mt-2">{skipFeedback.text}</span>
          </div>
        )}
      </div>

      {/* Center Play/Pause Button - z-30 */}
      <div className={`absolute inset-0 z-30 flex items-center justify-center pointer-events-none transition-all duration-300 ${!isPlaying || showControls ? 'opacity-100' : 'opacity-0 scale-150'}`}>
         {isReady ? (
           <button 
             onClick={togglePlay} 
             className="w-20 h-20 md:w-28 md:h-28 bg-yellow-400 rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(250,204,21,0.4)] pointer-events-auto transform active:scale-90 transition-transform"
           >
             {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} className="ml-2" fill="currentColor" />}
           </button>
         ) : (
           <div className="flex flex-col items-center gap-4">
             <Loader2 size={48} className="text-yellow-400 animate-spin" />
             <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Đang kết nối...</span>
           </div>
         )}
      </div>

      {/* Main Controls - z-40 */}
      <div 
        className={`absolute inset-0 z-40 flex flex-col justify-between transition-opacity duration-500 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Bar */}
        <div className="p-4 md:p-6 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
             <div className="px-2.5 py-1 bg-yellow-400 text-black text-[9px] font-black rounded uppercase tracking-tighter shadow-lg">PLAYER PRO</div>
             <span className="text-xs md:text-sm font-bold text-white/50 truncate max-w-[200px]">TUANPHIM.XYZ</span>
          </div>
          <button onClick={() => window.location.reload()} className="p-2.5 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white">
            <RefreshCcw size={20} />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="p-4 md:p-8 space-y-6 pointer-events-auto">
          {/* Progress Bar */}
          <div className="relative h-6 flex items-center cursor-pointer group" onClick={handleSeek}>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
               <div className="h-full bg-yellow-400 transition-all shadow-[0_0_20px_rgba(250,204,21,0.6)]" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="absolute h-5 w-5 bg-yellow-400 rounded-full shadow-2xl scale-0 group-hover:scale-100 sm:scale-100 transition-transform pointer-events-none" style={{ left: `calc(${progress}% - 10px)` }}></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-8">
              <button onClick={() => togglePlay()} className="text-white hover:text-yellow-400 transition-all">
                {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" />}
              </button>

              {/* Tua nhanh tích hợp */}
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
                 <button onClick={(e) => { e.stopPropagation(); skipTime(-600); }} title="Lùi 10 phút" className="p-2 text-white/40 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all flex flex-col items-center">
                    <SkipBack size={18} />
                    <span className="text-[8px] font-black">-10m</span>
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); skipTime(-60); }} title="Lùi 1 phút" className="p-2 text-white/40 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all flex flex-col items-center">
                    <ChevronLeft size={18} />
                    <span className="text-[8px] font-black">-1m</span>
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); skipTime(60); }} title="Tiến 1 phút" className="p-2 text-white/40 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all flex flex-col items-center">
                    <ChevronRight size={18} />
                    <span className="text-[8px] font-black">+1m</span>
                 </button>
                 <button onClick={(e) => { e.stopPropagation(); skipTime(600); }} title="Tiến 10 phút" className="p-2 text-white/40 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all flex flex-col items-center">
                    <SkipForward size={18} />
                    <span className="text-[8px] font-black">+10m</span>
                 </button>
              </div>

              <div className="hidden lg:flex text-sm font-black text-white/80 bg-white/5 px-4 py-2 rounded-xl border border-white/5 tabular-nums">
                <span className="text-yellow-400">{formatTime(currentTime)}</span>
                <span className="mx-2 opacity-30">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }} 
                  className={`flex items-center gap-2 text-[10px] font-black px-4 py-2.5 rounded-xl border transition-all pointer-events-auto ${showSettings ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'}`}
                >
                  <Settings size={16} /> {speed}
                </button>
                {showSettings && (
                  <div className="absolute right-0 bottom-full mb-4 w-40 bg-neutral-900 border border-white/10 rounded-[1.5rem] p-2 shadow-2xl grid grid-cols-2 gap-1 animate-in slide-in-from-bottom-2 pointer-events-auto">
                    {['0.5x', '1x', '1.5x', '2x'].map(s => (
                      <button key={s} onClick={() => changeSpeed(s)} className={`p-3 rounded-xl text-[10px] font-black transition-all ${speed === s ? 'bg-yellow-400 text-black' : 'hover:bg-white/5 text-neutral-400'}`}>{s}</button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={handleFullscreen} 
                className="p-3.5 bg-yellow-400 text-black rounded-2xl hover:bg-yellow-300 transition-all active:scale-90 flex items-center gap-2 font-black text-[11px] uppercase shadow-xl shadow-yellow-400/20 pointer-events-auto"
              >
                <Maximize size={20} />
                <span className="hidden sm:inline">Toàn màn hình</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping-once {
          0% { transform: scale(0.6); opacity: 0; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-ping-once {
          animation: ping-once 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
