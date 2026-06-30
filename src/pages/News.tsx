import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Clock, Newspaper, Zap, Bookmark, Share2,
  ExternalLink, RefreshCcw, X, TrendingUp, TrendingDown, Activity
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Source   = 'COINGECKO INSIGHTS' | 'COINMARKETCAP' | 'THE DAILY HODL' | 'DAILYFI STRATEGY';
type Category = 'Bitcoin' | 'Ethereum' | 'Altcoins' | 'ETFs' | 'Regulation' | 'Macro Economics' | 'Global Markets';
type Sentiment = 'Bullish' | 'Bearish' | 'Neutral';
type Impact    = 'High' | 'Medium' | 'Low';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: Source;
  time: string;
  timestamp: number;
  category: Category;
  sentiment: Sentiment;
  impact: Impact;
  image: string;
  author: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES: string[] = [
  'All', 'Bitcoin', 'Ethereum', 'Altcoins', 'ETFs', 'Regulation', 'Macro Economics', 'Global Markets'
];

// ─── Unique image map — one distinct Unsplash photo per article ───────────────
// Bitcoin:        orange/gold coin / blockchain circuit aesthetics
// Ethereum:       purple digital art / smart contract neon
// Altcoins:       colorful multichain / futuristic network nodes
// ETFs:           stock market floor / trading screens / TradingView charts
// Regulation:     government building / gavel / legal architecture
// Macro Economics: central bank / gold bars / dollar bills
// Global Markets: world map / global finance skyline / trading floor

const IMG = {
  // Bitcoin
  btc1: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80&w=800&h=500',
  btc2: 'https://images.unsplash.com/photo-1591994843349-f415893b3a6b?auto=format&fit=crop&q=80&w=800&h=500',
  btc3: 'https://images.unsplash.com/photo-1622630998477-20aa696ecb05?auto=format&fit=crop&q=80&w=800&h=500',
  btc4: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=800&h=500',
  // Ethereum
  eth1: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800&h=500',
  eth2: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80&w=800&h=500',
  eth3: 'https://images.unsplash.com/photo-1614854262318-831574f15f1f?auto=format&fit=crop&q=80&w=800&h=500',
  // Altcoins
  alt1: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=800&h=500',
  alt2: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800&h=500',
  alt3: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800&h=500',
  // ETFs
  etf1: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800&h=500',
  etf2: 'https://images.unsplash.com/photo-1560221328-12fe60f83ab8?auto=format&fit=crop&q=80&w=800&h=500',
  etf3: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=800&h=500',
  // Regulation
  reg1: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800&h=500',
  reg2: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800&h=500',
  // Macro Economics
  mac1: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800&h=500',
  mac2: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800&h=500',
  mac3: 'https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&q=80&w=800&h=500',
  // Global Markets
  gm1:  'https://images.unsplash.com/photo-1534951009808-766178b47a4f?auto=format&fit=crop&q=80&w=800&h=500',
  gm2:  'https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=800&h=500',
};

