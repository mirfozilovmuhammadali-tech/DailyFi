import React, { useEffect, useState } from 'react';
import { X, PieChart, TrendingUp, Info, Activity, Database, DollarSign } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BtcDominanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BtcDominanceModal: React.FC<BtcDominanceModalProps> = ({ isOpen, onClose }) => {
  const [animationClass, setAnimationClass] = useState('opacity-0 scale-95');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimationClass('opacity-100 scale-100'), 10);
    } else {
      setAnimationClass('opacity-0 scale-95');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Trend Data
  const trendData = [
    { date: 'Jan', dominance: 51.2, altcoins: 38.5, stablecoins: 10.3 },
    { date: 'Feb', dominance: 52.5, altcoins: 37.0, stablecoins: 10.5 },
    { date: 'Mar', dominance: 53.8, altcoins: 36.1, stablecoins: 10.1 },
    { date: 'Apr', dominance: 53.1, altcoins: 37.5, stablecoins: 9.4 },
    { date: 'May', dominance: 54.2, altcoins: 36.8, stablecoins: 9.0 },
    { date: 'Jun', dominance: 54.5, altcoins: 36.5, stablecoins: 9.0 },
    { date: 'Jul', dominance: 54.2, altcoins: 37.0, stablecoins: 8.8 },
  ];

  // Market Share Snapshot
  const marketShareData = [
    { name: 'Bitcoin', share: 54.2, color: '#fbbf24' },
    { name: 'Ethereum', share: 16.8, color: '#627eea' },
    { name: 'Tether (USDT)', share: 4.5, color: '#22c55e' },
    { name: 'BNB', share: 3.8, color: '#facc15' },
    { name: 'Solana', share: 2.9, color: '#14f195' },
    { name: 'Others', share: 17.8, color: '#888888' },
  ];

  // Detailed Table
  const tableData = [
    { asset: 'BTC', name: 'Bitcoin', marketCap: '$1.28T', dominance: '54.2%', change: '+0.1%' },
    { asset: 'ETH', name: 'Ethereum', marketCap: '$395B', dominance: '16.8%', change: '-0.4%' },
    { asset: 'USDT', name: 'Tether', marketCap: '$110B', dominance: '4.5%', change: '+0.0%' },
    { asset: 'BNB', name: 'Binance Coin', marketCap: '$88B', dominance: '3.8%', change: '+0.2%' },
    { asset: 'SOL', name: 'Solana', marketCap: '$65B', dominance: '2.9%', change: '-0.1%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className={"absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 " + (isOpen ? 'opacity-100' : 'opacity-0')} 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className={"relative w-full max-w-6xl bg-dark-bg/95 backdrop-blur-2xl border border-gold/20 rounded-3xl shadow-[0_0_80px_rgba(255,215,0,0.1)] overflow-hidden transition-all duration-300 transform max-h-[90vh] flex flex-col " + animationClass}>
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-gold via-yellow-500 to-transparent opacity-50"></div>
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.3)]">
              <PieChart className="w-7 h-7 text-gold" />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-white tracking-tight">BTC Dominance Index</h2>
              <div className="flex items-center gap-4 mt-1.5">
                <span className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-gold">
                  <Activity size={14} /> Global Market Share
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span className="text-sm font-medium text-gray-400">Tracks Bitcoin's weight in the total crypto economy</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors relative z-10 bg-white/5 border border-white/10">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6 border shadow-xl bg-gradient-to-br from-gold/10 to-transparent border-gold/20">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider">BTC Dominance</span>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-mono font-bold text-gold drop-shadow-md">54.2%</span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                <Database size={14}/> Total Crypto Cap
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white">$2.42T</span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                <DollarSign size={14}/> Altcoin Cap (ex-BTC)
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white">$1.14T</span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={14}/> 30-Day Trend
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-bullish glow-bullish">+1.2%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Primary Area Chart */}
              <div className="glass-card p-6 flex flex-col h-[350px] border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="text-lg font-heading font-bold text-white">Dominance Trajectory (YTD)</h3>
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 text-gold"><span className="w-2 h-2 rounded-full bg-gold shadow-[0_0_8px_#fbbf24]"></span> BTC</span>
                    <span className="flex items-center gap-1.5 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]"></span> ALTS</span>
                  </div>
                </div>
                <div className="flex-1 -ml-4 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorDom" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.6}/>
                          <stop offset="50%" stopColor="#fbbf24" stopOpacity={0.2}/>
                          <stop offset="100%" stopColor="#fbbf24" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAlts" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.4}/>
                          <stop offset="100%" stopColor="#60a5fa" stopOpacity={0}/>
                        </linearGradient>
                        <filter id="glowDom" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} tickFormatter={(val) => val + "%"} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                      />
                      <Area type="monotoneX" dataKey="dominance" stackId="1" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorDom)" filter="url(#glowDom)" />
                      <Area type="monotoneX" dataKey="altcoins" stackId="1" stroke="#60a5fa" strokeWidth={2} fillOpacity={1} fill="url(#colorAlts)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Data Table */}
              <div className="glass-card p-0 overflow-hidden border border-white/5 flex-1 flex flex-col">
                <div className="p-5 border-b border-white/5 bg-white/5">
                  <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Top Global Market Shares</h4>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/20 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-white/5">
                        <th className="px-5 py-3">Asset</th>
                        <th className="px-5 py-3">Name</th>
                        <th className="px-5 py-3 text-right">Market Cap</th>
                        <th className="px-5 py-3 text-right">Dominance</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-white/5">
                      {tableData.map((row, idx) => (
                        <tr key={idx} className={"hover:bg-white/5 transition-colors group " + (row.asset === 'BTC' ? 'bg-white/5 border-y border-gold/20' : '')}>
                          <td className="px-5 py-4 font-bold text-gray-300 group-hover:text-white transition-colors">{row.asset}</td>
                          <td className="px-5 py-4 text-gray-400 group-hover:text-gray-300">{row.name}</td>
                          <td className="px-5 py-4 text-right font-mono text-gray-300">{row.marketCap}</td>
                          <td className="px-5 py-4 text-right">
                            <span className={"px-3 py-1 rounded text-xs font-bold border " + 
                              (row.asset === 'BTC' ? 'text-gold bg-gold/10 border-gold/20' : 'text-gray-300 bg-white/5 border-white/10')
                            }>
                              {row.dominance}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div className="lg:col-span-1 flex flex-col gap-8">
              
              {/* Secondary Bar Chart */}
              <div className="glass-card p-6 flex flex-col h-[300px] border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="text-lg font-heading font-bold text-white">Current Distribution</h3>
                </div>
                <div className="flex-1 -ml-4 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={marketShareData} margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 11 }} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                        contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                        formatter={(val: any) => [val + "%", 'Share']}
                      />
                      <Bar dataKey="share" radius={[0,4,4,0]} barSize={24}>
                        {marketShareData.map((entry, index) => (
                          <Cell key={"cell-" + index} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex flex-col justify-center flex-1">
                <h4 className="text-sm font-bold text-gold uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Info size={16} /> Market Context
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Bitcoin Dominance represents the ratio of Bitcoin's market capitalization to the total cryptocurrency market cap. It serves as a primary macro indicator for crypto market cycles.
                </p>
                <div className="space-y-4 mt-2">
                  <div className="flex items-start gap-4 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                    <TrendingUp className="text-gold w-6 h-6 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white text-sm block mb-1">Rising Dominance</strong>
                      <p className="text-xs text-gray-400 leading-tight">
                        Capital is flowing out of altcoins and into the relative safety of Bitcoin. Often associated with bear markets or early bull market phases.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BtcDominanceModal;

