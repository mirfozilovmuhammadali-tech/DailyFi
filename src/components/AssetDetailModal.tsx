import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, TrendingUp, TrendingDown, RefreshCw, ZoomOut } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  createChart, ColorType, CrosshairMode,
  CandlestickSeries, LineSeries, BarSeries, AreaSeries, HistogramSeries,
} from 'lightweight-charts';

interface Props { isOpen: boolean; onClose: () => void; asset: any; }
type ChartType = 'candlestick' | 'line' | 'bar' | 'area';
type TF = '1M'|'3M'|'5M'|'15M'|'30M'|'1H'|'2H'|'4H'|'6H'|'12H'|'1D'|'1W'|'1MO'|'ALL';

// Binance valid intervals + display limit
const TF_MAP: Record<TF,{interval:string;limit:number}> = {
  '1M':  {interval:'1m',  limit:120},
  '3M':  {interval:'3m',  limit:120},
  '5M':  {interval:'5m',  limit:120},
  '15M': {interval:'15m', limit:120},
  '30M': {interval:'30m', limit:120},
  '1H':  {interval:'1h',  limit:120},
  '2H':  {interval:'2h',  limit:120},
  '4H':  {interval:'4h',  limit:120},
  '6H':  {interval:'6h',  limit:120},
  '12H': {interval:'12h', limit:120},
  '1D':  {interval:'1d',  limit:200},
  '1W':  {interval:'1w',  limit:150},
  '1MO': {interval:'1M',  limit:100},
  'ALL': {interval:'1M',  limit:500},
};

const SYMBOL_MAP: Record<string,string> = {
  bitcoin:'BTCUSDT', ethereum:'ETHUSDT', solana:'SOLUSDT',
  chainlink:'LINKUSDT', 'avalanche-2':'AVAXUSDT', 'fetch-ai':'FETUSDT',
  dogecoin:'DOGEUSDT', ripple:'XRPUSDT', cardano:'ADAUSDT',
  polkadot:'DOTUSDT', binancecoin:'BNBUSDT', 'matic-network':'MATICUSDT',
  litecoin:'LTCUSDT', uniswap:'UNIUSDT', stellar:'XLMUSDT',
  'the-open-network':'TONUSDT','shiba-inu':'SHIBUSDT',
  sui:'SUIUSDT', aptos:'APTUSDT', near:'NEARUSDT',
};

const toSymbol = (a:any) => {
  const id = a?.cgId || a?.id || '';
  return SYMBOL_MAP[id] || ((a?.symbol?.toUpperCase()||'BTC')+'USDT');
};

// Shared chart options (no layout changes needed)
const CHART_OPTS = {
  layout: { background:{type:ColorType.Solid,color:'transparent'}, textColor:'#9ca3af', fontFamily:"'Inter',sans-serif", fontSize:11 },
  grid: { vertLines:{color:'rgba(255,255,255,0.04)'}, horzLines:{color:'rgba(255,255,255,0.04)'} },
  crosshair: { mode:CrosshairMode.Normal, vertLine:{labelBackgroundColor:'#1a1a2e'}, horzLine:{labelBackgroundColor:'#1a1a2e'} },
  rightPriceScale: { borderColor:'rgba(255,255,255,0.08)', textColor:'#6b7280' },
  timeScale: { borderColor:'rgba(255,255,255,0.08)', timeVisible:true, secondsVisible:false, rightOffset:5, barSpacing:6, minBarSpacing:1.5 },
  handleScroll: { mouseWheel:true, pressedMouseMove:true, horzTouchDrag:true, vertTouchDrag:false },
  handleScale: { mouseWheel:true, pinch:true, axisPressedMouseMove:true },
};

const ETF_FLOWS = [
  {date:'Today',     flow: 145.2, aum:18450.5},
  {date:'Yesterday', flow: -24.8, aum:18305.3},
  {date:'2D Ago',    flow: 312.4, aum:18330.1},
  {date:'3D Ago',    flow:  89.1, aum:18017.7},
  {date:'4D Ago',    flow: -56.2, aum:17928.6},
];
const ECOSYSTEM = [
  {label:'Total Value Locked',    value:'$4.2B', pos:true,  chg:'+5.2%'},
  {label:'Staking Ratio',         value:'65.4%', pos:false, chg:'-0.1%'},
  {label:'Active Addresses (24h)',value:'1.2M',  pos:true,  chg:'+12.4%'},
  {label:'Network Revenue (24h)', value:'$2.1M', pos:true,  chg:'+8.7%'},
];

const PRIMARY_TF: TF[] = ['1M','5M','15M','1H','4H','1D'];
const MORE_TF:    TF[] = ['3M','30M','2H','6H','12H','1W','1MO','ALL'];