// ─── Initial Article Database (17 articles, all unique images) ────────────────
const INITIAL_NEWS: NewsItem[] = [

  // ══════ BITCOIN ══════
  {
    id: 'n-btc-1',
    title: 'Bitcoin Surges Past $72K as Institutional ETF Demand Hits 90-Day Peak',
    summary: 'Spot BTC ETF inflows cross the $1.4B weekly threshold for the first time since January as BlackRock and Fidelity absorb sell-side pressure.',
    content: 'On-chain data from Glassnode confirms that Bitcoin exchange reserves have hit a 5-year low. BlackRock\'s IBIT and Fidelity\'s FBTC reported a combined daily intake exceeding $420M — levels last seen at the January 2024 spot-ETF launch event. The confluence of shrinking exchange supply and growing institutional accumulation creates a classic demand shock setup likely to sustain upward price momentum through Q3.',
    source: 'COINMARKETCAP',
    time: '4m ago',
    timestamp: Date.now() - 240000,
    category: 'Bitcoin',
    sentiment: 'Bullish',
    impact: 'High',
    image: IMG.btc1,
    author: 'Marcus Thornton'
  },
  {
    id: 'n-btc-2',
    title: 'CoinGecko: Bitcoin Open Interest Spikes 22% — Liquidation Cascade Risk Elevated',
    summary: 'Perpetual futures OI on BTC climbed aggressively in 72 hours, raising probability of a sharp correction if leverage unwinds.',
    content: 'CoinGecko derivatives analytics show Bitcoin perpetual open interest has swelled to $18.4B across major CEXs — a 22% increase week-over-week. Funding rates have turned positive but remain below euphoric thresholds. Historical patterns show OI expansions of this magnitude, when not supported by spot volume, historically precede 8–15% corrective drawdowns. Disciplined stop-loss protocols are advised.',
    source: 'COINGECKO INSIGHTS',
    time: '31m ago',
    timestamp: Date.now() - 1860000,
    category: 'Bitcoin',
    sentiment: 'Bearish',
    impact: 'High',
    image: IMG.btc2,
    author: 'Bobby Ong'
  },
  {
    id: 'n-btc-3',
    title: 'MicroStrategy Adds 10,000 BTC to Treasury — Holdings Now 224,000 Coins',
    summary: 'Saylor\'s firm acquires 10,000 BTC at $68,500 average, validating Bitcoin as the premier corporate treasury reserve asset.',
    content: 'MicroStrategy executed another large-scale Bitcoin purchase, acquiring 10,000 BTC for approximately $685M. Total holdings now stand at 224,000 BTC with a cost basis of $9.87B. This aggressive treasury strategy continues to validate Bitcoin as a corporate reserve asset and signals to other CFOs evaluating non-dilutive treasury diversification that the institutional conviction narrative is intact.',
    source: 'THE DAILY HODL',
    time: '1h ago',
    timestamp: Date.now() - 3600000,
    category: 'Bitcoin',
    sentiment: 'Bullish',
    impact: 'Medium',
    image: IMG.btc3,
    author: 'Nick Marinoff'
  },
  {
    id: 'n-btc-4',
    title: 'DailyFi Strategy: Post-Halving Miner Revenue Hits 12-Month High',
    summary: 'Bitcoin miner daily revenue above $40M validates the halving supply shock thesis and eliminates capitulation risk.',
    content: 'DAILYFI TERMINAL ANALYSIS — Post-halving miner revenue has stabilized well above break-even levels for industrial-grade operations. The combination of higher BTC spot prices (+52% post-halving) and episodic Rune transaction fee spikes keeps daily miner revenue above $40M consistently. This validates the halving supply shock thesis and removes a key systemic risk: mass miner capitulation selling.',
    source: 'DAILYFI STRATEGY',
    time: '2h ago',
    timestamp: Date.now() - 7200000,
    category: 'Bitcoin',
    sentiment: 'Bullish',
    impact: 'Medium',
    image: IMG.btc4,
    author: 'DailyFi Macro Desk'
  },

  // ══════ ETHEREUM ══════
  {
    id: 'n-eth-1',
    title: 'Ethereum Staking Ratio Crosses 28% — Network Supply Shock Deepens',
    summary: 'Over 33.6M ETH locked in the consensus layer reduces liquid exchange supply to multi-year lows, tightening the float.',
    content: 'The Ethereum staking ratio has crossed the 28.5% threshold according to latest beacon chain data. This structural reduction in active liquid supply, combined with steady ETF purchasing velocity, is creating a supply-demand imbalance. The Ethereum Foundation notes that validator queue wait times have extended to 28 days — further illustrating relentless demand for staking yield in the current rate environment.',
    source: 'THE DAILY HODL',
    time: '35m ago',
    timestamp: Date.now() - 2100000,
    category: 'Ethereum',
    sentiment: 'Bullish',
    impact: 'Medium',
    image: IMG.eth1,
    author: 'Nick Marinoff'
  },
  {
    id: 'n-eth-2',
    title: 'CoinGecko: Ethereum Layer-2 TVL Reaches $52B as Dencun Upgrade Matures',
    summary: 'Post-Dencun proto-danksharding compresses L2 fees 96%, driving unprecedented DeFi protocol migration from mainnet.',
    content: 'CoinGecko ecosystem analytics confirm total value locked across Ethereum Layer-2 networks has surpassed $52 billion. Arbitrum, Optimism, and Base collectively account for 73% of this liquidity. Transaction fees on leading L2s have dropped 96% following EIP-4844 activation, accelerating migration of Uniswap, Aave, and Curve user bases off Ethereum mainnet and establishing L2s as the default execution layer.',
    source: 'COINGECKO INSIGHTS',
    time: '2h ago',
    timestamp: Date.now() - 7200000,
    category: 'Ethereum',
    sentiment: 'Bullish',
    impact: 'High',
    image: IMG.eth2,
    author: 'Connor Brown'
  },
  {
    id: 'n-eth-3',
    title: 'DailyFi Strategy: ETH/BTC Ratio Signals Altseason Precursor — Reweight Now',
    summary: 'ETH/BTC breaking above 0.052 historically precedes broad alt market outperformance within 4–8 weeks with 74% accuracy.',
    content: 'DAILYFI TERMINAL ANALYSIS — Our proprietary cross-pair momentum matrix detected the ETH/BTC ratio reclaiming its 200-day EMA. Back-tests across 3 previous cycles show this pattern precedes Ethereum-led alt season rotations with a 74% success rate. Current portfolio allocation models suggest increasing ETH weighting by 5–8% at the expense of stablecoin buffer positions to capture this historical tendency.',
    source: 'DAILYFI STRATEGY',
    time: '3h ago',
    timestamp: Date.now() - 10800000,
    category: 'Ethereum',
    sentiment: 'Bullish',
    impact: 'High',
    image: IMG.eth3,
    author: 'DailyFi Macro Desk'
  },

  // ══════ ALTCOINS ══════
  {
    id: 'n-alt-1',
    title: 'CoinGecko: $420M Institutional Inflow Into Solana and Avalanche Protocols',
    summary: 'High-conviction capital rotation into non-EVM smart contract platforms accelerates as institutional risk appetite expands.',
    content: 'A comprehensive institutional asset flow report from CoinGecko Research details $420M in net inflows across top-tier non-EVM smart contract platforms in 7 business days. Solana leads with $280M driven by DePIN and consumer-application ecosystems. Avalanche attracted $140M, benefiting from its subnet architecture adopted by multiple TradFi institutions for permissioned chain deployments.',
    source: 'COINGECKO INSIGHTS',
    time: '2m ago',
    timestamp: Date.now() - 120000,
    category: 'Altcoins',
    sentiment: 'Bullish',
    impact: 'High',
    image: IMG.alt1,
    author: 'Bobby Ong'
  },
  {
    id: 'n-alt-2',
    title: 'DailyFi Strategy: DXY Weakness Triggers Layer-1 Capital Rotation Matrix',
    summary: 'DXY declining 3%+ in 30 days historically produces 34% average L1 outperformance versus Bitcoin over the following 60 days.',
    content: 'DAILYFI TERMINAL ANALYSIS — Dynamic macro-trend indicators confirm the US Dollar Index has entered a medium-term distribution phase. In 4 of the last 5 instances where DXY declined 3%+ over 30 days, on-chain capital rotated into alternative Layer-1 protocols outperforming Bitcoin by an average of 34% over 60 days. Current rotation targets: SOL, AVAX, DOT, NEAR at structured entry levels.',
    source: 'DAILYFI STRATEGY',
    time: '45m ago',
    timestamp: Date.now() - 2700000,
    category: 'Altcoins',
    sentiment: 'Bullish',
    impact: 'High',
    image: IMG.alt2,
    author: 'DailyFi Macro Desk'
  },
  {
    id: 'n-alt-3',
    title: 'The Daily Hodl: Solana Memecoin Volume Collapses 87% — Pump.fun Fees Crater',
    summary: 'Speculative retail frenzy driving Solana ecosystem fees to record highs has reversed sharply, signaling reduced retail participation.',
    content: 'On-chain analytics confirm memecoin launch platform Pump.fun has seen daily fee revenue crater from $4.2M to under $600K in 30 days — an 86% reduction. This mirrors previous memecoin cycle collapses and historically precedes a 6–10 week SOL price drawdown period before the next utility-driven cycle expansion begins. DeFi protocol revenues remain healthy despite the memecoin slowdown.',
    source: 'THE DAILY HODL',
    time: '4h ago',
    timestamp: Date.now() - 14400000,
    category: 'Altcoins',
    sentiment: 'Bearish',
    impact: 'Medium',
    image: IMG.alt3,
    author: 'Liam Wright'
  },

  // ══════ ETFs ══════
  {
    id: 'n-etf-1',
    title: 'BlackRock IBIT Surpasses $20B AUM — Fastest ETF Accumulation in Financial History',
    summary: 'The iShares Bitcoin Trust shatters the all-time record for fastest AUM accumulation, leaving gold ETFs decades behind.',
    content: 'BlackRock\'s iShares Bitcoin Trust (IBIT) crossed the $20B AUM threshold in just 120 trading days since its January 2024 launch — smashing the previous record held by a gold ETF that took 5 years to achieve the same. Daily volume for IBIT now regularly exceeds $1.5B, making it one of the top 5 most-traded ETFs on US exchanges. The product is now available on over 140 wealth management platforms.',
    source: 'COINMARKETCAP',
    time: '12m ago',
    timestamp: Date.now() - 720000,
    category: 'ETFs',
    sentiment: 'Bullish',
    impact: 'High',
    image: IMG.etf1,
    author: 'Alice Taylor'
  },
  {
    id: 'n-etf-2',
    title: 'CoinGecko: Ethereum Spot ETF Day-1 Volume Hits $804M Across All Issuers',
    summary: 'Inaugural US spot Ethereum ETF trading session delivers strong institutional participation with nine issuers competing for flows.',
    content: 'CoinGecko market data confirms the first-day combined volume across all approved US spot Ethereum ETFs reached $804M. Grayscale ETHE led with $319M in volume, followed by BlackRock\'s ETHA at $248M. Net flow analysis confirms Day-1 net inflows of $106M after accounting for Grayscale conversion outflows. Analysts predict steady accumulation over 30–60 days as wealth management platforms complete ETH onboarding.',
    source: 'COINGECKO INSIGHTS',
    time: '5h ago',
    timestamp: Date.now() - 18000000,
    category: 'ETFs',
    sentiment: 'Bullish',
    impact: 'High',
    image: IMG.etf2,
    author: 'Elena Voss'
  },
  {
    id: 'n-etf-3',
    title: 'DailyFi Strategy: GBTC Discount Narrows to 1.5% — Arbitrage Window Closing',
    summary: 'GBTC discount compressed from 48% to 1.5%, eliminating the lucrative institutional arbitrage opportunity that defined 2023.',
    content: 'DAILYFI TERMINAL ANALYSIS — The Grayscale Bitcoin Trust discount to NAV has nearly closed following ETF conversion approval. This removes the largest source of systematic arbitrage alpha exploited by hedge funds during 2022–2023. Rotation capital previously locked in GBTC arbitrage is now flowing into spot BTC ETFs at BlackRock and Fidelity, providing net-positive demand momentum for direct BTC price exposure vehicles.',
    source: 'DAILYFI STRATEGY',
    time: '6h ago',
    timestamp: Date.now() - 21600000,
    category: 'ETFs',
    sentiment: 'Neutral',
    impact: 'Medium',
    image: IMG.etf3,
    author: 'DailyFi Macro Desk'
  },

  // ══════ REGULATION ══════
  {
    id: 'n-reg-1',
    title: 'SEC Launches Probe Into Decentralized AI Compute Tokens — RNDR and AKT Named',
    summary: 'Regulators examine whether GPU-leasing token distributions constitute unregistered securities under the Howey Test.',
    content: 'The SEC has initiated formal inquiries into multiple decentralized compute-sharing protocols. Regulators are examining whether token distributions for AI GPU-leasing networks constitute unregistered securities offerings. Render Network (RNDR) and Akash Network (AKT) are both under review. Legal teams for both projects issued public statements affirming utility token classification and compliance with existing guidance.',
    source: 'THE DAILY HODL',
    time: '3h ago',
    timestamp: Date.now() - 10800000,
    category: 'Regulation',
    sentiment: 'Bearish',
    impact: 'High',
    image: IMG.reg1,
    author: 'Daily Hodl Staff'
  },
  {
    id: 'n-reg-2',
    title: 'EU MiCA Framework Live — Binance and Kraken Secure Full CASP Compliance Licenses',
    summary: 'MiCA grants legal certainty to compliant exchanges across 27 EU member states while restricting non-compliant stablecoin operations.',
    content: 'The European Union\'s landmark MiCA regulation has entered enforcement, establishing the first comprehensive crypto regulatory framework across 27 member states. Binance EU, Kraken, and Coinbase have secured CASP (Crypto Asset Service Provider) licenses, granting full legal authority across EU markets. Tether USDT has received a restricted notice — operators must transition clients to MiCA-compliant stablecoins by year-end.',
    source: 'COINMARKETCAP',
    time: '7h ago',
    timestamp: Date.now() - 25200000,
    category: 'Regulation',
    sentiment: 'Bullish',
    impact: 'High',
    image: IMG.reg2,
    author: 'Sophie Laurent'
  },

  // ══════ MACRO ECONOMICS ══════
  {
    id: 'n-mac-1',
    title: 'DailyFi Strategy: DXY Breakout Above 104.80 Triggers Tactical Hedge Allocation',
    summary: 'Dollar Index breaking multi-month resistance prompts 15% rebalance into stablecoin buffers as high-beta assets face headwinds.',
    content: 'DAILYFI TERMINAL ANALYSIS — Dynamic macro indicators show DXY consolidating above critical multi-month resistance at 104.80. Persistent dollar strength historically suppresses digital asset valuations with a 60–90 day lag. We recommend systematic profit-taking on over-extended positions. Rebalance 15% of high-beta holdings into USDC buffers while maintaining core BTC/ETH allocations unchanged to preserve upside optionality.',
    source: 'DAILYFI STRATEGY',
    time: '1h ago',
    timestamp: Date.now() - 3600000,
    category: 'Macro Economics',
    sentiment: 'Bearish',
    impact: 'High',
    image: IMG.mac1,
    author: 'DailyFi Macro Desk'
  },
  {
    id: 'n-mac-2',
    title: 'Federal Reserve Signals Pivot — September Rate Cut at 94% Probability on CME FedWatch',
    summary: 'Powell\'s Congressional testimony contains unmistakable pivot signals. Rate cuts expand global M2, catalyzing risk-on capital rotation.',
    content: 'Federal Reserve Chair Jerome Powell\'s latest Congressional testimony contained clear signals of an approaching monetary policy pivot. The CME FedWatch tool now prices a 94% probability of a 25bps cut at the September FOMC meeting. Rate cuts expand global M2 money supply — historically a tailwind for scarce, deflationary digital assets. DailyFi recommends systematic DCA into BTC and ETH in the 4–6 weeks before the expected cut.',
    source: 'DAILYFI STRATEGY',
    time: '2h ago',
    timestamp: Date.now() - 7200000,
    category: 'Macro Economics',
    sentiment: 'Bullish',
    impact: 'High',
    image: IMG.mac2,
    author: 'DailyFi Macro Desk'
  },
  {
    id: 'n-mac-3',
    title: 'CoinMarketCap Macro Report: Global M2 Supply Hits $108T — Crypto Tailwind Builds',
    summary: 'Global M2 money supply reaching record highs historically precedes Bitcoin price appreciation by 3–5 months with high correlation.',
    content: 'CoinMarketCap\'s macro intelligence report documents global M2 money supply reaching $108 trillion — an all-time high driven by synchronized monetary easing across the US, EU, China, and Japan. Quantitative research from multiple institutional desks identifies a historically high correlation between global M2 expansion and Bitcoin price appreciation with a 90–150 day lag, suggesting a significant tailwind building for Q4.',
    source: 'COINMARKETCAP',
    time: '5h ago',
    timestamp: Date.now() - 18000000,
    category: 'Macro Economics',
    sentiment: 'Bullish',
    impact: 'High',
    image: IMG.mac3,
    author: 'Vance Parker'
  },

  // ══════ GLOBAL MARKETS ══════
  {
    id: 'n-gm-1',
    title: 'CoinMarketCap: DeFi Volume Spikes 34% as Rate Cuts Compress Bond Yields',
    summary: 'DeFi yields now offer a 3× premium over comparable 10-year Treasuries, triggering institutional capital migration into on-chain protocols.',
    content: 'CoinMarketCap market telemetry reports DeFi trading volumes hitting an annualized high. The recent rate cut cycle compressed sovereign bond yields to the point where on-chain yields offer a meaningful premium. Decentralized stablecoin pools on Curve and Aave offer 6–9% APY — a 3× premium over comparable 10-year Treasuries. Capital inflows into DeFi from traditional asset managers reached $2.1B over 30 days.',
    source: 'COINMARKETCAP',
    time: '12m ago',
    timestamp: Date.now() - 720000,
    category: 'Global Markets',
    sentiment: 'Bullish',
    impact: 'High',
    image: IMG.gm1,
    author: 'Vance Parker'
  },
  {
    id: 'n-gm-2',
    title: 'CoinMarketCap Intelligence: Stablecoin Inflows Near $3B Weekly — Dry Powder Accumulates',
    summary: 'Largest weekly stablecoin onboarding phase of the calendar year signals institutional readiness to deploy into risk assets imminently.',
    content: 'Net capital entering the digital asset ecosystem via USDT and USDC mints has accelerated significantly. CoinMarketCap data marks this as the largest weekly onboarding phase of the calendar year, reflecting institutional readiness to deploy into risk assets. Total stablecoin market cap now exceeds $162B — a formidable war chest of dry powder positioned for deployment into digital assets at key technical levels.',
    source: 'COINMARKETCAP',
    time: '4h ago',
    timestamp: Date.now() - 14400000,
    category: 'Global Markets',
    sentiment: 'Bullish',
    impact: 'Medium',
    image: IMG.gm2,
    author: 'Vance Parker'
  }
];

