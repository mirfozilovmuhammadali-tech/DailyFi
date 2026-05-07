import React, { useEffect, useState } from 'react';
import { X, Info, Activity, BarChart2, CalendarDays, TrendingUp, DollarSign } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface StandardMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  value: string;
  change: string;
  description: string;
  colorTheme: 'gold' | 'cyan' | 'green' | 'blue' | 'purple' | 'yellow';
}

const StandardMetricModal: React.FC<StandardMetricModalProps> = ({ 
  isOpen, onClose, title, value, change, description, colorTheme 
}) => {
  const [animationClass, setAnimationClass] = useState('opacity-0 scale-95');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimationClass('opacity-100 scale-100'), 10);
    } else {
      setAnimationClass('opacity-0 scale-95');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Rich daily data for multiple charts - high density
  const historyData = [
    { date: 'Apr 01', value: 12000, growth: 120 },
    { date: 'Apr 02', value: 12350, growth: 350 },
    { date: 'Apr 03', value: 12400, growth: 50 },
    { date: 'Apr 04', value: 12150, growth: -250 },
    { date: 'Apr 05', value: 12600, growth: 450 },
    { date: 'Apr 08', value: 12950, growth: 350 },
    { date: 'Apr 09', value: 12850, growth: -100 },
    { date: 'Apr 10', value: 13400, growth: 550 },
    { date: 'Apr 11', value: 13600, growth: 200 },
    { date: 'Apr 12', value: 13100, growth: -500 },
    { date: 'Apr 15', value: 13300, growth: 200 },
    { date: 'Apr 16', value: 14200, growth: 900 },
    { date: 'Apr 17', value: 14800, growth: 600 },
    { date: 'Apr 18', value: 14720, growth: -80 },
    { date: 'Apr 19', value: 15200, growth: 480 },
    { date: 'Apr 22', value: 15450, growth: 250 },
    { date: 'Apr 23', value: 15100, growth: -350 },
    { date: 'Apr 24', value: 15600, growth: 500 },
    { date: 'Apr 25', value: 15900, growth: 300 },
    { date: 'Apr 26', value: 15850, growth: -50 },
    { date: 'Apr 29', value: 16300, growth: 450 },
    { date: 'Apr 30', value: 16800, growth: 500 },
  ];

  // Table Data based on title
  const getTableData = () => {
    if (title.includes('Treasuries')) {
      return [
        { entity: 'MicroStrategy', amount: '214,246', value: '$13.5B', share: '1.02%' },
        { entity: 'Marathon Digital', amount: '16,930', value: '$1.06B', share: '0.08%' },
        { entity: 'Tesla, Inc.', amount: '9,720', value: '$612M', share: '0.04%' },
        { entity: 'Coinbase Global', amount: '9,480', value: '$597M', share: '0.04%' },
        { entity: 'Block, Inc.', amount: '8,027', value: '$505M', share: '0.03%' },
      ];
    }
    return [
      { entity: 'Bitcoin', amount: '1', value: '$63,240', share: '54.2%' },
      { entity: 'Ethereum', amount: '2', value: '$3,150', share: '16.8%' },
      { entity: 'Tether', amount: '3', value: '$1.00', share: '4.5%' },
      { entity: 'BNB', amount: '4', value: '$580', share: '3.8%' },
      { entity: 'Solana', amount: '5', value: '$145', share: '2.9%' },
    ];
  };

  const tableData = getTableData();

  const getThemeColors = () => {
    switch(colorTheme) {
      case 'gold': return { text: 'text-gold', bg: 'bg-gold/20', border: 'border-gold/30', hex: '#fbbf24', gradient: 'from-gold via-yellow-500' };
      case 'cyan': return { text: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/30', hex: '#22d3ee', gradient: 'from-cyan-400 via-blue-500' };
      case 'green': return { text: 'text-bullish glow-bullish', bg: 'bg-green-400/20', border: 'border-green-400/30', hex: '#4ade80', gradient: 'from-green-400 via-emerald-500' };
      case 'blue': return { text: 'text-blue-400', bg: 'bg-blue-400/20', border: 'border-blue-400/30', hex: '#60a5fa', gradient: 'from-blue-400 via-indigo-500' };
      case 'purple': return { text: 'text-purple-400', bg: 'bg-purple-400/20', border: 'border-purple-400/30', hex: '#c084fc', gradient: 'from-purple-400 via-fuchsia-500' };
      case 'yellow': return { text: 'text-yellow-400', bg: 'bg-yellow-400/20', border: 'border-yellow-400/30', hex: '#facc15', gradient: 'from-yellow-400 via-orange-500' };
      default: return { text: 'text-white', bg: 'bg-white/20', border: 'border-white/30', hex: '#ffffff', gradient: 'from-gray-400 via-gray-600' };
    }
  };

  const theme = getThemeColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div 
        className={"absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 " + (isOpen ? 'opacity-100' : 'opacity-0')} 
        onClick={onClose}
      ></div>
      
      <div className={"relative w-full max-w-6xl bg-dark-bg/95 backdrop-blur-2xl border rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300 transform max-h-[90vh] flex flex-col border-white/10 " + animationClass}>
        
        <div className={"absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l opacity-50 to-transparent " + theme.gradient}></div>
        <div className={"absolute top-0 left-1/4 w-[800px] h-[500px] rounded-full blur-[120px] pointer-events-none " + theme.bg.replace('/20', '/5')}></div>

        {/* Rich Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-5 relative z-10">
            <div className={"w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg " + theme.bg + " " + theme.border}>
              <BarChart2 className={"w-7 h-7 " + theme.text} />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-white tracking-tight">{title}</h2>
              <div className="flex items-center gap-4 mt-1.5">
                <span className={"text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 " + theme.text}>
                  <Activity size={14} /> Global Metric
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span className="text-sm font-medium text-gray-400">{description.substring(0, 50)}...</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors relative z-10 bg-white/5 border border-white/10">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={"glass-card p-6 border shadow-xl bg-gradient-to-br to-transparent " + theme.border.replace('/30', '/20') + " " + theme.bg.replace('/20', '/10')}>
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider">Current Value</span>
              <div className="flex items-end justify-between">
                <span className={"text-4xl font-mono font-bold drop-shadow-md " + theme.text}>{value}</span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={14}/> Recent Change
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white">{change}</span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                <CalendarDays size={14}/> 30-Day Trend
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-bullish glow-bullish">+4.2%</span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                <DollarSign size={14}/> Est. Market Value
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white">$142B</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Charts Column */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Primary Area Chart */}
              <div className="glass-card p-6 flex flex-col h-[350px] border border-white/5 relative overflow-hidden">
                <div className={"absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] " + theme.bg.replace('/20', '/10')}></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="text-lg font-heading font-bold text-white">Historical Valuation Trend</h3>
                  <span className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full text-gray-300 border border-white/10">Daily (30D)</span>
                </div>
                <div className="flex-1 -ml-4 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={historyData}>
                      <defs>
                        <linearGradient id={"colorGeneric" + colorTheme} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={theme.hex} stopOpacity={0.6}/>
                          <stop offset="50%" stopColor={theme.hex} stopOpacity={0.2}/>
                          <stop offset="100%" stopColor={theme.hex} stopOpacity={0}/>
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} tickMargin={10} minTickGap={20} />
                      <YAxis domain={['dataMin - 1000', 'dataMax + 1000']} axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} width={45} tickFormatter={(val) => val >= 1000 ? (val/1000) + 'k' : val} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: theme.hex, fontWeight: 'bold' }}
                        formatter={(val: any) => [val.toLocaleString(), 'Value']}
                        labelStyle={{ color: '#aaa', marginBottom: '4px' }}
                      />
                      <Area type="monotoneX" dataKey="value" stroke={theme.hex} strokeWidth={3} fillOpacity={1} fill={"url(#colorGeneric" + colorTheme + ")"} filter="url(#glow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Secondary Bar Chart */}
              <div className="glass-card p-6 flex flex-col h-[250px] border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h3 className="text-lg font-heading font-bold text-white">Daily Growth / Momentum</h3>
                  <span className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full text-gray-300 border border-white/10">Absolute</span>
                </div>
                <div className="flex-1 -ml-4 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historyData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }} barCategoryGap="5%">
                      <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} minTickGap={20} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} width={45} tickFormatter={(val) => val > 0 ? "+" + val : val} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                        contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                        formatter={(val: any) => [val > 0 ? "+" + val : val, 'Daily Change']}
                        labelStyle={{ color: '#aaa', marginBottom: '4px' }}
                      />
                      <Bar dataKey="growth" radius={[2,2,2,2]}>
                        {historyData.map((entry, index) => (
                          <Cell key={"cell-" + index} fill={entry.growth >= 0 ? '#22c55e' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Insights & Table Column */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              
              {/* Insight Text */}
              <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full"></div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Info size={16} className={theme.text} /> Executive Summary
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {description} This metric is crucial for understanding institutional adoption and overall market liquidity concentration.
                </p>
                <div className={"p-4 rounded-xl border flex items-center gap-4 " + theme.bg.replace('/20', '/10') + " " + theme.border.replace('/30', '/20')}>
                  <div className={"w-10 h-10 rounded-full flex items-center justify-center " + theme.bg}>
                    <TrendingUp className={"w-5 h-5 " + theme.text} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-gray-400 block">Sentiment</span>
                    <span className="text-white font-bold tracking-wider">BULLISH</span>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="glass-card p-0 overflow-hidden border border-white/5 flex-1 flex flex-col">
                <div className="p-5 border-b border-white/5 bg-white/5">
                  <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                    {title.includes('Treasuries') ? 'Top Holders' : 'Top Components'}
                  </h4>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/20 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-white/5">
                        <th className="px-5 py-3">Entity/Asset</th>
                        <th className="px-5 py-3 text-right">Amount</th>
                        <th className="px-5 py-3 text-right">% Share</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-white/5">
                      {tableData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                          <td className="px-5 py-4 font-medium text-gray-300 group-hover:text-white transition-colors">{row.entity}</td>
                          <td className="px-5 py-4 text-right font-mono text-gray-400 group-hover:text-gray-300">{row.amount}</td>
                          <td className="px-5 py-4 text-right">
                            <span className={"px-2 py-1 rounded text-xs font-bold border " + theme.text + " " + theme.bg.replace('/20', '/10') + " " + theme.border.replace('/30', '/20')}>
                              {row.share}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StandardMetricModal;

