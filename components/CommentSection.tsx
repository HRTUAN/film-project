
import React, { useState } from 'react';
import { Send, ThumbsUp, MessageSquare } from 'lucide-react';
import { MOCK_COMMENTS } from '../mockData';

const CommentSection: React.FC = () => {
  const [commentText, setCommentText] = useState('');

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-8">
        <h3 className="text-xl font-bold">Bình luận</h3>
        <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 text-xs rounded-full">124</span>
      </div>

      {/* Add Comment */}
      <div className="flex gap-4 mb-10">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex-shrink-0 flex items-center justify-center text-black font-bold">U</div>
        <div className="flex-grow flex flex-col gap-3">
          <textarea 
            placeholder="Để lại cảm nghĩ của bạn về phim..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 min-h-[100px] transition-all"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="flex justify-end">
            <button 
              disabled={!commentText.trim()}
              className="bg-yellow-400 text-black px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gửi bình luận <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {MOCK_COMMENTS.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-sm">{comment.user}</span>
                <span className="text-[10px] text-neutral-500">{comment.timestamp}</span>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed mb-3">
                {comment.content}
              </p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-yellow-400 transition-colors">
                  <ThumbsUp size={14} /> 12
                </button>
                <button className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-yellow-400 transition-colors">
                  <MessageSquare size={14} /> Trả lời
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