// ─── Dynamic injection pool (4 rotating articles, unique images) ──────────────
const INJECTION_POOL: Omit<NewsItem, 'id' | 'timestamp' | 'time'>[] = [
  {
    title: 'BREAKING: Bitcoin Spot ETF Records Largest Single-Day Inflow — $1.14B Net',
    summary: 'Combined BTC ETF net inflows eclipsed the previous daily record, reinforcing institutional conviction ahead of quarter-end.',
    content: 'Real-time ETF flow data confirms all ten US Bitcoin spot ETFs collectively registered $1.14B in net inflows during this session, eclipsing the previous single-day record. BlackRock alone absorbed $640M. This supply shock against a backdrop of declining exchange reserves creates extraordinary conditions for upside price discovery.',
    source: 'COINMARKETCAP',
    category: 'ETFs',
    sentiment: 'Bullish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Wire Desk'
  },
  {
    title: 'WIRE: CoinGecko Flags Altcoin Fear & Greed Crossing Into Extreme Greed Territory',
    summary: 'The composite altcoin sentiment index enters extreme greed for the first time in 14 months — historically a dual-signal indicator.',
    content: 'CoinGecko\'s composite sentiment indicator for the broader altcoin market crossed 82/100 into extreme greed. Extreme greed readings preceded 10–20% short-term corrections in 68% of historical instances while also marking the beginning of parabolic final legs in 32% of cases. Risk management frameworks should account for both scenarios.',
    source: 'COINGECKO INSIGHTS',
    category: 'Altcoins',
    sentiment: 'Bearish',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1619418602850-35ad20aa1700?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Wire Desk'
  },
  {
    title: 'ALERT: Fed Statement Spooks Risk Markets — Bitcoin Drops 4% on Inflation Concerns',
    summary: 'Unexpected Fed commentary around sticky core services inflation at 3.8% annualized triggered immediate risk-off liquidations.',
    content: 'An unexpected Federal Reserve inter-meeting statement warned of sticky core services inflation re-accelerating to 3.8% annualized. Markets reacted with Bitcoin selling off 4% in 15 minutes on elevated volume. DXY spiked 0.6%. DailyFi Strategy Desk notes this as a data-driven buying opportunity for long-term accumulators rather than a structural trend reversal signal.',
    source: 'DAILYFI STRATEGY',
    category: 'Macro Economics',
    sentiment: 'Bearish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1462899006636-339e08d1844e?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'DailyFi Macro Desk'
  },
  {
    title: 'LIVE WIRE: Ethereum Layer-2 Sequencer Revenue Crosses $10M Daily for First Time',
    summary: 'L2 revenue milestone validates the Dencun upgrade thesis: lower user fees with higher protocol revenue as transaction volume explodes.',
    content: 'Combined daily sequencer revenue across Arbitrum, Optimism, and Base has crossed the $10M threshold for the first time — despite user fees falling 96% post-Dencun. The volume expansion more than compensated for per-transaction fee reductions. This milestone validates Ethereum\'s L2-centric scaling roadmap and demonstrates the sustainability of the new fee market architecture.',
    source: 'THE DAILY HODL',
    category: 'Ethereum',
    sentiment: 'Bullish',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800&h=500',
    author: 'Wire Desk'
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getRelativeTime = (ts: number): string => {
  const min = Math.floor((Date.now() - ts) / 60000);
  if (min < 1)  return 'Just now';
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24)   return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const getSourceBadge = (source: Source): string => {
  switch (source) {
    case 'COINGECKO INSIGHTS': return 'text-[#8cc63f] bg-[#8cc63f]/10 border-[#8cc63f]/30';
    case 'COINMARKETCAP':      return 'text-[#4E88F8] bg-[#4E88F8]/10 border-[#4E88F8]/30';
    case 'THE DAILY HODL':     return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
    case 'DAILYFI STRATEGY':   return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
  }
};

const getSentimentColors = (s: Sentiment) => ({
  ping:  s === 'Bullish' ? 'bg-emerald-400' : s === 'Bearish' ? 'bg-rose-400' : 'bg-gray-400',
  dot:   s === 'Bullish' ? 'bg-emerald-500' : s === 'Bearish' ? 'bg-rose-500' : 'bg-gray-500',
  text:  s === 'Bullish' ? 'text-emerald-400' : s === 'Bearish' ? 'text-rose-400' : 'text-gray-400',
  badge: s === 'Bullish' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
       : s === 'Bearish' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
       : 'bg-white/5 text-gray-400 border-white/10',
});

const getImpactBadge = (i: Impact): string => {
  if (i === 'High')   return 'bg-rose-500/10 text-rose-400';
  if (i === 'Medium') return 'bg-amber-500/10 text-amber-400';
  return 'bg-white/5 text-gray-500';
};

// ─── Component ────────────────────────────────────────────────────────────────
const News: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery,    setSearchQuery]     = useState('');
  const [selectedItem,   setSelectedItem]    = useState<NewsItem | null>(null);
  const [savedIds,       setSavedIds]        = useState<string[]>([]);
  const [toastMsg,       setToastMsg]        = useState('');
  const [toastVisible,   setToastVisible]    = useState(false);
  const [tick,           setTick]            = useState(60);
  const [flashId,        setFlashId]         = useState<string | null>(null);
  const [news,           setNews]            = useState<NewsItem[]>(INITIAL_NEWS);
  const poolIndexRef = useRef(0);

  // ── Restore bookmarks
  useEffect(() => {
    const saved = localStorage.getItem('dailyfi_saved_news');
    if (saved) setSavedIds(JSON.parse(saved));
  }, []);

  // ── Lock body scroll when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedItem]);

  // ── Relative-time updater (every 20s)
  useEffect(() => {
    const id = setInterval(() => {
      setNews(prev => prev.map(item => ({ ...item, time: getRelativeTime(item.timestamp) })));
    }, 20000);
    return () => clearInterval(id);
  }, []);

  // ── 60-second live injection engine
  useEffect(() => {
    const id = setInterval(() => {
      setTick(prev => {
        if (prev <= 1) {
          const base    = INJECTION_POOL[poolIndexRef.current % INJECTION_POOL.length];
          poolIndexRef.current += 1;
          const newId   = `inject-${Date.now()}`;
          const article: NewsItem = { ...base, id: newId, timestamp: Date.now(), time: 'Just now' };

          setNews(prevList => {
            if (prevList.some(i => i.title === article.title)) return prevList;
            return [article, ...prevList]
              .slice(0, 25)
              .map(i => ({ ...i, time: getRelativeTime(i.timestamp) }));
          });
          setFlashId(newId);
          setTimeout(() => setFlashId(null), 4000);
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
    setTimeout(() => setToastVisible(false), 3500);
  };

  const forceInject = () => {
    const base  = INJECTION_POOL[poolIndexRef.current % INJECTION_POOL.length];
    poolIndexRef.current += 1;
    const newId = `inject-${Date.now()}`;
    const article: NewsItem = { ...base, id: newId, timestamp: Date.now(), time: 'Just now' };
    setNews(prev => [article, ...prev].slice(0, 25).map(i => ({ ...i, time: getRelativeTime(i.timestamp) })));
    setFlashId(newId);
    setTimeout(() => setFlashId(null), 4000);
    showToast(`⚡ MANUAL WIRE: ${article.source}`);
    setTick(60);
  };

  const toggleSave = (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    const next = savedIds.includes(item.id)
      ? savedIds.filter(x => x !== item.id)
      : [...savedIds, item.id];
    setSavedIds(next);
    localStorage.setItem('dailyfi_saved_news', JSON.stringify(next));
    showToast(savedIds.includes(item.id) ? 'Removed from Bookmarks' : 'Saved to Bookmarks');
  };

  const handleShare = (e: React.MouseEvent, item: NewsItem) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/news/${item.id}`);
    showToast('Share link copied!');
  };

  // ── Category-filtered list ────────────────────────────────────────────────
  const filteredNews = useMemo(() => {
    return news.filter(item => {
      const matchCat  = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch = !searchQuery
        || item.title.toLowerCase().includes(searchQuery.toLowerCase())
        || item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [news, activeCategory, searchQuery]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-16">

      {/* ── Toast Notification ─────────────────────────────────────────── */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[400] flex items-center gap-2
          px-6 py-3 rounded-xl bg-black/80 border border-yellow-400/30 text-yellow-300 font-bold text-xs
          shadow-[0_0_24px_rgba(255,200,0,0.18)] backdrop-blur-md transition-all duration-300 whitespace-nowrap
          ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <Zap size={13} className="text-yellow-300 animate-bounce" />
        {toastMsg}
      </div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Newspaper size={13} className="text-yellow-400" />
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.4em]">
              DailyFi Intelligence Board
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">News Aggregator</h1>
          <p className="text-gray-500 mt-1 text-sm">Live crypto-native feeds, market insights, and macro alerts.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Manual inject */}
          <button
            onClick={forceInject}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-yellow-400
                       hover:bg-yellow-400/10 transition-all active:scale-95 flex items-center gap-2
                       text-xs font-black uppercase tracking-widest"
          >
            <RefreshCcw size={14} /> Inject Feed
          </button>

          {/* Countdown */}
          <div className="px-4 py-2 rounded-xl bg-cyan-400/5 border border-cyan-400/15 text-right">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Next Wire</span>
            <span className="text-sm font-mono font-black text-cyan-400 tracking-wider">{tick}s</span>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-[260px] group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500
                            group-focus-within:text-yellow-400 transition-colors">
              <Search size={15} />
            </div>
            <input
              type="text"
              placeholder="Search feed..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs text-white
                         placeholder:text-gray-500 focus:outline-none focus:border-yellow-400/40
                         focus:bg-white/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── Category Filter Row ─────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => {
          const count  = cat === 'All' ? news.length : news.filter(i => i.category === cat).length;
          const active = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border
                          flex items-center gap-1.5 ${
                active
                  ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30 shadow-[0_0_14px_rgba(250,204,21,0.14)]'
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

      {/* ── News Grid ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredNews.length > 0 ? filteredNews.map(item => {
            const sc   = getSentimentColors(item.sentiment);
            const flash = flashId === item.id;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                onClick={() => setSelectedItem(item)}
                className={`rounded-2xl flex flex-col overflow-hidden cursor-pointer group transition-all duration-500
                            border bg-black/60 ${
                  flash
                    ? 'border-cyan-400 shadow-[0_0_26px_rgba(0,245,255,0.3)]'
                    : 'border-white/5 hover:border-yellow-400/25 hover:-translate-y-1'
                }`}
                style={{ backdropFilter: 'blur(22px)' }}
              >
                {/* ── Thumbnail ── */}
                <div className="relative w-full aspect-video overflow-hidden bg-white/5 shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* LIVE badge */}
                  {flash && (
                    <span className="absolute top-3 right-3 bg-cyan-400 text-black text-[9px] font-black
                                     px-2 py-0.5 rounded uppercase tracking-widest animate-pulse">
                      LIVE WIRE
                    </span>
                  )}

                  {/* Category chip */}
                  <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded
                                   text-[9px] font-black uppercase tracking-widest text-white border border-white/10">
                    {item.category}
                  </span>
                </div>

                {/* ── Body ── */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getSourceBadge(item.source)}`}>
                        {item.source}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Clock size={11} /><span>{item.time}</span>
                      </div>
                    </div>

                    <h3 className="text-[14px] font-black text-white group-hover:text-yellow-300 transition-colors
                                   leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed mt-2 line-clamp-2">{item.summary}</p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${sc.ping}`} />
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${sc.dot}`} />
                      </span>
                      <span className={`text-[10px] font-bold flex items-center gap-1 ${sc.text}`}>
                        {item.sentiment === 'Bullish' ? <TrendingUp size={10} />
                          : item.sentiment === 'Bearish' ? <TrendingDown size={10} />
                          : <Activity size={10} />}
                        {item.sentiment}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getImpactBadge(item.impact)}`}>
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
          }) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="col-span-full py-24 text-center"
            >
              <div className="text-5xl mb-4">📡</div>
              <p className="text-gray-500 text-sm font-medium">No intel on this channel.</p>
              <button
                onClick={() => setActiveCategory('All')}
                className="mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400
                           hover:text-white transition-colors"
              >
                Clear Filter
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Article Detail Modal — FIXED VIEWPORT CENTER ───────────────── */}
      <AnimatePresence>
        {selectedItem && (() => {
          const sc = getSentimentColors(selectedItem.sentiment);
          return (
            /* ⚠️ fixed inset-0 — this is what keeps the modal in the viewport */
            <div
              className="fixed inset-0 z-[500] flex items-center justify-center p-4 md:p-8"
              style={{ position: 'fixed' }}
            >
              {/* Backdrop — clicking it closes the modal */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedItem(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />

              {/* Modal card — centered, never bleeds off-screen */}
              <motion.div
                initial={{ opacity: 0, scale: 0.93, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl z-10
                           bg-[#07080d] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.95)]"
                style={{ backdropFilter: 'blur(40px)' }}
                onClick={e => e.stopPropagation()}
              >
                {/* Hero image */}
                <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl shrink-0">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07080d] via-black/30 to-transparent" />

                  {/* Close button */}
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-black/70 border border-white/10
                               text-gray-400 hover:text-white hover:bg-white/15 transition-all backdrop-blur-md"
                  >
                    <X size={15} />
                  </button>

                  {/* Source badges on image */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="text-[9px] font-black text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded">
                      INTEL CORE
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${getSourceBadge(selectedItem.source)}`}>
                      {selectedItem.source}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Meta row */}
                  <div className="flex items-center flex-wrap gap-3 text-[10px] text-gray-500">
                    <div className="flex items-center gap-1"><Clock size={11} /><span>{selectedItem.time}</span></div>
                    <span className="text-gray-700">•</span>
                    <span>By {selectedItem.author}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-black text-white leading-tight">{selectedItem.title}</h2>

                  {/* Tag row */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded border ${sc.badge}`}>
                      SENTIMENT: {selectedItem.sentiment.toUpperCase()}
                    </span>
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded border ${
                      selectedItem.impact === 'High'   ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : selectedItem.impact === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-white/5 text-gray-400 border-white/10'
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
                  <p className="text-gray-400 text-sm leading-relaxed">{selectedItem.content}</p>

                  {/* Action buttons */}
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
          );
        })()}
      </AnimatePresence>
    </div>
  );
};

export default News;
