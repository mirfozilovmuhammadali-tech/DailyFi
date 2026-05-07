import React, { useEffect, useState } from 'react';
import { X, Activity, TrendingUp, Info, Radar } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

interface TechnicalAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  metricType: 'RSI' | 'MACD';
}

const TechnicalAnalysisModal: React.FC<TechnicalAnalysisModalProps> = ({ isOpen, onClose, metricType }) => {
  const [animationClass, setAnimationClass] = useState('opacity-0 scale-95');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimationClass('opacity-100 scale-100'), 10);
    } else {
      setAnimationClass('opacity-0 scale-95');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const rsiData = [
    { date: 'Apr 01', rsi: 42 },
    { date: 'Apr 02', rsi: 45 },
    { date: 'Apr 03', rsi: 41 },
    { date: 'Apr 04', rsi: 48 },
    { date: 'Apr 05', rsi: 55 },
    { date: 'Apr 08', rsi: 58 },
    { date: 'Apr 09', rsi: 54 },
    { date: 'Apr 10', rsi: 62 },
    { date: 'Apr 11', rsi: 71 },
    { date: 'Apr 12', rsi: 65 },
    { date: 'Apr 15', rsi: 68 },
    { date: 'Apr 16', rsi: 75 },
    { date: 'Apr 17', rsi: 82 },
    { date: 'Apr 18', rsi: 78 },
    { date: 'Apr 19', rsi: 70 },
    { date: 'Apr 22', rsi: 65 },
    { date: 'Apr 23', rsi: 58 },
    { date: 'Apr 24', rsi: 52 },
    { date: 'Apr 25', rsi: 58 },
    { date: 'Apr 26', rsi: 65 },
    { date: 'Apr 29', rsi: 68 },
    { date: 'Apr 30', rsi: 62.4 },
  ];

  const macdData = [
    { date: 'Apr 01', macd: -150, signal: -180, hist: 30 },
    { date: 'Apr 02', macd: -120, signal: -160, hist: 40 },
    { date: 'Apr 03', macd: -130, signal: -150, hist: 20 },
    { date: 'Apr 04', macd: -90, signal: -130, hist: 40 },
    { date: 'Apr 05', macd: -40, signal: -100, hist: 60 },
    { date: 'Apr 08', macd: -10, signal: -70, hist: 60 },
    { date: 'Apr 09', macd: -25, signal: -50, hist: 25 },
    { date: 'Apr 10', macd: 20, signal: -20, hist: 40 },
    { date: 'Apr 11', macd: 80, signal: 10, hist: 70 },
    { date: 'Apr 12', macd: 60, signal: 25, hist: 35 },
    { date: 'Apr 15', macd: 90, signal: 45, hist: 45 },
    { date: 'Apr 16', macd: 140, signal: 70, hist: 70 },
    { date: 'Apr 17', macd: 210, signal: 110, hist: 100 },
    { date: 'Apr 18', macd: 180, signal: 130, hist: 50 },
    { date: 'Apr 19', macd: 120, signal: 125, hist: -5 },
    { date: 'Apr 22', macd: 80, signal: 110, hist: -30 },
    { date: 'Apr 23', macd: 40, signal: 90, hist: -50 },
    { date: 'Apr 24', macd: -20, signal: 60, hist: -80 },
    { date: 'Apr 25', macd: -10, signal: 40, hist: -50 },
    { date: 'Apr 26', macd: 30, signal: 35, hist: -5 },
    { date: 'Apr 29', point: 70, macd: 80, signal: 50, hist: 30 },
    { date: 'Apr 30', point: 90, macd: 120, signal: 70, hist: 50 },
  ];

  const tableDataRsi = [
    { asset: 'BTC', name: 'Bitcoin', value: '62.4', signal: 'Neutral' },
    { asset: 'ETH', name: 'Ethereum', value: '54.2', signal: 'Neutral' },
    { asset: 'SOL', name: 'Solana', value: '78.5', signal: 'Overbought' },
    { asset: 'ADA', name: 'Cardano', value: '28.4', signal: 'Oversold' },
    { asset: 'AVAX', name: 'Avalanche', value: '82.1', signal: 'Overbought' },
  ];

  const tableDataMacd = [
    { asset: 'BTC', name: 'Bitcoin', value: 'Bull Cross', signal: 'Buy' },
    { asset: 'ETH', name: 'Ethereum', value: 'Converging', signal: 'Neutral' },
    { asset: 'SOL', name: 'Solana', value: 'Bear Cross', signal: 'Sell' },
    { asset: 'ADA', name: 'Cardano', value: 'Diverging', signal: 'Strong Sell' },
    { asset: 'AVAX', name: 'Avalanche', value: 'Bull Cross', signal: 'Buy' },
  ];

  const isRsi = metricType === 'RSI';
  const tableData = isRsi ? tableDataRsi : tableDataMacd;
  
  const color = isRsi ? '#22d3ee' : '#4ade80';
  const colorClass = isRsi ? 'text-cyan-400' : 'text-bullish glow-bullish';
  const bgClass = isRsi ? 'bg-cyan-400/20' : 'bg-green-400/20';
  const borderClass = isRsi ? 'border-cyan-400/30' : 'border-green-400/30';
  const gradientClass = isRsi ? 'from-cyan-400 via-blue-500' : 'from-green-400 via-emerald-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className={"absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 " + (isOpen ? 'opacity-100' : 'opacity-0')} 
        onClick={onClose}
      ></div>
      
      <div className={"relative w-full max-w-6xl bg-dark-bg/95 backdrop-blur-2xl border rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 transform max-h-[90vh] flex flex-col " + borderClass + " " + animationClass}>
        
        <div className={"absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l to-transparent opacity-50 " + gradientClass}></div>
        <div className={"absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none " + bgClass.replace('/20', '/10')}></div>

        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-5 relative z-10">
            <div className={"w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg " + bgClass + " " + borderClass}>
              {isRsi ? <Activity className={"w-7 h-7 " + colorClass} /> : <TrendingUp className={"w-7 h-7 " + colorClass} />}
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-white tracking-tight">{isRsi ? 'Relative Strength Index (RSI)' : 'MACD'}</h2>
              <div className="flex items-center gap-4 mt-1.5">
                <span className={"text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 " + colorClass}>
                  <Radar size={14} /> Global Oscillator
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span className="text-sm font-medium text-gray-400">{isRsi ? 'Momentum indicator tracking speed of price changes' : 'Trend-following momentum indicator'}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors relative z-10 bg-white/5 border border-white/10">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={"glass-card p-6 border shadow-xl bg-gradient-to-br to-transparent " + borderClass.replace('/30', '/20') + " " + bgClass.replace('/20', '/10')}>
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider">Current {isRsi ? 'RSI' : 'Signal'}</span>
              <div className="flex items-end justify-between">
                <span className={"text-4xl font-mono font-bold drop-shadow-md " + colorClass}>
                  {isRsi ? '62.4' : 'Bull Cross'}
                </span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider">Status</span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white">
                  {isRsi ? 'Neutral' : 'Buy'}
                </span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider">Timeframe</span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white">
                  Daily (1D)
                </span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider">Asset</span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white flex items-center gap-2">
                  <img src="https://assets.coingecko.com/coins/images/1/small/bitcoin.png" alt="BTC" className="w-6 h-6 rounded-full" /> BTC
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              <div className="glass-card p-6 flex flex-col h-[350px] border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="text-lg font-heading font-bold text-white">{isRsi ? 'RSI 14-Day Trajectory' : 'MACD (12, 26, 9) Histogram'}</h3>
                </div>
                
                <div className="flex-1 -ml-4 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    {isRsi ? (
                      <AreaChart data={rsiData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRsi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity={0.6}/>
                            <stop offset="50%" stopColor={color} stopOpacity={0.2}/>
                            <stop offset="100%" stopColor={color} stopOpacity={0}/>
                          </linearGradient>
                          <filter id="glowRsi" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'OVERBOUGHT', fill: '#ef4444', fontSize: 10 }} />
                        <ReferenceLine y={30} stroke="#22c55e" strokeDasharray="3 3" label={{ position: 'bottom', value: 'OVERSOLD', fill: '#22c55e', fontSize: 10 }} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} minTickGap={20} />
                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} width={30} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                          itemStyle={{ color: color, fontWeight: 'bold' }}
                        />
                        <Area type="monotoneX" dataKey="rsi" stroke={color} strokeWidth={3} fillOpacity={1} fill="url(#colorRsi)" filter="url(#glowRsi)" />
                      </AreaChart>
                    ) : (
                      <BarChart data={macdData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barCategoryGap="2%">
                        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} minTickGap={20} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} width={40} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                          contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                        />
                        <Bar dataKey="hist" radius={[2,2,2,2]}>
                          {macdData.map((entry, index) => {
                            // Darker red for negatives, bright green for positives
                            const histColor = entry.hist >= 0 ? '#10b981' : '#dc2626';
                            return <Cell key={"cell-" + index} fill={histColor} />;
                          })}
                        </Bar>
                        <Line type="monotoneX" dataKey="macd" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                        <Line type="monotoneX" dataKey="signal" stroke="#f43f5e" strokeWidth={2} dot={false} isAnimationActive={false} />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Data Table */}
              <div className="glass-card p-0 overflow-hidden border border-white/5 flex-1 flex flex-col">
                <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
                  <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Top Asset Signals (Daily)</h4>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/20 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-white/5">
                        <th className="px-5 py-3">Asset</th>
                        <th className="px-5 py-3 text-right">Value</th>
                        <th className="px-5 py-3 text-right">Signal</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-white/5">
                      {tableData.map((row, idx) => {
                        let signalColor = 'text-gray-400 bg-white/5 border-white/10';
                        if (row.signal === 'Overbought' || row.signal.includes('Sell')) signalColor = 'text-bearish glow-bearish bg-bearish/10 border-bearish/20';
                        if (row.signal === 'Oversold' || row.signal.includes('Buy')) signalColor = 'text-bullish glow-bullish bg-bullish/10 border-bullish/20';
                        
                        return (
                          <tr key={idx} className="hover:bg-white/5 transition-colors group">
                            <td className="px-5 py-4 font-bold text-gray-300 group-hover:text-white transition-colors">{row.asset} - {row.name}</td>
                            <td className="px-5 py-4 text-right font-mono text-gray-300">{row.value}</td>
                            <td className="px-5 py-4 text-right">
                              <span className={"px-3 py-1 rounded text-xs font-bold border " + signalColor}>
                                {row.signal}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div className="lg:col-span-1 flex flex-col gap-8">
              <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full"></div>
                <h4 className={"text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 " + colorClass}>
                  <Info size={16} /> Strategy Context
                </h4>
                
                {isRsi ? (
                  <>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                      RSI measures the speed and magnitude of recent price changes to evaluate overvalued or undervalued conditions.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                        <div>
                          <strong className="text-bearish glow-bearish text-sm block mb-1">Overbought (&gt; 70)</strong>
                          <span className="text-xs text-gray-400 leading-tight">
                            The asset has experienced rapid upward momentum and may be primed for a trend reversal or corrective pullback.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                        <div>
                          <strong className="text-bullish glow-bullish text-sm block mb-1">Oversold (&lt; 30)</strong>
                          <span className="text-xs text-gray-400 leading-tight">
                            The asset has experienced significant downward momentum and may be undervalued, presenting a buying opportunity.
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                      MACD is a trend-following momentum indicator that shows the relationship between two moving averages (typically 12-day and 26-day EMA).
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                        <div>
                          <strong className="text-bullish glow-bullish text-sm block mb-1">Bullish Crossover</strong>
                          <span className="text-xs text-gray-400 leading-tight">
                            Occurs when the MACD line crosses ABOVE the signal line. Indicates increasing upward momentum and generates a BUY signal.
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                        <div>
                          <strong className="text-bearish glow-bearish text-sm block mb-1">Bearish Crossover</strong>
                          <span className="text-xs text-gray-400 leading-tight">
                            Occurs when the MACD line crosses BELOW the signal line. Indicates increasing downward momentum and generates a SELL signal.
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TechnicalAnalysisModal;

