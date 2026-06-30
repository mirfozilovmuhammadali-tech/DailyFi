import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Clock,
  Newspaper,
  Zap,
  Bookmark,
  Share2,
  ExternalLink,
  RefreshCcw,
  X,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: 'COINGECKO INSIGHTS' | 'COINMARKETCAP' | 'THE DAILY HODL' | 'DAILYFI STRATEGY';
  time: string;
  timestamp: number;
  category: 'Bitcoin' | 'Ethereum' | 'Altcoins' | 'ETFs' | 'Regulation' | 'Macro Economics' | 'Global Markets';
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  impact: 'High' | 'Medium' | 'Low';
  image: string;
  author: string;
}

// ─── Full Article Database ────────────────────────────────────────────────────
const INITIAL_NEWS: NewsItem[] = [
  // ── BITCOIN ──────────────────────────────────────────────────────────────
  {
    id: 'n-btc-1',
    title: 'Bitcoin Surges Past $72K as Institutional Demand Reaches 90-Day Peak',
    summary: 'Spot BTC ETF inflows cross the $1.4B weekly threshold for the first time since January as BlackRock and Fidelity absorb sell-side pressure.',
    content: 'On-chain data from Glassnode confirms that Bitcoin exchange reserves have hit a 5-year low, removing liquid sell-side inventory from order books. Simultaneously, BlackRock\'s IBIT and Fidelity\'s FBTC reported a combined daily intake exceeding $420M — levels last seen at the January 2024 spot-ETF launch event. Macro strategists at DailyFi note that the confluence of shrinking exchange supply and growing institutional accumulation creates a classic demand shock setup.',
    source: 'COINMARKETCAP',
    time: '4m ago',
    timestamp: Date.now() - 240000,
    category: 'Bitcoin',
    sentiment: 'Bullish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Marcus Thornton'
  },
  {
    id: 'n-btc-2',
    title: 'CoinGecko: Bitcoin Open Interest Spikes 22% — Liquidation Cascade Risk Elevated',
    summary: 'Perpetual futures OI on BTC has climbed aggressively in the past 72 hours, raising the probability of a sharp short-term correction if leverage unwinds.',
    content: 'CoinGecko derivatives analytics indicate Bitcoin perpetual open interest has swelled to $18.4B across major CEXs — a 22% increase week-over-week. Funding rates have turned positive but remain below euphoric thresholds. Historical patterns show that OI expansions of this magnitude, when not supported by spot volume confirmation, historically precede 8–15% corrective drawdowns. Traders are advised to manage leverage positions with disciplined stop-loss protocols.',
    source: 'COINGECKO INSIGHTS',
    time: '31m ago',
    timestamp: Date.now() - 1860000,
    category: 'Bitcoin',
    sentiment: 'Bearish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Bobby Ong'
  },
  {
    id: 'n-btc-3',
    title: 'The Daily Hodl: Saylor\'s MicroStrategy Increases BTC Treasury Position by 10,000 Coins',
    summary: 'MicroStrategy adds 10,000 BTC to its balance sheet at an average price of $68,500, bringing its total holdings to 224,000 BTC.',
    content: 'Michael Saylor\'s MicroStrategy has once again executed a large-scale Bitcoin purchase, acquiring 10,000 BTC for approximately $685M. The company now holds 224,000 BTC with a total cost basis of $9.87 billion. This aggressive treasury strategy continues to validate Bitcoin as a corporate reserve asset and sends a powerful signal to other CFOs evaluating non-dilutive treasury diversification strategies.',
    source: 'THE DAILY HODL',
    time: '1h ago',
    timestamp: Date.now() - 3600000,
    category: 'Bitcoin',
    sentiment: 'Bullish',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Nick Marinoff'
  },

  // ── ETHEREUM ─────────────────────────────────────────────────────────────
  {
    id: 'n-eth-1',
    title: 'Ethereum Staking Ratio Crosses 28% — Network Supply Shock Deepens',
    summary: 'Over 33.6 million ETH is now locked inside the consensus layer, reducing liquid exchange supply to multi-year lows.',
    content: 'According to latest staking data published by The Daily Hodl, the Ethereum staking ratio has crossed the 28.5% threshold. This structural reduction in active liquid supply, coupled with steady ETF purchasing velocity, could create a supply-demand imbalance in the coming quarters. The Ethereum Foundation notes that validator queue wait times have extended to 28 days, further illustrating demand for staking yield.',
    source: 'THE DAILY HODL',
    time: '35m ago',
    timestamp: Date.now() - 2100000,
    category: 'Ethereum',
    sentiment: 'Bullish',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Nick Marinoff'
  },
  {
    id: 'n-eth-2',
    title: 'CoinGecko: Ethereum Layer-2 TVL Reaches $52B as Dencun Upgrade Matures',
    summary: 'The post-Dencun proto-danksharding era continues to compress L2 fees, driving unprecedented migration of DeFi protocols from L1.',
    content: 'CoinGecko ecosystem analytics confirm total value locked across Ethereum Layer-2 networks has surpassed $52 billion. Arbitrum, Optimism, and Base collectively account for 73% of this liquidity. Transaction fees on leading L2s have dropped 96% following the Dencun upgrade activation of EIP-4844, accelerating the migration of Uniswap, Aave, and Curve user bases off the Ethereum mainnet.',
    source: 'COINGECKO INSIGHTS',
    time: '2h ago',
    timestamp: Date.now() - 7200000,
    category: 'Ethereum',
    sentiment: 'Bullish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Connor Brown'
  },
  {
    id: 'n-eth-3',
    title: 'DailyFi Strategy: ETH/BTC Ratio Signals Altseason Precursor Phase',
    summary: 'The ETH/BTC ratio breaking above the 0.052 level has historically preceded broad alt market outperformance within 4–8 weeks.',
    content: 'DAILYFI TERMINAL ANALYSIS — Our proprietary cross-pair momentum matrix has detected the ETH/BTC ratio reclaiming its 200-day exponential moving average. Historical back-tests across 3 previous cycles show that this pattern precedes Ethereum-led alt season rotations with a 74% success rate. Current portfolio allocation models suggest increasing ETH weighting by 5–8% at the expense of stablecoin buffer positions.',
    source: 'DAILYFI STRATEGY',
    time: '3h ago',
    timestamp: Date.now() - 10800000,
    category: 'Ethereum',
    sentiment: 'Bullish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'DailyFi Macro Desk'
  },

  // ── ALTCOINS ─────────────────────────────────────────────────────────────
  {
    id: 'n-alt-1',
    title: 'CoinGecko: Massive Institutional Inflow into Solana and Avalanche Protocols',
    summary: 'Over $420M in net inflows was recorded across top-tier non-EVM smart contract platforms in the past 7 business days.',
    content: 'A comprehensive institutional asset flow report published by CoinGecko Research details a significant reallocation of capital away from Ethereum L1 toward high-performance alternative smart contract platforms. Solana leads with $280M of net institutional inflow, driven by growing DePIN and consumer-application ecosystems. Avalanche attracted $140M, benefiting from its subnet architecture adopted by multiple TradFi institutions.',
    source: 'COINGECKO INSIGHTS',
    time: '2m ago',
    timestamp: Date.now() - 120000,
    category: 'Altcoins',
    sentiment: 'Bullish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Bobby Ong'
  },
  {
    id: 'n-alt-2',
    title: 'DailyFi Strategy Desk: DXY Weakness Triggers Layer-1 Capital Rotation Matrix',
    summary: 'DXY weakness historically triggers capital rotation into high-beta risk assets. Current matrix yields 78% historical probability of L1 outperformance.',
    content: 'DAILYFI TERMINAL ANALYSIS — Dynamic macro-trend indicators confirm the US Dollar Index has entered a medium-term distribution phase. In 4 of the last 5 instances where DXY declined 3%+ over a 30-day window, on-chain capital rotation into alternative Layer-1 protocols outperformed Bitcoin by an average of 34% over the following 60 days. Target allocation: SOL, AVAX, DOT, NEAR.',
    source: 'DAILYFI STRATEGY',
    time: '45m ago',
    timestamp: Date.now() - 2700000,
    category: 'Altcoins',
    sentiment: 'Bullish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'DailyFi Macro Desk'
  },
  {
    id: 'n-alt-3',
    title: 'The Daily Hodl: Solana Memecoin Volume Collapses 87% — Pump.fun Daily Fees Crater',
    summary: 'The speculative retail frenzy that drove Solana ecosystem fees to record highs has reversed sharply, signaling reduced retail appetite.',
    content: 'On-chain analytics confirm memecoin launch platform Pump.fun has seen daily fee revenue crater from $4.2M to under $600K in just 30 days. This 86% reduction mirrors previous memecoin cycle collapses and historically precedes a 6–10 week Solana SOL price drawdown period before the next utility-driven cycle expansion phase begins.',
    source: 'THE DAILY HODL',
    time: '4h ago',
    timestamp: Date.now() - 14400000,
    category: 'Altcoins',
    sentiment: 'Bearish',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Liam Wright'
  },

  // ── ETFs ─────────────────────────────────────────────────────────────────
  {
    id: 'n-etf-1',
    title: 'BlackRock IBIT Surpasses $20B AUM — Fastest ETF to $20B in History',
    summary: 'The iShares Bitcoin Trust has shattered the all-time record for fastest AUM accumulation, leaving gold ETFs decades behind.',
    content: 'BlackRock\'s iShares Bitcoin Trust (IBIT) has officially crossed the $20 billion assets under management threshold in just 120 trading days since its January 2024 launch — smashing the previous record held by a gold ETF that took 5 years to achieve the same milestone. Daily volume for IBIT now regularly exceeds $1.5B, making it one of the top 5 most traded ETFs on US exchanges.',
    source: 'COINMARKETCAP',
    time: '12m ago',
    timestamp: Date.now() - 720000,
    category: 'ETFs',
    sentiment: 'Bullish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Alice Taylor'
  },
  {
    id: 'n-etf-2',
    title: 'CoinGecko: Ethereum Spot ETF Launch Generates $800M Day-1 Volume',
    summary: 'The inaugural trading day for US spot Ethereum ETFs delivered strong institutional participation, though below Bitcoin\'s historic debut.',
    content: 'CoinGecko market data confirms the first-day combined volume across all approved US spot Ethereum ETFs reached $804M — a strong showing that validates institutional demand for Ethereum exposure via regulated vehicles. Grayscale\'s ETHE led with $319M in volume. Net flow analysis is still pending as several issuers delay T+1 settlement data. Analysts predict steady accumulation over 30–60 days as wealth management platforms complete due-diligence onboarding.',
    source: 'COINGECKO INSIGHTS',
    time: '5h ago',
    timestamp: Date.now() - 18000000,
    category: 'ETFs',
    sentiment: 'Bullish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Elena Voss'
  },
  {
    id: 'n-etf-3',
    title: 'DailyFi Strategy: Grayscale GBTC Discount Narrows — Arbitrage Window Closing',
    summary: 'GBTC discount-to-NAV has compressed from 48% to under 1.5%, eliminating the lucrative institutional arbitrage opportunity that defined 2023.',
    content: 'DAILYFI TERMINAL ANALYSIS — The Grayscale Bitcoin Trust discount to net asset value has nearly closed following ETF conversion approval. This structural change removes the largest source of systematic arbitrage alpha that hedge funds exploited during 2022–2023. Rotation capital previously locked in GBTC arbitrage positions is now flowing into spot BTC ETF strategies at BlackRock and Fidelity, providing additional net-positive demand momentum.',
    source: 'DAILYFI STRATEGY',
    time: '6h ago',
    timestamp: Date.now() - 21600000,
    category: 'ETFs',
    sentiment: 'Neutral',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'DailyFi Macro Desk'
  },

  // ── REGULATION ────────────────────────────────────────────────────────────
  {
    id: 'n-reg-1',
    title: 'SEC Launches Regulatory Probe Into Decentralized AI GPU Compute Tokens',
    summary: 'Regulatory bodies are examining utility structures of decentralized AI GPU networks for potential unregistered securities violations.',
    content: 'WASHINGTON — The SEC has initiated formal inquiries into multiple decentralized compute-sharing protocols. Regulators are examining whether the distribution mechanisms of tokens used to lease AI GPU hardware constitute unregistered securities offerings under the Howey Test framework. Protocols under review include Render Network (RNDR) and Akash Network (AKT). Legal teams for both projects have issued public statements affirming utility token classification.',
    source: 'THE DAILY HODL',
    time: '3h ago',
    timestamp: Date.now() - 10800000,
    category: 'Regulation',
    sentiment: 'Bearish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Daily Hodl Staff'
  },
  {
    id: 'n-reg-2',
    title: 'EU MiCA Framework Goes Live — Binance, Kraken Secure Full Compliance Licenses',
    summary: 'The EU Markets in Crypto-Assets regulation is now operational, granting legal certainty to regulated exchanges and stablecoin issuers across 27 member states.',
    content: 'The European Union\'s landmark MiCA regulation has officially entered enforcement, establishing the first comprehensive crypto regulatory framework across 27 member states. Binance EU, Kraken, and Coinbase have secured CASP (Crypto Asset Service Provider) licenses, granting them full legal authority to operate across all EU markets. Tether USDT has received a restricted notice — operators must transition clients to compliant alternatives by year-end.',
    source: 'COINMARKETCAP',
    time: '7h ago',
    timestamp: Date.now() - 25200000,
    category: 'Regulation',
    sentiment: 'Bullish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Sophie Laurent'
  },

  // ── MACRO ECONOMICS ───────────────────────────────────────────────────────
  {
    id: 'n-mac-1',
    title: 'DailyFi Strategy Desk: DXY Breakout Above 104.80 Triggers Hedge Allocation',
    summary: 'The US Dollar Index breaking multi-month resistance prompts rebalancing into stablecoin buffers as high-beta risk assets face headwinds.',
    content: 'DAILYFI TERMINAL ANALYSIS — Dynamic macro-trend indicators show DXY strength consolidating above critical multi-month resistance at 104.80. Historically, persistent dollar strength suppresses digital asset valuations with a 60–90 day lag. We recommend systematic profit-taking on over-extended assets. Rebalance 15% of high-beta positions into USDC cash buffers while maintaining core BTC/ETH allocations unchanged.',
    source: 'DAILYFI STRATEGY',
    time: '1h ago',
    timestamp: Date.now() - 3600000,
    category: 'Macro Economics',
    sentiment: 'Bearish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'DailyFi Macro Desk'
  },
  {
    id: 'n-mac-2',
    title: 'Federal Reserve Signals Pivot — September Rate Cut Nearly Certain at 94% Probability',
    summary: 'CME FedWatch tool shows nearly unanimous market conviction that the Fed will cut 25bps in September, catalyzing global risk-on sentiment.',
    content: 'Federal Reserve Chair Jerome Powell\'s latest Congressional testimony contained unmistakable signals of an approaching monetary policy pivot. The CME FedWatch tool now prices a 94% probability of a 25 basis point rate cut at the September FOMC meeting. Interest rate cuts expand global M2 money supply, historically acting as a tailwind for scarce, deflationary digital assets. DailyFi recommends systematic DCA into hard store-of-value assets (BTC/ETH) in the 4–6 weeks before the expected cut.',
    source: 'DAILYFI STRATEGY',
    time: '2h ago',
    timestamp: Date.now() - 7200000,
    category: 'Macro Economics',
    sentiment: 'Bullish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'DailyFi Macro Desk'
  },

  // ── GLOBAL MARKETS ────────────────────────────────────────────────────────
  {
    id: 'n-gm-1',
    title: 'CoinMarketCap: DeFi Volume Spikes 34% as Rate Cuts Compress Bond Yields',
    summary: 'DeFi exchange metrics point to record lending pool activity as institutional capital migrates from low-yield sovereigns to on-chain protocols.',
    content: 'CoinMarketCap market telemetry reports DeFi trading volumes have hit an annualized high, with the recent interest rate cut cycle compressing yields on traditional sovereign bonds to the point where on-chain yields now offer a meaningful premium. Decentralized stablecoin pools on Curve and Aave are offering 6–9% APY — a 3× premium over comparable 10-year Treasuries. Capital inflows into DeFi from traditional asset managers have reached $2.1B over 30 days.',
    source: 'COINMARKETCAP',
    time: '12m ago',
    timestamp: Date.now() - 720000,
    category: 'Global Markets',
    sentiment: 'Bullish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Vance Parker'
  },
  {
    id: 'n-gm-2',
    title: 'CoinMarketCap Intelligence: Stablecoin Inflows Near $3B Weekly Threshold',
    summary: 'Aggregated stablecoin minting volumes indicate heavy fiat onboarding, setting the stage for massive potential buy pressure.',
    content: 'Net capital entering the digital asset ecosystem via Tether (USDT) and USD Coin (USDC) mints has accelerated significantly. CoinMarketCap data highlights this as the largest weekly onboarding phase of the calendar year, reflecting strong institutional readiness to deploy capital. Total stablecoin market cap now exceeds $162B, representing a significant war chest of dry powder awaiting deployment into risk assets.',
    source: 'COINMARKETCAP',
    time: '4h ago',
    timestamp: Date.now() - 14400000,
    category: 'Global Markets',
    sentiment: 'Bullish',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Vance Parker'
  }
];

