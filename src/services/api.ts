import axios from 'axios';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

// Configure axios instance with reasonable timeouts and headers
export const api = axios.create({
  baseURL: COINGECKO_BASE_URL,
  timeout: 10000,
});

export const getMarketData = async () => {
  const ids = 'bitcoin,ethereum,solana,chainlink,avalanche-2,fetch-ai';
  const response = await api.get(`/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`);
  return response.data;
};

export const getGlobalData = async () => {
  const response = await api.get('/global');
  return response.data;
};

// Expanded News Service
export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  sourceLogo?: string;
  time: string;
  category: string;
  impact: 'High' | 'Medium' | 'Low';
  image: string;
  url: string;
  author?: string;
  trending?: boolean;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Bitcoin ETF Net Inflows Hit $450M as BlackRock Leads Surge',
    summary: 'Institutional demand for spot Bitcoin ETFs remains robust despite recent price volatility, with BlackRock\'s IBIT leading the pack in daily volume.',
    content: 'The spot Bitcoin ETF market in the United States continues to show significant strength. BlackRock\'s iShares Bitcoin Trust (IBIT) recorded over $300 million in net inflows yesterday alone. Analysts suggest that the "supply shock" is becoming a reality as more wealth management firms begin offering these products to their clients. Regulatory clarity in the US has also paved the way for broader institutional adoption, with several major banks exploring direct custody solutions.',
    source: 'Bloomberg',
    time: '15m ago',
    category: 'ETF',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://bloomberg.com',
    author: 'Eric Balchunas',
    trending: true
  },
  {
    id: '2',
    title: 'Ethereum Pectra Hard Fork Target Date Set for Early 2026',
    summary: 'Ethereum core developers have reached a consensus on the scope and timeline for the upcoming Pectra upgrade, focusing on EIP-7702.',
    content: 'The Pectra upgrade is shaping up to be one of the most ambitious improvements to the Ethereum network since the Merge. Key features include EIP-7702, which introduces account abstraction capabilities to EOA wallets. This will allow for much better UX, including gas sponsorship and transaction batching. Developers have set a tentative mainnet target for late Q1 2026, pending successful testnet deployments in the coming months.',
    source: 'CoinDesk',
    time: '42m ago',
    category: 'Ethereum',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1621416848440-23690bd1eb53?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://coindesk.com',
    author: 'Margaux Nijkerk',
    trending: true
  },
  {
    id: '3',
    title: 'SEC Commissioner Peirce Critiques "Regulation by Enforcement"',
    summary: 'In a fresh speech, Hester Peirce argues that the current regulatory approach is stifling innovation in the digital asset space.',
    content: 'SEC Commissioner Hester Peirce, often referred to as "Crypto Mom," has once again voiced her disagreement with the agency\'s current strategy. She emphasized that the lack of clear rules of the road forces legitimate projects to operate in a gray area. Peirce called for a "Safe Harbor" framework that would allow decentralization-focused projects a grace period to achieve true network autonomy before falling under full securities oversight.',
    source: 'Reuters',
    time: '1h ago',
    category: 'Regulation',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1526303323656-919d6eef7000?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://reuters.com',
    trending: false
  },
  {
    id: '4',
    title: 'Solana TVL Hits New Yearly High as DEX Volume Explodes',
    summary: 'On-chain activity on Solana is reaching fever pitch as several ecosystem protocols announce significant incentive programs.',
    content: 'Solana\'s Total Value Locked (TVL) has surpassed $5 billion for the first time in nearly two years. The surge is largely driven by a massive increase in decentralized exchange (DEX) volume, which briefly flipped Ethereum\'s daily volume earlier this week. Projects like Jupiter and Kamino have seen record user engagement, while the memecoin frenzy continues to bring in fresh retail liquidity to the network.',
    source: 'The Block',
    time: '2h ago',
    category: 'Altcoins',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://theblock.co',
    trending: true
  },
  {
    id: '5',
    title: 'NVIDIA CEO Predicts AI-Crypto Convergence in Near Future',
    summary: 'Jensen Huang highlights the role of decentralized compute in training the next generation of large language models.',
    content: 'During a keynote address at a major technology summit, NVIDIA CEO Jensen Huang pointed to the potential of blockchain-based compute networks. He noted that as the demand for GPUs continues to outstrip supply, decentralized physical infrastructure networks (DePIN) could provide a much-needed alternative for startups and researchers. This validation from one of the world\'s most influential tech leaders has sent several AI-focused crypto tokens to new highs.',
    source: 'CNBC',
    time: '4h ago',
    category: 'AI',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://cnbc.com',
    trending: false
  }
];

export const fetchNews = async (category: string = 'All'): Promise<NewsItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (category === 'All') return MOCK_NEWS;
  return MOCK_NEWS.filter(item => item.category === category);
};
