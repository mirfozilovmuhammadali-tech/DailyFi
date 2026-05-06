import React, { useState } from 'react';
import { X, Clock, User, Globe, ExternalLink, Share2, Bookmark, Check } from 'lucide-react';
import type { NewsItem } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: NewsItem | null;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

const NewsDetailModal: React.FC<Props> = ({ isOpen, onClose, item, isSaved, onToggleSave }) => {
  const [copyStatus, setCopyStatus] = useState(false);

  if (!isOpen || !item) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(item.url);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-md animate-in fade-in duration-500" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-dark-bg border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden max-h-full flex flex-col animate-in zoom-in-95 duration-500">
        
        {/* Header Controls */}
        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
          <button 
            onClick={handleShare}
            className={`p-3 rounded-2xl backdrop-blur-xl border transition-all ${copyStatus ? 'bg-green-500/20 border-green-500/30 text-green-400' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-black/60'}`}
          >
            {copyStatus ? <Check size={20} /> : <Share2 size={20} />}
          </button>
          <button 
            onClick={() => onToggleSave && onToggleSave(item.id)}
            className={`p-3 rounded-2xl backdrop-blur-xl border transition-all ${isSaved ? 'bg-gold/20 border-gold/30 text-gold' : 'bg-black/40 border-white/10 text-gray-400 hover:text-white hover:bg-black/60'}`}
          >
            <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={onClose}
            className="p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 text-gray-400 hover:text-white hover:bg-black/60 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {/* Cover Image */}
          <div className="w-full h-[350px] md:h-[500px] relative">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/20 to-transparent" />
            
            {/* Meta Overlay */}
            <div className="absolute bottom-10 left-10 right-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-gold text-black text-[10px] font-black uppercase tracking-[0.2em]">
                  {item.category}
                </span>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                  item.impact === 'High' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-cyan/10 border-cyan/20 text-cyan'
                }`}>
                  {item.impact} Impact
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-[1.1] drop-shadow-2xl max-w-4xl">
                {item.title}
              </h1>
            </div>
          </div>

          {/* Article Body */}
          <div className="px-10 py-12 max-w-3xl mx-auto">
            {/* Info Bar */}
            <div className="flex flex-wrap items-center gap-8 pb-10 mb-10 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5 shadow-inner">
                  <User size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Authored By</p>
                  <p className="text-sm font-black text-white">{item.author || 'DailyFi Intelligence'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/5 shadow-inner">
                  <Clock size={18} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Published</p>
                  <p className="text-sm font-black text-white">{item.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/10 to-transparent flex items-center justify-center border border-gold/20 shadow-inner">
                  <Globe size={18} className="text-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Source</p>
                  <p className="text-sm font-black text-gold uppercase tracking-widest">{item.source}</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              <p className="text-2xl text-white font-medium leading-relaxed border-l-4 border-gold pl-8 py-2">
                {item.summary}
              </p>
              <div className="text-gray-400 leading-[1.8] text-lg space-y-6 font-medium">
                {item.content.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-16 p-10 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-gold/10 transition-all" />
              <div className="relative z-10">
                <h4 className="text-2xl font-heading font-bold text-white mb-2">Continue analysis on {item.source}</h4>
                <p className="text-gray-500">View the original telemetry and deep-dive reports.</p>
              </div>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative z-10 flex items-center gap-3 bg-gold text-black px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:scale-105 transition-all shrink-0 active:scale-95"
              >
                Read Original <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailModal;
