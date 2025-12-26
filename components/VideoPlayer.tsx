
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
  
  const [skipFeedback, setSkipFeedback] = useState<{ 
    type: 'left' | 'right' | null; 
    text: string;
    visible: boolean 
  }>({ type: null, text: '', visible: false });

  const lastTap = useRef(0);
  const controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsReady(false);
    setIsPlaying(false);

    const isHls = embedUrl.includes('.m3u8');

    if (isHls && Hls.isSupported()) {
      const hls = new Hls({ capLevelToPlayerSize: true });
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
      video.onloadedmetadata = () => {
        setIsReady(true);
        if (initialPercent > 0) {
          video.currentTime = (initialPercent / 100) * video.duration;
        }
      };
    }
  }, [embedUrl]);

  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!(
        document.fullscreenElement || 
        (document as any).webkitFullscreenElement || 
        (document as any).mozFullScreenElement || 
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFs);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    document.addEventListener('mozfullscreenchange', handleFsChange);
    document.addEventListener('MSFullscreenChange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
      document.removeEventListener('mozfullscreenchange', handleFsChange);
      document.removeEventListener('MSFullscreenChange', handleFsChange);
    };
  }, []);

  const resetControlsTimeout = () => {
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    setShowControls(true);
    if (isPlaying) {
      controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  const togglePlay = (e?: any) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play().catch(() => {});
    setIsPlaying(!isPlaying);
    resetControlsTimeout();
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
    const absSec = Math.abs(seconds);
    const feedbackText = absSec >= 60 ? `${Math.floor(absSec/60)}m` : `${absSec}s`;
    setSkipFeedback({ 
      type: seconds > 0 ? 'right' : 'left', 
      text: `${seconds > 0 ? '+' : '-'}${feedbackText}`, 
      visible: true 
    });
    setTimeout(() => setSkipFeedback(prev => ({ ...prev, visible: false })), 600);
    resetControlsTimeout();
  };

  const handleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;
    
    try {
      if (isFullscreen) {
        const exitFs = document.exitFullscreen || 
                      (document as any).webkitExitFullscreen || 
                      (document as any).mozCancelFullScreen || 
                      (document as any).msExitFullscreen;
        if (exitFs) await exitFs.call(document);
      } else {
        const requestFs = container.requestFullscreen || 
                         (container as any).webkitRequestFullscreen || 
                         (container as any).mozRequestFullScreen || 
                         (container as any).msRequestFullscreen;

        if (requestFs) {
          await requestFs.call(container);
          if (window.screen.orientation && (window.screen.orientation as any).lock) {
            await (window.screen.orientation as any).lock('landscape').catch(() => {});
          }
        } else if ((video as any).webkitEnterFullscreen) {
          // Giải pháp tối thượng cho iOS iPhone
          (video as any).webkitEnterFullscreen();
        }
      }
    } catch (err) {
      console.error("Fullscreen toggle failed:", err);
    }
  };

  const handleTapZone = (side: 'left' | 'center' | 'right', e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const now = Date.now();
    const isDoubleTap = now - lastTap.current < 300;
    lastTap.current = now;

    if (isDoubleTap) {
      if (side === 'left') skipTime(-10);
      if (side === 'right') skipTime(10);
    } else {
      setTimeout(() => {
        if (lastTap.current === now) {
          if (showControls) togglePlay();
          else setShowControls(true);
        }
      }, 300);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    videoRef.current.currentTime = (x / rect.width) * duration;
  };

  const formatTime = (time: number) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group select-none transition-all duration-300 ${isFullscreen ? 'w-screen h-screen rounded-none' : ''}`}
      onMouseMove={resetControlsTimeout}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration);
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
            onProgress?.((videoRef.current.currentTime / videoRef.current.duration) * 100);
          }
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        playsInline
      />

      {/* 1. INTERACTION ZONES (Z-10) */}
      <div className="absolute inset-0 z-10 flex">
        <div className="w-[25%] h-full cursor-pointer" onClick={(e) => handleTapZone('left', e)}></div>
        <div className="flex-grow h-full cursor-pointer" onClick={(e) => handleTapZone('center', e)}></div>
        <div className="w-[25%] h-full cursor-pointer" onClick={(e) => handleTapZone('right', e)}></div>
      </div>

      {/* 2. FEEDBACK LAYER (Z-20) */}
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-around overflow-hidden">
        {skipFeedback.visible && (
          <div className={`flex flex-col items-center animate-ping-once bg-yellow-400/20 p-6 md:p-10 rounded-full backdrop-blur-md ${skipFeedback.type === 'left' ? 'ml-10 mr-auto' : 'mr-10 ml-auto'}`}>
            {skipFeedback.type === 'left' ? <Rewind size={32} fill="currentColor" className="text-yellow-400" /> : <FastForward size={32} fill="currentColor" className="text-yellow-400" />}
            <span className="text-white font-black mt-2 text-sm">{skipFeedback.text}</span>
          </div>
        )}
      </div>

      {/* 3. CENTER PLAY BUTTON (Z-30) */}
      <div className={`absolute inset-0 z-30 flex items-center justify-center pointer-events-none transition-all duration-300 ${!isPlaying || showControls ? 'opacity-100' : 'opacity-0 scale-110'}`}>
        {isReady ? (
          <button 
            onClick={togglePlay}
            className="w-14 h-14 md:w-24 md:h-24 bg-yellow-400 rounded-full flex items-center justify-center text-black shadow-2xl pointer-events-auto active:scale-90 transition-transform"
          >
            {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
          </button>
        ) : (
          <Loader2 size={32} className="text-yellow-400 animate-spin" />
        )}
      </div>

      {/* 4. CONTROLS OVERLAY (Z-40) */}
      <div className={`absolute inset-0 z-40 flex flex-col justify-between bg-gradient-to-t from-black/95 via-transparent to-black/40 pointer-events-none transition-opacity duration-500 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        {/* Top */}
        <div className="p-3 md:p-5 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-[8px] md:text-[10px] font-black text-white/50 tracking-widest uppercase">TuanPhim Player</span>
          </div>
          <button onClick={() => window.location.reload()} className="p-2 text-white/30 hover:text-white transition-colors"><RefreshCcw size={14} /></button>
        </div>

        {/* Bottom Bar - Hạ cực thấp trên mobile */}
        <div className="px-3 pb-0.5 md:px-8 md:pb-8 space-y-0.5 md:space-y-4 pointer-events-auto">
          {/* Progress Bar */}
          <div className="relative h-4 flex items-center cursor-pointer group" onClick={handleSeek}>
            <div className="w-full h-0.5 md:h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-400 shadow-[0_0_8px_#facc15]" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="absolute h-3 w-3 bg-yellow-400 rounded-full scale-0 group-hover:scale-100 sm:scale-100 transition-transform" style={{ left: `calc(${progress}% - 6px)` }}></div>
          </div>

          <div className="flex items-center justify-between pb-1 md:pb-0">
            <div className="flex items-center gap-1.5 md:gap-6">
              <button onClick={togglePlay} className="p-1.5 text-white hover:text-yellow-400 transition-colors">
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              </button>
              
              {/* Skip Controls: 10m và 1m */}
              <div className="flex items-center gap-0.5 bg-white/5 p-0.5 rounded-lg border border-white/5">
                <button onClick={() => skipTime(-600)} className="p-1 text-white/40 hover:text-yellow-400 flex flex-col items-center">
                   <SkipBack size={10} /><span className="text-[5px] font-black uppercase">-10m</span>
                </button>
                <button onClick={() => skipTime(-60)} className="p-1 text-white/40 hover:text-yellow-400 flex flex-col items-center">
                   <ChevronLeft size={10} /><span className="text-[5px] font-black uppercase">-1m</span>
                </button>
                <button onClick={() => skipTime(60)} className="p-1 text-white/40 hover:text-yellow-400 flex flex-col items-center">
                   <ChevronRight size={10} /><span className="text-[5px] font-black uppercase">+1m</span>
                </button>
                <button onClick={() => skipTime(600)} className="p-1 text-white/40 hover:text-yellow-400 flex flex-col items-center">
                   <SkipForward size={10} /><span className="text-[5px] font-black uppercase">+10m</span>
                </button>
              </div>

              <div className="hidden md:block text-[10px] font-black text-white/80 tabular-nums">
                <span className="text-yellow-400">{formatTime(currentTime)}</span> / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="relative">
                <button onClick={() => setShowSettings(!showSettings)} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[7px] md:text-[9px] font-black text-white/60 flex items-center gap-1 hover:bg-white/10 transition-all">
                  <Settings size={10} /> {speed}
                </button>
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 w-20 bg-neutral-900 border border-white/10 rounded-xl p-1 flex flex-col gap-1 z-50 shadow-2xl">
                    {['0.5x', '1x', '1.5x', '2x'].map(s => (
                      <button key={s} onClick={() => { setSpeed(s); if(videoRef.current) videoRef.current.playbackRate = parseFloat(s); setShowSettings(false); }} className={`p-1.5 text-left rounded text-[8px] font-black ${speed === s ? 'bg-yellow-400 text-black' : 'text-white/40 hover:bg-white/5'}`}>{s}</button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={handleFullscreen} 
                className="px-2.5 py-1.5 md:py-2 bg-yellow-400 text-black rounded-lg md:rounded-xl flex items-center gap-1.5 font-black text-[8px] md:text-[10px] uppercase shadow-lg shadow-yellow-400/20 active:scale-95 transition-all"
              >
                <Maximize size={12} /> <span className="hidden sm:inline">Phóng to</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping-once {
          0% { transform: scale(0.6); opacity: 0; }
          50% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .animate-ping-once {
          animation: ping-once 0.6s cubic-bezier(0,0,0.2,1) forwards;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
