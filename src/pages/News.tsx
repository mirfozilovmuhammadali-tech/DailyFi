import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Clock, 
  Newspaper,
  ChevronRight,
  Zap,
  Bookmark,
  Share2,
  ExternalLink,
  Loader2,
  RefreshCcw,
  Check
} from 'lucide-react';
import type { NewsItem } from '../services/api';
import { fetchNews } from '../services/api';
import NewsDetailModal from '../components/NewsDetailModal';

const News: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const categories = [
    'All', 'Bitcoin', 'Ethereum', 'Altcoins', 'ETFs', 'Regulation', 'AI+Crypto', 'Macro Economics', 'Global Markets'
  ];

  // Load saved news from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dailyfi_saved_news');
    if (saved) {
      setSavedIds(JSON.parse(saved));
    }
  }, []);

  const loadNews = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    try {
      const data = await fetchNews(activeCategory);
      setNews(data);
    } catch (error) {
      console.error('Failed to fetch news:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [news, searchQuery]);

  const handleOpenDetail = (item: NewsItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newSaved = savedIds.includes(id) 
      ? savedIds.filter(i => i !== id) 
      : [...savedIds, id];
    
    setSavedIds(newSaved);
    localStorage.setItem('dailyfi_saved_news', JSON.stringify(newSaved));
  };

  const handleShare = (e: React.MouseEvent, url: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-4xl font-heading font-black text-white tracking-tight">Market Intelligence</h1>
            <p className="text-gray-400 mt-2 text-lg">Real-time professional news and analysis terminal.</p>
          </div>
          <button 
            onClick={() => loadNews(true)}
            disabled={refreshing || loading}
            className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-gold hover:bg-gold/10 transition-all mt-4 lg:mt-0 ${refreshing ? 'animate-spin text-gold' : ''}`}
          >
            <RefreshCcw size={20} />
          </button>
        </div>
        
        <div className="relative w-full lg:w-[450px] group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-gold transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search intel, protocols, or tickers..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all shadow-inner"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Breaking News Highlight Banner */}
      <div className="relative glass-card p-1 border-gold/30 bg-gradient-to-r from-gold/20 via-transparent to-transparent overflow-hidden group">
        <div className="flex items-center gap-6 px-6 py-3">
          <div className="flex items-center gap-2 shrink-0">
            <Zap size={16} className="text-gold fill-gold animate-pulse" />
            <span className="text-xs font-bold text-gold uppercase tracking-[0.2em]">Breaking News</span>
          </div>
          <div className="w-px h-4 bg-gold/20 shrink-0" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm text-white font-bold truncate">
              {news[0]?.title || 'Loading latest breaking intelligence...'}
            </p>
          </div>
          <button 
            onClick={() => news[0] && handleOpenDetail(news[0])}
            className="hidden md:flex items-center gap-1 text-xs font-black text-gold uppercase tracking-widest hover:text-white transition-colors"
          >
            Read Intel <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card p-6 border border-white/5 sticky top-24">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Filter size={14} /> Categories
            </h3>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-gold/10 text-gold border border-gold/20 shadow-[0_0_15px_rgba(255,215,0,0.05)]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                  {activeCategory === cat && <ChevronRight size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 border border-white/5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={14} className="text-cyan" /> Trending News
            </h3>
            <div className="space-y-6">
              {news.filter(i => i.trending).slice(0, 5).map((item) => (
                <div key={item.id} onClick={() => handleOpenDetail(item)} className="group cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-gold/60 uppercase">{item.source}</span>
                    <span className="text-[10px] text-gray-600">• {item.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="glass-card p-6 border border-white/5 flex flex-col md:flex-row gap-8 animate-pulse">
                  <div className="w-full md:w-[280px] h-[180px] bg-white/5 rounded-2xl" />
                  <div className="flex-1 space-y-4 py-2">
                    <div className="h-4 w-32 bg-white/5 rounded" />
                    <div className="h-8 w-full bg-white/5 rounded" />
                    <div className="h-4 w-full bg-white/5 rounded" />
                    <div className="h-4 w-2/3 bg-white/5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredNews.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => handleOpenDetail(item)}
                  className="glass-card p-6 border border-white/5 hover:border-gold/20 transition-all group cursor-pointer flex flex-col md:flex-row gap-8 min-h-[220px]"
                >
                  <div className="w-full md:w-[280px] h-[180px] shrink-0 rounded-2xl overflow-hidden relative">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800&h=450'} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">
                      {item.category}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col py-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-gold">
                            {item.source[0]}
                          </div>
                          <span className="text-xs font-bold text-gold uppercase tracking-widest">{item.source}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <Clock size={14} />
                          {item.time}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          className={`p-2 rounded-xl transition-all ${savedIds.includes(item.id) ? 'bg-gold/10 text-gold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`} 
                          onClick={(e) => toggleSave(e, item.id)}
                        >
                          <Bookmark size={18} fill={savedIds.includes(item.id) ? "currentColor" : "none"} />
                        </button>
                        <button 
                          className={`p-2 rounded-xl transition-all ${copyStatus === item.id ? 'bg-green-500/10 text-green-400' : 'text-gray-500 hover:text-white hover:bg-white/5'}`} 
                          onClick={(e) => handleShare(e, item.url, item.id)}
                        >
                          {copyStatus === item.id ? <Check size={18} /> : <Share2 size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-heading font-bold text-white mb-3 group-hover:text-gold transition-colors leading-tight line-clamp-2">
                      {item.title}
                    </h2>
                    
                    <p className="text-gray-400 line-clamp-2 mb-6 leading-relaxed text-sm md:text-base flex-1">
                      {item.summary}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${
                          item.impact === 'High' ? 'bg-red-400/20 text-red-400' : 'bg-cyan/20 text-cyan'
                        }`}>
                          {item.impact} Impact
                        </span>
                      </div>
                      <button className="flex items-center gap-2 text-xs font-black text-gold uppercase tracking-[0.2em] hover:gap-4 transition-all group/btn">
                        Analyze Intel <ExternalLink size={14} className="group-hover/btn:scale-110" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-20 border border-white/5 text-center flex flex-col items-center justify-center space-y-6">
              <div className="p-6 rounded-full bg-white/5 text-gray-600">
                <Newspaper size={64} />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-bold text-white mb-2">No Intelligence Found</h3>
                <p className="text-gray-400">Expand your search or check another frequency.</p>
              </div>
              <button 
                onClick={() => setActiveCategory('All')} 
                className="px-8 py-3 bg-gold/10 text-gold font-bold rounded-2xl border border-gold/20 hover:bg-gold/20 transition-all shadow-lg"
              >
                Reset Feed
              </button>
            </div>
          )}

          <div className="py-12 text-center">
            <button 
              disabled={loading}
              onClick={() => loadNews()}
              className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 mx-auto group disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin text-gold" /> : 'Decrypting Older Intel...'}
              {!loading && (
                <>
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <NewsDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        item={selectedItem} 
        isSaved={selectedItem ? savedIds.includes(selectedItem.id) : false}
        onToggleSave={(id) => {
          const newSaved = savedIds.includes(id) 
            ? savedIds.filter(i => i !== id) 
            : [...savedIds, id];
          setSavedIds(newSaved);
          localStorage.setItem('dailyfi_saved_news', JSON.stringify(newSaved));
        }}
      />
    </div>
  );
};

export default News;
