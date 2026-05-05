import React, { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, PieChart as PieChartIcon, Plus, X, Trash2 } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';
import AssetDetailModal from '../components/AssetDetailModal';

// CoinGecko CDN — verified stable URLs
const COIN_LOGO_MAP: Record<string, string> = {
  'bitcoin':           'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  'ethereum':          'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  'solana':            'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  'chainlink':         'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
  'avalanche-2':       'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
  'fetch-ai':          'https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg',
  'dogecoin':          'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  'ripple':            'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  'cardano':           'https://assets.coingecko.com/coins/images/975/small/cardano.png',
  'polkadot':          'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
  'binancecoin':       'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
  'matic-network':     'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  'litecoin':          'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
  'uniswap':           'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
  'stellar':           'https://assets.coingecko.com/coins/images/100/small/Stellar_symbol_black_RGB.png',
  'the-open-network':  'https://assets.coingecko.com/coins/images/17980/small/photo_2023-06-22_23-18-16.jpg',
  'shiba-inu':         'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
  'pepe':              'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
  'sui':               'https://assets.coingecko.com/coins/images/26375/small/sui-ocean-square.png',
  'aptos':             'https://assets.coingecko.com/coins/images/26455/small/aptos_round.png',
  'near':              'https://assets.coingecko.com/coins/images/10365/small/near.jpg',
  'internet-computer': 'https://assets.coingecko.com/coins/images/14495/small/Internet_Computer_logo.png',
};

// Hard fallbacks using cryptologos (for when CoinGecko CDN is slow / blocked)
const LOGO_FALLBACKS: Record<string, string> = {
  'bitcoin':    'https://cryptologos.cc/logos/bitcoin-btc-logo.svg',
  'ethereum':   'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
  'solana':     'https://cryptologos.cc/logos/solana-sol-logo.svg',
  'chainlink':  'https://cryptologos.cc/logos/chainlink-link-logo.svg',
  'fetch-ai':   'https://s2.coinmarketcap.com/static/img/coins/64x64/3773.png',
  'ripple':     'https://cryptologos.cc/logos/xrp-xrp-logo.svg',
  'cardano':    'https://cryptologos.cc/logos/cardano-ada-logo.svg',
  'dogecoin':   'https://cryptologos.cc/logos/dogecoin-doge-logo.svg',
  'binancecoin':'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
};

const getLogoForId = (id: string) => COIN_LOGO_MAP[id] || LOGO_FALLBACKS[id] || '';

const initialAssets = [
  { 
    id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: '$63,240', numericPrice: 63240, change: '+2.4%', usd: 63240, usd_24h_change: 2.4,
    amount: 1.25, color: '#f59e0b',
    logo: COIN_LOGO_MAP['bitcoin'],
    sparkline: [{val: 40}, {val: 45}, {val: 42}, {val: 50}, {val: 48}, {val: 55}, {val: 60}]
  },
  { 
    id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: '$3,150', numericPrice: 3150, change: '-1.2%', usd: 3150, usd_24h_change: -1.2,
    amount: 12.4, color: '#627eea',
    logo: COIN_LOGO_MAP['ethereum'],
    sparkline: [{val: 30}, {val: 25}, {val: 28}, {val: 24}, {val: 26}, {val: 22}, {val: 20}]
  },
  { 
    id: 'solana', name: 'Solana', symbol: 'SOL', price: '$145.20', numericPrice: 145.2, change: '+8.4%', usd: 145.2, usd_24h_change: 8.4,
    amount: 150, color: '#14f195',
    logo: COIN_LOGO_MAP['solana'],
    sparkline: [{val: 10}, {val: 15}, {val: 12}, {val: 18}, {val: 20}, {val: 25}, {val: 30}]
  }
];

