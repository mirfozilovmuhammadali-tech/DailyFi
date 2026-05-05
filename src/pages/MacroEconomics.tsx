import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Activity, 
  DollarSign, 
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const MacroEconomics: React.FC = () => {
  const dxyData = [
    { date: 'Mon', value: 104.2 },
    { date: 'Tue', value: 104.5 },
    { date: 'Wed', value: 104.1 },
    { date: 'Thu', value: 104.8 },
    { date: 'Fri', value: 105.2 },
    { date: 'Sat', value: 105.0 },
    { date: 'Sun', value: 105.3 },
  ];

  const bondYieldData = [
    { date: 'Mon', value: 4.21 },
    { date: 'Tue', value: 4.25 },
    { date: 'Wed', value: 4.28 },
    { date: 'Thu', value: 4.32 },
    { date: 'Fri', value: 4.35 },
    { date: 'Sat', value: 4.38 },
    { date: 'Sun', value: 4.41 },
  ];

  const economicEvents = [
    {
      id: 1,
      title: 'US Core CPI (YoY)',
      impact: 'High',
      time: '2h ago',
      sentiment: 'Bearish',
      actual: '3.4%',
      forecast: '3.2%',
      previous: '3.1%',
      description: 'Higher than expected inflation fuels hawkish Fed expectations.'
    },
    {
      id: 2,
      title: 'Fed Interest Rate Decision',
      impact: 'High',
      time: 'Tomorrow',
      sentiment: 'Neutral',
      actual: '-',
      forecast: '5.50%',
      previous: '5.50%',
      description: 'Markets pricing in a 95% chance of a pause.'
    },
    {
      id: 3,
      title: 'Unemployment Rate',
      impact: 'Medium',
      time: 'Yesterday',
      sentiment: 'Bullish',
      actual: '3.9%',
      forecast: '4.0%',
      previous: '4.1%',
      description: 'Labor market remains resilient despite tightening.'
    }
  ];

  const metrics = [
    { name: 'Target Rate', value: '5.50%', change: 'Unchanged', icon: DollarSign, color: 'text-gold' },
    { name: 'M2 Money Supply', value: '$20.8T', change: '-1.2% (YoY)', icon: Activity, color: 'text-cyan' },
    { name: 'DXY Index', value: '105.32', change: '+0.45%', icon: TrendingUp, color: 'text-red-400' },
    { name: 'Global Liquidity', value: '$172T', change: '+2.1%', icon: Globe, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white tracking-tight">Macro Economics</h1>
          <p className="text-gray-400 mt-2 text-lg">Global financial indicators and high-impact economic events.</p>
        </div>
        <div className="flex items-center gap-3 glass-card px-4 py-2 border border-gold/20 bg-gold/5">
          <Zap size={18} className="text-gold animate-pulse" />
          <span className="text-sm font-bold text-gold uppercase tracking-widest">Live Terminal Status: Connected</span>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="glass-card p-6 border border-white/5 hover:border-white/10 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                  <Icon className={`w-6 h-6 ${m.color}`} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded ${m.change.includes('+') ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                  {m.change}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-1">{m.name}</span>
                <span className="text-3xl font-mono font-bold text-white">{m.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DXY Chart */}
        <div className="glass-card p-8 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <DollarSign className="text-gold" size={20} /> DXY - US Dollar Index
            </h3>
            <div className="flex items-center gap-2 text-green-400 font-mono font-bold">
              <ArrowUpRight size={18} /> +0.84%
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dxyData}>
                <defs>
                  <linearGradient id="colorDxy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffd700" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffd700" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#ffd700" fillOpacity={1} fill="url(#colorDxy)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bond Yields Chart */}
        <div className="glass-card p-8 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <Activity className="text-cyan" size={20} /> US 10Y Bond Yield
            </h3>
            <div className="flex items-center gap-2 text-red-400 font-mono font-bold">
              <ArrowDownRight size={18} /> -0.12%
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bondYieldData}>
                <defs>
                  <linearGradient id="colorBond" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f5ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f5ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(0,245,255,0.2)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#00f5ff" fillOpacity={1} fill="url(#colorBond)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Economic Calendar Section */}
      <div className="glass-card border border-white/5 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h3 className="text-xl font-heading font-bold text-white flex items-center gap-3">
            <Calendar className="text-gold" size={22} /> High-Impact Economic Calendar
          </h3>
          <button className="text-sm font-bold text-gold hover:text-white transition-colors uppercase tracking-widest">View Full Calendar</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/40">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Event</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Time</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Impact</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Sentiment</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Actual / Forecast</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {economicEvents.map((event) => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-white group-hover:text-gold transition-colors">{event.title}</span>
                      <span className="text-xs text-gray-500 mt-1">{event.description}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-mono font-bold text-gray-300">{event.time}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter ${
                      event.impact === 'High' ? 'bg-red-400/20 text-red-400' : 'bg-cyan/20 text-cyan'
                    }`}>
                      {event.impact} Impact
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        event.sentiment === 'Bullish' ? 'bg-green-400' : 
                        event.sentiment === 'Bearish' ? 'bg-red-400' : 'bg-gray-400'
                      }`} />
                      <span className={`text-xs font-bold uppercase tracking-widest ${
                        event.sentiment === 'Bullish' ? 'text-green-400' : 
                        event.sentiment === 'Bearish' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {event.sentiment}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-sm font-mono font-bold text-white">{event.actual}</span>
                      <span className="text-xs text-gray-600">/</span>
                      <span className="text-sm font-mono text-gray-500">{event.forecast}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recession Indicators & Correlation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass-card p-8 border border-white/5 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-400/10 flex items-center justify-center text-red-400 mb-6">
            <AlertTriangle size={32} />
          </div>
          <h4 className="text-lg font-heading font-bold text-white mb-2">Recession Probability</h4>
          <span className="text-3xl font-mono font-black text-red-400">65%</span>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">Based on the 10Y-2Y yield curve inversion and leading economic indicators.</p>
        </div>

        <div className="glass-card p-8 border border-white/5 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-6">
            <Activity size={32} />
          </div>
          <h4 className="text-lg font-heading font-bold text-white mb-2">BTC Correlation (DXY)</h4>
          <span className="text-3xl font-mono font-black text-gold">-0.82</span>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">Bitcoin continues to trade as a high-beta asset with strong inverse correlation to USD strength.</p>
        </div>

        <div className="glass-card p-8 border border-white/5 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan/10 flex items-center justify-center text-cyan mb-6">
            <Globe size={32} />
          </div>
          <h4 className="text-lg font-heading font-bold text-white mb-2">Global Liquidity Index</h4>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-mono font-black text-cyan">Neutral</span>
            <TrendingUp size={24} className="text-green-400" />
          </div>
          <p className="text-xs text-gray-500 mt-4 leading-relaxed">Central bank balance sheets showing slight expansion in the Asian markets.</p>
        </div>
      </div>
    </div>
  );
};

export default MacroEconomics;