const AssetDetailModal: React.FC<Props> = ({isOpen, onClose, asset}) => {
  const [anim,    setAnim]    = useState('opacity-0 scale-95');
  const [tf,      setTf]      = useState<TF>('1D');
  const [ctype,   setCtype]   = useState<ChartType>('candlestick');
  const [bar,     setBar]     = useState<any>(null);
  const [price,   setPrice]   = useState(0);
  const [chg,     setChg]     = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [showMore,  setShowMore]  = useState(false);
  const [isLive,    setIsLive]    = useState(true);  // true = viewport at latest candle

  const divRef      = useRef<HTMLDivElement>(null);
  const chartRef    = useRef<any>(null);
  const mainRef     = useRef<any>(null);
  const volRef      = useRef<any>(null);
  const dataRef     = useRef<any[]>([]);
  const isFetching  = useRef(false);
  const tfRef       = useRef<TF>('1D');
  const loadOlderRef = useRef<() => void>(() => {});  // stable ref — avoids forward-ref issue

  // ----- animation -----
  useEffect(() => { setAnim(isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'); }, [isOpen]);

  // ----- live price -----
  useEffect(() => {
    if (!isOpen || !asset) return;
    const id = asset.cgId || asset.id;
    setPrice(asset.usd || 0);
    setChg(asset.usd_24h_change || 0);
    const fn = async () => {
      try {
        const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true`);
        if (!r.ok) return;
        const d = await r.json();
        if (d[id]) { setPrice(d[id].usd); setChg(d[id].usd_24h_change||0); }
      } catch(_){}
    };
    fn(); const iv = setInterval(fn, 30000); return () => clearInterval(iv);
  }, [isOpen, asset]);

  // ----- create chart once divRef is available -----
  const initChart = useCallback(() => {
    if (!divRef.current || chartRef.current) return;
    const chart = createChart(divRef.current, { ...CHART_OPTS, width: divRef.current.clientWidth, height: 340 });
    chartRef.current = chart;
    const vol = chart.addSeries(HistogramSeries, { color: 'rgba(34,197,94,0.2)', priceScaleId: 'vol' });
    chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.82, bottom: 0 } });
    volRef.current = vol;
    chart.timeScale().subscribeVisibleLogicalRangeChange((range: any) => {
      // Use ref so we never capture a stale loadOlder
      if (range && range.from <= 20) loadOlderRef.current();
      const totalBars = dataRef.current.length;
      if (totalBars > 0 && range) setIsLive(range.to >= totalBars - 2);
    });
    const ro = new ResizeObserver(() => {
      if (divRef.current && chartRef.current)
        chartRef.current.applyOptions({ width: divRef.current.clientWidth });
    });
    ro.observe(divRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // no deps — uses only refs

  // Run initChart when modal becomes visible
  useEffect(() => {
    if (!isOpen || !asset) return;
    // Small timeout lets the CSS transition finish so divRef has real dimensions
    const t = setTimeout(() => initChart(), 30);
    return () => clearTimeout(t);
  }, [isOpen, asset, initChart]);

  // ----- destroy chart on close -----
  useEffect(() => {
    if (!isOpen && chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      mainRef.current  = null;
      volRef.current   = null;
    }
  }, [isOpen]);

  // ----- fetch data helper (optional endTime for pagination) -----
  const fetchCandles = useCallback(async (sym:string, interval:string, limit:number, endTime?:number): Promise<any[]> => {
    try {
      const url = endTime
        ? `https://api.binance.com/api/v3/klines?symbol=${sym}&interval=${interval}&limit=${limit}&endTime=${endTime}`
        : `https://api.binance.com/api/v3/klines?symbol=${sym}&interval=${interval}&limit=${limit}`;
      const r = await fetch(url);
      if (r.ok) {
        return (await r.json()).map((k:any) => ({
          time: Math.floor(k[0]/1000) as any,
          open:+k[1], high:+k[2], low:+k[3], close:+k[4], volume:+k[5],
        }));
      }
    } catch(_){}
    // Fallback generated
    const STEP: Record<string,number> = {
      '1m':60,'3m':180,'5m':300,'15m':900,'30m':1800,'1h':3600,
      '2h':7200,'4h':14400,'6h':21600,'12h':43200,'1d':86400,'1w':604800,'1M':2592000,
    };
    const s = STEP[interval]||86400;
    const now = endTime ? Math.floor(endTime/1000) : Math.floor(Date.now()/1000);
    let p = (price || 100)*0.65;
    return Array.from({length:limit},(_,i)=>{
      p = Math.max(p+(Math.random()-0.5)*p*0.04,0.001);
      const o=p, c=p+(Math.random()-0.5)*p*0.025;
      return {time:(now-(limit-1-i)*s) as any, open:o,
        high:Math.max(o,c)+Math.random()*p*0.008, low:Math.min(o,c)-Math.random()*p*0.008, close:c, volume:Math.random()*4000+100};
    });
  }, [price]);

  // ----- prepend older candles (infinite scroll) -----
  const loadOlder = useCallback(async () => {
    if (isFetching.current || !chartRef.current || !asset || !mainRef.current) return;
    const existing = dataRef.current;
    if (!existing.length) return;
    isFetching.current = true;
    const {interval, limit} = TF_MAP[tfRef.current];
    const oldest = (existing[0].time as number) * 1000;
    const older = await fetchCandles(toSymbol(asset), interval, limit, oldest - 1);
    if (older.length) {
      const merged = [...older, ...existing];
      const seen = new Set<number>();
      const deduped = merged.filter(d => { if (seen.has(d.time)) return false; seen.add(d.time); return true; })
                            .sort((a,b)=>a.time-b.time);
      dataRef.current = deduped;
      const ser = mainRef.current;
      try { ser.setData(deduped); }
      catch(_) { ser.setData(deduped.map((d:any) => ({time:d.time, value:d.close}))); }
      volRef.current?.setData(deduped.map((d:any)=>({time:d.time,value:d.volume,color:d.close>=d.open?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)'})));
    }
    isFetching.current = false;
  }, [asset, fetchCandles]);

  // Keep the ref in sync so initChart can call the latest loadOlder
  useEffect(() => { loadOlderRef.current = loadOlder; }, [loadOlder]);

  // ----- swap series without recreating chart -----
  const applyChartType = useCallback((chart:any, data:any[], type:ChartType) => {
    if (mainRef.current) { chart.removeSeries(mainRef.current); mainRef.current = null; }

    let series: any;
    if (type === 'candlestick') {
      series = chart.addSeries(CandlestickSeries, {
        upColor:'#22c55e', downColor:'#ef4444',
        borderUpColor:'#22c55e', borderDownColor:'#ef4444',
        wickUpColor:'#22c55e', wickDownColor:'#ef4444',
      });
      series.setData(data);
    } else if (type === 'bar') {
      series = chart.addSeries(BarSeries, {upColor:'#22c55e', downColor:'#ef4444', thinBars:false});
      series.setData(data);
    } else if (type === 'line') {
      series = chart.addSeries(LineSeries, {color:'#00f5ff', lineWidth:2, crosshairMarkerRadius:5});
      series.setData(data.map(d=>({time:d.time,value:d.close})));
    } else {
      series = chart.addSeries(AreaSeries, {
        lineColor:'#00f5ff', topColor:'rgba(0,245,255,0.28)',
        bottomColor:'rgba(0,245,255,0)', lineWidth:2,
      });
      series.setData(data.map(d=>({time:d.time,value:d.close})));
    }

    // crosshair subscription
    chart.subscribeCrosshairMove((p:any) => {
      if (p?.seriesData) {
        const v = p.seriesData.get(series);
        if (v) setBar({...v, time:p.time});
      }
    });

    mainRef.current = series;
    return series;
  }, []);

  // ----- update volume bars -----
  const applyVolume = useCallback((data:any[]) => {
    if (!volRef.current) return;
    volRef.current.setData(data.map(d=>({
      time:d.time, value:d.volume,
      color: d.close>=d.open ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)',
    })));
  }, []);

  // ----- main data load (runs on tf or asset change) -----
  useEffect(() => {
    if (!isOpen || !asset) return;
    // Wait for chart to be initialized (may need a tick after initChart)
    const run = () => {
      if (!chartRef.current) return;
      tfRef.current = tf;
      isFetching.current = false;
      const chart = chartRef.current;
      const { interval, limit } = TF_MAP[tf];
      setLoading(true);
      fetchCandles(toSymbol(asset), interval, limit).then(data => {
        dataRef.current = data;
        applyChartType(chart, data, ctype);
        applyVolume(data);
        chart.timeScale().fitContent();
        setLoading(false);
      });
    };
    // If chart not ready yet, retry after init delay
    if (chartRef.current) { run(); }
    else { const t = setTimeout(run, 80); return () => clearTimeout(t); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tf, asset]);

  // ----- chart type change (no refetch needed) -----
  useEffect(() => {
    if (!chartRef.current || !dataRef.current.length) return;
    applyChartType(chartRef.current, dataRef.current, ctype);
    chartRef.current.timeScale().fitContent();
  }, [ctype, applyChartType]);

  // Never return null — keep divRef mounted so chart can initialize
  if (!asset) return null;

  const pos = chg >= 0;
  const dp  = price || asset.usd || 0;
  const cgId = asset.cgId || asset.id;
  const isBtc = cgId === 'bitcoin';
  const isEth = cgId === 'ethereum';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none opacity-0'}`}>
      <div className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${isOpen?'opacity-100':'opacity-0'}`} onClick={onClose}/>

      <div className={`relative w-full max-w-5xl bg-[#0b0b0f]/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 transform ${anim} max-h-[90vh] flex flex-col`}>
        {/* top accent */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70"/>

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/20 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
              {asset.logo
                ? <img src={asset.logo} alt={asset.symbol} className="w-9 h-9 object-contain rounded-full" onError={e=>{(e.currentTarget as any).style.display='none';}}/>
                : <span className="font-bold text-base text-yellow-400">{asset.symbol?.substring(0,3)}</span>
              }
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">{asset.name}</span>
                <span className="text-xs font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/5 uppercase">{asset.symbol}</span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-lg font-mono font-bold text-gray-100">
                  ${dp.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:6})}
                </span>
                <span className={`flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded ${pos?'text-green-400 bg-green-400/10':'text-red-400 bg-red-400/10'}`}>
                  {pos?<TrendingUp size={11}/>:<TrendingDown size={11}/>}
                  {Math.abs(chg).toFixed(2)}%
                </span>
                <span className="text-xs text-gray-600 flex items-center gap-1">
                  <RefreshCw size={9} className="animate-spin" style={{animationDuration:'4s'}}/>Live
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"><X size={18}/></button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Chart toolbar */}
          <div className="px-4 pt-3 pb-2 flex flex-wrap items-center gap-2 border-b border-white/5 bg-black/10">
            {/* Timeframe — primary + collapsible More */}
            <div className="flex flex-wrap items-center gap-0.5 relative">
              {PRIMARY_TF.map(t=>(
                <button key={t} onClick={()=>{setTf(t);setShowMore(false);}}
                  className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                    tf===t
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_6px_rgba(6,182,212,0.3)]'
                      : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                  }`}>{t}</button>
              ))}
              {/* More button */}
              <button
                onClick={()=>setShowMore(p=>!p)}
                className={`px-2.5 py-1 text-xs font-bold rounded transition-all flex items-center gap-0.5 ${
                  MORE_TF.includes(tf)
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                }`}>
                {MORE_TF.includes(tf) ? tf : 'More'} <span className={`transition-transform ${showMore?'rotate-180':'rotate-0'}`}>▾</span>
              </button>
              {/* Dropdown */}
              {showMore && (
                <div className="absolute top-full left-0 mt-1 z-20 bg-[#0f0f14] border border-white/10 rounded-xl p-2 shadow-2xl flex flex-wrap gap-1 min-w-[200px] animate-[fadeIn_0.15s_ease]">
                  {MORE_TF.map(t=>(
                    <button key={t} onClick={()=>{setTf(t);setShowMore(false);}}
                      className={`px-2.5 py-1 text-xs font-bold rounded transition-all ${
                        tf===t
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                          : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                      }`}>{t}</button>
                  ))}
                </div>
              )}
            </div>
            <div className="h-5 w-px bg-white/10 mx-1"/>
            {/* Chart type */}
            {(['candlestick','line','bar','area'] as ChartType[]).map(ct=>(
              <button key={ct} onClick={()=>setCtype(ct)}
                className={`px-3 py-1 text-xs font-bold rounded transition-all capitalize ${
                  ctype===ct
                    ? 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/30'
                    : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
                }`}>
                {ct}
              </button>
            ))}
            <div className="h-5 w-px bg-white/10 mx-1"/>
            {/* Now button — highlighted when user is scrolled away from live */}
            <button
              onClick={() => { chartRef.current?.timeScale().scrollToRealTime(); setIsLive(true); }}
              title="Go to latest candle"
              className={`relative flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-md transition-all duration-200 group ${
                !isLive
                  ? 'bg-green-500/20 text-green-400 border border-green-500/40 shadow-[0_0_8px_rgba(34,197,94,0.25)] animate-pulse'
                  : 'text-gray-500 hover:text-green-400 hover:bg-green-500/10 border border-transparent hover:border-green-500/20'
              }`}>
              <span className={`w-1.5 h-1.5 rounded-full transition-colors ${!isLive ? 'bg-green-400' : 'bg-gray-600 group-hover:bg-green-500'}`}/>
              Now
            </button>
            {/* Fit button */}
            <button
              onClick={() => { chartRef.current?.timeScale().fitContent(); }}
              title="Fit all candles in view"
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 rounded-md transition-all duration-200 group">
              <ZoomOut size={10} className="transition-transform group-hover:scale-110"/>
              Fit
            </button>
            <div className="ml-auto text-xs text-gray-600">
              {loading ? <span className="flex items-center gap-1"><RefreshCw size={10} className="animate-spin"/>Loading…</span>
                       : `Binance · ${TF_MAP[tf].interval}`}
            </div>
          </div>

          <div className="px-4 pb-2">
            {/* Chart */}
            <div className="relative mt-3 rounded-xl overflow-hidden border border-white/5 bg-black/20">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50 backdrop-blur-sm rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400">
                    <RefreshCw size={15} className="animate-spin"/><span className="text-sm">Fetching market data…</span>
                  </div>
                </div>
              )}
              <div ref={divRef} className="w-full" style={{height:340}}/>
            </div>

            {/* OHLC bar detail */}
            {bar && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {[
                  {l:'Time',  v: typeof bar.time==='number' ? new Date(bar.time*1000).toLocaleString() : String(bar.time), c:'text-gray-300'},
                  {l:'Open',  v: '$'+((bar.open  ||bar.value||0).toLocaleString(undefined,{maximumFractionDigits:5})), c:'text-gray-200'},
                  {l:'High',  v: '$'+((bar.high  ||bar.value||0).toLocaleString(undefined,{maximumFractionDigits:5})), c:'text-green-400'},
                  {l:'Low',   v: '$'+((bar.low   ||bar.value||0).toLocaleString(undefined,{maximumFractionDigits:5})), c:'text-red-400'},
                  {l:'Close', v: '$'+((bar.close ||bar.value||0).toLocaleString(undefined,{maximumFractionDigits:5})), c:'text-cyan-400'},
                ].map(({l,v,c})=>(
                  <div key={l} className="glass-card py-2 px-3 border border-white/5 text-center">
                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-0.5">{l}</div>
                    <div className={`text-xs font-mono font-bold truncate ${c}`}>{v}</div>
                  </div>
                ))}
              </div>
            )}

            {/* ETF flows */}
            {(isBtc||isEth) && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isBtc?'bg-yellow-400':'bg-[#627eea]'}`}/>
                  {isBtc?'Bitcoin':'Ethereum'} Spot ETFs — Net Flow
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-card p-3 h-[160px] border border-white/5">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[...ETF_FLOWS].reverse()} barCategoryGap="25%" barSize={22}>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill:'#6b7280',fontSize:10}}/>
                        <YAxis axisLine={false} tickLine={false} tick={{fill:'#6b7280',fontSize:10}} tickFormatter={v=>v+'M'}/>
                        <Tooltip cursor={{fill:'rgba(255,255,255,0.04)'}} contentStyle={{backgroundColor:'#0a0a0a',borderColor:'#222',borderRadius:'8px'}} formatter={(v:any)=>['$'+Number(v).toFixed(1)+'M','Flow']}/>
                        <Bar dataKey="flow" radius={[3,3,0,0]}>
                          {ETF_FLOWS.map((_,i)=><Cell key={i} fill={ETF_FLOWS[ETF_FLOWS.length-1-i]?.flow>=0?'#22c55e':'#ef4444'}/>)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="glass-card overflow-hidden border border-white/5">
                    <table className="w-full text-xs">
                      <thead className="bg-white/5">
                        <tr>{['Date','Flow','AUM'].map(h=><th key={h} className="px-3 py-2 text-left font-bold text-gray-500 uppercase">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {ETF_FLOWS.map((r,i)=>(
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="px-3 py-2 text-gray-300">{r.date}</td>
                            <td className={`px-3 py-2 font-mono font-bold ${r.flow>=0?'text-green-400':'text-red-400'}`}>{r.flow>0?'+':''}{r.flow}M</td>
                            <td className="px-3 py-2 font-mono text-gray-500">${r.aum.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Ecosystem for altcoins */}
            {!isBtc && !isEth && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"/> Ecosystem Metrics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ECOSYSTEM.map((m,i)=>(
                    <div key={i} className="glass-card p-4 border border-white/5 bg-gradient-to-br from-white/5 to-transparent">
                      <div className="text-[11px] font-medium text-gray-500 mb-2">{m.label}</div>
                      <div className="flex items-end justify-between">
                        <span className="text-lg font-mono font-bold text-white">{m.value}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${m.pos?'text-green-400 bg-green-400/10':'text-red-400 bg-red-400/10'}`}>{m.chg}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailModal;
