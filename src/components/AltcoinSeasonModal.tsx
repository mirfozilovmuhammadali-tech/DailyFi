import React, { useEffect, useState } from 'react';
import { X, Sparkles, Info, CalendarDays, ArrowRight, TrendingUp, BarChart2, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

interface AltcoinSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AltcoinSeasonModal: React.FC<AltcoinSeasonModalProps> = ({ isOpen, onClose }) => {
  const [animationClass, setAnimationClass] = useState('opacity-0 scale-95');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimationClass('opacity-100 scale-100'), 10);
    } else {
      setAnimationClass('opacity-0 scale-95');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentValue = 42;
  
  // Gauge Data
  const gaugeData = [
    { name: 'Bitcoin Season', value: 25, color: '#f59e0b' },
    { name: 'Leaning BTC', value: 25, color: '#fbbf24' },
    { name: 'Leaning Alts', value: 25, color: '#22d3ee' },
    { name: 'Altcoin Season', value: 25, color: '#06b6d4' },
  ];

  // History Line Chart Data
  const historyData = [
    { date: 'Jan', index: 32 },
    { date: 'Feb', index: 45 },
    { date: 'Mar', index: 68 },
    { date: 'Apr', index: 82 },
    { date: 'May', index: 75 },
    { date: 'Jun', index: 54 },
    { date: 'Jul', index: 42 },
  ];

  // Top Performers Table
  const performersData = [
    { coin: 'SOL', name: 'Solana', return: '+142%', status: 'Outperformed' },
    { coin: 'TON', name: 'Toncoin', return: '+98%', status: 'Outperformed' },
    { coin: 'PEPE', name: 'Pepe', return: '+85%', status: 'Outperformed' },
    { coin: 'BTC', name: 'Bitcoin', return: '+45%', status: 'Benchmark' },
    { coin: 'ETH', name: 'Ethereum', return: '+38%', status: 'Underperformed' },
    { coin: 'ADA', name: 'Cardano', return: '-12%', status: 'Underperformed' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className={"absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 " + (isOpen ? 'opacity-100' : 'opacity-0')} 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className={"relative w-full max-w-6xl bg-dark-bg/95 backdrop-blur-2xl border border-cyan-500/20 rounded-3xl shadow-[0_0_80px_rgba(6,182,212,0.1)] overflow-hidden transition-all duration-300 transform max-h-[90vh] flex flex-col " + animationClass}>
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-cyan-400 via-blue-500 to-transparent opacity-50"></div>
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Altcoin Season Index</h2>
              <div className="flex items-center gap-4 mt-1.5">
                <span className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-cyan-400">
                  <BarChart2 size={14} /> Market Rotation
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span className="text-sm font-medium text-gray-400">90-Day Top 50 Performance Benchmark</span>
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
            <div className="glass-card p-6 border shadow-xl bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider">Current Season</span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-heading font-black text-yellow-500 drop-shadow-md">BITCOIN</span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={14}/> Index Score
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white">{currentValue} / 100</span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                <Activity size={14}/> Top 50 Alts
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-cyan-400">18 <span className="text-lg text-gray-500">outperforming</span></span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                <CalendarDays size={14}/> Threshold
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white">75+</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Charts */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Gauge Chart */}
                <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden h-[320px] border border-cyan-500/10">
                  <div className="absolute top-4 left-4 flex items-center gap-2 text-sm text-gray-400">
                    <CalendarDays size={16} /> 90-Day Perf
                  </div>
                  
                  <div className="w-full h-[220px] mt-8 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={gaugeData}
                          cx="50%"
                          cy="100%"
                          startAngle={180}
                          endAngle={0}
                          innerRadius={90}
                          outerRadius={120}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {gaugeData.map((entry, index) => (
                            <Cell key={"cell-" + index} fill={entry.color} opacity={0.9} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center w-full">
                      <span className="text-7xl font-heading font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{currentValue}</span>
                      <span className="text-lg font-bold text-yellow-500 uppercase tracking-widest mt-1 bg-black/40 px-4 py-1 rounded-full border border-yellow-500/30 backdrop-blur-md">Bitcoin Season</span>
                    </div>
                  </div>
                </div>

                {/* Line Chart */}
                <div className="glass-card p-6 flex flex-col h-[320px] border border-white/5 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-lg font-heading font-bold text-white">Historical Index</h3>
                  </div>
                  <div className="flex-1 -ml-4 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData}>
                        <ReferenceLine y={75} stroke="#06b6d4" strokeDasharray="3 3" label={{ position: 'top', value: 'Alt Season', fill: '#06b6d4', fontSize: 10 }} />
                        <ReferenceLine y={25} stroke="#f59e0b" strokeDasharray="3 3" label={{ position: 'bottom', value: 'BTC Season', fill: '#f59e0b', fontSize: 10 }} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                        <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                          itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
                        />
                        <Line type="monotone" dataKey="index" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="glass-card p-0 overflow-hidden border border-white/5 flex-1 flex flex-col">
                <div className="p-5 border-b border-white/5 bg-white/5 flex justify-between items-center">
                  <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Top Performers vs Bitcoin (90 Days)</h4>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/20 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-white/5">
                        <th className="px-5 py-3">Asset</th>
                        <th className="px-5 py-3">Name</th>
                        <th className="px-5 py-3 text-right">90D Return</th>
                        <th className="px-5 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-white/5">
                      {performersData.map((row, idx) => (
                        <tr key={idx} className={"hover:bg-white/5 transition-colors group " + (row.coin === 'BTC' ? 'bg-white/5 border-y border-yellow-500/20' : '')}>
                          <td className="px-5 py-4 font-bold text-gray-300 group-hover:text-white transition-colors">{row.coin}</td>
                          <td className="px-5 py-4 text-gray-400 group-hover:text-gray-300">{row.name}</td>
                          <td className={"px-5 py-4 text-right font-mono font-bold " + (row.return.includes('+') ? 'text-green-400' : 'text-red-400')}>{row.return}</td>
                          <td className="px-5 py-4 text-right">
                            <span className={"px-3 py-1 rounded text-xs font-bold border " + 
                              (row.status === 'Outperformed' ? 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20' : 
                               row.status === 'Benchmark' ? 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' : 
                               'text-gray-400 bg-white/5 border-white/10')
                            }>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Right Column: Info */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              
              <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full"></div>
                <h4 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Info size={16} /> Technical Analysis
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  If 75% of the Top 50 coins performed better than Bitcoin over the last season (90 days) it is Altcoin Season. Excluded from the Top 50 are Stablecoins and asset-backed tokens.
                </p>
                
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Market Cycle Implications</h5>
                <ul className="text-sm space-y-4 text-gray-400">
                  <li className="flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                    <ArrowRight size={16} className="text-yellow-500 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-white block mb-1">Bitcoin Season (Current)</strong>
                      Capital flows mostly into BTC, increasing its dominance. Lower risk appetite in the broader crypto market.
                    </div>
                  </li>
                  <li className="flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner opacity-50">
                    <ArrowRight size={16} className="text-cyan-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-white block mb-1">Altcoin Season</strong>
                      Capital rotates out of Bitcoin and distributes into higher-risk altcoins, causing massive, rapid price appreciation across the board.
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AltcoinSeasonModal;
