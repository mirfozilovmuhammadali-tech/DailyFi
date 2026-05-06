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
    category: 'AI+Crypto',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://cnbc.com',
    trending: false
  },
  {
    id: '6',
    title: 'Fed Minutes Suggest Rates May Stay Higher for Longer',
    summary: 'Macro-economic indicators point towards a cautious approach by the Federal Reserve, impacting risk assets globally.',
    content: 'The latest minutes from the FOMC meeting reveal a persistent concern over inflation targets. While the labor market remains strong, several members expressed that the current interest rate trajectory might need to be sustained longer than previously anticipated. This has led to a slight pullback in equity markets and a temporary cooling of the recent crypto rally as traders price in "higher for longer" scenarios.',
    source: 'The Financial Times',
    time: '5h ago',
    category: 'Macro Economics',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1611974714158-f8a4d46c6022?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://ft.com',
    trending: false
  },
  {
    id: '7',
    title: 'Chainlink Cross-Chain Interoperability Protocol (CCIP) Expands',
    summary: 'Major financial institutions begin testing Chainlink\'s CCIP for tokenized asset transfers between private and public chains.',
    content: 'Chainlink\'s CCIP is becoming the industry standard for cross-chain communication. Several European banks have successfully completed pilot programs using the protocol to move tokenized bonds between private testnets and Ethereum. The integration aims to bridge the gap between legacy finance and the burgeoning world of decentralized finance, providing a secure and scalable way to manage digital assets at scale.',
    source: 'CoinTelegraph',
    time: '6h ago',
    category: 'Altcoins',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1642104704074-907c0698bcd9?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://cointelegraph.com',
    trending: false
  },
  {
    id: '8',
    title: 'Bitcoin Hashrate Reaches All-Time High Despite Halving Concerns',
    summary: 'The security of the Bitcoin network has never been stronger as miners deploy new generation hardware to maintain profitability.',
    content: 'Bitcoin\'s network hashrate has surged past 650 EH/s, marking a new historic peak. This growth comes despite fears that the recent halving would force older mining rigs offline. It seems that major mining operations have successfully upgraded their infrastructure, focusing on energy efficiency and low-cost power sources. This increase in compute power further solidifies Bitcoin\'s position as the most secure decentralized network in the world.',
    source: 'Bitcoin Magazine',
    time: '8h ago',
    category: 'Bitcoin',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://bitcoinmagazine.com',
    trending: false
  },
  {
    id: '9',
    title: 'European Union Finalizes MiCA Compliance Guidelines',
    summary: 'Regulators in the EU release detailed documentation for crypto asset service providers (CASPs) to ensure full compliance by 2026.',
    content: 'The Markets in Crypto-Assets (MiCA) regulation is entering its final implementation phase. The new guidelines provide clarity on stablecoin issuance, custody requirements, and market abuse prevention. While the compliance burden is significant, industry leaders in Europe welcome the legal certainty, which they believe will attract more traditional investment firms to the digital asset space.',
    source: 'Decrypt',
    time: '10h ago',
    category: 'Regulation',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://decrypt.co',
    trending: false
  },
  {
    id: '10',
    title: 'Global Markets Rebound as Inflation Data Beats Expectations',
    summary: 'Equity markets and risk assets see a coordinated relief rally following the latest CPI print from major economies.',
    content: 'Stock indices in New York, London, and Tokyo all closed higher today as global inflation figures came in lower than analysts expected. This "goldilocks" scenario—cooling inflation without a major economic slowdown—has reinvigorated investor confidence. Crypto assets, often sensitive to macro-economic shifts, followed suit with Bitcoin and Ethereum gaining 3-4% in the aftermath of the data release.',
    source: 'The Wall Street Journal',
    time: '12h ago',
    category: 'Global Markets',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://wsj.com',
    trending: false
  },
  {
    id: '11',
    title: 'Vitalik Buterin Proposes "The Verge" Updates for Ethereum',
    summary: 'New roadmap details for Ethereum aim to make the network "stateless," allowing for even faster and more secure verification.',
    content: 'In a new blog post, Ethereum co-founder Vitalik Buterin outlined the technical milestones for "The Verge." The primary goal is to lower the barrier for running a node by implementing Verkle trees. This would allow users to verify the network on their mobile devices or light clients without needing a massive amount of storage. This step is seen as crucial for long-term decentralization and resilience.',
    source: 'The Block',
    time: '14h ago',
    category: 'Ethereum',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1621416848440-23690bd1eb53?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://theblock.co',
    trending: false
  },
  {
    id: '12',
    title: 'Fetch.ai and Ocean Protocol Merge to Form ASI Alliance',
    summary: 'A new era of decentralized AI begins as three major protocols finalize their token merger to compete with Big Tech.',
    content: 'The Artificial Superintelligence (ASI) Alliance is now official. Fetch.ai, Ocean Protocol, and SingularityNET have successfully merged their tokens into the new ASI ticker. The alliance aims to create a decentralized AI alternative to centralized giants like OpenAI and Google. By pooling their resources and compute power, the group believes they can accelerate the development of ethical and open AI systems.',
    source: 'CoinDesk',
    time: '16h ago',
    category: 'AI+Crypto',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://coindesk.com',
    trending: true
  },
  {
    id: '13',
    title: 'Bybit Gains Regulatory License in Kazakhstan',
    summary: 'The major crypto exchange continues its global expansion with a new full authorization from Kazakh financial regulators.',
    content: 'Bybit has announced it received a full license from the Astana Financial Services Authority (AFSA). This allows the exchange to offer a wide range of digital asset services to institutional and retail clients in the region. Kazakhstan is increasingly becoming a hub for digital asset mining and trading in Central Asia, thanks to its strategic location and evolving regulatory framework.',
    source: 'Bloomberg',
    time: '18h ago',
    category: 'Regulation',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://bloomberg.com',
    trending: false
  },
  {
    id: '14',
    title: 'MicroStrategy Bitcoin Portfolio Surpasses $15B in Value',
    summary: 'Michael Saylor\'s bet on Bitcoin continues to pay off as the firm\'s treasury holdings hit a major milestone.',
    content: 'MicroStrategy (MSTR) has seen its Bitcoin holdings reach a staggering value of $15 billion. The company, which has been aggressively buying Bitcoin since 2020, now holds over 220,000 BTC. This strategy has made MSTR a proxy for Bitcoin exposure for many institutional investors who cannot yet hold the digital asset directly. Saylor remains one of the most vocal advocates for Bitcoin as a "digital property" and long-term store of value.',
    source: 'CNBC',
    time: '20h ago',
    category: 'Bitcoin',
    impact: 'Medium',
    image: 'https://images.unsplash.com/photo-1621416848440-23690bd1eb53?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://cnbc.com',
    trending: false
  },
  {
    id: '15',
    title: 'Goldman Sachs Reveals $418M in Bitcoin ETF Holdings',
    summary: 'A new 13F filing shows the banking giant has significant exposure to multiple spot Bitcoin ETF products.',
    content: 'In its latest regulatory filing, Goldman Sachs disclosed holding over $400 million in various spot Bitcoin ETFs, including BlackRock\'s IBIT and Fidelity\'s FBTC. This disclosure highlights the growing institutional acceptance of Bitcoin as a legitimate asset class. Other major banks are expected to follow suit as client demand for digital asset exposure continues to rise.',
    source: 'Reuters',
    time: '22h ago',
    category: 'ETF',
    impact: 'High',
    image: 'https://images.unsplash.com/photo-1526303323656-919d6eef7000?auto=format&fit=crop&q=80&w=800&h=450',
    url: 'https://reuters.com',
    trending: true
  }
];

export const fetchNews = async (category: string = 'All'): Promise<NewsItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (category === 'All') return MOCK_NEWS;
  return MOCK_NEWS.filter(item => item.category === category);
};
