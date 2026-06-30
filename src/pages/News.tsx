import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Clock, 
  Newspaper, 
  Zap, 
  Bookmark, 
  Share2, 
  ExternalLink, 
  RefreshCcw
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: 'COINGECKO INSIGHTS' | 'COINMARKETCAP' | 'THE DAILY HODL' | 'DAILYFI STRATEGY DESK';
  time: string;
  timestamp: number;
  category: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  impact: 'High' | 'Medium' | 'Low';
  image: string;
  author: string;
}

const News: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [tick, setTick] = useState(60);
  const [newlyInjectedId, setNewlyInjectedId] = useState<string | null>(null);

  // Pool of high-quality crypto-native & macro articles for dynamic injection
  const articlePool: Omit<NewsItem, 'id' | 'timestamp' | 'time'>[] = [
    {
      title: "CoinGecko Reports Massive Institutional Inflow into Layer-1 Protocols",
      summary: "Institutional allocation indexes tracked by CoinGecko show high-conviction capital rotation into Solana, Avalanche, and alternative L1 chains.",
      content: "A comprehensive institutional asset flow report published by CoinGecko Research details a significant reallocation of capital. Over $420M in net inflows was recorded across top-tier non-EVM smart contract platforms during the past seven business days, signaling expanding risk appetite for high-performance networks.",
      source: "COINGECKO INSIGHTS",
      category: "Altcoins",
      sentiment: "Bullish",
      impact: "High",
      image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=600&h=400",
      author: "Bobby Ong"
    },
    {
      title: "CoinMarketCap Data Highlights Record Surge in DeFi Volume After Rate Cuts",
      summary: "DeFi exchange metrics compiled by CoinMarketCap point to a 34% volume jump as interest rate cuts stimulate lending pool activity.",
      content: "CoinMarketCap market telemetry reports decentralized finance (DeFi) trading volumes have hit an annualized high. The recent interest rate cuts have compressed yields on traditional sovereign bonds, driving liquidity back into yields offered by decentralized stablecoin pools and automated market makers.",
      source: "COINMARKETCAP",
      category: "Global Markets",
      sentiment: "Bullish",
      impact: "High",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600&h=400",
      author: "Alice Taylor"
    },
    {
      title: "The Daily Hodl: Ethereum Staking Ratios Hit New All-Time High Above 28%",
      summary: "Over 33.6 million ETH is now locked inside the consensus layer, securing the network while reducing liquid exchange supply.",
      content: "According to latest staking data published by The Daily Hodl, the Ethereum staking ratio has crossed the 28.5% threshold. This structural reduction in active liquid supply, coupled with steady ETF purchasing velocity, could create an supply-demand imbalance in the coming quarters.",
      source: "THE DAILY HODL",
      category: "Ethereum",
      sentiment: "Bullish",
      impact: "Medium",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=600&h=400",
      author: "Nick Marinoff"
    },
    {
      title: "DailyFi Strategy Desk: DXY Breakout Triggers Tactical Hedge Allocation",
      summary: "The US Dollar Index breaking above 104.80 prompts our Strategy Desk to rebalance 15% of high-beta positions into stablecoin cash buffers.",
      content: "DAILYFI TERMINAL ANALYSIS — Dynamic macro-trend indicators show DXY strength consolidating near critical multi-month resistance. Historically, persistent dollar strength suppresses digital asset valuations. We recommend systematic profit-taking on over-extended assets to maintain capital safety.",
      source: "DAILYFI STRATEGY DESK",
      category: "Macro Economics",
      sentiment: "Bearish",
      impact: "High",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=600&h=400",
      author: "DailyFi Macro Desk"
    },
    {
      title: "SEC Launches Regulatory Probe Into Emerging Compute Infrastructure Tokens",
      summary: "Regulatory bodies are examining utility structures of decentralized AI GPU networks for potential securities violations.",
      content: "WASHINGTON — Emerging reports state the SEC has initiated inquiries into multiple decentralized compute sharing protocols. Regulators are focusing on the distribution mechanisms of tokens used to lease AI computing hardware, testing for potential compliance violations.",
      source: "THE DAILY HODL",
      category: "Regulation",
      sentiment: "Bearish",
      impact: "High",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600&h=400",
      author: "Daily Hodl Staff"
    },
    {
      title: "CoinMarketCap Intelligence: Stablecoin Inflows Near $3B Weekly Threshold",
      summary: "Aggregated stablecoin minting volumes indicate heavy fiat onboarding, setting the stage for massive potential buy pressure.",
      content: "Net capital entering the digital asset ecosystem via Tether (USDT) and USD Coin (USDC) mints has accelerated. CoinMarketCap data highlights this as the largest weekly onboarding phase of the calendar year, reflecting strong institutional readiness to deploy capital.",
      source: "COINMARKETCAP",
      category: "Global Markets",
      sentiment: "Bullish",
      impact: "Medium",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600&h=400",
      author: "Vance Parker"
    }
  ];

  // Initial News Database
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: "news-init-1",
      title: "CoinGecko Reports Massive Institutional Inflow into Layer-1 Protocols",
      summary: "Institutional allocation indexes tracked by CoinGecko show high-conviction capital rotation into Solana, Avalanche, and alternative L1 chains.",
      content: "A comprehensive institutional asset flow report published by CoinGecko Research details a significant reallocation of capital. Over $420M in net inflows was recorded across top-tier non-EVM smart contract platforms during the past seven business days, signaling expanding risk appetite for high-performance networks.",
      source: "COINGECKO INSIGHTS",
      time: "2m ago",
      timestamp: Date.now() - 120000,
      category: "Altcoins",
      sentiment: "Bullish",
      impact: "High",
      image: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=600&h=400",
      author: "Bobby Ong"
    },
    {
      id: "news-init-2",
      title: "CoinMarketCap Data Highlights Record Surge in DeFi Volume After Rate Cuts",
      summary: "DeFi exchange metrics compiled by CoinMarketCap point to a 34% volume jump as interest rate cuts stimulate lending pool activity.",
      content: "CoinMarketCap market telemetry reports decentralized finance (DeFi) trading volumes have hit an annualized high. The recent interest rate cuts have compressed yields on traditional sovereign bonds, driving liquidity back into yields offered by decentralized stablecoin pools and automated market makers.",
      source: "COINMARKETCAP",
      time: "12m ago",
      timestamp: Date.now() - 720000,
      category: "Global Markets",
      sentiment: "Bullish",
      impact: "High",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600&h=400",
      author: "Alice Taylor"
    },
    {
      id: "news-init-3",
      title: "The Daily Hodl: Ethereum Staking Ratios Hit New All-Time High Above 28%",
      summary: "Over 33.6 million ETH is now locked inside the consensus layer, securing the network while reducing liquid exchange supply.",
      content: "According to latest staking data published by The Daily Hodl, the Ethereum staking ratio has crossed the 28.5% threshold. This structural reduction in active liquid supply, coupled with steady ETF purchasing velocity, could create an supply-demand imbalance in the coming quarters.",
      source: "THE DAILY HODL",
      time: "35m ago",
      timestamp: Date.now() - 2100000,
      category: "Ethereum",
      sentiment: "Bullish",
      impact: "Medium",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=600&h=400",
      author: "Nick Marinoff"
    },
    {
      id: "news-init-4",
      title: "DailyFi Strategy Desk: DXY Breakout Triggers Tactical Hedge Allocation",
      summary: "The US Dollar Index breaking above 104.80 prompts our Strategy Desk to rebalance 15% of high-beta positions into stablecoin cash buffers.",
      content: "DAILYFI TERMINAL ANALYSIS — Dynamic macro-trend indicators show DXY strength consolidating near critical multi-month resistance. Historically, persistent dollar strength suppresses digital asset valuations. We recommend systematic profit-taking on over-extended assets to maintain capital safety.",
      source: "DAILYFI STRATEGY DESK",
      time: "1h ago",
      timestamp: Date.now() - 3600000,
      category: "Macro Economics",
      sentiment: "Bearish",
      impact: "High",
      image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=600&h=400",
      author: "DailyFi Macro Desk"
    },
    {
      id: "news-init-5",
      title: "SEC Launches Regulatory Probe Into Emerging Compute Infrastructure Tokens",
      summary: "Regulatory bodies are examining utility structures of decentralized AI GPU networks for potential securities violations.",
      content: "WASHINGTON — Emerging reports state the SEC has initiated inquiries into multiple decentralized compute sharing protocols. Regulators are focusing on the distribution mechanisms of tokens used to lease AI computing hardware, testing for potential compliance violations.",
      source: "THE DAILY HODL",
      time: "3h ago",
      timestamp: Date.now() - 10800000,
      category: "Regulation",
      sentiment: "Bearish",
      impact: "High",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600&h=400",
      author: "Daily Hodl Staff"
    }
  ]);

  const categories = [
    'All', 'Bitcoin', 'Ethereum', 'Altcoins', 'ETFs', 'Regulation', 'Macro Economics', 'Global Markets'
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  useEffect(() => {
    const saved = localStorage.getItem('dailyfi_saved_news');
    if (saved) {
      setSavedIds(JSON.parse(saved));
    }
  }, []);

  const getRelativeTime = (timestamp: number) => {
    const min = Math.floor((Date.now() - timestamp) / 60000);
    if (min < 1) return 'Just now';
    if (min < 60) return `${min}m ago`;
    const hours = Math.floor(min / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Live Auto-Refresh Engine (Every 60 Seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => {
        if (prev <= 1) {
          const baseArticle = articlePool[Math.floor(Math.random() * articlePool.length)];
          const newId = `news-inject-${Date.now()}`;
          const newArticle: NewsItem = {
            ...baseArticle,
            id: newId,
            timestamp: Date.now(),
            time: 'Just now'
          };

          setNews(prevList => {
            // Avoid duplicate injection
            if (prevList.some(item => item.title === newArticle.title)) {
              return prevList;
            }
            const updated = [newArticle, ...prevList].slice(0, 15);
            return updated.map(item => ({
              ...item,
              time: getRelativeTime(item.timestamp)
            }));
          });

          setNewlyInjectedId(newId);
          setTimeout(() => setNewlyInjectedId(null), 3000); // Clear flash after 3s
          showToast(`⚡ NEW WIRE: ${newArticle.source}`);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [news]);

  // Periodic relative time update
  useEffect(() => {
    const interval = setInterval(() => {
      setNews(prevList => prevList.map(item => ({
        ...item,
        time: getRelativeTime(item.timestamp)
      })));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [news, activeCategory, searchQuery]);

  const toggleSave = (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    const isSaved = savedIds.includes(item.id);
    const newSaved = isSaved 
      ? savedIds.filter(id => id !== item.id) 
      : [...savedIds, item.id];
    
    setSavedIds(newSaved);
    localStorage.setItem('dailyfi_saved_news', JSON.stringify(newSaved));
    showToast(isSaved ? 'Removed from Bookmarks' : 'Saved to Bookmarks');
  };

  const handleShare = (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/news/${item.id}`);
    showToast('Share link copied to clipboard!');
  };

  // Get Custom Source Tag Color Theme
  const getSourceBadgeClass = (source: NewsItem['source']) => {
    switch (source) {
      case 'COINGECKO INSIGHTS':
        return 'text-[#8cc63f] bg-[#8cc63f]/10 border-[#8cc63f]/30';
      case 'COINMARKETCAP':
        return 'text-[#3861fb] bg-[#3861fb]/10 border-[#3861fb]/30';
      case 'THE DAILY HODL':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'DAILYFI STRATEGY DESK':
        return 'text-cyan bg-cyan/10 border-cyan/30';
    }
  };

  const forceRefresh = () => {
    const baseArticle = articlePool[Math.floor(Math.random() * articlePool.length)];
    const newId = `news-inject-${Date.now()}`;
    const newArticle: NewsItem = {
      ...baseArticle,
      id: newId,
      timestamp: Date.now(),
      time: 'Just now'
    };

    setNews(prevList => {
      const updated = [newArticle, ...prevList].slice(0, 15);
      return updated.map(item => ({
        ...item,
        time: getRelativeTime(item.timestamp)
      }));
    });

    setNewlyInjectedId(newId);
    setTimeout(() => setNewlyInjectedId(null), 3000);
    showToast(`⚡ MANUAL INJECTION: ${newArticle.source}`);
    setTick(60);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Toast Alert Banner */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-6 py-3 rounded-xl bg-gold/10 border border-gold/30 text-gold font-bold shadow-[0_0_20px_rgba(255,215,0,0.2)] backdrop-blur-md transition-all duration-300 ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <Zap size={16} className="text-gold animate-bounce" /> {toastMessage}
      </div>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Newspaper size={14} className="text-gold" />
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">DailyFi Intelligence Board</span>
          </div>
          <h1 className="text-4xl font-heading font-black text-white tracking-tight uppercase">News Aggregator</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Crypto-native feeds, market insights, and macroeconomic alerts.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={forceRefresh}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-gold hover:bg-gold/10 transition-all active:scale-95 flex items-center gap-2 text-xs font-black uppercase tracking-widest"
            title="Manual Feed Injection"
          >
            <RefreshCcw size={14} /> Inject Feed
          </button>
          
          <div className="glass-card-laser px-4 py-2 border-cyan/15 bg-cyan/5 rounded-xl text-right">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Simulation Tick</span>
            <span className="text-sm font-mono font-black text-cyan tracking-wider">{tick}s</span>
          </div>
          
          <div className="relative w-full sm:w-[280px] group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-gold transition-colors">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Search feed..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
              activeCategory === cat 
                ? 'bg-gold/10 text-gold border-gold/30 shadow-[0_0_15px_rgba(255,215,0,0.15)]' 
                : 'text-gray-400 border-white/5 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Aggregator Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.length > 0 ? (
          filteredNews.map(item => {
            const isJustInjected = newlyInjectedId === item.id;
            return (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={`glass-card border bg-black/60 rounded-2xl flex flex-col justify-between overflow-hidden cursor-pointer group transition-all duration-500 ${
                  isJustInjected 
                    ? 'border-cyan shadow-[0_0_20px_rgba(0,245,255,0.3)] animate-pulse' 
                    : 'border-white/5 hover:border-gold/20 hover:-translate-y-1'
                }`}
              >
                {/* Visual Thumbnail Area with aspect ratio box to prevent layout shifts */}
                <div className="w-full aspect-video bg-white/5 relative overflow-hidden shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Category overlay */}
                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest text-white border border-white/10">
                    {item.category}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      {/* Brand Colored Source Badge */}
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getSourceBadgeClass(item.source)}`}>
                        {item.source}
                      </span>
                      
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Clock size={12} />
                        <span>{item.time}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-heading font-black text-white group-hover:text-gold transition-colors leading-snug pt-3 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-400 text-xs leading-relaxed pt-2 line-clamp-2">
                      {item.summary}
                    </p>
                  </div>

                  {/* Foot Controls */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    {/* Sentiment Glowing Pulse Indicator */}
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          item.sentiment === 'Bullish' ? 'bg-emerald-400' : item.sentiment === 'Bearish' ? 'bg-rose-400' : 'bg-gray-400'
                        }`}></span>
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${
                          item.sentiment === 'Bullish' ? 'bg-emerald-500' : item.sentiment === 'Bearish' ? 'bg-rose-500' : 'bg-gray-400'
                        }`}></span>
                      </span>
                      <span className={`text-[10px] font-bold ${
                        item.sentiment === 'Bullish' ? 'text-bullish' : item.sentiment === 'Bearish' ? 'text-bearish' : 'text-gray-400'
                      }`}>
                        {item.sentiment}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => toggleSave(e, item)}
                        className={`p-2 rounded-lg transition-colors ${savedIds.includes(item.id) ? 'bg-gold/10 text-gold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                      >
                        <Bookmark size={14} fill={savedIds.includes(item.id) ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={(e) => handleShare(e, item)}
                        className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500 text-sm">
            No matching news cards found on this category channel.
          </div>
        )}
      </div>

      {/* Slide-over Detailed Analysis Report Panel */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[250] flex items-center justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />
            
            {/* Slide Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg h-full bg-dark-bg border-l border-white/10 p-8 flex flex-col justify-between z-10 overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-cyan bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded">INTEL CORE</span>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${getSourceBadgeClass(selectedItem.source)}`}>
                      {selectedItem.source}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                  >
                    CLOSE [X]
                  </button>
                </div>

                <div className="space-y-5">
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-white/5">
                    <img 
                      src={selectedItem.image} 
                      alt={selectedItem.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <Clock size={12} />
                    <span>{selectedItem.time}</span>
                    <span>•</span>
                    <span>Report By {selectedItem.author}</span>
                  </div>
                  
                  <h2 className="text-2xl font-heading font-black text-white leading-tight uppercase">
                    {selectedItem.title}
                  </h2>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                      selectedItem.sentiment === 'Bullish' 
                        ? 'bg-bullish/10 text-bullish border-bullish/20' 
                        : 'bg-bearish/10 text-bearish border-bearish/20'
                    }`}>
                      SENTIMENT: {selectedItem.sentiment.toUpperCase()}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-300">
                      IMPACT: {selectedItem.impact.toUpperCase()}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-300">
                      CHANNEL: {selectedItem.category.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-white leading-relaxed pt-4 border-t border-white/5">
                    {selectedItem.summary}
                  </p>

                  <div className="text-gray-400 text-xs leading-relaxed space-y-4 pt-4">
                    <p>{selectedItem.content}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-3 mt-12">
                <button 
                  onClick={(e) => toggleSave(e, selectedItem)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 hover:border-gold/30 hover:text-gold rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  <Bookmark size={14} fill={savedIds.includes(selectedItem.id) ? "currentColor" : "none"} />
                  {savedIds.includes(selectedItem.id) ? 'Bookmarked' : 'Save Intel'}
                </button>
                
                <a 
                  href="https://tradingview.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 py-3 bg-gold/10 border border-gold/20 hover:bg-gold/20 text-gold rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                  Deep Research <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;
