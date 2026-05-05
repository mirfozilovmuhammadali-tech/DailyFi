import React, { useEffect, useState } from 'react';
import { X, Info, Layers, ActivitySquare } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface FundingRatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FundingRatesModal: React.FC<FundingRatesModalProps> = ({ isOpen, onClose }) => {
  const [animationClass, setAnimationClass] = useState('opacity-0 scale-95');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimationClass('opacity-100 scale-100'), 10);
    } else {
      setAnimationClass('opacity-0 scale-95');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Average Funding Rates for Chart
  const chartData = [
    { coin: 'BTC', rate: 0.0100 },
    { coin: 'ETH', rate: 0.0125 },
    { coin: 'SOL', rate: 0.0350 },
    { coin: 'BNB', rate: 0.0085 },
    { coin: 'XRP', rate: -0.0050 },
    { coin: 'DOGE', rate: 0.0450 },
    { coin: 'ADA', rate: -0.0120 },
    { coin: 'AVAX', rate: 0.0210 },
  ];

  // Heatmap Data
  const heatmapData = [
    { coin: 'BTC', name: 'Bitcoin', binance: 0.0100, bybit: 0.0095, okx: 0.0110, bitget: 0.0098, avg: 0.0100 },
    { coin: 'ETH', name: 'Ethereum', binance: 0.0125, bybit: 0.0110, okx: 0.0130, bitget: 0.0120, avg: 0.0121 },
    { coin: 'SOL', name: 'Solana', binance: 0.0350, bybit: 0.0320, okx: 0.0380, bitget: 0.0340, avg: 0.0347 },
    { coin: 'BNB', name: 'BNB', binance: 0.0085, bybit: 0.0080, okx: 0.0090, bitget: 0.0088, avg: 0.0085 },
    { coin: 'XRP', name: 'Ripple', binance: -0.0050, bybit: -0.0040, okx: -0.0060, bitget: -0.0045, avg: -0.0048 },
    { coin: 'DOGE', name: 'Dogecoin', binance: 0.0450, bybit: 0.0420, okx: 0.0480, bitget: 0.0460, avg: 0.0452 },
    { coin: 'ADA', name: 'Cardano', binance: -0.0120, bybit: -0.0100, okx: -0.0140, bitget: -0.0110, avg: -0.0117 },
    { coin: 'AVAX', name: 'Avalanche', binance: 0.0210, bybit: 0.0200, okx: 0.0230, bitget: 0.0215, avg: 0.0213 },
    { coin: 'LINK', name: 'Chainlink', binance: 0.0150, bybit: 0.0140, okx: 0.0160, bitget: 0.0145, avg: 0.0148 },
    { coin: 'DOT', name: 'Polkadot', binance: -0.0080, bybit: -0.0070, okx: -0.0090, bitget: -0.0085, avg: -0.0081 },
  ];

  // Helper to format rate and get color classes
  const formatRate = (rate: number) => {
    const isPositive = rate > 0;
    const isNegative = rate < 0;
    const formatted = rate.toFixed(4) + '%';
    
    // Heatmap intensity logic
    let bgColor = 'bg-white/5';
    let textColor = 'text-gray-400';
    
    if (isPositive) {
      if (rate > 0.03) { bgColor = 'bg-green-500/30'; textColor = 'text-green-300'; }
      else if (rate > 0.01) { bgColor = 'bg-green-500/20'; textColor = 'text-green-400'; }
      else { bgColor = 'bg-green-500/10'; textColor = 'text-green-500'; }
    } else if (isNegative) {
      if (rate < -0.01) { bgColor = 'bg-red-500/30'; textColor = 'text-red-300'; }
      else { bgColor = 'bg-red-500/10'; textColor = 'text-red-400'; }
    }

    return (
      <div className={"px-2 py-1.5 rounded text-center font-mono text-xs font-bold w-full " + bgColor + " " + textColor}>
        {isPositive ? '+' : ''}{formatted}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className={"absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 " + (isOpen ? 'opacity-100' : 'opacity-0')} 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className={"relative w-full max-w-6xl bg-dark-bg/95 backdrop-blur-2xl border border-rose-500/20 rounded-3xl shadow-[0_0_80px_rgba(244,63,94,0.15)] overflow-hidden transition-all duration-300 transform max-h-[90vh] flex flex-col " + animationClass}>
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-rose-500 via-orange-500 to-transparent opacity-50"></div>
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <ActivitySquare className="w-7 h-7 text-rose-400" />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Perpetual Funding Rates</h2>
              <div className="flex items-center gap-4 mt-1.5">
                <span className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-rose-400">
                  <Layers size={14} /> Derivatives Market
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span className="text-sm font-medium text-gray-400">Global Heatmap across Major Exchanges (8H)</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors relative z-10 bg-white/5 border border-white/10">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Top Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6 border shadow-xl bg-gradient-to-br from-rose-500/10 to-transparent border-rose-500/20">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                 Market Sentiment
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-heading font-black text-rose-400 drop-shadow-md">BULLISH</span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                Avg BTC Rate
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-green-400">+0.0100%</span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                 Highest Rate
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white flex flex-col items-start gap-1">
                  <span className="text-sm text-gray-500">DOGE</span>
                  +0.0450%
                </span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                Lowest Rate
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white flex flex-col items-start gap-1">
                  <span className="text-sm text-gray-500">ADA</span>
                  -0.0120%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column: Heatmap Table */}
            <div className="xl:col-span-2 flex flex-col gap-8">
              <div className="glass-card p-0 overflow-hidden border border-white/5 flex-1 flex flex-col">
                <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
                  <h3 className="text-lg font-heading font-bold text-white">Global Heatmap (8H Rates)</h3>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/20 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-white/5">
                        <th className="px-5 py-4">Asset</th>
                        <th className="px-5 py-4 text-center">Average</th>
                        <th className="px-5 py-4 text-center">Binance</th>
                        <th className="px-5 py-4 text-center">Bybit</th>
                        <th className="px-5 py-4 text-center">OKX</th>
                        <th className="px-5 py-4 text-center">Bitget</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-white/5">
                      {heatmapData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                          <td className="px-5 py-3 font-bold text-gray-300 group-hover:text-white transition-colors flex items-center gap-3">
                            <span className="w-8">{row.coin}</span>
                            <span className="text-xs text-gray-500 font-normal hidden sm:inline">{row.name}</span>
                          </td>
                          <td className="px-2 py-3 border-r border-white/5 bg-white/5">
                            {formatRate(row.avg)}
                          </td>
                          <td className="px-2 py-3">
                            {formatRate(row.binance)}
                          </td>
                          <td className="px-2 py-3">
                            {formatRate(row.bybit)}
                          </td>
                          <td className="px-2 py-3">
                            {formatRate(row.okx)}
                          </td>
                          <td className="px-2 py-3">
                            {formatRate(row.bitget)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Chart & Info */}
            <div className="xl:col-span-1 flex flex-col gap-8">
              
              <div className="glass-card p-6 flex flex-col h-[300px] border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="text-lg font-heading font-bold text-white">Average Funding Rates</h3>
                </div>
                <div className="flex-1 -ml-4 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }} barCategoryGap="15%">
                      <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" />
                      <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} tickFormatter={(val) => val + '%'} />
                      <YAxis type="category" dataKey="coin" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 11, fontWeight: 'bold' }} width={40} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                        contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                        formatter={(val: any) => [Number(val).toFixed(4) + '%', 'Rate']}
                      />
                      <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={"cell-" + index} fill={entry.rate >= 0 ? '#10b981' : '#f43f5e'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full"></div>
                <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Info size={16} /> Understanding Funding
                </h4>
                
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Mechanism</h5>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Funding rates are periodic payments made to short or long traders to keep perpetual contract prices aligned with spot prices.
                </p>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                    <div>
                      <strong className="text-white block mb-1">Positive Rates (Longs pay Shorts)</strong>
                      <span className="text-gray-400 text-xs">Indicates bullish sentiment. The perpetual price is higher than the spot price. High positive rates can precede a long squeeze.</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                    <div>
                      <strong className="text-white block mb-1">Negative Rates (Shorts pay Longs)</strong>
                      <span className="text-gray-400 text-xs">Indicates bearish sentiment. The perpetual price is lower than the spot price. High negative rates can precede a short squeeze.</span>
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

export default FundingRatesModal;
