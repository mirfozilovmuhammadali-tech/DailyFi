import React from 'react';
import { X, Clock, User, Globe, ExternalLink, Share2, Bookmark } from 'lucide-react';
import type { NewsItem } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: NewsItem | null;
}

const NewsDetailModal: React.FC<Props> = ({ isOpen, onClose, item }) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl bg-dark-bg border border-white/10 rounded-3xl shadow-2xl overflow-hidden max-h-full flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button className="p-2 rounded-full bg-black/50 text-gray-400 hover:text-white transition-colors">
            <Share2 size={20} />
          </button>
          <button className="p-2 rounded-full bg-black/50 text-gray-400 hover:text-white transition-colors">
            <Bookmark size={20} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-black/50 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          {/* Cover Image */}
          <div className="w-full h-[300px] md:h-[450px] relative">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
            
            {/* Meta Overlay */}
            <div className="absolute bottom-8 left-8 right-8">
              <span className="inline-block px-3 py-1 rounded-lg bg-gold/20 text-gold text-xs font-bold uppercase tracking-widest border border-gold/30 mb-4">
                {item.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-heading font-black text-white leading-tight drop-shadow-lg">
                {item.title}
              </h1>
            </div>
          </div>

          {/* Article Body */}
          <div className="px-8 py-10 max-w-3xl mx-auto">
            {/* Info Bar */}
            <div className="flex flex-wrap items-center gap-6 pb-8 mb-8 border-b border-white/5">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="text-sm font-bold text-gray-200">{item.author || 'Editorial Team'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={16} />
                <span className="text-sm">{item.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Globe size={16} />
                <span className="text-sm font-bold text-gold uppercase tracking-widest">{item.source}</span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <p className="text-xl text-gray-300 font-medium leading-relaxed italic">
                {item.summary}
              </p>
              <div className="text-gray-400 leading-relaxed text-lg space-y-4">
                {item.content.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-white font-bold mb-1">Continue reading on {item.source}</h4>
                <p className="text-sm text-gray-500">Access the full depth of this report on the original platform.</p>
              </div>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gold text-black px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shrink-0"
              >
                Read Full Article <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailModal;
