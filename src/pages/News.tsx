import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Clock, 
  Newspaper,
  Zap,
  Bookmark,
  Share2,
  ExternalLink
} from 'lucide-react';

interface MockNewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  time: string;
  timestamp: number; // for sorting and age calculations
  category: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  impact: 'High' | 'Medium' | 'Low';
  author: string;
}

const News: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MockNewsItem | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [tick, setTick] = useState(60);

  const tvContainerRef = useRef<HTMLDivElement>(null);

  // Pool of news items to choose from when simulating a new incoming headline
  const headlinePool = [
    {
      title: "FED FOMC Minutes Suggest Potential Rate Pause in Upcoming Quarter",
      summary: "Minutes from the Federal Reserve indicate policymakers are shifting focus toward assessing the cumulative impact of tightening, pointing to a potential pause.",
      content: "WASHINGTON — Meeting minutes released by the Federal Reserve suggest a growing consensus among officials to stabilize borrowing rates. Citing moderate improvements in CPI and cooling labor dynamics, several members advocated for steady rates to monitor lagged macroeconomic policy transmission. Analysts expect this policy shift to support equity markets and interest-rate-sensitive assets in the near term.",
      source: "BLOOMBERG",
      category: "Macro Economics",
      sentiment: "Bullish" as const,
      impact: "High" as const,
      author: "Sarah Jenkins"
    },
    {
      title: "SEC Approves Options Trading for Major Spot Ethereum ETFs",
      summary: "In a landmark regulatory update, the SEC has approved options listing and trading for leading Spot Ethereum ETFs, boosting liquidity.",
      content: "NEW YORK — The Securities and Exchange Commission approved rule changes permitting options trading on spot Ethereum exchange-traded funds (ETFs). Industry participants suggest this milestone enables deeper capital deployment, hedging possibilities, and higher volume inflows into Layer-1 asset indexes.",
      source: "REUTERS",
      category: "ETFs",
      sentiment: "Bullish" as const,
      impact: "High" as const,
      author: "Marcus Vance"
    },
    {
      title: "DXY Index Rises to 104.50 as US Treasury Yields Hold Near Peaks",
      summary: "The US Dollar Index (DXY) climbed to 104.50, dampening momentum in risk assets as macroeconomic data remains resilient.",
      content: "LONDON — The dollar index rose on stronger-than-expected retail telemetry and services output. High yields on US Treasuries continue to exert capital pressure on crypto markets and sovereign alternatives, as institutional investors reposition for a higher-for-longer rate cycle.",
      source: "BLOOMBERG",
      category: "Macro Economics",
      sentiment: "Bearish" as const,
      impact: "Medium" as const,
      author: "David L. Ross"
    },
    {
      title: "Liquidity Influx: Global M2 Supply Expands by 5.4% YoY",
      summary: "Aggregated global money supply metrics point to a renewed expansion cycle, raising inflation-hedging asset profiles.",
      content: "TOKYO — Global central banks expanded their aggregate balance sheets, showing a 5.4% year-over-year increase in M2 liquidity. Hard assets and decentralized stores of value like Bitcoin historically demonstrate high beta correlation during fiat supply expansion cycles.",
      source: "CNBC",
      category: "Global Markets",
      sentiment: "Bullish" as const,
      impact: "High" as const,
      author: "Emily Chen"
    },
    {
      title: "Major Whale Wallet Accumulates 15,000 BTC in Under 24 Hours",
      summary: "On-chain telemetry reveals an anonymous institutional wallet completed multiple block trades to acquire $1B in BTC.",
      content: "ON-CHAIN DATA — Block telemetry identified a series of massive transactions transferring roughly 15,000 BTC from multiple OTC desks to a single cold-storage custody address. Heavy OTC accumulation typically signals a reduction in liquid exchange supply, indicating bullish long-term sentiment.",
      source: "COINDESK",
      category: "Bitcoin",
      sentiment: "Bullish" as const,
      impact: "Medium" as const,
      author: "Jameson Lopp"
    },
    {
      title: "Ethereum Gas Fees Drop to Multi-Year Lows Amid Layer-2 Expansion",
      summary: "Blobs and rollups have successfully offset layer-one block congestion, reducing transactional friction significantly.",
      content: "GENEVA — Network gas fees on the Ethereum mainnet reached a historic low of 2 Gwei. The successful implementation of recent protocol upgrades has diverted transactional throughput onto Layer-2 scaling networks, optimizing ecosystem utility at lower operating costs.",
      source: "REUTERS",
      category: "Ethereum",
      sentiment: "Bullish" as const,
      impact: "Low" as const,
      author: "Nikita Smirnov"
    },
    {
      title: "SEC Launches Investigation Into Emerging Decentralized AI Protocols",
      summary: "Regulatory bodies are focusing on decentralized compute networks and utility token classification metrics.",
      content: "WASHINGTON — The SEC issued regulatory inquiries to developers of decentralized GPU compute sharing networks. Regulators seek clarity regarding model governance, token sale structures, and compliance parameters for non-custodial computing networks.",
      source: "REUTERS",
      category: "Regulation",
      sentiment: "Bearish" as const,
      impact: "High" as const,
      author: "Arthur Dent"
    },
    {
      title: "US CPI Inflation Rises to 3.1%, Dampening Rate Cut Hopes",
      summary: "Consumer Price Index telemetry print came in slightly above estimates, triggering immediate short-term bond volatility.",
      content: "WASHINGTON — US consumer prices rose 3.1% annually, exceeding consensus forecast markers. The persistence of core service sector costs indicates central bankers may prolong high borrowing rates, leading to capital consolidation across equity and risk baskets.",
      source: "CNBC",
      category: "Macro Economics",
      sentiment: "Bearish" as const,
      impact: "High" as const,
      author: "Sarah Jenkins"
    }
  ];

  // Initial News Database
  const [news, setNews] = useState<MockNewsItem[]>([
    {
      id: "news-1",
      title: "FED FOMC Minutes Suggest Potential Rate Pause in Upcoming Quarter",
      summary: "Minutes from the Federal Reserve indicate policymakers are shifting focus toward assessing the cumulative impact of tightening, pointing to a potential pause.",
      content: "WASHINGTON — Meeting minutes released by the Federal Reserve suggest a growing consensus among officials to stabilize borrowing rates. Citing moderate improvements in CPI and cooling labor dynamics, several members advocated for steady rates to monitor lagged macroeconomic policy transmission. Analysts expect this policy shift to support equity markets and interest-rate-sensitive assets in the near term.",
      source: "BLOOMBERG",
      time: "2m ago",
      timestamp: Date.now() - 120000,
      category: "Macro Economics",
      sentiment: "Bullish",
      impact: "High",
      author: "Sarah Jenkins"
    },
    {
      id: "news-2",
      title: "SEC Approves Options Trading for Major Spot Ethereum ETFs",
      summary: "In a landmark regulatory update, the SEC has approved options listing and trading for leading Spot Ethereum ETFs, boosting liquidity.",
      content: "NEW YORK — The Securities and Exchange Commission approved rule changes permitting options trading on spot Ethereum exchange-traded funds (ETFs). Industry participants suggest this milestone enables deeper capital deployment, hedging possibilities, and higher volume inflows into Layer-1 asset indexes.",
      source: "REUTERS",
      time: "15m ago",
      timestamp: Date.now() - 900000,
      category: "ETFs",
      sentiment: "Bullish",
      impact: "High",
      author: "Marcus Vance"
    },
    {
      id: "news-3",
      title: "DXY Index Rises to 104.50 as US Treasury Yields Hold Near Peaks",
      summary: "The US Dollar Index (DXY) climbed to 104.50, dampening momentum in risk assets as macroeconomic data remains resilient.",
      content: "LONDON — The dollar index rose on stronger-than-expected retail telemetry and services output. High yields on US Treasuries continue to exert capital pressure on crypto markets and sovereign alternatives, as institutional investors reposition for a higher-for-longer rate cycle.",
      source: "BLOOMBERG",
      time: "45m ago",
      timestamp: Date.now() - 2700000,
      category: "Macro Economics",
      sentiment: "Bearish",
      impact: "Medium",
      author: "David L. Ross"
    },
    {
      id: "news-4",
      title: "Liquidity Influx: Global M2 Supply Expands by 5.4% YoY",
      summary: "Aggregated global money supply metrics point to a renewed expansion cycle, raising inflation-hedging asset profiles.",
      content: "TOKYO — Global central banks expanded their aggregate balance sheets, showing a 5.4% year-over-year increase in M2 liquidity. Hard assets and decentralized stores of value like Bitcoin historically demonstrate high beta correlation during fiat supply expansion cycles.",
      source: "CNBC",
      time: "1h ago",
      timestamp: Date.now() - 3600000,
      category: "Global Markets",
      sentiment: "Bullish",
      impact: "High",
      author: "Emily Chen"
    },
    {
      id: "news-5",
      title: "Ethereum Gas Fees Drop to Multi-Year Lows Amid Layer-2 Expansion",
      summary: "Blobs and rollups have successfully offset layer-one block congestion, reducing transactional friction significantly.",
      content: "GENEVA — Network gas fees on the Ethereum mainnet reached a historic low of 2 Gwei. The successful implementation of recent protocol upgrades has diverted transactional throughput onto Layer-2 scaling networks, optimizing ecosystem utility at lower operating costs.",
      source: "REUTERS",
      time: "3h ago",
      timestamp: Date.now() - 10800000,
      category: "Ethereum",
      sentiment: "Bullish",
      impact: "Low",
      author: "Nikita Smirnov"
    }
  ]);

  const categories = [
    'All', 'Bitcoin', 'Ethereum', 'Altcoins', 'ETFs', 'Regulation', 'Macro Economics', 'Global Markets'
  ];

  // Helper to trigger visual toast alert
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  // Load saved bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dailyfi_saved_news');
    if (saved) {
      setSavedIds(JSON.parse(saved));
    }
  }, []);

  // Update timestamps and relative time tags
  const getRelativeTime = (timestamp: number) => {
    const min = Math.floor((Date.now() - timestamp) / 60000);
    if (min < 1) return 'Just now';
    if (min < 60) return `${min}m ago`;
    const hours = Math.floor(min / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // Load TradingView News Widget dynamically
  useEffect(() => {
    if (!tvContainerRef.current) return;
    
    // Clear previous elements
    tvContainerRef.current.innerHTML = '';
    
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "feedMode": "all_symbols",
      "colorTheme": "dark",
      "isTransparent": true,
      "displayMode": "regular",
      "width": "100%",
      "height": "650",
      "locale": "en"
    });
    
    tvContainerRef.current.appendChild(script);
  }, []);

  // 60-Second Auto-Update Tick Loop: Injects new mock articles dynamically
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(prev => {
        if (prev <= 1) {
          // Select a random article from pool
          const randomBase = headlinePool[Math.floor(Math.random() * headlinePool.length)];
          const newArticle: MockNewsItem = {
            ...randomBase,
            id: `news-${Date.now()}`,
            timestamp: Date.now(),
            time: 'Just now'
          };
          
          setNews(prevList => {
            // Check if article with same title already exists to avoid duplicates
            if (prevList.some(item => item.title === newArticle.title)) {
              return prevList;
            }
            // Add new article at the top, limit to 20 items
            const updatedList = [newArticle, ...prevList].slice(0, 20);
            return updatedList.map(item => ({
              ...item,
              time: getRelativeTime(item.timestamp)
            }));
          });
          
          showToast(`⚡ INTELLIGENCE INJECTED: ${newArticle.source}`);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [news]);

  // Periodic update of time strings every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setNews(prevList => prevList.map(item => ({
        ...item,
        time: getRelativeTime(item.timestamp)
      })));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter & Search Logic
  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [news, activeCategory, searchQuery]);

  const toggleSave = (e: React.MouseEvent, item: MockNewsItem) => {
    e.stopPropagation();
    const isSaved = savedIds.includes(item.id);
    const newSaved = isSaved 
      ? savedIds.filter(id => id !== item.id) 
      : [...savedIds, item.id];
    
    setSavedIds(newSaved);
    localStorage.setItem('dailyfi_saved_news', JSON.stringify(newSaved));
    showToast(isSaved ? 'Removed from Bookmarks' : 'Saved to Bookmarks');
  };

  const handleShare = (e: React.MouseEvent, item: MockNewsItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/news/${item.id}`);
    showToast('Share link copied to clipboard!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Toast Alert Banner */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2 px-6 py-3 rounded-xl bg-gold/10 border border-gold/30 text-gold font-bold shadow-[0_0_20px_rgba(255,215,0,0.2)] backdrop-blur-md transition-all duration-300 ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <Zap size={16} className="text-gold animate-bounce" /> {toastMessage}
      </div>
      
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Newspaper size={14} className="text-gold" />
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">DailyFi Matrix Stream</span>
          </div>
          <h1 className="text-4xl font-heading font-black text-white tracking-tight uppercase">Market Intelligence</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Real-time professional news feeds and aggregate economic analysis.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Ticker tracker */}
          <div className="glass-card-laser px-4 py-2 border-cyan/15 bg-cyan/5 rounded-xl text-right">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Next Feed Refresh</span>
            <span className="text-sm font-mono font-black text-cyan tracking-wider">{tick}s</span>
          </div>
          
          <div className="relative w-full lg:w-[320px] group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-gold transition-colors">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Filter headlines..." 
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

      {/* Main Aggregator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Column 1 & 2: TradingView Timeline Widget (Preferred live feed) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-cyan rounded" />
              <h2 className="text-lg font-heading font-black text-white uppercase tracking-tight">TradingView Live Feed</h2>
            </div>
            <span className="text-[10px] font-black text-gray-500 tracking-wider">SECURED TELEMETRY</span>
          </div>
          
          <div className="glass-card-laser bg-black/60 border-white/5 p-4 rounded-2xl h-[650px] relative overflow-hidden">
            <div className="tradingview-widget-container w-full h-full" ref={tvContainerRef}>
              <div className="tradingview-widget-container__widget h-full"></div>
            </div>
          </div>
        </div>

        {/* Column 3: Live Terminal Alerts Matrix (Mock update fallback) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-gold rounded" />
              <h2 className="text-lg font-heading font-black text-white uppercase tracking-tight">Terminal Matrix</h2>
            </div>
            <span className="text-[10px] font-black text-gold/70 tracking-wider animate-pulse">LIVE UPDATE</span>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[650px] pr-2 custom-scrollbar">
            {filteredNews.length > 0 ? (
              filteredNews.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedItem(item)}
                  className="glass-card p-5 border border-white/5 hover:border-gold/20 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black text-gold uppercase tracking-widest">{item.source}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                        <Clock size={12} />
                        {item.time}
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-heading font-black text-white group-hover:text-gold transition-colors leading-snug mb-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-gray-400 text-[11px] leading-relaxed line-clamp-2">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                        item.sentiment === 'Bullish' 
                          ? 'bg-bullish/10 text-bullish border-bullish/20' 
                          : 'bg-bearish/10 text-bearish border-bearish/20'
                      }`}>
                        {item.sentiment}
                      </span>
                      <span className="text-[9px] text-gray-500 font-medium">{item.category}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => toggleSave(e, item)}
                        className={`p-1.5 rounded-lg transition-colors ${savedIds.includes(item.id) ? 'bg-gold/10 text-gold' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                      >
                        <Bookmark size={14} fill={savedIds.includes(item.id) ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={(e) => handleShare(e, item)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Share2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="glass-card p-12 border border-white/5 text-center text-gray-500 text-xs">
                No matching headlines found in terminal matrix.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide-over Detailed Report Panel */}
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
                    <span className="text-[10px] font-black text-cyan bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded">INTEL LOG</span>
                    <span className="text-[10px] font-black text-gold uppercase tracking-widest">{selectedItem.source}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-500 hover:text-white transition-colors text-xs font-black"
                  >
                    CLOSE [X]
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <Clock size={12} />
                    <span>{selectedItem.time}</span>
                    <span>•</span>
                    <span>By {selectedItem.author}</span>
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
                      IMPACT: {selectedItem.impact}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-300">
                      CATEGORY: {selectedItem.category.toUpperCase()}
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
                  Research original <ExternalLink size={14} />
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
