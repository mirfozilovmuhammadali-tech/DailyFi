import React, { useEffect, useState } from 'react';
import { X, ArrowRightLeft, TrendingUp, TrendingDown, Info, AlertTriangle, Building2 } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface ExchangeFlowsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExchangeFlowsModal: React.FC<ExchangeFlowsModalProps> = ({ isOpen, onClose }) => {
  const [animationClass, setAnimationClass] = useState('opacity-0 scale-95');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimationClass('opacity-100 scale-100'), 10);
    } else {
      setAnimationClass('opacity-0 scale-95');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const data = [
    { date: 'Apr 01', netFlow: -450, cumulative: 2150 },
    { date: 'Apr 02', netFlow: 120, cumulative: 2270 },
    { date: 'Apr 03', netFlow: -850, cumulative: 1420 },
    { date: 'Apr 04', netFlow: -1200, cumulative: 220 },
    { date: 'Apr 05', netFlow: 340, cumulative: 560 },
    { date: 'Apr 08', netFlow: -620, cumulative: -60 },
    { date: 'Apr 09', netFlow: -1200, cumulative: -1260 },
    { date: 'Apr 10', netFlow: 200, cumulative: -1060 },
    { date: 'Apr 11', netFlow: 450, cumulative: -610 },
    { date: 'Apr 12', netFlow: -800, cumulative: -1410 },
    { date: 'Apr 15', netFlow: -300, cumulative: -1710 },
    { date: 'Apr 16', netFlow: 150, cumulative: -1560 },
    { date: 'Apr 17', netFlow: -400, cumulative: -1960 },
    { date: 'Apr 18', netFlow: -650, cumulative: -2610 },
    { date: 'Apr 19', netFlow: 220, cumulative: -2390 },
    { date: 'Apr 22', netFlow: -900, cumulative: -3290 },
  ];

  const tableData = [
    { exchange: 'Binance', balance: '584,240 BTC', change: '-12,400', share: '32.4%' },
    { exchange: 'Coinbase Pro', balance: '392,100 BTC', change: '-8,200', share: '21.8%' },
    { exchange: 'Bitfinex', balance: '378,500 BTC', change: '+1,100', share: '21.0%' },
    { exchange: 'Kraken', balance: '122,400 BTC', change: '-3,400', share: '6.8%' },
    { exchange: 'OKX', balance: '115,200 BTC', change: '-500', share: '6.4%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className={"absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 " + (isOpen ? 'opacity-100' : 'opacity-0')} 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className={"relative w-full max-w-6xl bg-dark-bg/95 backdrop-blur-2xl border border-green-500/20 rounded-3xl shadow-[0_0_80px_rgba(34,197,94,0.1)] overflow-hidden transition-all duration-300 transform max-h-[90vh] flex flex-col " + animationClass}>
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l from-green-500 via-emerald-500 to-transparent opacity-50"></div>
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-green-500/20 border border-green-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <ArrowRightLeft className="w-7 h-7 text-green-400" />
            </div>
            <div>
              <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Exchange Flows</h2>
              <div className="flex items-center gap-4 mt-1.5">
                <span className="text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 text-green-400">
                  <Building2 size={14} /> Liquidity Tracker
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20"></span>
                <span className="text-sm font-medium text-gray-400">Net transfer volume across major CEXs</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors relative z-10 bg-white/5 border border-white/10">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6 border shadow-xl bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider">Net Flow (24h)</span>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-mono font-bold text-green-400 drop-shadow-md">-$1.2B</span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                <TrendingDown className="text-red-400" size={14}/> Total Inflows
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white">$4.8B</span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="text-green-400" size={14}/> Total Outflows
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white">$6.0B</span>
              </div>
            </div>
            <div className="glass-card p-6 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block uppercase tracking-wider flex items-center gap-2">
                <Building2 size={14}/> Exchange Reserves
              </span>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-mono font-bold text-white">1.8M <span className="text-lg text-gray-500">BTC</span></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bar Chart: Daily Net Flows */}
                <div className="glass-card p-6 flex flex-col h-[320px] border border-white/5 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-lg font-heading font-bold text-white">Daily Net Flows</h3>
                    <span className="text-xs font-mono bg-white/5 px-3 py-1 rounded-full text-gray-300 border border-white/10">in Millions USD</span>
                  </div>
                  <div className="flex-1 -ml-4 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barCategoryGap="5%">
                        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} minTickGap={20} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} tickFormatter={(val) => "$" + val + "M"} width={45} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                          contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                          formatter={(val: any) => ["$" + val + "M", 'Net Flow']}
                        />
                        <Bar dataKey="netFlow" radius={[2,2,2,2]}>
                          {data.map((entry, index) => (
                            <Cell key={"cell-" + index} fill={entry.netFlow >= 0 ? '#ef4444' : '#22c55e'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Area Chart: Cumulative Flow */}
                <div className="glass-card p-6 flex flex-col h-[320px] border border-white/5 relative overflow-hidden">
                  <div className="flex justify-between items-center mb-6 relative z-10">
                    <h3 className="text-lg font-heading font-bold text-white">7-Day Cumulative Flow</h3>
                  </div>
                  <div className="flex-1 -ml-4 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.6}/>
                            <stop offset="50%" stopColor="#22c55e" stopOpacity={0.2}/>
                            <stop offset="100%" stopColor="#22c55e" stopOpacity={0}/>
                          </linearGradient>
                          <filter id="glowCum" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>
                        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} minTickGap={20} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} width={45} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                          itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                        />
                        <Area type="monotoneX" dataKey="cumulative" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorCum)" filter="url(#glowCum)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="glass-card p-0 overflow-hidden border border-white/5 flex-1 flex flex-col">
                <div className="p-5 border-b border-white/5 bg-white/5">
                  <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Top Exchange Reserves (BTC)</h4>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black/20 text-xs uppercase tracking-wider text-gray-500 font-bold border-b border-white/5">
                        <th className="px-5 py-3">Exchange</th>
                        <th className="px-5 py-3 text-right">Balance</th>
                        <th className="px-5 py-3 text-right">7D Change</th>
                        <th className="px-5 py-3 text-right">Share</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-white/5">
                      {tableData.map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors group">
                          <td className="px-5 py-4 font-bold text-gray-300 group-hover:text-white transition-colors">{row.exchange}</td>
                          <td className="px-5 py-4 text-right font-mono text-gray-300">{row.balance}</td>
                          <td className={"px-5 py-4 text-right font-mono font-bold " + (row.change.includes('+') ? 'text-red-400' : 'text-green-400')}>
                            {row.change}
                          </td>
                          <td className="px-5 py-4 text-right text-gray-400">{row.share}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            <div className="lg:col-span-1 flex flex-col gap-8">
              <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full"></div>
                <h4 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <Info size={16} /> Market Context
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Exchange flows track the amount of cryptocurrency moving into and out of centralized exchange (CEX) wallets.
                </p>
                
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Flow Interpretation</h5>
                <ul className="text-sm space-y-4 text-gray-400">
                  <li className="flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner border-l-4 border-l-green-500">
                    <div>
                      <strong className="text-white block mb-1">Negative Net Flow (Outflows)</strong>
                      <span className="text-green-400 font-bold block mb-1">BULLISH</span>
                      Investors are withdrawing assets to cold storage, reducing available sell pressure on exchanges. Indicates holding behavior.
                    </div>
                  </li>
                  <li className="flex items-start gap-3 bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner border-l-4 border-l-red-500">
                    <div>
                      <strong className="text-white block mb-1">Positive Net Flow (Inflows)</strong>
                      <span className="text-red-400 font-bold block mb-1">BEARISH</span>
                      Investors are depositing assets to exchanges, typically preparing to sell or trade them. Increases available supply.
                    </div>
                  </li>
                </ul>

                <div className="mt-8 p-4 border border-yellow-500/20 bg-yellow-500/5 rounded-xl">
                  <h5 className="text-xs font-bold text-yellow-500 uppercase flex items-center gap-2 mb-2">
                    <AlertTriangle size={14} /> Supply Shock
                  </h5>
                  <p className="text-xs text-gray-400">
                    Exchange reserves are currently at 3-year lows, indicating extreme holder conviction.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExchangeFlowsModal;
