import React, { useEffect, useState } from 'react';
import { X, Briefcase, Newspaper, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SpotMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SpotMarketModal: React.FC<SpotMarketModalProps> = ({ isOpen, onClose }) => {
  const [animationClass, setAnimationClass] = useState('opacity-0 scale-95');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimationClass('opacity-100 scale-100'), 10);
    } else {
      setAnimationClass('opacity-0 scale-95');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const volumeData = [
    { date: 'Apr 24', volume: 62.4 },
    { date: 'Apr 25', volume: 68.1 },
    { date: 'Apr 26', volume: 74.2 },
    { date: 'Apr 27', volume: 81.5 },
    { date: 'Apr 28', volume: 78.9 },
    { date: 'Apr 29', volume: 82.3 },
    { date: 'Apr 30', volume: 84.0 },
  ];

  const newsItems = [
    { source: 'CoinDesk', time: '2 hours ago', title: 'Global spot trading volume surges 12.5% driven by institutional inflows into major altcoins.' },
    { source: 'Bloomberg', time: '5 hours ago', title: 'Major exchanges report highest daily active trader count since Q4 2023.' },
    { source: 'Reuters', time: '12 hours ago', title: 'Regulatory clarity in Asia prompts a 5% increase in regional spot market liquidity.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className={"absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 " + (isOpen ? 'opacity-100' : 'opacity-0')} 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className={"relative w-full max-w-5xl bg-dark-bg/95 backdrop-blur-2xl border border-indigo-500/20 rounded-3xl shadow-[0_0_50px_rgba(99,102,241,0.05)] overflow-hidden transition-all duration-300 transform max-h-[90vh] flex flex-col " + animationClass}>
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-indigo-500 via-purple-500 to-transparent opacity-50"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-white">Spot Market Overview</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-medium text-gray-400">Global Trading Liquidity</span>
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">LIVE</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors relative z-10">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Top Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-5 border border-indigo-500/10 bg-gradient-to-br from-indigo-500/5 to-transparent">
              <span className="text-sm font-medium text-gray-400 mb-2 block">24h Global Volume</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-mono font-bold text-white">$84.0B</span>
                <span className="text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">+12.5%</span>
              </div>
            </div>
            <div className="glass-card p-5 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block">Total Market Cap</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-mono font-bold text-white">$2.42T</span>
                <span className="text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">+3.2%</span>
              </div>
            </div>
            <div className="glass-card p-5 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block">Active Traders (24h)</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-mono font-bold text-white">4.2M</span>
                <span className="text-xs font-bold px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">+5.1%</span>
              </div>
            </div>
            <div className="glass-card p-5 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block">Bitcoin Dominance</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-mono font-bold text-white">54.2%</span>
                <span className="text-xs font-bold px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">-0.2%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Chart Section */}
            <div className="lg:col-span-2 glass-card p-6 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-heading font-bold text-white">Spot Volume Trend (7D)</h3>
                <span className="text-sm text-gray-400 font-mono">in Billions USD</span>
              </div>
              <div className="flex-1 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeData}>
                    <defs>
                      <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} tickFormatter={(val) => "$" + val + "B"} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', borderRadius: '8px' }}
                      itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                      formatter={(val: any) => ["$" + val + "B", 'Volume']}
                    />
                    <Area type="monotone" dataKey="volume" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Market Insights & News */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              <div className="glass-card p-6 flex-1 bg-gradient-to-br from-white/5 to-transparent border border-white/5">
                <h3 className="text-lg font-heading font-bold text-white mb-6 flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-indigo-400" /> Market Insights
                </h3>
                
                <div className="space-y-5">
                  {newsItems.map((news, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <div className="flex items-center gap-2 text-xs mb-1">
                        <span className="font-bold text-gray-400">{news.source}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500">{news.time}</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-snug group-hover:text-indigo-300 transition-colors">
                        {news.title}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs font-bold">
                        <span className="text-gray-500 group-hover:text-white transition-colors flex items-center gap-1">
                          Read full article <ArrowUpRight size={12} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SpotMarketModal;
