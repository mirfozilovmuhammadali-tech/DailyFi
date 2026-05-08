import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  Activity, 
  DollarSign, 
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Zap,
  Target
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import BackgroundGlobe from '../components/BackgroundGlobe';
import { MacroDetailModal } from '../components/MacroDetailModal';

const GlowingDot = (props: any) => {
  const { cx, cy, stroke } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={2.5} fill={stroke} />
      <circle cx={cx} cy={cy} r={6} fill={stroke} opacity={0.3} className="animate-pulse" />
      <circle cx={cx} cy={cy} r={12} fill={stroke} opacity={0.1} />
    </g>
  );
};

const MacroEconomics: React.FC = () => {
  const [selectedMetricId, setSelectedMetricId] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedGlow, setSelectedGlow] = useState<string>('');

  const handleCardClick = (id: string, icon: any, color: string, glow: string) => {
    setSelectedMetricId(id);
    setSelectedIcon(() => icon);
    setSelectedColor(color);
    setSelectedGlow(glow);
  };

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
      id: 'cpi',
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
      id: 'fed',
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
      id: 'unemployment',
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
    { id: 'target-rate', name: 'Target Rate', value: '5.50%', change: 'Unchanged', icon: Target, color: 'text-cyan glow-cyan' },
    { id: 'm2', name: 'M2 Money Supply', value: '$20.8T', change: '-1.2% (YoY)', icon: Activity, color: 'text-cyan glow-cyan' },
    { id: 'dxy', name: 'DXY Index', value: '105.32', change: '+0.45%', icon: DollarSign, color: 'text-bearish glow-bearish' },
    { id: 'global-liquidity', name: 'Global Liquidity', value: '$172T', change: '+2.1%', icon: Globe, color: 'text-bullish glow-bullish' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative min-h-screen">
      {/* 3D Holographic Globe Background */}
      <BackgroundGlobe />
      
      {/* Main Content Overlay */}
      <motion.div 
        className="relative z-10 space-y-8 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-white tracking-tight">Macro Economics</h1>
            <p className="text-gray-400 mt-2 text-lg">Global financial indicators. Click any card for live data & intelligence.</p>
          </div>
          <div className="flex items-center gap-3 glass-card-laser px-6 py-3">
            <Zap size={18} className="text-[#00ff9d] animate-pulse" />
            <span className="text-sm font-bold text-[#00ff9d] uppercase tracking-widest laser-badge">Live Terminal Status: Connected</span>
          </div>
        </motion.div>

        {/* Top Metrics Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <motion.div 
                key={m.id} 
                whileHover={{ scale: 1.02 }}
                onClick={() => handleCardClick(m.id, Icon, m.color.split(' ')[0], m.color.split(' ')[1] || '')}
                layoutId={`macro-card-${m.id}`}
                className="glass-card-laser p-6 group cursor-pointer"
              >
                <motion.div layoutId={`macro-header-${m.id}`} className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Icon className={`w-6 h-6 ${m.color}`} />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${m.change.includes('+') ? 'text-bullish glow-bullish bg-bullish/10' : m.change === 'Unchanged' ? 'text-cyan bg-cyan/10 glow-cyan' : 'text-bearish glow-bearish bg-bearish/10'}`}>
                    {m.change}
                  </span>
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 font-sans">{m.name}</span>
                  <span className="text-3xl font-geist font-bold text-white tracking-tight">{m.value}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* DXY Chart */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            onClick={() => handleCardClick('dxy', DollarSign, 'text-[#00f5ff]', 'glow-cyan')}
            layoutId={`macro-card-dxy`}
            className="glass-card-laser p-8 cursor-pointer"
          >
            <motion.div layoutId={`macro-header-dxy`} className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-3">
                <DollarSign className="text-[#00f5ff] glow-cyan" size={24} /> DXY - US Dollar Index
              </h3>
              <div className="flex items-center gap-2 text-bullish glow-bullish font-geist font-bold bg-bullish/10 px-4 py-1.5 rounded-full text-sm">
                <ArrowUpRight size={18} /> +0.84%
              </div>
            </motion.div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dxyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="date" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,245,255,0.2)', borderRadius: '12px' }}
                    itemStyle={{ color: '#00f5ff', fontFamily: 'Geist Mono, monospace', fontWeight: 'bold' }}
                    labelStyle={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00f5ff" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    dot={<GlowingDot />} 
                    activeDot={{ r: 8, fill: "#00f5ff", stroke: "#fff", strokeWidth: 2 }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Bond Yields Chart */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            onClick={() => handleCardClick('us10y', Activity, 'text-[#ffd700]', 'glow-gold')}
            layoutId={`macro-card-us10y`}
            className="glass-card-laser p-8 cursor-pointer"
          >
            <motion.div layoutId={`macro-header-us10y`} className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-3">
                <Activity className="text-gold" size={24} /> US 10Y Bond Yield
              </h3>
              <div className="flex items-center gap-2 text-bearish glow-bearish font-geist font-bold bg-bearish/10 px-4 py-1.5 rounded-full text-sm">
                <ArrowDownRight size={18} /> -0.12%
              </div>
            </motion.div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bondYieldData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="date" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: '12px' }}
                    itemStyle={{ color: '#ffd700', fontFamily: 'Geist Mono, monospace', fontWeight: 'bold' }}
                    labelStyle={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ffd700" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    dot={<GlowingDot />} 
                    activeDot={{ r: 8, fill: "#ffd700", stroke: "#fff", strokeWidth: 2 }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </motion.div>

        {/* Economic Calendar Section */}
        <motion.div variants={itemVariants} className="glass-card-laser overflow-hidden">
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/40">
            <h3 className="text-xl font-heading font-bold text-white flex items-center gap-3">
              <Calendar className="text-[#00f5ff] glow-cyan" size={22} /> High-Impact Economic Calendar
            </h3>
            <button className="text-sm font-bold text-[#00f5ff] hover:text-white transition-colors uppercase tracking-widest">View Full Calendar</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/60">
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
                  <motion.tr 
                    key={event.id}
                    layoutId={`macro-card-${event.id}`}
                    onClick={() => handleCardClick(event.id, Calendar, 'text-[#00f5ff]', 'glow-cyan')}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-white group-hover:text-[#00f5ff] transition-colors">{event.title}</span>
                        <span className="text-xs text-gray-500 mt-1">{event.description}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-geist font-bold text-gray-300">{event.time}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter ${
                        event.impact === 'High' ? 'bg-bearish/20 text-bearish glow-bearish' : 'bg-cyan/20 text-cyan glow-cyan'
                      }`}>
                        {event.impact} Impact
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          event.sentiment === 'Bullish' ? 'bg-[#00ff9d]' : 
                          event.sentiment === 'Bearish' ? 'bg-[#ff3b69]' : 'bg-gray-400'
                        }`} />
                        <span className={`text-xs font-bold uppercase tracking-widest ${
                          event.sentiment === 'Bullish' ? 'text-bullish glow-bullish' : 
                          event.sentiment === 'Bearish' ? 'text-bearish glow-bearish' : 'text-gray-400'
                        }`}>
                          {event.sentiment}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                        <span className="text-sm font-geist font-bold text-white">{event.actual}</span>
                        <span className="text-xs text-gray-600">/</span>
                        <span className="text-sm font-geist text-gray-500">{event.forecast}</span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recession Indicators & Correlation */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => handleCardClick('recession', AlertTriangle, 'text-bearish', 'glow-bearish')}
            layoutId={`macro-card-recession`}
            className="glass-card-laser p-8 flex flex-col items-center text-center cursor-pointer"
          >
            <motion.div layoutId={`macro-header-recession`} className="w-16 h-16 rounded-2xl bg-bearish/10 flex items-center justify-center text-bearish glow-bearish mb-6 border border-bearish/20">
              <AlertTriangle size={32} />
            </motion.div>
            <h4 className="text-lg font-heading font-bold text-white mb-2">Recession Probability</h4>
            <span className="text-3xl font-geist font-black text-bearish glow-bearish">65%</span>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed font-sans">Based on the 10Y-2Y yield curve inversion and leading economic indicators.</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => handleCardClick('btc-corr', Activity, 'text-gold', 'glow-gold')}
            layoutId={`macro-card-btc-corr`}
            className="glass-card-laser p-8 flex flex-col items-center text-center cursor-pointer"
          >
            <motion.div layoutId={`macro-header-btc-corr`} className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-gold mb-6 border border-gold/20">
              <Activity size={32} />
            </motion.div>
            <h4 className="text-lg font-heading font-bold text-white mb-2">BTC Correlation (DXY)</h4>
            <span className="text-3xl font-geist font-black text-gold">-0.82</span>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed font-sans">Bitcoin continues to trade as a high-beta asset with strong inverse correlation to USD strength.</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => handleCardClick('global-liq', Globe, 'text-[#00f5ff]', 'glow-cyan')}
            layoutId={`macro-card-global-liq`}
            className="glass-card-laser p-8 flex flex-col items-center text-center cursor-pointer"
          >
            <motion.div layoutId={`macro-header-global-liq`} className="w-16 h-16 rounded-2xl bg-[#00f5ff]/10 flex items-center justify-center text-[#00f5ff] glow-cyan mb-6 border border-[#00f5ff]/20">
              <Globe size={32} />
            </motion.div>
            <h4 className="text-lg font-heading font-bold text-white mb-2">Global Liquidity Index</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-geist font-black text-[#00f5ff] glow-cyan">Neutral</span>
              <TrendingUp size={24} className="text-bullish glow-bullish ml-2" />
            </div>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed font-sans">Central bank balance sheets showing slight expansion in the Asian markets.</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Advanced Analysis Modal */}
      <AnimatePresence>
        {selectedMetricId && (
          <MacroDetailModal 
            indicatorId={selectedMetricId}
            onClose={() => setSelectedMetricId(null)}
            icon={selectedIcon}
            colorClass={selectedColor}
            glowClass={selectedGlow}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MacroEconomics;

