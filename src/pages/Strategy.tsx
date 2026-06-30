import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Cpu, Zap, Lock, Sliders, RefreshCcw, Loader2, ChevronDown } from 'lucide-react';

type Portfolio = 'conservative' | 'aggressive' | null;

interface PB { id: string; name: string; risk: 'Low'|'Medium'|'High'; desc: string; conds: string[]; analysis: string; target: Portfolio; }

const PBs: PB[] = [
  { id:'pb1', name:'DXY Inversion Strategy', risk:'Medium', desc:'Tactical shift to capture capital rotation during US Dollar weakness.', conds:['DXY < 104','Fear & Greed < 40'], analysis:'QUANT ANALYSIS: DXY structural weakness historically accelerates smart money rotation into high-beta risk assets. Expect 78% probability of Layer-1 outperformance.', target:'aggressive' },
  { id:'pb2', name:'Fed Pivot Playbook', risk:'Low', desc:'Macro positioning for quantitative easing cycles and global fiat expansion.', conds:['M2 Growth > 2.0%'], analysis:'QUANT ANALYSIS: Federal Reserve interest rate cuts physically expand global M2 liquidity. Systematic dollar-cost averaging (DCA) into hard assets (BTC/ETH) is highly favored.', target:'conservative' },
  { id:'pb3', name:'Liquidity Surge Protocol', risk:'High', desc:'Aggressive growth strategy triggered by global balance sheet expansion.', conds:['M2 Growth > 5.0%','Fear & Greed < 40'], analysis:'QUANT ANALYSIS: Extreme M2 expansion combined with fear-phase entry creates optimal conditions for high-beta asset accumulation. Deploy liquidity into L1 ecosystem indexes.', target:'aggressive' },
];

const PORTFOLIOS = [
  { id:'conservative' as const, label:'MACRO-SHIELDED (CONSERVATIVE)', beta:'LOW BETA', sub:'DEFENSIVE ALLOCATION', icon:'🛡', color:'cyan', desc:'Designed to preserve buying power and hedge against systemic currency devaluation using sovereign hard assets.', allocs:[{a:'Bitcoin (BTC)',p:40},{a:'Gold/Commodities',p:25},{a:'Ethereum (ETH)',p:20},{a:'Stablecoins',p:15}] },
  { id:'aggressive' as const, label:'LIQUIDITY SURGE (AGGRESSIVE)', beta:'HIGH BETA', sub:'RISK-ON MOMENTUM', icon:'⚡', color:'gold', desc:'Optimized to maximize returns during quantitative easing cycles by allocating to high-beta digital assets.', allocs:[{a:'Bitcoin (BTC)',p:35},{a:'Ethereum (ETH)',p:30},{a:'Layer-1 Alts',p:25},{a:'DeFi / AI Tokens',p:10}] },
];

const riskCls = (r: string) => r==='Low'?'text-cyan bg-cyan/10 border-cyan/20':r==='Medium'?'text-gold bg-gold/10 border-gold/20':'text-bearish bg-bearish/10 border-bearish/20';

