import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  DollarSign, 
  Globe,
  AlertTriangle,
  ShieldAlert,
  Clock
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
import { fetchMacroData, type MacroData } from '../services/macroApi';

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
  const [dxyData, setDxyData] = useState<MacroData | null>(null);
  const [tnxData, setTnxData] = useState<MacroData | null>(null);
  const [m2Data, setM2Data] = useState<MacroData | null>(null);
  const [liqData, setLiqData] = useState<MacroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      const [dxy, tnx, m2, liq] = await Promise.all([
        fetchMacroData('DX-Y.NYB'),
        fetchMacroData('^TNX'),
        fetchMacroData('M2SL'),
        fetchMacroData('W5000')
      ]);
      setDxyData(dxy);
      setTnxData(tnx);
      setM2Data(m2);
      setLiqData(liq);
      setLoading(false);
    };
    loadAllData();
  }, []);

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

  const metrics = [
    { id: 'dxy', name: 'DXY Index', data: dxyData, icon: DollarSign, color: 'text-bearish glow-bearish' },
    { id: 'us10y', name: 'US 10Y Yield', data: tnxData, icon: Activity, color: 'text-cyan glow-cyan' },
    { id: 'm2', name: 'M2 Money Supply', data: m2Data, icon: Zap, color: 'text-gold glow-gold' },
    { id: 'liq', name: 'Global Liquidity', data: liqData, icon: Globe, color: 'text-bullish glow-bullish' },
  ];

  return (
    <div className="relative min-h-screen">
      <BackgroundGlobe />
      
      <motion.div 
        className="relative z-10 space-y-8 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-white tracking-tight">Macro Economics</h1>
            <p className="text-gray-400 mt-2 text-lg">High-Fidelity Financial Intelligence Terminal.</p>
          </div>
          <div className="flex items-center gap-3 glass-card-laser px-6 py-3">
            <ShieldAlert size={18} className="text-[#00ff9d] animate-pulse" />
            <span className="text-sm font-bold text-[#00ff9d] uppercase tracking-widest laser-badge">Live System: Operational</span>
          </div>
        </motion.div>

        {/* Top Metrics Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.id} className="glass-card-laser p-6 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-white/5">
                    <Icon className={`w-6 h-6 ${m.color}`} />
                  </div>
                  {m.data && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${m.data.change >= 0 ? 'text-bullish glow-bullish bg-bullish/10' : 'text-bearish glow-bearish bg-bearish/10'}`}>
                      {m.data.change >= 0 ? '+' : ''}{m.data.change.toFixed(2)}%
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 font-sans">{m.name}</span>
                  <span className="text-3xl font-geist font-bold text-white tracking-tight">
                    {loading ? '---' : m.data?.current.toLocaleString(undefined, { maximumFractionDigits: m.id === 'us10y' ? 2 : 2 })}
                    {m.id === 'us10y' ? '%' : m.id === 'm2' ? 'T' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Charts Section */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* DXY Chart */}
          <div className="glass-card-laser p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-3">
                <DollarSign className="text-[#00f5ff] glow-cyan" size={24} /> DXY Trajectory
              </h3>
              <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
                <Clock size={14} /> 30D Window
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dxyData?.history || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="date" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontFamily: 'Geist Mono, monospace', fontWeight: 'bold' }}
                    labelStyle={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00f5ff" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    dot={<GlowingDot stroke="#00f5ff" />} 
                    activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bond Yields Chart */}
          <div className="glass-card-laser p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-3">
                <Activity className="text-gold glow-gold" size={24} /> US10Y Bond Yield
              </h3>
              <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
                <Clock size={14} /> 30D Window
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tnxData?.history || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="date" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide domain={['dataMin - 0.1', 'dataMax + 0.1']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontFamily: 'Geist Mono, monospace', fontWeight: 'bold' }}
                    labelStyle={{ color: '#9ca3af', textTransform: 'uppercase', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#ffd700" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    dot={<GlowingDot stroke="#ffd700" />} 
                    activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Intelligence Insight */}
        <motion.div variants={itemVariants} className="glass-card-laser p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-bullish/10 flex items-center justify-center text-bullish glow-bullish border border-bullish/20">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-white">Market Intelligence Analysis</h3>
              <p className="text-sm text-gray-500">Real-time correlation insights for digital assets.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Crypto Sentiment</span>
              <p className="text-white text-sm leading-relaxed">DXY strength remains the primary headwind for Bitcoin. Current trajectory suggests a period of consolidation as liquidity rotates.</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Yield Impact</span>
              <p className="text-white text-sm leading-relaxed">Bond yields are stabilizing near multi-year highs, creating pressure on risk-on environments and equity markets.</p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">M2 Correlation</span>
              <p className="text-white text-sm leading-relaxed">Monetary expansion signals are beginning to bottom out, historically a precursor to long-term digital asset accumulation.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MacroEconomics;
