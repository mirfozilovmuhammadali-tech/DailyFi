import axios from 'axios';

// Using a reliable CORS proxy for public APIs
const CORS_PROXY = 'https://api.allorigins.win/get?url=';

export interface MacroDataPoint {
  date: string;
  value: number;
}

export interface MacroIndicatorDetails {
  id: string;
  name: string;
  symbol: string;
  currentValue: number;
  change24h: number;
  explanation: string;
  marketMeaning: string;
  cryptoImpact: 'Bullish' | 'Bearish' | 'Neutral';
  historicalContext: string;
  provider: string;
  chartData: MacroDataPoint[];
  lastUpdated: string;
}

// Fetch real Yahoo Finance data via CORS proxy
export const fetchYahooFinanceData = async (symbol: string): Promise<{ current: number, change: number, history: MacroDataPoint[] }> => {
  try {
    const targetUrl = encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`);
    const response = await axios.get(`${CORS_PROXY}${targetUrl}`);
    
    const data = JSON.parse(response.data.contents);
    const result = data.chart.result[0];
    const quotes = result.indicators.quote[0];
    const timestamps = result.timestamp;

    const history: MacroDataPoint[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (quotes.close[i] !== null) {
        history.push({
          date: new Date(timestamps[i] * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
          value: Number(quotes.close[i].toFixed(2))
        });
      }
    }

    const current = history[history.length - 1].value;
    const previous = history[history.length - 2].value;
    const change = ((current - previous) / previous) * 100;

    return { current, change, history };
  } catch (error) {
    console.error(`Error fetching real data for ${symbol}:`, error);
    throw error;
  }
};

export const fetchMacroDetails = async (indicatorId: string): Promise<MacroIndicatorDetails> => {
  const timestamp = new Date().toISOString();
  
  // Real Yahoo Finance Ticker Mapping
  const configMap: Record<string, any> = {
    'dxy': {
      symbol: 'DX-Y.NYB',
      name: 'DXY - US Dollar Index',
      explanation: 'The US Dollar Index measures the value of the USD relative to a basket of foreign currencies.',
      marketMeaning: 'A rising DXY indicates a strengthening US Dollar, meaning tighter global liquidity and higher borrowing costs.',
      cryptoImpact: 'Bearish',
      historicalContext: 'Historically, Bitcoin trades inversely to the dollar. High DXY correlates with local bottoms in crypto.'
    },
    'us10y': {
      symbol: '^TNX',
      name: 'US 10Y Bond Yield',
      explanation: 'The 10-year Treasury yield is the annualized return an investor earns by holding a US government bond.',
      marketMeaning: 'Serves as a global benchmark for borrowing costs. Rising yields indicate expectations of higher inflation or stronger growth.',
      cryptoImpact: 'Bearish',
      historicalContext: 'Risk-on assets like Bitcoin face downward pressure when risk-free rates rise as capital rotates into safe government debt.'
    },
    'target-rate': {
      symbol: '^IRX',
      name: '13-Week Treasury Bill (Target Rate Proxy)',
      explanation: 'The 13-week Treasury bill yield closely tracks the Federal Funds Target Rate.',
      marketMeaning: 'High short-term rates reflect restrictive monetary policy by the Federal Reserve to combat inflation.',
      cryptoImpact: 'Bearish',
      historicalContext: 'Crypto bull runs historically begin when the Fed pivots and begins cutting these short-term rates.'
    },
    'm2': {
      symbol: 'GC=F',
      name: 'Gold Futures (M2/Liquidity Proxy)',
      explanation: 'Gold is traditionally used to hedge against fiat debasement and M2 Money Supply expansion.',
      marketMeaning: 'Rising gold prices typically indicate expanding global liquidity and a devaluation of fiat currency.',
      cryptoImpact: 'Bullish',
      historicalContext: 'Bitcoin is often referred to as digital gold; both assets expand during periods of M2 supply growth.'
    },
    'global-liquidity': {
      symbol: '^W5000',
      name: 'Wilshire 5000 (Global Liquidity Proxy)',
      explanation: 'A broad-based market capitalization-weighted index representing the total US equity market.',
      marketMeaning: 'Total market capitalization acts as a real-time indicator of global liquidity and risk appetite.',
      cryptoImpact: 'Bullish',
      historicalContext: 'High global liquidity flows downstream into higher-beta assets like cryptocurrencies and altcoins.'
    },
    'recession': {
      symbol: '^VIX',
      name: 'CBOE Volatility Index (Recession Fear Gauge)',
      explanation: 'The VIX measures market expectation of near-term volatility conveyed by S&P 500 stock index option prices.',
      marketMeaning: 'Spikes in the VIX indicate fear, panic, and an increased probability of an impending recession or market crash.',
      cryptoImpact: 'Bearish',
      historicalContext: 'Extreme VIX spikes (e.g., March 2020) historically cause severe short-term liquidations in crypto markets.'
    },
    'btc-corr': {
      symbol: 'BTC-USD',
      name: 'Bitcoin vs DXY Correlation',
      explanation: 'Tracking real-time Bitcoin price action to measure its inverse correlation with the broader macro environment.',
      marketMeaning: 'When BTC rises while traditional equities or the Dollar falls, it demonstrates decoupling and strong fundamental strength.',
      cryptoImpact: 'Bullish',
      historicalContext: 'During peak accumulation phases, Bitcoin begins to decouple from the stock market and front-runs macro liquidity.'
    },
    'cpi': {
      symbol: 'TIP',
      name: 'Treasury Inflation-Protected Securities (CPI Proxy)',
      explanation: 'TIPS are government bonds whose principal increases with inflation (CPI).',
      marketMeaning: 'Rising TIPS prices indicate that the market expects higher future inflation and CPI prints.',
      cryptoImpact: 'Neutral',
      historicalContext: 'While inflation technically debases fiat (bullish for BTC), high CPI prints force the Fed to raise rates (bearish for BTC).'
    },
    'fed': {
      symbol: 'TLT',
      name: '20+ Year Treasury Bond (Fed Pivot Gauge)',
      explanation: 'Long-term government bonds that react aggressively to shifts in Federal Reserve policy expectations.',
      marketMeaning: 'A rising TLT indicates the market is pricing in rate cuts and a "dovish" pivot from the Federal Reserve.',
      cryptoImpact: 'Bullish',
      historicalContext: 'The moment the Fed pivots to cutting rates, risk-on assets typically experience massive capital inflows.'
    },
    'unemployment': {
      symbol: '^DJI',
      name: 'Dow Jones (Labor Market Health Proxy)',
      explanation: 'The Dow tracks 30 prominent companies. Industrial health is heavily correlated with unemployment.',
      marketMeaning: 'A strong labor market usually supports higher equity prices but can also keep inflation sticky.',
      cryptoImpact: 'Neutral',
      historicalContext: 'If unemployment spikes drastically, it forces the Fed to print money to stimulate the economy, which is highly bullish for crypto.'
    }
  };

  const config = configMap[indicatorId];
  
  if (!config) {
    throw new Error(`Indicator ID ${indicatorId} not mapped.`);
  }

  const { current, change, history } = await fetchYahooFinanceData(config.symbol);

  return {
    id: indicatorId,
    name: config.name,
    symbol: config.symbol,
    currentValue: current,
    change24h: change,
    explanation: config.explanation,
    marketMeaning: config.marketMeaning,
    cryptoImpact: config.cryptoImpact,
    historicalContext: config.historicalContext,
    provider: 'Yahoo Finance API (Live)',
    chartData: history,
    lastUpdated: timestamp
  };
};
