import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  DollarSign, 
  ShieldAlert, 
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  Fingerprint
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer 
} from 'recharts';
import BackgroundGlobe from '../components/BackgroundGlobe';
import { fetchMacroData, type MacroData } from '../services/macroApi';
import { TradingViewAdvancedChart } from '../components/TradingViewWidgets';

const MacroMetricCard: React.FC<{
  title: string;
  symbol: string;
  data: MacroData | null;
  loading: boolean;
  color: string;
  unit?: string;
}> = ({ title, symbol, data, loading, color, unit }) => {
  const isPositive = data ? data.change >= 0 : true;
  
  return (
    <div className="glass-card-laser p-5 group relative overflow-hidden flex flex-col justify-between h-[180px] bg-black/40 border-white/5 hover:border-white/20 transition-all duration-500">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1 block">{symbol}</span>
          <h3 className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{title}</h3>
        </div>
        {data && (
          <div className={`px-2 py-1 rounded text-[10px] font-bold ${isPositive ? 'bg-bullish/10 text-bullish' : 'bg-bearish/10 text-bearish'}`}>
            {isPositive ? '+' : ''}{data.change.toFixed(2)}%
          </div>
        )}
      </div>

      <div className="mt-4 relative z-10">
        <div className="text-2xl font-heading font-black text-white tracking-tight">
          {loading ? (
            <div className="h-8 w-24 bg-white/5 animate-pulse rounded" />
          ) : (
            <>
              {unit === '$' && '$'}
              {data?.current.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {unit === '%' && '%'}
              {unit === 'T' && 'T'}
            </>
          )}
        </div>
      </div>

      <div className="h-10 w-full mt-2 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data?.history || []}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2} 
              dot={false} 
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const MacroEconomics: React.FC = () => {
  const [data, setData] = useState<Record<string, MacroData | null>>({
    'DX-Y.NYB': null,
    '^TNX': null,
    'GC=F': null,
    'BTC-USD': null,
    '^IXIC': null,
    'M2SL': null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      const symbols = ['DX-Y.NYB', '^TNX', 'GC=F', 'BTC-USD', '^IXIC', 'M2SL'];
      const results = await Promise.all(symbols.map(s => fetchMacroData(s)));
      const newData: Record<string, MacroData> = {};
      symbols.forEach((s, i) => newData[s] = results[i]);
      setData(newData);
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

  return (
    <div className="relative min-h-screen">
      <BackgroundGlobe />
      
      <motion.div 
        className="relative z-10 space-y-8 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Institutional Header */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Fingerprint size={14} className="text-cyan animate-pulse" />
              <span className="text-[10px] font-black text-cyan uppercase tracking-[0.4em]">Terminal Mode</span>
            </div>
            <h1 className="text-4xl font-heading font-black text-white tracking-tighter uppercase">Global Macro Intelligence</h1>
            <p className="text-gray-500 mt-2 text-base font-medium">Professional grade terminal for institutional market analysis.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Last Update</div>
              <div className="text-xs font-mono text-white flex items-center gap-2">
                <Clock size={12} className="text-cyan" />
                {new Date().toLocaleTimeString()} UTC
              </div>
            </div>
            <div className="glass-card-laser px-6 py-3 border-cyan/20 bg-cyan/5">
              <span className="text-xs font-black text-cyan uppercase tracking-widest flex items-center gap-2">
                <ShieldAlert size={14} className="animate-pulse" /> System Active
              </span>
            </div>
          </div>
        </motion.div>

        {/* Premium Macro Metrics Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MacroMetricCard title="US Dollar Index" symbol="DXY" data={data['DX-Y.NYB']} loading={loading} color="#00f5ff" />
          <MacroMetricCard title="US 10Y Yield" symbol="US10Y" data={data['^TNX']} loading={loading} color="#ffd700" unit="%" />
          <MacroMetricCard title="Gold Spot" symbol="XAU/USD" data={data['GC=F']} loading={loading} color="#f59e0b" unit="$" />
          <MacroMetricCard title="Bitcoin" symbol="BTC/USD" data={data['BTC-USD']} loading={loading} color="#ff9f00" unit="$" />
          <MacroMetricCard title="Nasdaq 100" symbol="NDX" data={data['^IXIC']} loading={loading} color="#4ade80" unit="$" />
          <MacroMetricCard title="M2 Supply" symbol="M2SL" data={data['M2SL']} loading={loading} color="#8b5cf6" unit="T" />
        </motion.div>

        {/* Large Terminal Charts */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card-laser p-1 bg-white/5 border-white/5 group">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-heading font-black text-white flex items-center gap-3 tracking-widest uppercase">
                  <DollarSign className="text-cyan group-hover:rotate-12 transition-transform" size={20} /> 
                  DXY Performance
                </h3>
                <div className="px-3 py-1 bg-cyan/10 border border-cyan/20 rounded text-[10px] font-black text-cyan uppercase">TVC:DXY</div>
              </div>
              <div className="h-[450px] w-full rounded-lg overflow-hidden border border-white/5 bg-black/60 shadow-2xl">
                <TradingViewAdvancedChart symbol="TVC:DXY" height={450} />
              </div>
            </div>
          </div>

          <div className="glass-card-laser p-1 bg-white/5 border-white/5 group">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-heading font-black text-white flex items-center gap-3 tracking-widest uppercase">
                  <TrendingUp className="text-gold group-hover:-translate-y-1 transition-transform" size={20} /> 
                  US10Y Treasury
                </h3>
                <div className="px-3 py-1 bg-gold/10 border border-gold/20 rounded text-[10px] font-black text-gold uppercase">TVC:US10Y</div>
              </div>
              <div className="h-[450px] w-full rounded-lg overflow-hidden border border-white/5 bg-black/60 shadow-2xl">
                <TradingViewAdvancedChart symbol="TVC:US10Y" height={450} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Intel & Insights Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Economic Calendar */}
          <div className="glass-card-laser p-8 bg-black/40 border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="text-cyan" size={20} />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">High Impact Events</h3>
            </div>
            <div className="space-y-6">
              {[
                { event: 'CPI Inflation (MoM)', date: 'May 14', impact: 'Critical', consensus: '0.3%' },
                { event: 'Retail Sales', date: 'May 15', impact: 'High', consensus: '0.4%' },
                { event: 'FOMC Meeting', date: 'Jun 12', impact: 'Systemic', consensus: 'Pause' }
              ].map((ev, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan/30 transition-colors cursor-pointer group">
                  <div>
                    <div className="text-xs font-bold text-white mb-1">{ev.event}</div>
                    <div className="text-[10px] text-gray-500 font-mono uppercase">{ev.date} • Consensus: {ev.consensus}</div>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded uppercase ${ev.impact === 'Critical' ? 'bg-bearish/20 text-bearish' : 'bg-cyan/20 text-cyan'}`}>
                    {ev.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Sentiment */}
          <div className="glass-card-laser p-8 bg-black/40 border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <Activity className="text-bullish" size={20} />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Sentiment & Liquidity</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-400">
                  <span>Fear & Greed Index</span>
                  <span className="text-gold uppercase tracking-widest">Greed (74)</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-bearish via-gold to-bullish w-[74%] rounded-full shadow-[0_0_10px_rgba(0,255,157,0.3)]"></div>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-bold text-gray-400">
                  <span>Global Liquidity Delta</span>
                  <span className="text-cyan uppercase tracking-widest">Expanding</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan w-[62%] rounded-full shadow-[0_0_10px_rgba(0,245,255,0.3)]"></div>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs font-bold text-white mb-2">
                  <BarChart3 size={14} className="text-gold" />
                  Fed Rate Probabilities
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">CME FedWatch Tool suggests a 92% probability of "No Change" in the June cycle, with pivot expectations shifting towards Q4 2026.</p>
              </div>
            </div>
          </div>

          {/* Macro Correlation */}
          <div className="glass-card-laser p-8 bg-black/40 border-white/5">
            <div className="flex items-center gap-3 mb-8">
              <Layers className="text-gold" size={20} />
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Macro-BTC Correlation</h3>
            </div>
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-white">BTC vs DXY</span>
                  <span className="text-[10px] font-black text-bearish uppercase tracking-widest">-0.84 Inverse</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">High inverse correlation persists. DXY strength remains the dominant technical headwind for Bitcoin accumulation cycles.</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-white">BTC vs Gold</span>
                  <span className="text-[10px] font-black text-bullish uppercase tracking-widest">+0.42 Positive</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">Correlation with store-of-value assets is firming as global debt concerns accelerate institutional rotation into non-sovereign stores.</p>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default MacroEconomics;