// ─── Article Pool for Dynamic Injection ────────────────────────────────────
const INJECTION_POOL: Omit<NewsItem, 'id' | 'timestamp' | 'time'>[] = [
  {
    title: 'BREAKING: Bitcoin Spot ETF Records Largest Single-Day Inflow Since Launch',
    summary: 'Combined BTC ETF net inflows exceeded $1.1B in a single session — a new daily record reinforcing institutional conviction.',
    content: 'Real-time ETF flow data confirms that the ten US Bitcoin spot ETFs collectively registered $1.14B in net inflows during today\'s trading session, eclipsing the previous single-day record. BlackRock alone absorbed $640M. This supply shock against a backdrop of declining exchange reserves creates extraordinary conditions for upside price discovery.',
    source: 'COINMARKETCAP',
    category: 'ETFs',
    sentiment: 'Bullish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Wire Desk'
  },
  {
    title: 'WIRE: CoinGecko Flags Altcoin Fear & Greed Index Crossing Into Extreme Greed',
    summary: 'The altcoin market sentiment index has entered extreme greed territory for the first time in 14 months.',
    content: 'CoinGecko\'s composite sentiment indicator for the broader altcoin market has crossed the 82/100 threshold into extreme greed. Historical analysis shows that extreme greed readings have preceded 10–20% short-term corrections in 68% of historical instances while also marking the beginning of the parabolic final leg in 32% of cases. Risk management protocols are advised.',
    source: 'COINGECKO INSIGHTS',
    category: 'Altcoins',
    sentiment: 'Bearish',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Wire Desk'
  },
  {
    title: 'ALERT: Federal Reserve Emergency Statement Spooks Risk Markets — BTC Dips 4%',
    summary: 'An unexpected Fed inter-meeting statement expressing caution around inflation re-acceleration triggered immediate risk-off liquidations.',
    content: 'An unexpected Federal Reserve inter-meeting statement warned of sticky core services inflation re-accelerating to 3.8% annualized. Markets reacted immediately with Bitcoin selling off 4% in 15 minutes on elevated volume. Risk assets broadly declined. The DXY spiked 0.6%. DailyFi Strategy Desk notes this as a data-driven buying opportunity for long-term accumulators rather than a structural trend reversal.',
    source: 'DAILYFI STRATEGY',
    category: 'Macro Economics',
    sentiment: 'Bearish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'DailyFi Macro Desk'
  },
  {
    title: 'LIVE: Bitcoin Miners Revenue Hits 12-Month High After Halving Supply Shock',
    summary: 'Transaction fee revenue for Bitcoin miners surged to its highest level since Q1 2023, absorbing the block subsidy reduction from the April halving.',
    content: 'Post-halving data confirms Bitcoin miner revenue has stabilized well above break-even levels for most industrial-grade operations. The combination of higher BTC spot prices (+52% post-halving) and episodic inscription/Rune transaction fee spikes has kept daily miner revenue above $40M consistently. This validates the halving supply shock thesis and removes a key risk — mass miner capitulation.',
    source: 'THE DAILY HODL',
    category: 'Bitcoin',
    sentiment: 'Bullish',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Wire Desk'
  }
];

