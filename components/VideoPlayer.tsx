
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, RotateCw, Maximize, 
  Settings, RefreshCcw, FastForward, Rewind,
  ChevronLeft, ChevronRight, SkipBack, SkipForward
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
  const [volume] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(initialPercent);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState('1x');
  const [showSettings, setShowSettings] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [skipFeedback, setSkipFeedback] = useState<{ 
    type: 'left' | 'right' | null; 
    text: string;
    visible: boolean 
  }>({ type: null, text: '', visible: false });

  // Khởi tạo Video/HLS
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
        video.volume = volume / 100;
        if (initialPercent > 0 && video.duration) {
          video.currentTime = (initialPercent / 100) * video.duration;
        }
      });
      return () => hls.destroy();
    } else {
      video.src = embedUrl;
      const handleLoadedMetadata = () => {
        setIsReady(true);
        video.volume = volume / 100;
        if (initialPercent > 0) {
          video.currentTime = (initialPercent / 100) * video.duration;
        }
      };
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [embedUrl]);

  // Theo dõi trạng thái Fullscreen
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Tự động ẩn control
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
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
    
    const side = seconds > 0 ? 'right' : 'left';
    const absSeconds = Math.abs(seconds);
    let text = `${absSeconds}s`;
    if (absSeconds >= 60) text = `${absSeconds / 60}m`;
    
    setSkipFeedback({ type: side, text: `${seconds > 0 ? '+' : '-'}${text}`, visible: true });
    setTimeout(() => setSkipFeedback(prev => ({ ...prev, visible: false })), 600);
    setShowControls(true);
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
    if (!containerRef.current) return;
    
    try {
      if (document.fullscreenElement) {
        if (document.exitFullscreen) await document.exitFullscreen();
        if (window.screen.orientation && window.screen.orientation.unlock) {
          window.screen.orientation.unlock();
        }
      } else {
        const req = containerRef.current.requestFullscreen || 
                    (containerRef.current as any).webkitRequestFullscreen || 
                    (containerRef.current as any).msRequestFullscreen;
        if (req) {
          await req.call(containerRef.current);
          // Xoay ngang màn hình (Chỉ hoạt động trên mobile có hỗ trợ)
          if (window.screen.orientation && (window.screen.orientation as any).lock) {
            try {
              await (window.screen.orientation as any).lock('landscape');
            } catch (err) {
              console.warn("Orientation lock failed:", err);
            }
          }
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

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden group shadow-2xl ring-1 ring-neutral-800 select-none ${isFullscreen ? 'rounded-none border-none h-screen w-screen fixed inset-0 z-[9999]' : ''}`}
      style={{ cursor: showControls ? 'default' : 'none' }}
      onMouseMove={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
      />

      {/* Interaction Zones (Double Tap / Single Tap) */}
      <div className="absolute inset-0 z-10 flex pointer-events-none">
        <div className="w-[30%] h-full pointer-events-auto cursor-pointer" onDoubleClick={() => skipTime(-10)}></div>
        <div className="flex-grow h-full pointer-events-auto cursor-pointer" onClick={(e) => { e.stopPropagation(); togglePlay(); }}></div>
        <div className="w-[30%] h-full pointer-events-auto cursor-pointer" onDoubleClick={() => skipTime(10)}></div>
      </div>

      {/* Feedback Overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-around">
        {skipFeedback.visible && (
          <div className={`flex flex-col items-center animate-ping-once bg-white/10 p-6 md:p-10 rounded-full backdrop-blur-md ${skipFeedback.type === 'left' ? 'mr-auto ml-10' : 'ml-auto mr-10'}`}>
            {skipFeedback.type === 'left' ? <Rewind className="w-10 h-10 md:w-16 md:h-16 text-white" fill="white" /> : <FastForward className="w-10 h-10 md:w-16 md:h-16 text-white" fill="white" />}
            <span className="text-xl font-black text-white mt-2">{skipFeedback.text}</span>
          </div>
        )}
      </div>

      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 z-50">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-yellow-400 font-bold uppercase tracking-widest text-[10px]">Đang kết nối...</span>
        </div>
      )}

      {/* Controls Container */}
      <div 
        className={`absolute inset-0 z-30 flex flex-col justify-between transition-opacity duration-500 bg-gradient-to-t from-black/80 via-transparent to-black/40 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="px-2 py-1 bg-yellow-400 text-black text-[9px] font-black rounded uppercase tracking-tighter shadow-lg shadow-yellow-400/20">4K PREMIUM</div>
             <span className="text-xs md:text-sm font-bold text-white/70 line-clamp-1 max-w-[150px] md:max-w-md">Streaming Mode</span>
          </div>
          <button onClick={() => window.location.reload()} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white">
            <RefreshCcw size={18} />
          </button>
        </div>

        {/* Center Navigation Buttons - Optimized for Mobile Thumb access */}
        <div className="flex items-center justify-center gap-2 md:gap-8">
           <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => skipTime(-600)} className="w-10 h-10 flex flex-col items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all">
                <SkipBack size={20} />
                <span className="text-[8px] font-bold">-10m</span>
              </button>
              <button onClick={() => skipTime(-60)} className="w-10 h-10 flex flex-col items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all">
                <ChevronLeft size={20} />
                <span className="text-[8px] font-bold">-1m</span>
              </button>
           </div>

           <button onClick={() => togglePlay()} className="w-16 h-16 md:w-20 md:h-20 bg-yellow-400 rounded-full flex items-center justify-center text-black shadow-2xl hover:scale-110 active:scale-95 transition-transform">
             {isPlaying ? <Pause className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" /> : <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" fill="currentColor" />}
           </button>

           <div className="hidden sm:flex items-center gap-2">
              <button onClick={() => skipTime(60)} className="w-10 h-10 flex flex-col items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all">
                <ChevronRight size={20} />
                <span className="text-[8px] font-bold">+1m</span>
              </button>
              <button onClick={() => skipTime(600)} className="w-10 h-10 flex flex-col items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all">
                <SkipForward size={20} />
                <span className="text-[8px] font-bold">+10m</span>
              </button>
           </div>
        </div>

        {/* Bottom Bar */}
        <div className="p-4 md:p-6 space-y-4">
          {/* Progress Bar with larger touch area */}
          <div className="relative h-6 flex items-center cursor-pointer group" onClick={handleSeek}>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
               <div className="h-full bg-yellow-400 transition-all shadow-[0_0_15px_rgba(250,204,21,0.5)]" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="absolute h-4 w-4 bg-yellow-400 rounded-full shadow-lg scale-0 group-hover:scale-100 sm:scale-100 transition-transform pointer-events-none" style={{ left: `calc(${progress}% - 8px)` }}></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex md:hidden items-center gap-2">
                 <button onClick={() => skipTime(-60)} className="p-2 text-white/60"><RotateCcw size={20} /></button>
                 <button onClick={() => skipTime(60)} className="p-2 text-white/60"><RotateCw size={20} /></button>
              </div>

              <div className="text-[11px] font-black text-white bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 tabular-nums">
                <span className="text-yellow-400">{formatTime(currentTime)}</span>
                <span className="mx-1 opacity-30">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowSettings(!showSettings)} 
                  className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-2 rounded-lg border transition-all ${showSettings ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white/10 text-white/70 border-white/10 hover:bg-white/20'}`}
                >
                  <Settings size={14} /> {speed}
                </button>
                {showSettings && (
                  <div className="absolute right-0 bottom-full mb-3 w-36 bg-neutral-900 border border-white/10 rounded-2xl p-2 shadow-2xl grid grid-cols-2 gap-1 animate-in slide-in-from-bottom-2">
                    {['0.5x', '1x', '1.5x', '2x'].map(s => (
                      <button key={s} onClick={() => changeSpeed(s)} className={`p-2 rounded-xl text-[10px] font-black transition-all ${speed === s ? 'bg-yellow-400 text-black' : 'hover:bg-white/5 text-neutral-400'}`}>{s}</button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={handleFullscreen} 
                className="p-3 bg-yellow-400 text-black rounded-2xl hover:bg-yellow-300 transition-all active:scale-90 flex items-center gap-2 font-black text-[10px] uppercase shadow-xl shadow-yellow-400/20"
              >
                <Maximize size={18} />
                <span className="hidden sm:inline">Phóng to</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping-once {
          0% { transform: scale(0.6); opacity: 0; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        .animate-ping-once {
          animation: ping-once 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