// Robust logo component: shows image, falls back to styled initials if broken
const CoinLogo = ({ logo, symbol }: { logo: string; symbol: string }) => {
  const [broken, setBroken] = useState(false);
  if (logo && !broken) {
    return (
      <img
        src={logo}
        alt={symbol}
        className="w-10 h-10 rounded-full bg-white/5 p-1 object-contain"
        onError={() => setBroken(true)}
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-white text-xs shrink-0">
      {symbol.substring(0, 3)}
    </div>
  );
};

const Portfolio = () => {
  const [assets, setAssets] = useState<any[]>(() => {
    const saved = localStorage.getItem('portfolio_assets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialAssets;
      }
    }
    return initialAssets;
  });

  useEffect(() => {
    localStorage.setItem('portfolio_assets', JSON.stringify(assets));
  }, [assets]);

  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Asset Form State
  const [newAssetSymbol, setNewAssetSymbol] = useState('');
  const [newAssetAmount, setNewAssetAmount] = useState('');

  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const [addAssetError, setAddAssetError] = useState('');

  // Track asset IDs (use cgId when available — it's the real CoinGecko ID)
  const assetIds = JSON.stringify(assets.map(a => a.cgId || a.id));

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const idsList = Array.from(new Set(JSON.parse(assetIds))).join(',');
        if (!idsList) return;
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${idsList}&vs_currencies=usd&include_24hr_change=true`);
        const data = await res.json();
        
        setAssets(prev => prev.map(a => {
          const targetId = a.cgId || a.id;
          if (data[targetId]) {
            const usd = data[targetId].usd;
            const usd_24h_change = data[targetId].usd_24h_change;
            return {
              ...a,
              usd,
              usd_24h_change,
              numericPrice: usd,
              price: '$' + usd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
              change: (usd_24h_change >= 0 ? '+' : '') + usd_24h_change.toFixed(2) + '%'
            };
          }
          return a;
        }));
      } catch (err) {
        console.error("CoinGecko fetch failed", err);
      }
    };
    
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // Poll every 60s
    return () => clearInterval(interval);
  }, [assetIds]);

  // Derived state
  const portfolioData = useMemo(() => {
    let totalValue = 0;
    const computedAssets = assets.map(a => {
      const value = a.amount * a.numericPrice;
      totalValue += value;
      return { ...a, value };
    });
    
    const donutData = computedAssets.map(a => ({ name: a.symbol, value: a.value, color: a.color }));
    
    return { computedAssets, totalValue, donutData };
  }, [assets]);

  const handleAssetClick = (asset: any) => {
    setSelectedAsset(asset);
    setIsAssetModalOpen(true);
  };

  const handleRemoveAsset = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetSymbol || !newAssetAmount) return;
    
    setIsAddingAsset(true);
    setAddAssetError('');

    try {
      const query = newAssetSymbol.toLowerCase();
      
      let coinId = '';
      let coinName = '';
      let coinLogo = '';
      let coinSymbol = query.toUpperCase();

      const fallbackMap: Record<string, any> = {
        'btc':   { id: 'bitcoin',       name: 'Bitcoin',    symbol: 'BTC',  color: '#f59e0b' },
        'eth':   { id: 'ethereum',      name: 'Ethereum',   symbol: 'ETH',  color: '#627eea' },
        'sol':   { id: 'solana',        name: 'Solana',     symbol: 'SOL',  color: '#14f195' },
        'link':  { id: 'chainlink',     name: 'Chainlink',  symbol: 'LINK', color: '#2a5ada' },
        'avax':  { id: 'avalanche-2',   name: 'Avalanche',  symbol: 'AVAX', color: '#e84142' },
        'fet':   { id: 'fetch-ai',      name: 'Fetch.ai',   symbol: 'FET',  color: '#00aee9' },
        'doge':  { id: 'dogecoin',      name: 'Dogecoin',   symbol: 'DOGE', color: '#c2a633' },
        'xrp':   { id: 'ripple',        name: 'XRP',        symbol: 'XRP',  color: '#00aae4' },
        'ada':   { id: 'cardano',       name: 'Cardano',    symbol: 'ADA',  color: '#3cc8c8' },
        'dot':   { id: 'polkadot',      name: 'Polkadot',   symbol: 'DOT',  color: '#e6007a' },
        'bnb':   { id: 'binancecoin',   name: 'BNB',        symbol: 'BNB',  color: '#f3ba2f' },
        'matic': { id: 'matic-network', name: 'Polygon',    symbol: 'MATIC',color: '#8247e5' },
        'ltc':   { id: 'litecoin',      name: 'Litecoin',   symbol: 'LTC',  color: '#bfbbbb' },
        'uni':   { id: 'uniswap',       name: 'Uniswap',    symbol: 'UNI',  color: '#ff007a' },
        'xlm':   { id: 'stellar',       name: 'Stellar',    symbol: 'XLM',  color: '#000000' },
        'ton':   { id: 'the-open-network', name: 'Toncoin', symbol: 'TON',  color: '#0098ea' },
        'shib':  { id: 'shiba-inu',     name: 'Shiba Inu',  symbol: 'SHIB', color: '#e06b2f' },
        'pepe':  { id: 'pepe',          name: 'Pepe',       symbol: 'PEPE', color: '#3ea64b' },
        'sui':   { id: 'sui',           name: 'Sui',        symbol: 'SUI',  color: '#4da2ff' },
        'apt':   { id: 'aptos',         name: 'Aptos',      symbol: 'APT',  color: '#ffffff' },
        'near':  { id: 'near',          name: 'NEAR Protocol', symbol: 'NEAR', color: '#00c1de' },
        'icp':   { id: 'internet-computer', name: 'Internet Computer', symbol: 'ICP', color: '#ed1e79' },
      };

      if (fallbackMap[query]) {
        const fb = fallbackMap[query];
        coinId = fb.id;
        coinName = fb.name;
        coinSymbol = fb.symbol;
        coinLogo = getLogoForId(fb.id);
      } else {
        // Search CoinGecko for the symbol if not in fallback
        const searchRes = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`);
        if (!searchRes.ok) throw new Error("Search API rate limited");
        const searchData = await searchRes.json();
        
        let coinMatch = searchData.coins?.find((c: any) => c.symbol.toLowerCase() === query || c.id === query);
        if (!coinMatch && searchData.coins?.length > 0) {
          coinMatch = searchData.coins[0]; // Fallback to first result
        }
        
        if (!coinMatch) {
          setAddAssetError('Coin not found. Try a different symbol.');
          setIsAddingAsset(false);
          return;
        }

        coinId = coinMatch.id;
        coinName = coinMatch.name;
        coinSymbol = coinMatch.symbol.toUpperCase();
        // Try to resolve logo from our map first, then from CoinGecko search result
        coinLogo = getLogoForId(coinId) || coinMatch.large || coinMatch.thumb;
      }
      
      // Fetch live price with robust fallback
      let usd = 100; // fallback mock price
      let usd_24h_change = 0;
      
      try {
        const priceRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`);
        if (priceRes.ok) {
           const priceData = await priceRes.json();
           if (priceData[coinId]) {
              usd = priceData[coinId].usd || 100;
              usd_24h_change = priceData[coinId].usd_24h_change || 0;
           }
        }
      } catch(e) {
        console.warn("Price fetch failed, using fallback mock prices");
      }

      const newAsset = {
        id: coinId + '_' + Date.now(), // Unique React key — does NOT use this for API calls
        cgId: coinId,                  // Real CoinGecko ID used for price/chart lookups
        name: coinName,
        symbol: coinSymbol,
        amount: parseFloat(newAssetAmount),
        usd,
        usd_24h_change,
        numericPrice: usd,
        price: '$' + usd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
        change: (usd_24h_change >= 0 ? '+' : '') + usd_24h_change.toFixed(2) + '%',
        color: '#00f5ff',
        logo: coinLogo || getLogoForId(coinId),
        sparkline: [{val: usd*0.9}, {val: usd*0.95}, {val: usd*0.92}, {val: usd*1.05}, {val: usd*0.98}, {val: usd*1.02}, {val: usd}]
      };

      setAssets(prev => {
        // Prevent duplicate IDs by checking symbol instead of unique id
        if (prev.some(a => a.symbol === coinSymbol)) {
          // Just update amount if already exists
          return prev.map(a => a.symbol === coinSymbol ? { ...a, amount: a.amount + newAsset.amount } : a);
        }
        return [...prev, newAsset];
      });

      setIsAddModalOpen(false);
      setNewAssetSymbol('');
      setNewAssetAmount('');
    } catch (err) {
      console.error("Failed to add asset:", err);
      setAddAssetError('Rate limited by API. Please use common symbols (BTC, ETH, SOL, FET, XRP) or try again later.');
    } finally {
      setIsAddingAsset(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white tracking-tight">
            Portfolio Management
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Track your crypto allocations, performance, and real-time holdings.
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2.5 px-5 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]"
        >
          <Plus size={20} /> Add Asset
        </button>
      </div>

      {/* Executive Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Total Value & PnL */}
        <div className="lg:col-span-2 glass-card p-8 border border-white/5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Wallet className="w-5 h-5 text-gray-400" />
              </div>
              <h2 className="text-xl font-heading font-bold text-gray-300">Total Balance</h2>
            </div>
            
            <div className="mb-8 relative z-10 text-6xl font-heading font-black text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
              <AnimatedCounter value={portfolioData.totalValue} prefix="$" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <div className="bg-black/30 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
              <span className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2 block">24h Profit / Loss</span>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-mono font-bold text-green-400">+${(portfolioData.totalValue * 0.0225).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span className="flex items-center text-sm font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20 mb-1">
                  <ArrowUpRight size={14} className="mr-0.5" /> 2.25%
                </span>
              </div>
            </div>
            <div className="bg-black/30 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
              <span className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2 block">All-Time Profit / Loss</span>
              <div className="flex items-end gap-3">
                <span className="text-2xl font-mono font-bold text-green-400">+${(portfolioData.totalValue * 0.405).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                <span className="flex items-center text-sm font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded border border-green-400/20 mb-1">
                  <ArrowUpRight size={14} className="mr-0.5" /> 40.5%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Allocation Donut Chart */}
        <div className="lg:col-span-1 glass-card p-8 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-400 z-10">
            <PieChartIcon size={16} className="text-cyan-400" /> Allocation
          </div>
          
          <div className="w-full h-[220px] relative mt-6">
            {portfolioData.donutData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(10,10,10,0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ fontWeight: 'bold' }}
                    formatter={(value: any) => ['$' + Number(value).toLocaleString(), 'Value']}
                  />
                  <Pie
                    data={portfolioData.donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {portfolioData.donutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">No Assets</div>
            )}
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Assets</span>
              <span className="text-2xl font-mono font-bold text-white">{assets.length}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Asset Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
          <span className="w-1.5 h-6 bg-cyan-400 rounded-full"></span>
          Your Holdings
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioData.computedAssets.map((asset) => {
            const isPositive = asset.change.includes('+');
            const Icon = isPositive ? TrendingUp : TrendingDown;
            const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
            
            return (
              <div 
                key={asset.id}
                onClick={() => handleAssetClick(asset)}
                className="glass-card p-6 border border-white/5 hover:border-white/20 transition-all cursor-pointer hover:bg-white/5 group relative overflow-hidden flex flex-col justify-between h-[200px]"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Remove Button */}
                <button 
                  onClick={(e) => handleRemoveAsset(e, asset.id)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-md transition-colors opacity-0 group-hover:opacity-100 z-20"
                >
                  <Trash2 size={16} />
                </button>

                <div className="flex justify-between items-start w-full relative z-10">
                  <div className="flex items-center gap-4">
                    <CoinLogo logo={asset.logo} symbol={asset.symbol} />
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{asset.name}</h3>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{asset.symbol}</span>
                    </div>
                  </div>
                  <div className="text-right pr-8">
                    <span className="text-sm font-mono font-bold text-white block">{asset.price}</span>
                    <span className={"text-xs font-bold flex items-center justify-end gap-1 mt-1 " + changeColor}>
                      <Icon size={12} /> {asset.change}
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between relative z-10 mt-6">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-1">Balance</span>
                    <div className="flex flex-col">
                      <span className="text-xl font-mono font-bold text-white">{asset.amount} {asset.symbol}</span>
                      <span className="text-sm font-medium text-gray-400">${asset.value.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                    </div>
                  </div>
                  
                  {/* Sparkline Chart */}
                  <div className="w-[100px] h-[40px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={asset.sparkline}>
                        <Line 
                          type="monotone" 
                          dataKey="val" 
                          stroke={isPositive ? '#4ade80' : '#f87171'} 
                          strokeWidth={2} 
                          dot={false} 
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add New Asset Card inside Grid */}
          <div 
            onClick={() => setIsAddModalOpen(true)}
            className="glass-card p-6 border border-white/5 border-dashed hover:border-cyan-400/50 transition-all cursor-pointer bg-white/5 hover:bg-cyan-400/5 group flex flex-col items-center justify-center h-[200px]"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-cyan-400/20 flex items-center justify-center mb-3 transition-colors">
              <Plus className="text-gray-400 group-hover:text-cyan-400 transition-colors" size={24} />
            </div>
            <span className="text-gray-400 group-hover:text-cyan-400 font-bold transition-colors">Add New Asset</span>
          </div>

        </div>
      </div>

      {/* Asset Detail Modal — always rendered, hidden via CSS when closed */}
      <AssetDetailModal 
        isOpen={isAssetModalOpen} 
        onClose={() => { setIsAssetModalOpen(false); }} 
        asset={selectedAsset} 
      />

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-dark-bg/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-heading font-bold text-white">Add Asset</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Coin Symbol (e.g., LINK, AVAX, DOGE)</label>
                <input 
                  type="text" 
                  value={newAssetSymbol}
                  onChange={(e) => setNewAssetSymbol(e.target.value)}
                  placeholder="BTC"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Amount Held</label>
                <input 
                  type="number" 
                  step="any"
                  value={newAssetAmount}
                  onChange={(e) => setNewAssetAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                  required
                />
              </div>
              
              {addAssetError && (
                <div className="text-red-400 text-sm font-bold bg-red-400/10 p-3 rounded border border-red-400/20">
                  {addAssetError}
                </div>
              )}
              
              <button 
                type="submit"
                disabled={isAddingAsset}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-lg transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingAsset ? 'Fetching Asset...' : 'Add to Portfolio'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Portfolio;
