import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldAlert, Activity, DollarSign, Globe, TrendingUp } from 'lucide-react';
import BackgroundGlobe from '../components/BackgroundGlobe';
import { TradingViewMiniChart, TradingViewAdvancedChart } from '../components/TradingViewWidgets';

const MacroEconomics: React.FC = () => {
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
    { id: 'dxy', name: 'DXY Index', symbol: 'TVC:DXY', icon: DollarSign, color: 'text-bearish glow-bearish' },
    { id: 'us10y', name: 'US 10Y Yield', symbol: 'TVC:US10Y', icon: Activity, color: 'text-cyan glow-cyan' },
    { id: 'nasdaq', name: 'Nasdaq 100', symbol: 'NASDAQ:NDX', icon: Globe, color: 'text-bullish glow-bullish' },
    { id: 'gold', name: 'Gold Spot', symbol: 'OANDA:XAUUSD', icon: Zap, color: 'text-gold glow-gold' },
    { id: 'btc', name: 'Bitcoin', symbol: 'BINANCE:BTCUSDT', icon: TrendingUp, color: 'text-orange-500 glow-gold' },
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
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-white tracking-tight">Macro Economics</h1>
            <p className="text-gray-400 mt-2 text-lg">Real-time Financial Intelligence Terminal.</p>
          </div>
          <div className="flex items-center gap-3 glass-card-laser px-6 py-3">
            <ShieldAlert size={18} className="text-[#00ff9d] animate-pulse" />
            <span className="text-sm font-bold text-[#00ff9d] uppercase tracking-widest laser-badge">Live Feed: Operational</span>
          </div>
        </motion.div>

        {/* Top Metrics Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.id} className="glass-card-laser p-4 group overflow-hidden">
                <div className="flex justify-between items-center mb-2 px-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${m.color}`} />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-sans">{m.name}</span>
                  </div>
                </div>
                <div className="h-[120px] w-full rounded-lg overflow-hidden border border-white/5 bg-black/20">
                  <TradingViewMiniChart symbol={m.symbol} height={120} />
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Large Interactive Charts */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* DXY Advanced Chart */}
          <div className="glass-card-laser p-6 bg-black/40">
            <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-3">
              <DollarSign className="text-cyan glow-cyan" size={24} /> US Dollar Index (DXY)
            </h3>
            <div className="h-[450px] w-full rounded-xl overflow-hidden border border-white/5 bg-black/60 shadow-inner">
              <TradingViewAdvancedChart symbol="TVC:DXY" height={450} />
            </div>
          </div>

          {/* US10Y Advanced Chart */}
          <div className="glass-card-laser p-6 bg-black/40">
            <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-3">
              <TrendingUp className="text-gold glow-gold" size={24} /> US 10Y Treasury Yield
            </h3>
            <div className="h-[450px] w-full rounded-xl overflow-hidden border border-white/5 bg-black/60 shadow-inner">
              <TradingViewAdvancedChart symbol="TVC:US10Y" height={450} />
            </div>
          </div>
        </motion.div>

        {/* Intelligence Insight */}
        <motion.div variants={itemVariants} className="glass-card-laser p-8 bg-black/60">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan glow-cyan border border-cyan/20">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-heading font-bold text-white">Market Intelligence Correlation</h3>
              <p className="text-sm text-gray-400">Automated insights from live terminal feeds.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan/30 transition-colors">
              <span className="text-xs font-bold text-cyan uppercase tracking-widest border-b border-cyan/30 pb-2 block">BTC Correlation</span>
              <p className="text-gray-300 text-sm leading-relaxed">DXY strength remains the primary inverse signal for Bitcoin. Current trajectory suggests institutional rotation into safe-haven assets as volatility spikes.</p>
            </div>
            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold/30 transition-colors">
              <span className="text-xs font-bold text-gold uppercase tracking-widest border-b border-gold/30 pb-2 block">Fixed Income Signal</span>
              <p className="text-gray-300 text-sm leading-relaxed">Bond yields are stabilizing at multi-year resistance levels. A breakout above 4.5% could trigger a broader sell-off in growth-oriented tech sectors.</p>
            </div>
            <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-bullish/30 transition-colors">
              <span className="text-xs font-bold text-bullish uppercase tracking-widest border-b border-bullish/30 pb-2 block">Macro Liquidity</span>
              <p className="text-gray-300 text-sm leading-relaxed">M2 Money Supply expansion is plateauing. Historical data indicates that digital assets thrive in environments where global liquidity indices show a rising 12-month delta.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MacroEconomics;
