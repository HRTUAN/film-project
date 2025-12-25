
import React from 'react';
import { Link } from 'react-router-dom';
import { Construction, ArrowLeft, Rocket, Sparkles } from 'lucide-react';

const UnderDevelopment: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-yellow-400 blur-[80px] opacity-20 animate-pulse"></div>
        <div className="w-32 h-32 bg-neutral-900 rounded-3xl border border-neutral-800 flex items-center justify-center text-yellow-400 relative z-10 shadow-2xl">
          <Construction size={64} strokeWidth={1.5} />
        </div>
        <div className="absolute -top-4 -right-4 bg-yellow-400 text-black p-2 rounded-xl shadow-lg animate-bounce">
          <Rocket size={24} />
        </div>
      </div>

      <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
        SẮP <span className="text-yellow-400">RA MẮT</span>
      </h1>
      
      <p className="text-neutral-500 max-w-lg mx-auto text-lg mb-10 leading-relaxed font-medium">
        Tính năng này đang được đội ngũ <span className="text-white font-bold">TuanPhim</span> phát triển với công nghệ AI tiên tiến nhất. Hãy quay lại sau nhé!
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 bg-yellow-400 text-black px-8 py-3 rounded-xl font-black hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={18} /> QUAY LẠI TRANG CHỦ
        </Link>
        <div className="flex items-center gap-2 text-neutral-400 px-8 py-3 bg-neutral-900 rounded-xl border border-neutral-800 font-bold">
           <Sparkles size={18} className="text-yellow-400" /> TuanPhim v2.0
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full opacity-50">
         <div className="p-6 bg-neutral-900/50 rounded-2xl border border-neutral-800">
            <h4 className="font-bold text-white mb-2">Trí tuệ nhân tạo</h4>
            <p className="text-xs text-neutral-500">Gợi ý phim thông minh dựa trên sở thích cá nhân của bạn.</p>
         </div>
         <div className="p-6 bg-neutral-900/50 rounded-2xl border border-neutral-800">
            <h4 className="font-bold text-white mb-2">Xem chung</h4>
            <p className="text-xs text-neutral-500">Trải nghiệm xem phim cùng bạn bè mọi lúc mọi nơi.</p>
         </div>
         <div className="p-6 bg-neutral-900/50 rounded-2xl border border-neutral-800">
            <h4 className="font-bold text-white mb-2">Đa nền tảng</h4>
            <p className="text-xs text-neutral-500">Hỗ trợ ứng dụng di động và Smart TV trong tương lai.</p>
         </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;
