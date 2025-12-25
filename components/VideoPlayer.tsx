
import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, 
  Settings, RefreshCcw, FastForward, Rewind, ChevronLeft, ChevronRight 
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
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(initialPercent);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('Auto');
  const [speed, setSpeed] = useState('1x');
  const [showSettings, setShowSettings] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  // State cho hiệu ứng tua phim cải tiến
  const [skipFeedback, setSkipFeedback] = useState<{ 
    type: 'left' | 'right' | null; 
    text: string;
    visible: boolean 
  }>({ type: null, text: '', visible: false });

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
        video.muted = isMuted;
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
        video.muted = isMuted;
        if (initialPercent > 0) {
          video.currentTime = (initialPercent / 100) * video.duration;
        }
      };
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [embedUrl]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume / 100;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (showControls && isPlaying) {
      timer = setTimeout(() => setShowControls(false), 3000);
    }
    return () => timer && clearTimeout(timer);
  }, [showControls, isPlaying]);

  const handleMouseMove = () => setShowControls(true);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => console.log("Autoplay blocked:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
    
    const side = seconds > 0 ? 'right' : 'left';
    const absSeconds = Math.abs(seconds);
    const text = absSeconds >= 60 ? `${absSeconds / 60}m` : `${absSeconds}s`;
    
    setSkipFeedback({ type: side, text: `${seconds > 0 ? '+' : '-'}${text}`, visible: true });
    
    // Reset feedback sau hiệu ứng
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

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    setIsMuted(v === 0);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen?.() || 
      (containerRef.current as any).webkitRequestFullscreen?.();
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
    if (videoRef.current) {
      videoRef.current.playbackRate = parseFloat(s);
    }
    setShowSettings(false);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group shadow-2xl ring-1 ring-neutral-800 select-none"
      style={{ cursor: showControls ? 'default' : 'none' }}
      onMouseMove={handleMouseMove}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
      />

      {/* --- CÁC VÙNG TÁC ĐỘNG TRỰC TIẾP TRÊN MÀN HÌNH --- */}
      <div className="absolute inset-0 z-10 flex">
        {/* Vùng trái: Tua lùi mặc định 10s */}
        <div 
          className="w-[30%] h-full cursor-pointer flex items-center justify-center"
          onClick={() => skipTime(-10)}
        >
          {skipFeedback.type === 'left' && skipFeedback.visible && (
            <div className="flex flex-col items-center animate-ping-once bg-white/10 p-8 rounded-full backdrop-blur-md">
              <Rewind size={48} fill="white" className="text-white mb-2" />
              <span className="text-2xl font-black text-white">{skipFeedback.text}</span>
            </div>
          )}
        </div>

        {/* Vùng giữa: Play/Pause */}
        <div 
          className="w-[40%] h-full cursor-pointer flex items-center justify-center"
          onClick={() => togglePlay()}
        >
          {!isPlaying && isReady && (
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center text-black shadow-2xl transform transition-transform group-hover:scale-110">
              <Play size={36} fill="currentColor" className="ml-1" />
            </div>
          )}
        </div>

        {/* Vùng phải: Tua nhanh mặc định 10s */}
        <div 
          className="w-[30%] h-full cursor-pointer flex items-center justify-center"
          onClick={() => skipTime(10)}
        >
          {skipFeedback.type === 'right' && skipFeedback.visible && (
            <div className="flex flex-col items-center animate-ping-once bg-white/10 p-8 rounded-full backdrop-blur-md">
              <FastForward size={48} fill="white" className="text-white mb-2" />
              <span className="text-2xl font-black text-white">{skipFeedback.text}</span>
            </div>
          )}
        </div>
      </div>

      {!isReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950 z-50">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-yellow-400 font-bold uppercase tracking-widest text-[10px]">Đang kết nối server...</span>
        </div>
      )}

      {/* Controls UI */}
      <div 
        className={`absolute inset-0 z-20 bg-gradient-to-t from-black/95 via-transparent to-black/60 transition-opacity duration-500 flex flex-col justify-between pointer-events-none ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Bar */}
        <div className="p-6 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
             <div className="px-2 py-1 bg-yellow-400 text-black text-[10px] font-black rounded uppercase tracking-tighter shadow-lg shadow-yellow-400/20">PREMIUM SERVER</div>
             <span className="text-xs font-bold text-white/90 drop-shadow-lg line-clamp-1 max-w-[200px] md:max-w-md">
               {embedUrl.split('/').pop()}
             </span>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="p-2.5 bg-white/10 hover:bg-yellow-400 hover:text-black rounded-xl transition-all backdrop-blur-md border border-white/10"
          >
            <RefreshCcw size={18} />
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="p-6 pt-10 pointer-events-auto">
          {/* Progress Bar */}
          <div 
            className="relative w-full h-1.5 bg-white/15 rounded-full mb-6 cursor-pointer group/bar overflow-hidden"
            onClick={handleSeek}
          >
            <div 
              className="absolute top-0 left-0 h-full bg-yellow-400 transition-all shadow-[0_0_15px_rgba(250,204,21,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-8">
              <button onClick={(e) => togglePlay(e)} className="text-white hover:text-yellow-400 transition-all transform active:scale-90">
                {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
              </button>
              
              {/* Skip Controls Group */}
              <div className="flex items-center gap-1 md:gap-3 bg-white/5 p-1 rounded-2xl border border-white/5">
                <div className="flex items-center">
                  <button onClick={() => skipTime(-600)} className="p-2 text-white/50 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all flex flex-col items-center">
                    <span className="text-[9px] font-black">-10m</span>
                  </button>
                  <button onClick={() => skipTime(-60)} className="p-2 text-white/50 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all flex flex-col items-center">
                    <span className="text-[9px] font-black">-1m</span>
                  </button>
                  <button onClick={() => skipTime(-10)} className="p-2 text-white/70 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all">
                    <RotateCcw size={18} />
                  </button>
                </div>
                
                <div className="w-px h-6 bg-white/10 mx-1"></div>

                <div className="flex items-center">
                  <button onClick={() => skipTime(10)} className="p-2 text-white/70 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all">
                    <RotateCw size={18} />
                  </button>
                  <button onClick={() => skipTime(60)} className="p-2 text-white/50 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all flex flex-col items-center">
                    <span className="text-[9px] font-black">+1m</span>
                  </button>
                  <button onClick={() => skipTime(600)} className="p-2 text-white/50 hover:text-yellow-400 hover:bg-white/5 rounded-xl transition-all flex flex-col items-center">
                    <span className="text-[9px] font-black">+10m</span>
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-3 group/vol">
                <button onClick={toggleMute} className="text-white/70 hover:text-yellow-400 transition-colors">
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={isMuted ? 0 : volume} 
                  onChange={handleVolumeChange}
                  onClick={(e) => e.stopPropagation()}
                  className="w-20 h-1 bg-white/20 accent-yellow-400 rounded-full cursor-pointer transition-all"
                />
              </div>

              <div className="text-[11px] font-black text-white/80 tabular-nums bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                <span className="text-yellow-400">{formatTime(currentTime)}</span>
                <span className="mx-2 opacity-30">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); }}
                className={`flex items-center gap-2 text-[10px] font-black uppercase px-3 py-2 rounded-xl transition-all border ${showSettings ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white/10 text-white/70 hover:bg-white/20 border-white/10'}`}
              >
                <Settings size={14} className={showSettings ? 'animate-spin-slow' : ''} /> {speed}
              </button>

              {showSettings && (
                <div className="absolute right-6 bottom-24 w-44 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl animate-in slide-in-from-bottom-2 duration-300">
                  <p className="text-[9px] text-neutral-500 mb-3 uppercase font-black tracking-widest border-b border-white/5 pb-2">Tốc độ phát</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['0.5x', '0.75x', '1x', '1.25x', '1.5x', '2x'].map((s) => (
                      <button 
                        key={s}
                        onClick={(e) => { e.stopPropagation(); changeSpeed(s); }}
                        className={`text-[11px] font-black py-2.5 rounded-xl transition-all ${speed === s ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'hover:bg-white/5 text-neutral-400 hover:text-white'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={handleFullscreen} className="p-2 text-white/70 hover:text-yellow-400 transition-all hover:bg-white/5 rounded-xl">
                <Maximize size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping-once {
          0% { transform: scale(0.7); opacity: 0; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.1); opacity: 0; }
        }
        .animate-ping-once {
          animation: ping-once 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
