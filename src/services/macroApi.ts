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
  
  if (indicatorId === 'dxy') {
    const { current, change, history } = await fetchYahooFinanceData('DX-Y.NYB');
    return {
      id: 'dxy',
      name: 'DXY - US Dollar Index',
      symbol: 'DX-Y.NYB',
      currentValue: current,
      change24h: change,
      explanation: 'The US Dollar Index (DXY) measures the value of the United States dollar relative to a basket of foreign currencies, often referred to as a basket of US trade partners\' currencies.',
      marketMeaning: 'A rising DXY indicates a strengthening US Dollar. This generally means tighter global liquidity and higher borrowing costs internationally.',
      cryptoImpact: 'Bearish',
      historicalContext: 'Historically, Bitcoin trades as an inverse-dollar asset. High DXY usually correlates with local bottoms in crypto markets.',
      provider: 'Yahoo Finance API (Live)',
      chartData: history,
      lastUpdated: timestamp
    };
  }

  if (indicatorId === 'us10y') {
    const { current, change, history } = await fetchYahooFinanceData('^TNX');
    return {
      id: 'us10y',
      name: 'US 10Y Bond Yield',
      symbol: '^TNX',
      currentValue: current,
      change24h: change,
      explanation: 'The 10-year Treasury yield is the annualized return an investor earns by holding a US government 10-year bond until maturity.',
      marketMeaning: 'It serves as a benchmark for borrowing costs globally. Rising yields indicate expectations of higher inflation or stronger economic growth, forcing the Fed to keep rates high.',
      cryptoImpact: 'Bearish',
      historicalContext: 'Risk-on assets like Bitcoin face downward pressure when risk-free rates (like the 10Y) rise, as capital rotates into safer government debt.',
      provider: 'Yahoo Finance API (Live)',
      chartData: history,
      lastUpdated: timestamp
    };
  }

  // Add more dynamic fetching logic here for other indicators...
  // For UI testing, return dynamic algorithmic data if API is unmapped
  
  const baseValue = indicatorId === 'btc-corr' ? -0.82 : indicatorId === 'recession' ? 65 : 5.50;
  
  return {
    id: indicatorId,
    name: indicatorId.toUpperCase() + ' Metric',
    symbol: 'CUSTOM',
    currentValue: baseValue,
    change24h: 0.12,
    explanation: 'Detailed quantitative breakdown of this macroeconomic indicator and its underlying mechanics.',
    marketMeaning: 'This indicator acts as a leading oscillator for global market risk-appetite.',
    cryptoImpact: 'Neutral',
    historicalContext: 'In previous cycles, this metric crossing key thresholds has triggered massive capital rotations.',
    provider: 'Algorithmic Synthesis',
    chartData: [
      { date: 'Mon', value: baseValue * 0.98 },
      { date: 'Tue', value: baseValue * 0.99 },
      { date: 'Wed', value: baseValue * 1.01 },
      { date: 'Thu', value: baseValue * 1.05 },
      { date: 'Fri', value: baseValue * 0.95 },
    ],
    lastUpdated: timestamp
  };
};
