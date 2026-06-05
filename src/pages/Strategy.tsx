import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Cpu, 
  Zap, 
  ChevronRight,
  Lock,
  Layers,
  Sliders,
  Info,
  RefreshCcw,
  Loader2,
  Plus,
  Minus
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
  conditionMet: boolean;
}

const Strategy: React.FC = () => {
  // Global Live Feed Simulator Variables
  const [simDxy, setSimDxy] = useState<number>(103.5);
  const [simM2, setSimM2] = useState<number>(5.4);
  const [simFearGreed, setSimFearGreed] = useState<number>(35);

  // Automatic Feed Tick Counter
  const [secondsToTick, setSecondsToTick] = useState<number>(60);

  // Strategy Builder State
  const [ifCondition, setIfCondition] = useState<string>('dxy');
  const [operator, setOperator] = useState<string>('below');
  const [value, setValue] = useState<string>('104');
  const [andCondition, setAndCondition] = useState<string>('fng_fear');
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  
  // Unified Portfolio Deployment State (conservative / aggressive / null)
  const [activePortfolio, setActivePortfolio] = useState<'conservative' | 'aggressive' | null>(null);

  // Simulated Live Account Balance ($132,390.20 baseline)
  const [accountBalance, setAccountBalance] = useState<number>(132390.20);

  // Expanded Playbook Brief State
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string | null>(null);

  // Toast Notification State
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // High-Tech Bottom-Right Overlay System Alert State
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  // Ref for scrolling to portfolio cards
  const portfolioSectionRef = useRef<HTMLDivElement>(null);

  // Playbooks Data with dynamic condition checks
  const [playbooks, setPlaybooks] = useState<Playbook[]>([
    {
      id: 'playbook-1',
      name: 'DXY Inversion Strategy',
      risk: 'Medium',
      status: 'PENDING',
      indicators: ['DXY < 104', 'Fear & Greed < 40'],
      description: 'Tactical shift to capture capital rotation during US Dollar weakness.',
      allocation: 'Shift 30% allocation to high-beta Layer-1s.',
      conditionMet: false
    },
    {
      id: 'playbook-2',
      name: 'Fed Pivot Playbook',
      risk: 'Low',
      status: 'PENDING',
      indicators: ['M2 Growth > 2.0%'],
      description: 'Macro positioning for quantitative easing cycles and global fiat expansion.',
      allocation: 'Accumulate BTC/ETH using DCA strategy.',
      conditionMet: false
    },
    {
      id: 'playbook-3',
      name: 'Liquidity Surge Protocol',
      risk: 'High',
      status: 'PENDING',
      indicators: ['M2 Growth > 5.0%', 'Fear & Greed < 40'],
      description: 'Aggressive growth strategy triggered by global balance sheet expansion.',
      allocation: 'Deploy 20% to liquid ecosystem indexes and AI tokens.',
      conditionMet: false
    }
  ]);

  // 1-Minute Automatic Fluctuation Engine (useEffect & setInterval)
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsToTick(prev => {
        if (prev <= 1) {
          // Fluctuate DXY by +/- 0.05
          setSimDxy(d => {
            const dir = Math.random() > 0.5 ? 1 : -1;
            return Number(Math.min(110.0, Math.max(100.0, d + dir * 0.05)).toFixed(2));
          });
          // Fluctuate M2 by +/- 0.1%
          setSimM2(m => {
            const dir = Math.random() > 0.5 ? 1 : -1;
            return Number(Math.min(10.0, Math.max(0.0, m + dir * 0.1)).toFixed(1));
          });
          // Fluctuate Fear & Greed by +/- 1
          setSimFearGreed(fg => {
            const dir = Math.random() > 0.5 ? 1 : -1;
            return Math.min(90, Math.max(10, fg + dir));
          });
          triggerNotification("Live data feed ticked automatically", "info");
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Dynamically evaluate playbooks based on live feed values
  useEffect(() => {
    setPlaybooks(prev => prev.map(p => {
      let conditionMet = false;
      if (p.id === 'playbook-1') {
        conditionMet = simDxy < 104 && simFearGreed < 40;
      } else if (p.id === 'playbook-2') {
        conditionMet = simM2 > 2.0;
      } else if (p.id === 'playbook-3') {
        conditionMet = simM2 > 5.0 && simFearGreed < 40;
      }
      return {
        ...p,
        conditionMet,
        status: conditionMet ? 'ACTIVE' : 'PENDING'
      };
    }));
  }, [simDxy, simM2, simFearGreed]);

  // Simulated Account Balance Fluctuation Engine
  useEffect(() => {
    if (!activePortfolio) {
      setAccountBalance(132390.20);
      return;
    }

    const interval = setInterval(() => {
      setAccountBalance(prev => {
        const isUp = Math.random() > 0.5;
        if (activePortfolio === 'conservative') {
          // Conservative changes subtly by +/- $10
          const delta = Number((Math.random() * 10).toFixed(2));
          return Number((prev + (isUp ? delta : -delta)).toFixed(2));
        } else {
          // Aggressive swings wildly by +/- $140
          const delta = Number((Math.random() * 140).toFixed(2));
          return Number((prev + (isUp ? delta : -delta)).toFixed(2));
        }
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [activePortfolio]);

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  // Helper to trigger bottom-right matrix overlay alerts
  const triggerSystemAlert = (message: string) => {
    setSystemAlert(message);
    setTimeout(() => {
      setSystemAlert(null);
    }, 6000);
  };

  // Helper for status styles
  const getStatusBadge = (status: Playbook['status']) => {
    if (status === 'ACTIVE') {
      return (
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black tracking-widest bg-bullish/10 text-bullish border border-bullish/20 shadow-[0_0_15px_rgba(0,192,118,0.1)]">
          <span className="w-1.5 h-1.5 rounded-full bg-bullish animate-pulse"></span>
          ACTIVE
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black tracking-widest bg-gold/10 text-gold border border-gold/20">
        <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
        PENDING
      </span>
    );
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

  // Adjust simulator variables (Manual overrides)
  const adjustDxy = (amount: number) => {
    setSimDxy(prev => {
      const nextVal = Math.min(110.0, Math.max(100.0, Number((prev + amount).toFixed(2))));
      triggerNotification(`Manually adjusted DXY to ${nextVal.toFixed(2)}`, 'info');
      return nextVal;
    });
  };

  const adjustM2 = (amount: number) => {
    setSimM2(prev => {
      const nextVal = Math.min(10.0, Math.max(0.0, Number((prev + amount).toFixed(1))));
      triggerNotification(`Manually adjusted M2 to ${nextVal.toFixed(1)}%`, 'info');
      return nextVal;
    });
  };

  const adjustFearGreed = (amount: number) => {
    setSimFearGreed(prev => {
      const nextVal = Math.min(90, Math.max(10, prev + amount));
      triggerNotification(`Manually adjusted Fear & Greed to ${nextVal}`, 'info');
      return nextVal;
    });
  };

  // Toggle portfolio simulation deployment (safe toggle-off & mutex selection)
  const togglePortfolio = (portfolioId: 'conservative' | 'aggressive') => {
    if (activePortfolio === portfolioId) {
      setActivePortfolio(null);
      triggerNotification(`${portfolioId === 'conservative' ? 'Conservative' : 'Aggressive'} simulation undeployed`, 'info');
    } else {
      setActivePortfolio(portfolioId);
      triggerNotification(`${portfolioId === 'conservative' ? 'Conservative' : 'Aggressive'} simulation deployed`, 'success');
      triggerSystemAlert("SYSTEM: Strategy profile successfully injected into Live Matrix Simulation Engine.");
    }
  };

  // Handle Playbook "SIMULATE >" Action (link to portfolio highlighting & scroll)
  const handlePlaybookSimulate = (playbookId: string) => {
    // DXY Inversion -> Aggressive. Fed Pivot -> Conservative. Liquidity Surge -> Aggressive.
    const targetPortfolio = playbookId === 'playbook-2' ? 'conservative' : 'aggressive';
    setActivePortfolio(targetPortfolio);
    
    // Smooth scroll down to Model Portfolios Section
    portfolioSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    triggerNotification(`Simulating Playbook target: Selected & Highlighted ${targetPortfolio === 'conservative' ? 'Conservative' : 'Aggressive'} Portfolio`, 'success');
    triggerSystemAlert(`SYSTEM: Playbook target selection injected. Highlighting ${targetPortfolio === 'conservative' ? 'CONSERVATIVE' : 'AGGRESSIVE'} allocation model.`);
  };

  // Generate Interactive Simulation Recommendation
  const runSimulation = () => {
    setIsCompiling(true);
    triggerNotification("Executing compiler matrix...", "info");

    setTimeout(() => {
      let recommendation = '';
      let allocBtc = 50;
      let allocEth = 30;
      let allocAlt = 10;
      let allocCash = 10;
      let action = 'NEUTRAL / MONITOR';
      let actionColor = 'text-gold';
      let alertType: 'success' | 'warning' | 'info' = 'info';

      if (ifCondition === 'dxy' && operator === 'below' && value === '104' && andCondition === 'fng_fear') {
        recommendation = "COMPILATION SUCCESSFUL: Target asset allocation compiled. Matrix suggests high probability of capital rotation into Layer-1 assets.";
        allocBtc = 60;
        allocEth = 25;
        allocAlt = 15;
        allocCash = 0;
        action = 'STRONG BUY / ACCUMULATE';
        actionColor = 'text-bullish';
        alertType = 'success';
      } else if (ifCondition === 'dxy' && operator === 'above' && value === '106' && andCondition === 'fng_greed') {
        recommendation = "COMPILATION SUCCESSFUL: Extreme risk metric detected. Allocating capital away from volatility and securing fiat positions.";
        allocBtc = 20;
        allocEth = 10;
        allocAlt = 0;
        allocCash = 70;
        action = 'DE-RISK / LOCK PROFITS';
        actionColor = 'text-bearish';
        alertType = 'warning';
      } else if (ifCondition === 'rates' && operator === 'below' && value === '4.0' && andCondition === 'btc_dom_down') {
        recommendation = "COMPILATION SUCCESSFUL: Dynamic rotation protocol triggered. Capital moving systematically from BTC dominance into premium altcoins.";
        allocBtc = 30;
        allocEth = 30;
        allocAlt = 35;
        allocCash = 5;
        action = 'ROTATION TO ALTS';
        actionColor = 'text-cyan';
        alertType = 'success';
      } else if (ifCondition === 'm2' && operator === 'above' && value === '105' && andCondition === 'fng_fear') {
        recommendation = "COMPILATION SUCCESSFUL: Debt hedge protocol enabled. Cash rotation into hard assets. Accumulating digital stores of value.";
        allocBtc = 70;
        allocEth = 20;
        allocAlt = 10;
        allocCash = 0;
        action = 'LIQUIDITY DCA';
        actionColor = 'text-bullish';
        alertType = 'success';
      } else {
        recommendation = "COMPILATION SUCCESSFUL: Target asset allocation compiled. Matrix suggests high probability of capital rotation into Layer-1 assets.";
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

      setIsCompiling(false);
      triggerNotification(`Simulation Compiled: ${action}`, 'success');
    }, 1000);
  };

  const triggerNotification = (message: string, type: 'success' | 'info' | 'warning') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Reset simulator values to default
  const resetSimulator = () => {
    setSimDxy(103.5);
    setSimM2(5.4);
    setSimFearGreed(35);
    setSecondsToTick(60);
    triggerNotification("Simulator values reset to defaults", "info");
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
              notification.type === 'success' ? 'bg-bullish/10 border-bullish/20 text-bullish shadow-[0_0_20px_rgba(0,192,118,0.2)]' :
              notification.type === 'warning' ? 'bg-bearish/10 border-bearish/20 text-bearish shadow-[0_0_20px_rgba(255,59,105,0.2)]' :
              'bg-cyan/10 border-cyan/20 text-cyan shadow-[0_0_20px_rgba(0,245,255,0.2)]'
            }`}
          >
            <CheckCircle2 size={18} />
            <span className="text-xs font-black tracking-wider uppercase">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High-Tech Matrix System Alert Overlay */}
      <AnimatePresence>
        {systemAlert && (
          <motion.div 
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[250] bg-black/95 border border-cyan/30 text-cyan px-6 py-4 rounded-xl shadow-[0_0_30px_rgba(0,245,255,0.3)] backdrop-blur-md max-w-sm flex items-start gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-cyan animate-ping mt-1.5 shrink-0" />
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-cyan/70 mb-1">Matrix Terminal Status</div>
              <p className="text-xs font-mono font-bold leading-relaxed">{systemAlert}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Cpu size={14} className="text-gold animate-pulse" />
            <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">DAILYFI ALGORITHMIC LAB</span>
          </div>
          <h1 className="text-4xl font-heading font-black text-white tracking-tighter uppercase">Strategy Desks</h1>
          <p className="text-gray-500 mt-2 text-base font-medium">Data-driven playbooks matching macroeconomic variables with asset allocation profiles.</p>
        </div>
        
        {/* Dynamic Badges and Live Account Balance */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="glass-card-laser px-5 py-3 border-cyan/15 bg-cyan/5 flex flex-col items-end shrink-0 rounded-xl">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Simulated Matrix Value</span>
            <span className="text-xl font-mono font-black text-cyan tracking-wider glow-cyan mt-0.5">
              {formatCurrency(accountBalance)}
            </span>
          </div>
          <div className="flex flex-col gap-2 items-end shrink-0">
            <div className="flex items-center gap-3 glass-card-laser px-4 py-2 border-gold/10 bg-gold/5">
              <Lock size={12} className="text-gold" />
              <span className="text-[10px] font-black text-gold uppercase tracking-widest laser-badge">Simulation Mode Active</span>
            </div>
            {activePortfolio ? (
              <div className="text-[10px] font-black text-cyan uppercase tracking-widest bg-cyan/10 border border-cyan/20 px-3 py-1 rounded shadow-[0_0_15px_rgba(0,245,255,0.2)] animate-pulse">
                ACTIVE PROFILE: {activePortfolio.toUpperCase()}
              </div>
            ) : (
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white/5 border border-white/5 px-3 py-1 rounded">
                ACTIVE PROFILE: NONE
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OVERHAULED LIVE MACRO FEED SIMULATOR (Sleek Horizontal Dock) */}
      <div className="glass-card-laser bg-black/40 border-white/5 py-4 px-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
        
        {/* Left Side Info */}
        <div className="flex items-center gap-4 relative z-10 shrink-0">
          <div className="text-[10px] font-black text-cyan uppercase tracking-widest bg-cyan/5 border border-cyan/20 px-2.5 py-1.5 rounded flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"></span>
            Live Feed Console
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Macro Feed Simulator</h3>
            <p className="text-[9px] text-gray-500 font-medium">
              Auto ticks in <span className="font-mono text-cyan font-bold">{secondsToTick}s</span>
            </p>
          </div>
        </div>

        {/* Matrix of Indicators (Compact side-by-side row) */}
        <div className="flex flex-wrap items-center justify-center gap-6 relative z-10 w-full max-w-2xl">
          
          {/* DXY Compact Control */}
          <div className="flex items-center gap-3 bg-black/60 border border-white/5 px-4 py-2 rounded-lg relative overflow-hidden flex-1 min-w-[170px]">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider shrink-0">DXY</span>
            <div className="flex items-center gap-2 ml-auto">
              <button 
                onClick={() => adjustDxy(-0.05)}
                className="w-5 h-5 rounded bg-white/5 border border-white/10 hover:border-cyan/50 hover:bg-cyan/10 flex items-center justify-center text-white transition-colors active:scale-90"
              >
                <Minus size={10} />
              </button>
              <span className="text-xs font-mono font-black text-white w-12 text-center">{simDxy.toFixed(2)}</span>
              <button 
                onClick={() => adjustDxy(0.05)}
                className="w-5 h-5 rounded bg-white/5 border border-white/10 hover:border-cyan/50 hover:bg-cyan/10 flex items-center justify-center text-white transition-colors active:scale-90"
              >
                <Plus size={10} />
              </button>
            </div>
            {/* Laser Underline */}
            <div className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-500 ${
              simDxy < 104 ? 'bg-bullish shadow-[0_0_8px_rgba(0,192,118,0.8)]' : 'bg-transparent'
            }`} />
          </div>

          {/* M2 Compact Control */}
          <div className="flex items-center gap-3 bg-black/60 border border-white/5 px-4 py-2 rounded-lg relative overflow-hidden flex-1 min-w-[170px]">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider shrink-0">M2</span>
            <div className="flex items-center gap-2 ml-auto">
              <button 
                onClick={() => adjustM2(-0.1)}
                className="w-5 h-5 rounded bg-white/5 border border-white/10 hover:border-cyan/50 hover:bg-cyan/10 flex items-center justify-center text-white transition-colors active:scale-90"
              >
                <Minus size={10} />
              </button>
              <span className="text-xs font-mono font-black text-white w-12 text-center">{simM2.toFixed(1)}%</span>
              <button 
                onClick={() => adjustM2(0.1)}
                className="w-5 h-5 rounded bg-white/5 border border-white/10 hover:border-cyan/50 hover:bg-cyan/10 flex items-center justify-center text-white transition-colors active:scale-90"
              >
                <Plus size={10} />
              </button>
            </div>
            {/* Laser Underline */}
            <div className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-500 ${
              simM2 > 2.0 ? 'bg-bullish shadow-[0_0_8px_rgba(0,192,118,0.8)]' : 'bg-transparent'
            }`} />
          </div>

          {/* Fear & Greed Compact Control */}
          <div className="flex items-center gap-3 bg-black/60 border border-white/5 px-4 py-2 rounded-lg relative overflow-hidden flex-1 min-w-[170px]">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider shrink-0">F&G</span>
            <div className="flex items-center gap-2 ml-auto">
              <button 
                onClick={() => adjustFearGreed(-1)}
                className="w-5 h-5 rounded bg-white/5 border border-white/10 hover:border-cyan/50 hover:bg-cyan/10 flex items-center justify-center text-white transition-colors active:scale-90"
              >
                <Minus size={10} />
              </button>
              <span className="text-xs font-mono font-black text-white w-12 text-center">{simFearGreed}</span>
              <button 
                onClick={() => adjustFearGreed(1)}
                className="w-5 h-5 rounded bg-white/5 border border-white/10 hover:border-cyan/50 hover:bg-cyan/10 flex items-center justify-center text-white transition-colors active:scale-90"
              >
                <Plus size={10} />
              </button>
            </div>
            {/* Laser Underline */}
            <div className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-500 ${
              simFearGreed < 40 ? 'bg-bullish shadow-[0_0_8px_rgba(0,192,118,0.8)]' : 'bg-transparent'
            }`} />
          </div>

        </div>

        {/* Right Side Reset */}
        <button 
          onClick={resetSimulator}
          className="flex items-center gap-1 text-[9px] font-black text-gray-400 hover:text-cyan border border-white/5 hover:border-cyan/30 px-2.5 py-1.5 rounded transition-all active:scale-95 bg-white/5 shrink-0 relative z-10"
        >
          <RefreshCcw size={10} /> Reset
        </button>
      </div>

      {/* SECTION 1: ACTIVE MACRO PLAYBOOKS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-heading font-black text-white flex items-center gap-3 tracking-widest uppercase">
            <span className="w-1.5 h-6 bg-gold rounded-full"></span>
            Active Macro Playbooks
          </h2>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            {playbooks.filter(p => p.status === 'ACTIVE').length} Systems Active
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {playbooks.map((p) => (
            <div 
              key={p.id} 
              onClick={() => setSelectedPlaybookId(prev => prev === p.id ? null : p.id)}
              className={`glass-card-laser p-6 flex flex-col justify-between h-[280px] transition-all duration-500 group relative cursor-pointer ${
                selectedPlaybookId === p.id 
                  ? 'border-cyan shadow-[0_0_20px_rgba(0,245,255,0.1)] bg-black/60' 
                  : p.status === 'ACTIVE'
                  ? 'border-bullish/30 shadow-[0_0_20px_rgba(0,192,118,0.05)] bg-black/50 hover:border-cyan/30'
                  : 'bg-black/40 border-white/5 hover:border-white/20'
              }`}
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

              {/* Glowing action simulate button */}
              <div className="pt-4 border-t border-white/5 relative z-10 flex items-center justify-between mt-4">
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Playbook Target</div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlaybookSimulate(p.id);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-gold/20 bg-gold/5 hover:bg-gold/15 text-xs font-black text-gold uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,215,0,0.05)] hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all active:scale-95"
                >
                  Simulate <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Analytical Brief Expansion Drawer */}
        <AnimatePresence>
          {selectedPlaybookId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden w-full pt-2"
            >
              <div className="glass-card-laser p-6 bg-cyan/5 border-cyan/20 rounded-xl relative shadow-[0_0_20px_rgba(0,245,255,0.05)]">
                <div className="flex items-center gap-2 mb-2">
                  <Info size={14} className="text-cyan animate-pulse" />
                  <span className="text-[10px] font-black text-cyan uppercase tracking-widest">Integrated Analytical Matrix Brief</span>
                </div>
                <p className="text-sm font-mono text-gray-300 leading-relaxed">
                  {selectedPlaybookId === 'playbook-1' && 
                    "ANALYSIS: DXY weakness historically triggers capital rotation into high-beta risk assets. Current matrix yields a 78% historical probability of Layer-1 outperformance."
                  }
                  {selectedPlaybookId === 'playbook-2' && 
                    "ANALYSIS: Interest rate cuts expand global M2 money supply. Recommended action: Systematic DCA into hard store-of-value assets (BTC/ETH)."
                  }
                  {selectedPlaybookId === 'playbook-3' && 
                    "ANALYSIS: High global liquidity growth combined with extreme fear creates an optimal asymmetric risk-reward window. Reallocating into ecosystem and high-beta protocols."
                  }
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 2: MODEL PORTFOLIOS */}
      <div ref={portfolioSectionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
        
        {/* Portfolio A - Conservative */}
        <div className={`glass-card-laser p-8 bg-black/60 relative overflow-hidden transition-all duration-500 ${
          activePortfolio === 'conservative' 
            ? 'border-cyan ring-2 ring-cyan shadow-[0_0_30px_rgba(0,245,255,0.3)] bg-black/80' 
            : 'border-white/5 hover:border-white/20'
        } ${activePortfolio === 'conservative' ? 'animate-[pulse_4s_infinite]' : ''}`}>
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
              onClick={() => togglePortfolio('conservative')}
              className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 ${
                activePortfolio === 'conservative'
                  ? 'bg-cyan text-black shadow-[0_0_20px_rgba(0,245,255,0.5)] font-black border border-cyan/50'
                  : 'bg-white/5 border border-white/10 hover:border-cyan/55 text-white'
              }`}
            >
              {activePortfolio === 'conservative' ? 'SIMULATION DEPLOYED' : 'Deploy Simulation'}
            </button>
          </div>
        </div>

        {/* Portfolio B - Aggressive */}
        <div className={`glass-card-laser p-8 bg-black/60 relative overflow-hidden transition-all duration-500 ${
          activePortfolio === 'aggressive' 
            ? 'border-cyan ring-2 ring-cyan shadow-[0_0_30px_rgba(0,245,255,0.3)] bg-black/80' 
            : 'border-white/5 hover:border-white/20'
        } ${activePortfolio === 'aggressive' ? 'animate-[pulse_4s_infinite]' : ''}`}>
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
              onClick={() => togglePortfolio('aggressive')}
              className={`px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 ${
                activePortfolio === 'aggressive'
                  ? 'bg-cyan text-black shadow-[0_0_20px_rgba(0,245,255,0.5)] font-black border border-cyan/50'
                  : 'bg-white/5 border border-white/10 hover:border-cyan/55 text-white'
              }`}
            >
              {activePortfolio === 'aggressive' ? 'SIMULATION DEPLOYED' : 'Deploy Simulation'}
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
                  onChange={(e) => {
                    const val = e.target.value;
                    setIfCondition(val);
                    if (val === 'dxy') setValue('104');
                    else if (val === 'rates') setValue('4.0');
                    else if (val === 'm2') setValue('105');
                    else if (val === 'yields') setValue('3.8');
                  }}
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
                  disabled={isCompiling}
                  className="w-full bg-gold hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isCompiling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Compiling Matrix...
                    </>
                  ) : (
                    'Compile Playbook logic'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Recommendation Box */}
          <div className="lg:col-span-1 border border-white/5 bg-black/40 rounded-2xl p-6 relative overflow-hidden h-[260px] flex flex-col justify-between">
            {simulationResult ? (
              <div className="flex flex-col h-full justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-wider">Calculated Action</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${simulationResult.actionColor}`}>
                      {simulationResult.action}
                    </span>
                  </div>
                  <div className="bg-bullish/10 border border-bullish/20 rounded-xl p-3 shadow-[0_0_15px_rgba(0,192,118,0.05)]">
                    <p className="text-[11px] text-bullish font-bold leading-relaxed">
                      {simulationResult.recommendation}
                    </p>
                  </div>
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
