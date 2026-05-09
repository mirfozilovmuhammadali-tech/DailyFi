import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Clock, ShieldAlert, FileText, Database, Activity, AlertCircle, RefreshCw } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { fetchMacroDetails, type MacroIndicatorDetails } from '../services/macroApi';
import { AdvancedChartWidget } from './TradingViewWidgets';

interface MacroDetailModalProps {
  indicatorId: string;
  onClose: () => void;
  icon: any;
  colorClass: string;
  glowClass: string;
}

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

// Map local IDs to TradingView fallback symbols
const fallbackSymbolMap: Record<string, string> = {
  'dxy': 'TVC:DXY',
  'us10y': 'TVC:US10Y',
  'target-rate': 'ECONOMICS:USINTR',
  'm2': 'ECONOMICS:USM2',
  'global-liquidity': 'TVC:W5000',
  'recession': 'TVC:VIX',
  'btc-corr': 'CRYPTO:BTCUSD',
  'cpi': 'ECONOMICS:USCPI',
  'fed': 'AMEX:TLT',
  'unemployment': 'ECONOMICS:USUR'
};

export const MacroDetailModal: React.FC<MacroDetailModalProps> = ({ indicatorId, onClose, icon: Icon, colorClass, glowClass }) => {
  const [data, setData] = useState<MacroIndicatorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(false);
      const result = await fetchMacroDetails(indicatorId);
      setData(result);
    } catch (err) {
      console.error("Failed to load macro details", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto refresh every 60 seconds
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [indicatorId]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div 
        layoutId={`macro-card-${indicatorId}`}
        className="glass-card w-full max-w-5xl max-h-[90vh] overflow-y-auto relative shadow-2xl flex flex-col bg-black/60 border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <motion.div layoutId={`macro-header-${indicatorId}`} className="flex justify-between items-center p-6 border-b border-white/10 bg-black/40 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <Icon className={`w-8 h-8 ${colorClass} ${glowClass}`} />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-white tracking-tight">
                {data ? data.name : error ? 'Data Source Unavailable' : 'Loading Analysis...'}
              </h2>
              {data && !error && (
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm font-mono text-gray-400 flex items-center gap-1">
                    <Database size={14} /> Source: {data.provider}
                  </span>
                  <span className="text-sm font-mono text-gray-400 flex items-center gap-1">
                    <Clock size={14} /> Updated: {new Date(data.lastUpdated).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <X size={24} />
          </button>
        </motion.div>

        {loading ? (
          <div className="p-12 flex flex-col justify-center items-center h-64 gap-4">
            <div className={`w-12 h-12 rounded-full border-2 border-transparent border-t-current animate-spin ${colorClass}`}></div>
            <p className="text-gray-400 font-mono text-sm animate-pulse">Establishing secure connection to data provider...</p>
          </div>
        ) : error ? (
          <div className="p-8 space-y-6">
            <div className="glass-card p-6 bg-bearish/10 border border-bearish/20 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AlertCircle className="text-bearish glow-bearish" size={32} />
                <div>
                  <h3 className="text-lg font-bold text-white">Service Temporarily Unavailable</h3>
                  <p className="text-sm text-gray-400">The primary data proxy was blocked by CORS or timed out. Falling back to public widget feed.</p>
                </div>
              </div>
              <button 
                onClick={loadData}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 text-sm font-bold uppercase tracking-widest"
              >
                <RefreshCw size={16} /> Retry Connection
              </button>
            </div>
            
            {/* Fallback TradingView Widget */}
            <div className="glass-card p-4 bg-white/5 border border-white/5 h-[400px] relative overflow-hidden">
              <AdvancedChartWidget symbol={fallbackSymbolMap[indicatorId] || 'TVC:DXY'} />
            </div>
          </div>
        ) : data && (
          <div className="p-8 space-y-8">
            {/* Real-time Stats Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 bg-white/5 border border-white/5">
                <span className="text-sm text-gray-500 uppercase tracking-widest font-bold">Current Value</span>
                <div className="mt-2 text-4xl font-mono font-bold text-white">
                  {data.currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className={`mt-2 text-sm font-bold flex items-center gap-1 ${data.change24h >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                  {data.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {Math.abs(data.change24h).toFixed(2)}% (24h)
                </div>
              </div>

              <div className="glass-card p-6 bg-white/5 border border-white/5 md:col-span-2">
                <span className="text-sm text-gray-500 uppercase tracking-widest font-bold flex items-center gap-2">
                  <ShieldAlert size={16} /> Crypto Market Impact
                </span>
                <div className="mt-4 flex items-center gap-4">
                  <div className={`px-6 py-2 rounded-xl text-lg font-bold border ${
                    data.cryptoImpact === 'Bullish' ? 'bg-bullish/20 text-bullish border-bullish/50 glow-bullish' : 
                    data.cryptoImpact === 'Bearish' ? 'bg-bearish/20 text-bearish border-bearish/50 glow-bearish' : 
                    'bg-cyan/20 text-cyan border-cyan/50 glow-cyan'
                  }`}>
                    {data.cryptoImpact.toUpperCase()}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed font-sans">{data.marketMeaning}</p>
                </div>
              </div>
            </div>

            {/* Dynamic Interactive Chart */}
            <div className="glass-card p-6 bg-white/5 border border-white/5">
              <h3 className="text-lg font-heading font-bold text-white mb-6 flex items-center gap-2">
                <Activity className={colorClass} size={20} /> 30-Day Trajectory
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                      stroke={data.cryptoImpact === 'Bearish' ? '#ff3b69' : data.cryptoImpact === 'Bullish' ? '#00ff9d' : '#00f5ff'} 
                      strokeWidth={2} 
                      strokeDasharray="4 4"
                      dot={<GlowingDot />} 
                      activeDot={{ r: 8, stroke: "#fff", strokeWidth: 2 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* In-Depth Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card p-6 bg-white/5 border border-white/5">
                <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                  <FileText className="text-gray-400" size={18} /> Full Explanation
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed font-sans">{data.explanation}</p>
              </div>

              <div className="glass-card p-6 bg-white/5 border border-white/5">
                <h3 className="text-md font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="text-gray-400" size={18} /> Historical Context
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed font-sans">{data.historicalContext}</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
