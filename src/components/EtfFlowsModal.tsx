import React, { useEffect, useState } from 'react';
import { X, Activity, Bitcoin, Info } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface EtfFlowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetType: 'BTC' | 'ETH';
}

const EtfFlowsModal: React.FC<EtfFlowsModalProps> = ({ isOpen, onClose, assetType }) => {
  const [animationClass, setAnimationClass] = useState('opacity-0 scale-95');
  const [chartType, setChartType] = useState<'flow' | 'aum'>('flow');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimationClass('opacity-100 scale-100'), 10);
    } else {
      setAnimationClass('opacity-0 scale-95');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const btcData = [
    { date: 'Apr 01', flow: 120, aum: 53100 },
    { date: 'Apr 02', flow: 250, aum: 53350 },
    { date: 'Apr 03', flow: -45, aum: 53300 },
    { date: 'Apr 04', flow: 310, aum: 53600 },
    { date: 'Apr 05', flow: 420, aum: 54000 },
    { date: 'Apr 08', flow: 150, aum: 54150 },
    { date: 'Apr 09', flow: -180, aum: 53950 },
    { date: 'Apr 10', flow: 290, aum: 54200 },
    { date: 'Apr 11', flow: 450, aum: 54600 },
    { date: 'Apr 12', flow: -50, aum: 54550 },
    { date: 'Apr 15', flow: 110, aum: 54650 },
    { date: 'Apr 16', flow: 210, aum: 54850 },
    { date: 'Apr 17', flow: 340, aum: 55150 },
    { date: 'Apr 18', flow: 180, aum: 55300 },
    { date: 'Apr 19', flow: -20, aum: 55250 },
    { date: 'Apr 22', flow: 145, aum: 55400 },
  ];

  const ethData = [
    { date: 'Apr 01', flow: 15, aum: 7800 },
    { date: 'Apr 02', flow: 40, aum: 7850 },
    { date: 'Apr 03', flow: -10, aum: 7840 },
    { date: 'Apr 04', flow: 35, aum: 7880 },
    { date: 'Apr 05', flow: 50, aum: 7950 },
    { date: 'Apr 08', flow: -25, aum: 7920 },
    { date: 'Apr 09', flow: 45, aum: 7960 },
    { date: 'Apr 10', flow: 60, aum: 8020 },
    { date: 'Apr 11', flow: -15, aum: 8000 },
    { date: 'Apr 12', flow: 20, aum: 8020 },
    { date: 'Apr 15', flow: 40, aum: 8060 },
    { date: 'Apr 16', flow: -5, aum: 8055 },
    { date: 'Apr 17', flow: 35, aum: 8100 },
    { date: 'Apr 18', flow: 12, aum: 8115 },
    { date: 'Apr 19', flow: -10, aum: 8105 },
    { date: 'Apr 22', flow: 45, aum: 8150 },
  ];

  const data = assetType === 'BTC' ? btcData : ethData;
  const color = assetType === 'BTC' ? '#fbbf24' : '#627eea';
  const colorClass = assetType === 'BTC' ? 'text-gold' : 'text-[#627eea]';
  const bgClass = assetType === 'BTC' ? 'bg-gold/20' : 'bg-[#627eea]/20';
  const borderClass = assetType === 'BTC' ? 'border-gold/30' : 'border-[#627eea]/30';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className={"absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 " + (isOpen ? 'opacity-100' : 'opacity-0')} 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className={"relative w-full max-w-5xl bg-dark-bg/95 backdrop-blur-2xl border rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 transform max-h-[90vh] flex flex-col " + borderClass + " " + animationClass}>
        
        {/* Glow Effects */}
        <div className={"absolute top-0 right-0 w-1/2 h-1 bg-gradient-to-l to-transparent opacity-50 " + (assetType === 'BTC' ? 'from-gold' : 'from-[#627eea]')}></div>
        <div className={"absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[100px] pointer-events-none " + (assetType === 'BTC' ? 'bg-gold/10' : 'bg-[#627eea]/10')}></div>

        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-4 relative z-10">
            <div className={"w-12 h-12 rounded-2xl flex items-center justify-center border " + bgClass + " " + borderClass}>
              {assetType === 'BTC' ? <Bitcoin className="w-6 h-6 text-gold" /> : <Activity className="w-6 h-6 text-[#627eea]" />}
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-white">{assetType === 'BTC' ? 'Bitcoin Spot ETFs' : 'Ethereum Spot ETFs'}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-medium text-gray-400">Institutional Fund Flows</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors relative z-10">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className={"glass-card p-5 border bg-gradient-to-br to-transparent " + borderClass + " " + bgClass.replace('/20', '/5')}>
              <span className="text-sm font-medium text-gray-400 mb-2 block">Daily Net Flow</span>
              <div className="flex items-end justify-between">
                <span className={"text-3xl font-mono font-bold " + colorClass}>
                  {assetType === 'BTC' ? '+$145M' : '+$45M'}
                </span>
              </div>
            </div>
            <div className="glass-card p-5 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block">Total AUM</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-mono font-bold text-white">
                  {assetType === 'BTC' ? '$55.0B' : '$8.15B'}
                </span>
              </div>
            </div>
            <div className="glass-card p-5 border border-white/5 bg-white/5">
              <span className="text-sm font-medium text-gray-400 mb-2 block">Trading Volume (24h)</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-mono font-bold text-white">
                  {assetType === 'BTC' ? '$2.4B' : '$840M'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-card p-6 flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                  <button 
                    onClick={() => setChartType('flow')}
                    className={"px-4 py-1.5 rounded-md text-sm font-medium transition-all " + (chartType === 'flow' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200')}
                  >
                    Net Flows
                  </button>
                  <button 
                    onClick={() => setChartType('aum')}
                    className={"px-4 py-1.5 rounded-md text-sm font-medium transition-all " + (chartType === 'aum' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-gray-200')}
                  >
                    Total AUM
                  </button>
                </div>
                <span className="text-sm text-gray-400 font-mono">in Millions USD</span>
              </div>
              
              <div className="flex-1 -ml-4 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'flow' ? (
                    <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barCategoryGap="5%">
                      <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} minTickGap={20} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} tickFormatter={(val) => "$" + val + "M"} width={45} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                        contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                        formatter={(val: any) => ["$" + val + "M", 'Net Flow']}
                      />
                      <Bar dataKey="flow" radius={[2,2,2,2]}>
                        {data.map((entry, index) => (
                          <Cell key={"cell-" + index} fill={entry.flow >= 0 ? '#22c55e' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id={"colorAum" + assetType} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={0.6}/>
                          <stop offset="50%" stopColor={color} stopOpacity={0.2}/>
                          <stop offset="100%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                        <filter id="glowAum" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} minTickGap={20} />
                      <YAxis domain={['dataMin - 500', 'dataMax + 500']} axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 10 }} tickFormatter={(val) => "$" + val + "M"} width={45} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: color, fontWeight: 'bold' }}
                        formatter={(val: any) => ["$" + val + "M", 'AUM']}
                      />
                      <Area type="monotoneX" dataKey="aum" stroke={color} strokeWidth={3} fillOpacity={1} fill={"url(#colorAum" + assetType + ")"} filter="url(#glowAum)" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-transparent border border-white/5 flex flex-col justify-center">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Info size={16} /> ETF Insights
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Spot ETFs allow traditional financial institutions and retail investors to gain direct exposure to {assetType === 'BTC' ? 'Bitcoin' : 'Ethereum'} without needing to custody the asset.
                </p>
                <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                  <span className="text-xs text-gray-500 uppercase font-bold tracking-wider block mb-1">Top Fund</span>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{assetType === 'BTC' ? 'iShares Bitcoin Trust (IBIT)' : 'iShares Ethereum Trust'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EtfFlowsModal;