const CATEGORIES = ['All', 'Bitcoin', 'Ethereum', 'Altcoins', 'ETFs', 'Regulation', 'Macro Economics', 'Global Markets'] as const;

const getSourceBadge = (source: NewsItem['source']) => {
  switch (source) {
    case 'COINGECKO INSIGHTS':  return 'text-[#8cc63f] bg-[#8cc63f]/10 border-[#8cc63f]/30';
    case 'COINMARKETCAP':       return 'text-[#4E88F8] bg-[#4E88F8]/10 border-[#4E88F8]/30';
    case 'THE DAILY HODL':      return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
    case 'DAILYFI STRATEGY':    return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
  }
};

const getRelativeTime = (ts: number) => {
  const min = Math.floor((Date.now() - ts) / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ─── Component ───────────────────────────────────────────────────────────────
const News: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedItem, setSelectedItem]     = useState<NewsItem | null>(null);
  const [savedIds, setSavedIds]             = useState<string[]>([]);
  const [toastMsg, setToastMsg]             = useState('');
  const [toastVisible, setToastVisible]     = useState(false);
  const [tick, setTick]                     = useState(60);
  const [flashId, setFlashId]               = useState<string | null>(null);
  const [news, setNews]                     = useState<NewsItem[]>(INITIAL_NEWS);
  const poolIndexRef                        = useRef(0);

  // ── Restore saved bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dailyfi_saved_news');
    if (saved) setSavedIds(JSON.parse(saved));
  }, []);

  // ── Relative-time updater (every 15s)
  useEffect(() => {
    const id = setInterval(() => {
      setNews(prev => prev.map(item => ({ ...item, time: getRelativeTime(item.timestamp) })));
    }, 15000);
    return () => clearInterval(id);
  }, []);

  // ── 60-second live injection engine
  useEffect(() => {
    const id = setInterval(() => {
      setTick(prev => {
        if (prev <= 1) {
          const base = INJECTION_POOL[poolIndexRef.current % INJECTION_POOL.length];
          poolIndexRef.current += 1;
          const newId   = `inject-${Date.now()}`;
          const article: NewsItem = {
            ...base,
            id: newId,
            timestamp: Date.now(),
            time: 'Just now'
          };
          setNews(prevList => {
            if (prevList.some(i => i.title === article.title)) return prevList;
            return [article, ...prevList].slice(0, 20).map(i => ({ ...i, time: getRelativeTime(i.timestamp) }));
          });
          setFlashId(newId);
          setTimeout(() => setFlashId(null), 3500);
          showToast(`⚡ WIRE: ${article.source}`);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3200);
  };

  const forceInject = () => {
    const base   = INJECTION_POOL[poolIndexRef.current % INJECTION_POOL.length];
    poolIndexRef.current += 1;
    const newId  = `inject-${Date.now()}`;
    const article: NewsItem = { ...base, id: newId, timestamp: Date.now(), time: 'Just now' };
    setNews(prev => [article, ...prev].slice(0, 20).map(i => ({ ...i, time: getRelativeTime(i.timestamp) })));
    setFlashId(newId);
    setTimeout(() => setFlashId(null), 3500);
    showToast(`⚡ MANUAL WIRE: ${article.source}`);
    setTick(60);
  };

  const toggleSave = (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    const next = savedIds.includes(item.id) ? savedIds.filter(x => x !== item.id) : [...savedIds, item.id];
    setSavedIds(next);
    localStorage.setItem('dailyfi_saved_news', JSON.stringify(next));
    showToast(savedIds.includes(item.id) ? 'Removed from Bookmarks' : 'Saved to Bookmarks');
  };

  const handleShare = (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/news/${item.id}`);
    showToast('Share link copied!');
  };

  // ── Filtered list — drives ALL filter buttons
  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchesCat    = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [news, activeCategory, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16 relative">

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-2 px-6 py-3 rounded-xl
          bg-black/80 border border-yellow-400/30 text-yellow-300 font-bold text-xs shadow-[0_0_24px_rgba(255,200,0,0.2)]
          backdrop-blur-md transition-all duration-300 whitespace-nowrap
          ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <Zap size={14} className="text-yellow-300 animate-bounce" />
        {toastMsg}
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Newspaper size={13} className="text-yellow-400" />
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.4em]">
              DailyFi Intelligence Board
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">News Aggregator</h1>
          <p className="text-gray-500 mt-1 text-sm">Crypto-native feeds, market insights, and macroeconomic alerts.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={forceInject}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-yellow-400
                       hover:bg-yellow-400/10 transition-all active:scale-95 flex items-center gap-2 text-xs font-black uppercase tracking-widest"
          >
            <RefreshCcw size={14} /> Inject Feed
          </button>

          <div className="px-4 py-2 rounded-xl bg-cyan-400/5 border border-cyan-400/15 text-right">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Next Wire</span>
            <span className="text-sm font-mono font-black text-cyan-400 tracking-wider">{tick}s</span>
          </div>

          <div className="relative w-full sm:w-[260px] group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-yellow-400 transition-colors">
              <Search size={15} />
            </div>
            <input
              type="text"
              placeholder="Search feed..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white
                         placeholder:text-gray-500 focus:outline-none focus:border-yellow-400/40 focus:bg-white/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Category Filters ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => {
          const count = cat === 'All' ? news.length : news.filter(i => i.category === cat).length;
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border flex items-center gap-1.5 ${
                active
                  ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30 shadow-[0_0_15px_rgba(250,204,21,0.15)]'
                  : 'text-gray-400 border-white/5 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                active ? 'bg-yellow-400/20 text-yellow-300' : 'bg-white/5 text-gray-500'
              }`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* ── News Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredNews.length > 0 ? (
            filteredNews.map(item => {
              const flashing = flashId === item.id;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  onClick={() => setSelectedItem(item)}
                  className={`bg-black/60 rounded-2xl flex flex-col overflow-hidden cursor-pointer group
                              transition-all duration-500 border
                              ${flashing
                                ? 'border-cyan-400 shadow-[0_0_24px_rgba(0,245,255,0.35)]'
                                : 'border-white/5 hover:border-yellow-400/20 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
                              }`}
                  style={{ backdropFilter: 'blur(24px)' }}
                >
                  {/* Thumbnail */}
                  <div className="w-full aspect-video bg-white/5 relative overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Dark vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Sentiment flash badge */}
                    {flashing && (
                      <span className="absolute top-3 right-3 bg-cyan-400/90 text-black text-[9px] font-black
                                       px-2 py-0.5 rounded uppercase tracking-widest animate-pulse">
                        LIVE WIRE
                      </span>
                    )}

                    {/* Category chip */}
                    <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded
                                     text-[9px] font-black uppercase tracking-widest text-white border border-white/10">
                      {item.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getSourceBadge(item.source)}`}>
                          {item.source}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                          <Clock size={11} />
                          <span>{item.time}</span>
                        </div>
                      </div>

                      <h3 className="text-[15px] font-black text-white group-hover:text-yellow-300 transition-colors leading-snug line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-gray-400 text-xs leading-relaxed mt-2 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        {/* Animated sentiment pulse */}
                        <span className="relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                            item.sentiment === 'Bullish' ? 'bg-emerald-400' : item.sentiment === 'Bearish' ? 'bg-rose-400' : 'bg-gray-400'
                          }`} />
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${
                            item.sentiment === 'Bullish' ? 'bg-emerald-500' : item.sentiment === 'Bearish' ? 'bg-rose-500' : 'bg-gray-500'
                          }`} />
                        </span>
                        <span className={`text-[10px] font-bold flex items-center gap-1 ${
                          item.sentiment === 'Bullish' ? 'text-emerald-400' : item.sentiment === 'Bearish' ? 'text-rose-400' : 'text-gray-400'
                        }`}>
                          {item.sentiment === 'Bullish' ? <TrendingUp size={10} /> : item.sentiment === 'Bearish' ? <TrendingDown size={10} /> : <Activity size={10} />}
                          {item.sentiment}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          item.impact === 'High' ? 'bg-rose-500/10 text-rose-400' : item.impact === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-white/5 text-gray-500'
                        }`}>
                          {item.impact}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={e => toggleSave(e, item)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            savedIds.includes(item.id) ? 'bg-yellow-400/10 text-yellow-400' : 'text-gray-500 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Bookmark size={13} fill={savedIds.includes(item.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={e => handleShare(e, item)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Share2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="col-span-full py-24 text-center"
            >
              <div className="text-gray-600 text-4xl mb-4">📡</div>
              <p className="text-gray-500 text-sm font-medium">No intel matching this category channel.</p>
              <button
                onClick={() => setActiveCategory('All')}
                className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Clear Filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Centered Article Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Card — centered, max-w-2xl */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ type: 'spring', damping: 30, stiffness: 260 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl z-10
                         bg-[#08090f] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.9)]"
              style={{ backdropFilter: 'blur(40px)' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Thumbnail hero */}
              <div className="w-full aspect-video relative overflow-hidden rounded-t-2xl">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090f] via-black/30 to-transparent" />

                {/* Close button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 border border-white/10
                             text-gray-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
                >
                  <X size={16} />
                </button>

                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="text-[9px] font-black text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded">
                    INTEL CORE
                  </span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getSourceBadge(selectedItem.source)}`}>
                    {selectedItem.source}
                  </span>
                </div>
              </div>

              {/* Content area */}
              <div className="p-6 space-y-5">
                {/* Meta */}
                <div className="flex items-center gap-3 text-[10px] text-gray-500 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>{selectedItem.time}</span>
                  </div>
                  <span className="text-gray-700">•</span>
                  <span>By {selectedItem.author}</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-black text-white leading-tight">
                  {selectedItem.title}
                </h2>

                {/* Tag row */}
                <div className="flex flex-wrap gap-2">
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded border ${
                    selectedItem.sentiment === 'Bullish'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : selectedItem.sentiment === 'Bearish'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-white/5 text-gray-400 border-white/10'
                  }`}>
                    SENTIMENT: {selectedItem.sentiment.toUpperCase()}
                  </span>
                  <span className={`text-[9px] font-bold px-2.5 py-1 rounded border ${
                    selectedItem.impact === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    selectedItem.impact === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-white/5 text-gray-400 border-white/10'
                  }`}>
                    IMPACT: {selectedItem.impact.toUpperCase()}
                  </span>
                  <span className="text-[9px] font-bold px-2.5 py-1 rounded bg-white/5 border border-white/10 text-gray-400">
                    CHANNEL: {selectedItem.category.toUpperCase()}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-sm font-semibold text-white/90 leading-relaxed border-t border-white/5 pt-4">
                  {selectedItem.summary}
                </p>

                {/* Full content */}
                <p className="text-gray-400 text-sm leading-relaxed">
                  {selectedItem.content}
                </p>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button
                    onClick={e => toggleSave(e, selectedItem)}
                    className="flex-1 py-3 bg-white/5 border border-white/10 hover:border-yellow-400/30
                               hover:text-yellow-400 rounded-xl text-xs font-black uppercase tracking-widest
                               transition-all flex items-center justify-center gap-2 text-gray-300"
                  >
                    <Bookmark size={14} fill={savedIds.includes(selectedItem.id) ? 'currentColor' : 'none'} />
                    {savedIds.includes(selectedItem.id) ? 'Bookmarked' : 'Save Intel'}
                  </button>

                  <a
                    href="https://tradingview.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex-1 py-3 bg-yellow-400/10 border border-yellow-400/20 hover:bg-yellow-400/20
                               text-yellow-400 rounded-xl text-xs font-black uppercase tracking-widest
                               transition-all flex items-center justify-center gap-2"
                  >
                    Deep Research <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;