const Strategy: React.FC = () => {
  const [dxy, setDxy] = useState(103.5);
  const [m2, setM2] = useState(5.4);
  const [fg, setFg] = useState(35);
  const [tick, setTick] = useState(60);
  const [activePortfolio, setActivePortfolio] = useState<Portfolio>(null);
  const [balance, setBalance] = useState(132390.20);
  const [expandedPB, setExpandedPB] = useState<string|null>(null);
  const [highlightPort, setHighlightPort] = useState<Portfolio>(null);
  const [systemAlert, setSystemAlert] = useState<string|null>(null);
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null);
  const [ifC, setIfC] = useState('dxy'); const [op, setOp] = useState('below'); const [val, setVal] = useState('104'); const [andC, setAndC] = useState('fng_fear');
  const [compiling, setCompiling] = useState(false); const [result, setResult] = useState<any>(null);
  const portRef = useRef<HTMLDivElement>(null);

  const conds = (pb: PB) => {
    if(pb.id==='pb1') return dxy<104 && fg<40;
    if(pb.id==='pb2') return m2>2.0;
    return m2>5.0 && fg<40;
  };

  const pop = (msg:string,ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),4000); };
  const alert = (msg:string) => { setSystemAlert(msg); setTimeout(()=>setSystemAlert(null),6000); };

  useEffect(()=>{
    const t=setInterval(()=>setTick(p=>{
      if(p<=1){
        setDxy(d=>+Math.min(110,Math.max(100,d+(Math.random()>.5?.05:-.05))).toFixed(2));
        setM2(m=>+Math.min(10,Math.max(0,m+(Math.random()>.5?.1:-.1))).toFixed(1));
        setFg(f=>Math.min(90,Math.max(10,f+(Math.random()>.5?1:-1))));
        return 60;
      }
      return p-1;
    }),1000);
    return ()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    if(!activePortfolio){setBalance(132390.20);return;}
    const t=setInterval(()=>{
      setBalance(p=>{
        const d=activePortfolio==='conservative'?+(Math.random()*15).toFixed(2):+(Math.random()*180).toFixed(2);
        return +(p+(Math.random()>.5?d:-d)).toFixed(2);
      });
    },3000);
    return ()=>clearInterval(t);
  },[activePortfolio]);

  const deploy = (id:'conservative'|'aggressive') => {
    if(activePortfolio===id){setActivePortfolio(null);pop(`${id} simulation undeployed`,false);}
    else{setActivePortfolio(id);pop(`${id.toUpperCase()} profile deployed`);alert('SYSTEM: Allocation matrix injected. Executing portfolio simulation engine.');}
  };

  const simulate = (pb: PB, e: React.MouseEvent) => {
    e.stopPropagation();
    setHighlightPort(pb.target);
    portRef.current?.scrollIntoView({behavior:'smooth',block:'start'});
    pop(`Simulating ${pb.name} → ${pb.target} portfolio highlighted`);
    setTimeout(()=>setHighlightPort(null),5000);
  };

  const runSim = () => {
    setCompiling(true);
    setTimeout(()=>{
      const presets: Record<string,any> = {
        'dxy:below:104:fng_fear':{action:'STRONG BUY',color:'text-bullish',alloc:[60,25,15,0]},
        'dxy:above:106:fng_greed':{action:'DE-RISK',color:'text-bearish',alloc:[20,10,0,70]},
        'rates:below:4.0:btc_dom_down':{action:'ROTATION TO ALTS',color:'text-cyan',alloc:[30,30,35,5]},
        'm2:above:105:fng_fear':{action:'LIQUIDITY DCA',color:'text-bullish',alloc:[70,20,10,0]},
      };
      const k=`${ifC}:${op}:${val}:${andC}`;
      const p=presets[k]||{action:'BALANCED REBALANCE',color:'text-cyan',alloc:[40,30,10,20]};
      setResult({...p,allocs:[{a:'Bitcoin (BTC)',p:p.alloc[0],c:'bg-gold'},{a:'Ethereum (ETH)',p:p.alloc[1],c:'bg-indigo-500'},{a:'Altcoins',p:p.alloc[2],c:'bg-cyan'},{a:'Stablecoins',p:p.alloc[3],c:'bg-gray-600'}]});
      setCompiling(false);
    },1200);
  };

  const fmt = (v:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(v);

  return (
    <div className="relative min-h-screen pb-16 space-y-8 animate-in fade-in duration-500">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-40}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
            className={`fixed top-5 right-5 z-[300] flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-md text-xs font-black tracking-wider uppercase shadow-2xl ${toast.ok?'bg-bullish/10 border-bullish/30 text-bullish':'bg-cyan/10 border-cyan/30 text-cyan'}`}>
            <CheckCircle2 size={16}/>{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* System Alert */}
      <AnimatePresence>
        {systemAlert && (
          <motion.div initial={{opacity:0,x:100}} animate={{opacity:1,x:0}} exit={{opacity:0,x:60}}
            className="fixed bottom-6 right-6 z-[300] bg-black/95 border border-cyan/30 px-5 py-4 rounded-xl shadow-[0_0_30px_rgba(0,245,255,0.25)] backdrop-blur-md max-w-xs flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan animate-ping mt-1 shrink-0"/>
            <div><div className="text-[9px] font-black text-cyan/60 uppercase tracking-widest mb-1">Matrix Terminal</div>
            <p className="text-xs font-mono text-cyan font-bold leading-relaxed">{systemAlert}</p></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-white/5 pb-7">
        <div>
          <div className="flex items-center gap-2 mb-1"><Cpu size={13} className="text-gold animate-pulse"/><span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">DAILYFI ALGORITHMIC LAB</span></div>
          <h1 className="text-4xl font-heading font-black text-white tracking-tighter uppercase">Strategy Desks</h1>
          <p className="text-gray-500 mt-1 text-sm">Data-driven playbooks bridging macro variables with asset allocation profiles.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="glass-card-laser px-4 py-2.5 border-cyan/15 bg-cyan/5 rounded-xl flex flex-col items-end">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Simulated Matrix Value</span>
            <span className="text-lg font-mono font-black text-cyan glow-cyan mt-0.5">{fmt(balance)}</span>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            <div className="flex items-center gap-2 glass-card-laser px-3 py-1.5 border-gold/10 bg-gold/5 rounded-lg">
              <Lock size={11} className="text-gold"/><span className="text-[10px] font-black text-gold uppercase tracking-widest">Simulation Mode</span>
            </div>
            <div className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded border ${activePortfolio?'text-cyan bg-cyan/10 border-cyan/20 shadow-[0_0_12px_rgba(0,245,255,0.15)] animate-pulse':'text-gray-500 bg-white/5 border-white/5'}`}>
              ACTIVE PROFILE: {activePortfolio?activePortfolio.toUpperCase():'NONE'}
            </div>
          </div>
        </div>
      </div>

      {/* COMPACT HORIZONTAL SIMULATOR BAR */}
      <div className="glass-card-laser bg-black/50 border-white/5 px-5 py-3 rounded-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan/3 via-transparent to-gold/3 pointer-events-none"/>
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"/>
            <span className="text-[10px] font-black text-cyan uppercase tracking-widest">Live Feed Console</span>
            <span className="text-[9px] text-gray-600 font-mono ml-1">Auto tick in {tick}s</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 flex-1 justify-center sm:justify-start">
            {[
              {label:'DXY',val:dxy.toFixed(2),unit:'',inc:()=>setDxy(p=>+Math.min(110,p+0.1).toFixed(2)),dec:()=>setDxy(p=>+Math.max(100,p-0.1).toFixed(2)),thr:104,hi:false},
              {label:'M2 Growth',val:m2.toFixed(1),unit:'%',inc:()=>setM2(p=>+Math.min(10,p+0.1).toFixed(1)),dec:()=>setM2(p=>+Math.max(0,p-0.1).toFixed(1)),thr:2.0,hi:true},
              {label:'Fear & Greed',val:fg.toString(),unit:'',inc:()=>setFg(p=>Math.min(90,p+1)),dec:()=>setFg(p=>Math.max(10,p-1)),thr:40,hi:false},
            ].map(c=>(
              <div key={c.label} className="flex items-center gap-1.5 bg-white/3 border border-white/5 rounded-lg px-3 py-1.5">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest w-20 shrink-0">{c.label}</span>
                <button onClick={c.dec} className="w-5 h-5 rounded flex items-center justify-center bg-white/5 hover:bg-bearish/20 hover:text-bearish text-gray-400 transition-colors text-xs font-black">−</button>
                <span className="font-mono font-black text-sm text-white w-14 text-center tabular-nums">{c.val}{c.unit}</span>
                <button onClick={c.inc} className="w-5 h-5 rounded flex items-center justify-center bg-white/5 hover:bg-bullish/20 hover:text-bullish text-gray-400 transition-colors text-xs font-black">+</button>
                <div className={`w-1.5 h-1.5 rounded-full ml-1 ${c.hi?(parseFloat(c.val)>c.thr?'bg-bullish animate-pulse':'bg-bearish'):(parseFloat(c.val)<c.thr?'bg-bullish animate-pulse':'bg-bearish')}`}/>
              </div>
            ))}
          </div>
          <button onClick={()=>{setDxy(103.5);setM2(5.4);setFg(35);setTick(60);}} className="shrink-0 text-[9px] font-black text-gray-600 hover:text-gray-300 uppercase tracking-widest flex items-center gap-1 transition-colors">
            <RefreshCcw size={10}/>Reset
          </button>
        </div>
      </div>

      {/* ACTIVE MACRO PLAYBOOKS */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gold rounded-full"/>
            <h2 className="text-xl font-heading font-black text-white uppercase tracking-tight">Active Macro Playbooks</h2>
          </div>
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{PBs.filter(p=>conds(p)).length} Systems Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PBs.map(pb=>{
            const active=conds(pb);
            const expanded=expandedPB===pb.id;
            return (
              <div key={pb.id} className="flex flex-col">
                <div onClick={()=>setExpandedPB(expanded?null:pb.id)}
                  className={`glass-card-laser p-5 border rounded-xl cursor-pointer transition-all duration-300 hover:translate-y-[-2px] ${active?'border-bullish/20 shadow-[0_0_20px_rgba(0,192,118,0.08)]':'border-gold/10'} ${expanded?'border-b-0 rounded-b-none':''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black tracking-widest border ${active?'text-bullish bg-bullish/10 border-bullish/20':'text-gold bg-gold/10 border-gold/20'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${active?'bg-bullish animate-pulse':'bg-gold'}`}/>
                      {active?'ACTIVE':'PENDING'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${riskCls(pb.risk)}`}>{pb.risk.toUpperCase()} RISK</span>
                  </div>
                  <h3 className="text-base font-heading font-black text-white mb-1.5">{pb.name}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{pb.desc}</p>
                  <div className="mb-4">
                    <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2">Condition Dependencies</div>
                    <div className="flex flex-wrap gap-1.5">
                      {pb.conds.map(c=><span key={c} className="text-[10px] font-mono font-bold text-gold bg-gold/5 border border-gold/15 px-2 py-0.5 rounded">{c}</span>)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Playbook Target</span>
                    <button onClick={(e)=>simulate(pb,e)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-[11px] font-black uppercase tracking-widest hover:bg-gold/20 hover:shadow-[0_0_15px_rgba(255,215,0,0.2)] transition-all active:scale-95">
                      Simulate <span>›</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-center mt-3 text-gray-600">
                    <ChevronDown size={14} className={`transition-transform duration-300 ${expanded?'rotate-180':''}`}/>
                  </div>
                </div>
                <AnimatePresence>
                  {expanded && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.3}}
                      className="overflow-hidden bg-black/60 border border-bullish/15 border-t-0 rounded-b-xl px-5 pb-5 pt-4">
                      <div className="text-[9px] font-black text-cyan/70 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse"/>Integrated Analytical Matrix Brief
                      </div>
                      <p className="text-xs font-mono text-gray-300 leading-relaxed">{pb.analysis}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODEL PORTFOLIOS */}
      <div ref={portRef}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-6 bg-cyan rounded-full"/>
          <h2 className="text-xl font-heading font-black text-white uppercase tracking-tight">Model Portfolios</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PORTFOLIOS.map(port=>{
            const isActive=activePortfolio===port.id;
            const isHighlighted=highlightPort===port.id;
            const borderColor=port.color==='cyan'?'border-cyan/40 shadow-[0_0_30px_rgba(0,245,255,0.15)]':'border-gold/40 shadow-[0_0_30px_rgba(255,215,0,0.15)]';
            return (
              <div key={port.id} className={`glass-card-laser p-6 rounded-2xl border-2 transition-all duration-500 ${isActive||isHighlighted?borderColor:'border-white/5'} ${isHighlighted?'animate-pulse':''}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${port.color==='cyan'?'text-cyan':'text-gold'}`}>{port.icon} {port.sub}</div>
                    <h3 className="text-lg font-heading font-black text-white">{port.label}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border ${port.color==='cyan'?'text-cyan bg-cyan/10 border-cyan/20':'text-gold bg-gold/10 border-gold/20'}`}>{port.beta}</span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed mb-5">{port.desc}</p>
                <div className="space-y-2 mb-5">
                  {port.allocs.map(a=>(
                    <div key={a.a} className="flex items-center gap-3">
                      <span className="text-[10px] text-gray-400 w-36 shrink-0">{a.a}</span>
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-700 ${port.color==='cyan'?'bg-cyan':'bg-gold'}`} style={{width:`${a.p}%`}}/>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-white w-8 text-right">{a.p}%</span>
                    </div>
                  ))}
                </div>
                <button onClick={()=>deploy(port.id)}
                  className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${isActive?`bg-${port.color==='cyan'?'cyan':'gold'}/20 border-2 border-${port.color==='cyan'?'cyan':'gold'}/50 text-${port.color==='cyan'?'cyan':'gold'} shadow-[0_0_20px_rgba(${port.color==='cyan'?'0,245,255':'255,215,0'},0.25)]`:'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20 hover:text-white'}`}>
                  {isActive?'◉ SIMULATION DEPLOYED — CLICK TO UNDEPLOY':'◎ Deploy Simulation'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* IF-THEN COMPILER */}
      <div className="glass-card-laser bg-black/40 border-white/5 p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Sliders size={16} className="text-cyan"/><h2 className="text-lg font-heading font-black text-white uppercase tracking-tight">Algorithmic IF-THEN Compiler</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
          {[
            {label:'IF Indicator',val:ifC,set:setIfC,opts:[{v:'dxy',l:'DXY Index'},{v:'rates',l:'Fed Rate'},{v:'m2',l:'M2 Liquidity'},{v:'cpi',l:'CPI Inflation'}]},
            {label:'Condition',val:op,set:setOp,opts:[{v:'below',l:'Falls Below'},{v:'above',l:'Rises Above'},{v:'crosses',l:'Crosses'}]},
            {label:'Threshold',val:val,set:setVal,opts:[{v:'104',l:'104.00'},{v:'106',l:'106.00'},{v:'4.0',l:'4.0%'},{v:'105',l:'105.00'}]},
            {label:'AND Condition',val:andC,set:setAndC,opts:[{v:'fng_fear',l:'FNG < 40 (Fear)'},{v:'fng_greed',l:'FNG > 75 (Greed)'},{v:'btc_dom_down',l:'BTC Dom < 50%'}]},
          ].map(f=>(
            <div key={f.label}>
              <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1.5">{f.label}</div>
              <select value={f.val} onChange={e=>f.set(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-cyan/30 appearance-none cursor-pointer">
                {f.opts.map(o=><option key={o.v} value={o.v} className="bg-black">{o.l}</option>)}
              </select>
            </div>
          ))}
        </div>
        <button onClick={runSim} disabled={compiling}
          className="w-full py-3 rounded-xl bg-cyan/10 border border-cyan/20 text-cyan text-xs font-black uppercase tracking-widest hover:bg-cyan/20 hover:shadow-[0_0_20px_rgba(0,245,255,0.2)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {compiling?<><Loader2 size={14} className="animate-spin"/>Compiling Matrix...</>:<><Zap size={14}/>Execute Simulation Compiler</>}
        </button>
        <AnimatePresence>
          {result && (
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="mt-5 p-5 rounded-xl bg-white/3 border border-white/5">
              <div className={`text-base font-black mb-4 ${result.color}`}>{result.action}</div>
              <div className="space-y-2.5">
                {result.allocs.map((a:any)=>(
                  <div key={a.a} className="flex items-center gap-3">
                    <span className="text-[10px] text-gray-400 w-36 shrink-0">{a.a}</span>
                    <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden"><div className={`h-full ${a.c} rounded-full transition-all duration-700`} style={{width:`${a.p}%`}}/></div>
                    <span className="text-[10px] font-mono font-bold text-white w-8 text-right">{a.p}%</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Strategy;
