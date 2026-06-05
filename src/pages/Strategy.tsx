import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Cpu, 
  Zap, 
  ChevronRight,
  Lock,
  Layers,
  Sliders,
  Info
} from 'lucide-react';

// Types
interface Playbook {
  id: string;
  name: string;
  risk: 'Low' | 'Medium' | 'High';
  status: 'ACTIVE' | 'PENDING' | 'PAUSED';
  indicators: string[];
  description: string;
  allocation: string;
}

const Strategy: React.FC = () => {
  // Strategy Builder State
  const [ifCondition, setIfCondition] = useState<string>('dxy');
  const [operator, setOperator] = useState<string>('below');
  const [value, setValue] = useState<string>('104');
  const [andCondition, setAndCondition] = useState<string>('fng_fear');
  const [simulationResult, setSimulationResult] = useState<any>(null);
  
  // Notification State
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Playbooks Data
  const playbooks: Playbook[] = [
    {
      id: 'playbook-1',
      name: 'DXY Inversion Strategy',
      risk: 'Medium',
      status: 'ACTIVE',
      indicators: ['DXY < 104', 'BTC Overbought'],
      description: 'Tactical shift to capture capital rotation during US Dollar weakness.',
      allocation: 'Shift 30% allocation to high-beta Layer-1s.'
    },
    {
      id: 'playbook-2',
      name: 'Fed Pivot Playbook',
      risk: 'Low',
      status: 'PENDING',
      indicators: ['Interest Rates Cut', 'M2 Expanding'],
      description: 'Macro positioning for quantitative easing cycles and global fiat expansion.',
      allocation: 'Accumulate BTC/ETH using DCA strategy.'
    },
    {
      id: 'playbook-3',
      name: 'Liquidity Surge Protocol',
      risk: 'High',
      status: 'ACTIVE',
      indicators: ['Global M2 > 5%', 'Fear & Greed < 40'],
      description: 'Aggressive growth strategy triggered by global balance sheet expansion.',
      allocation: 'Deploy 20% to liquid ecosystem indexes and AI tokens.'
    }
  ];

  // Helper for status styles
  const getStatusBadge = (status: Playbook['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black tracking-widest bg-bullish/10 text-bullish border border-bullish/20">
            <span className="w-1.5 h-1.5 rounded-full bg-bullish animate-pulse"></span>
            ACTIVE
          </span>
        );
      case 'PENDING':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black tracking-widest bg-gold/10 text-gold border border-gold/20">
            <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
            PENDING
          </span>
        );
      case 'PAUSED':
        return (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black tracking-widest bg-white/5 text-gray-500 border border-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
            PAUSED
          </span>
        );
    }
  };

  // Helper for risk styles
  const getRiskBadge = (risk: Playbook['risk']) => {
    switch (risk) {
      case 'Low':
        return <span className="text-[10px] font-bold text-cyan bg-cyan/10 px-2 py-0.5 rounded border border-cyan/20">LOW RISK</span>;
      case 'Medium':
        return <span className="text-[10px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">MED RISK</span>;
      case 'High':
        return <span className="text-[10px] font-bold text-bearish bg-bearish/10 px-2 py-0.5 rounded border border-bearish/20">HIGH RISK</span>;
    }
  };

  // Generate Interactive Simulation Recommendation
  const runSimulation = () => {
    let recommendation = '';
    let allocBtc = 50;
    let allocEth = 30;
    let allocAlt = 10;
    let allocCash = 10;
    let action = 'NEUTRAL / MONITOR';
    let actionColor = 'text-gold';
    let alertType: 'success' | 'warning' | 'info' = 'info';

    if (ifCondition === 'dxy' && operator === 'below' && value === '104' && andCondition === 'fng_fear') {
      recommendation = "Optimal buying opportunity. A weakening US Dollar index paired with retail market capitulation (Extreme Fear) has historically marked major local bottoms. We recommend high-exposure asset acquisition.";
      allocBtc = 60;
      allocEth = 25;
      allocAlt = 15;
      allocCash = 0;
      action = 'STRONG BUY / ACCUMULATE';
      actionColor = 'text-bullish';
      alertType = 'success';
    } else if (ifCondition === 'dxy' && operator === 'above' && value === '106' && andCondition === 'fng_greed') {
      recommendation = "Risk-Off protective protocol suggested. Strong dollar index trajectory coupled with market euphoria (Extreme Greed) is a high-risk regime. Consider locking profits and building cash reserves.";
      allocBtc = 20;
      allocEth = 10;
      allocAlt = 0;
      allocCash = 70;
      action = 'DE-RISK / LOCK PROFITS';
      actionColor = 'text-bearish';
      alertType = 'warning';
    } else if (ifCondition === 'rates' && operator === 'below' && value === '4.0' && andCondition === 'btc_dom_down') {
      recommendation = "Altseason expansion regime. Lower interest rates trigger global yield chasing, while declining BTC Dominance signifies rotation down the risk curve into major L1s and utility tokens.";
      allocBtc = 30;
      allocEth = 30;
      allocAlt = 35;
      allocCash = 5;
      action = 'ROTATION TO ALTS';
      actionColor = 'text-cyan';
      alertType = 'success';
    } else if (ifCondition === 'm2' && operator === 'above' && value === '105' && andCondition === 'fng_fear') {
      recommendation = "Liquidity injection signal. Rapid expansion of global money supply during fear states creates a powerful asset-inflation hedge. Acquire hard assets prior to currency devaluation.";
      allocBtc = 70;
      allocEth = 20;
      allocAlt = 10;
      allocCash = 0;
      action = 'LIQUIDITY DCA';
      actionColor = 'text-bullish';
      alertType = 'success';
    } else {
      // Default dynamic calculation
      recommendation = `Custom algorithmic playbook compiled. Conditions suggest a hybrid regime. Monitoring indicator thresholds for precise entry/exit execution.`;
      allocBtc = 40;
      allocEth = 30;
      allocAlt = 10;
      allocCash = 20;
      action = 'BALANCED REBALANCE';
      actionColor = 'text-cyan';
      alertType = 'info';
    }

    setSimulationResult({
      recommendation,
      allocations: [
        { name: 'Bitcoin (BTC)', percent: allocBtc, color: 'bg-gold' },
        { name: 'Ethereum (ETH)', percent: allocEth, color: 'bg-indigo-500' },
        { name: 'Altcoins (L1/DeFi)', percent: allocAlt, color: 'bg-cyan' },
        { name: 'Cash / Stablecoins', percent: allocCash, color: 'bg-gray-600' }
      ],
      action,
      actionColor,
      alertType
    });

    triggerNotification(`Strategy Simulation Compiled: ${action}`, 'success');
  };

  const triggerNotification = (message: string, type: 'success' | 'info' | 'warning') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="relative min-h-screen pb-12 space-y-10 animate-in fade-in duration-500">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-[200] flex items-center gap-3 px-6 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl ${
              notification.type === 'success' ? 'bg-bullish/10 border-bullish/20 text-bullish' :
              notification.type === 'warning' ? 'bg-bearish/10 border-bearish/20 text-bearish' :
              'bg-cyan/10 border-cyan/20 text-cyan'
            }`}
          >
            <CheckCircle2 size={18} />
            <span className="text-xs font-black tracking-wider uppercase">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={14} className="text-gold animate-pulse" />
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">DAILYFI ALGORITHMIC LAB</span>
          </div>
          <h1 className="text-4xl font-heading font-black text-white tracking-tighter uppercase">Strategy Desks</h1>
          <p className="text-gray-500 mt-2 text-base font-medium">Data-driven playbooks matching macroeconomic variables with asset allocation profiles.</p>
        </div>
        <div className="flex items-center gap-3 glass-card-laser px-5 py-2.5 border-gold/10 bg-gold/5">
          <Lock size={14} className="text-gold" />
          <span className="text-[10px] font-black text-gold uppercase tracking-widest laser-badge">Simulation Mode Active</span>
        </div>
      </div>

      {/* SECTION 1: ACTIVE MACRO PLAYBOOKS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-black text-white flex items-center gap-3 tracking-widest uppercase">
            <span className="w-1.5 h-6 bg-gold rounded-full"></span>
            Active Macro Playbooks
          </h2>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">3 Systems Operational</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {playbooks.map((p) => (
            <div 
              key={p.id} 
              className="glass-card-laser p-6 flex flex-col justify-between h-[280px] bg-black/40 border-white/5 hover:border-white/20 transition-all duration-500 group relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                  {getStatusBadge(p.status)}
                  {getRiskBadge(p.risk)}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">{p.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
                </div>

                <div className="pt-2">
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-wider mb-2">Condition Dependencies</div>
                  <div className="flex flex-wrap gap-2">
                    {p.indicators.map((ind, i) => (
                      <span key={i} className="text-[10px] font-mono bg-white/5 border border-white/10 rounded px-2.5 py-1 text-gray-300">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 relative z-10 flex items-center justify-between mt-4">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Playbook Target</div>
                <button 
                  onClick={() => triggerNotification(`Playbook simulation updated for: ${p.name}`, 'info')}
                  className="text-xs font-black text-gold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Simulate <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: MODEL PORTFOLIOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        {/* Portfolio A */}
        <div className="glass-card-laser p-8 bg-black/60 border-white/5 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[80px] pointer-events-none opacity-20"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Layers className="text-cyan" size={16} />
                <span className="text-[9px] font-black text-cyan uppercase tracking-widest">Defensive Allocation</span>
              </div>
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-wider">Macro-Shielded (Conservative)</h3>
            </div>
            <span className="text-[10px] font-bold text-cyan bg-cyan/10 px-2 py-0.5 rounded border border-cyan/20">LOW BETA</span>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed mb-6">Designed to preserve buying power and hedge against systemic currency devaluation using sovereign hard assets.</p>

          <div className="space-y-4">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">Asset Weight Matrix</div>
            
            {/* BTC Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span>Bitcoin (BTC)</span>
                <span className="text-gold">70%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gold w-[70%] rounded-full shadow-[0_0_10px_rgba(255,215,0,0.3)]"></div>
              </div>
            </div>

            {/* ETH Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span>Ethereum (ETH)</span>
                <span className="text-indigo-400">20%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[20%] rounded-full"></div>
              </div>
            </div>

            {/* Gold Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span>Gold Spot (XAU)</span>
                <span className="text-amber-600">10%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 w-[10%] rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex gap-6">
              <div>
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Volatility Profile</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">Low-Med</div>
              </div>
              <div>
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Dominant Beta</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">0.68</div>
              </div>
            </div>
            <button 
              onClick={() => triggerNotification("Conservative allocation loaded into local simulation wallet", "success")}
              className="px-4 py-2 bg-white/5 border border-white/10 hover:border-cyan/50 rounded-lg text-xs font-bold text-white transition-all active:scale-95"
            >
              Deploy Simulation
            </button>
          </div>
        </div>

        {/* Portfolio B */}
        <div className="glass-card-laser p-8 bg-black/60 border-white/5 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[80px] pointer-events-none opacity-20"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap className="text-gold" size={16} />
                <span className="text-[9px] font-black text-gold uppercase tracking-widest">Risk-On Momentum</span>
              </div>
              <h3 className="text-xl font-heading font-black text-white uppercase tracking-wider">Liquidity Surge (Aggressive)</h3>
            </div>
            <span className="text-[10px] font-bold text-bearish bg-bearish/10 px-2 py-0.5 rounded border border-bearish/20">HIGH BETA</span>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed mb-6">Optimized to maximize returns during quantitative easing cycles by allocating capital to high-beta digital assets.</p>

          <div className="space-y-4">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider mb-2">Asset Weight Matrix</div>
            
            {/* BTC Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span>Bitcoin (BTC)</span>
                <span className="text-gold">40%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gold w-[40%] rounded-full shadow-[0_0_10px_rgba(255,215,0,0.3)]"></div>
              </div>
            </div>

            {/* Altcoins Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span>Layer-2 & Altcoins</span>
                <span className="text-cyan">40%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan w-[40%] rounded-full shadow-[0_0_10px_rgba(0,245,255,0.3)]"></div>
              </div>
            </div>

            {/* High-Beta L1s Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span>High-Beta L1s</span>
                <span className="text-indigo-400">20%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[20%] rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex gap-6">
              <div>
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Volatility Profile</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">High</div>
              </div>
              <div>
                <div className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Dominant Beta</div>
                <div className="text-xs font-mono font-bold text-white mt-0.5">1.45</div>
              </div>
            </div>
            <button 
              onClick={() => triggerNotification("Aggressive allocation loaded into local simulation wallet", "success")}
              className="px-4 py-2 bg-white/5 border border-white/10 hover:border-cyan/50 rounded-lg text-xs font-bold text-white transition-all active:scale-95"
            >
              Deploy Simulation
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: INTERACTIVE "IF-THEN" STRATEGY BUILDER */}
      <div className="glass-card-laser p-8 bg-black/60 border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none opacity-20"></div>
        
        <div className="flex items-center gap-3 mb-8">
          <Sliders className="text-gold animate-pulse" size={20} />
          <div>
            <h2 className="text-2xl font-heading font-black text-white uppercase tracking-widest">Algorithmic Playbook Compiler</h2>
            <p className="text-xs text-gray-500 font-medium tracking-wider mt-1">Select logic variables to simulate portfolio directives.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* IF Condition */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider">IF (Macro Variable)</label>
                <select 
                  value={ifCondition} 
                  onChange={(e) => setIfCondition(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white text-xs focus:outline-none focus:border-cyan transition-colors"
                >
                  <option value="dxy">DXY Index</option>
                  <option value="rates">Interest Rates</option>
                  <option value="m2">M2 Liquidity</option>
                  <option value="yields">US 10Y Yield</option>
                </select>
              </div>

              {/* Operator */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider">Operator</label>
                <select 
                  value={operator} 
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white text-xs focus:outline-none focus:border-cyan transition-colors"
                >
                  <option value="below">drops below</option>
                  <option value="above">rises above</option>
                </select>
              </div>

              {/* Value Threshold */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider">Value Threshold</label>
                <select 
                  value={value} 
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white text-xs focus:outline-none focus:border-cyan transition-colors"
                >
                  {ifCondition === 'dxy' && (
                    <>
                      <option value="104">104</option>
                      <option value="106">106</option>
                    </>
                  )}
                  {ifCondition === 'rates' && (
                    <>
                      <option value="4.0">4.0%</option>
                      <option value="5.5">5.5%</option>
                    </>
                  )}
                  {ifCondition === 'm2' && (
                    <>
                      <option value="105">Expanding ($105T)</option>
                      <option value="98">Contracting ($98T)</option>
                    </>
                  )}
                  {ifCondition === 'yields' && (
                    <>
                      <option value="3.8">3.8%</option>
                      <option value="4.5">4.5%</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end pt-2">
              {/* AND Condition */}
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider">AND (Market Sentiment)</label>
                <select 
                  value={andCondition} 
                  onChange={(e) => setAndCondition(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white text-xs focus:outline-none focus:border-cyan transition-colors"
                >
                  <option value="fng_fear">Fear & Greed is Extreme Fear</option>
                  <option value="fng_greed">Fear & Greed is Extreme Greed</option>
                  <option value="btc_dom_down">BTC Dominance drops below 50%</option>
                </select>
              </div>

              {/* Action Compile */}
              <div>
                <button 
                  onClick={runSimulation}
                  className="w-full bg-gold hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] active:scale-95"
                >
                  Compile Playbook logic
                </button>
              </div>
            </div>
          </div>

          {/* Recommendation Box */}
          <div className="lg:col-span-1 border border-white/5 bg-black/40 rounded-2xl p-6 relative overflow-hidden h-[260px] flex flex-col justify-between">
            {simulationResult ? (
              <div className="flex flex-col h-full justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Calculated Action</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${simulationResult.actionColor}`}>
                      {simulationResult.action}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed font-medium line-clamp-4">
                    {simulationResult.recommendation}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Target Weights</div>
                  <div className="flex gap-2">
                    {simulationResult.allocations.map((alloc: any, i: number) => (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <span className="text-[10px] font-mono font-bold text-white mb-1">{alloc.percent}%</span>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${alloc.color}`} style={{ width: `${alloc.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                <Info className="text-gray-600 w-10 h-10" />
                <div>
                  <h4 className="text-xs font-bold text-gray-300">Ready for Compilation</h4>
                  <p className="text-[10px] text-gray-500 max-w-[200px] mt-1">Select your macroeconomic criteria and select compile.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
};

export default Strategy;
