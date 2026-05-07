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
export interface NewsVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  channel: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  time: string;
  category: string;
  impact: 'High' | 'Medium' | 'Low';
  image: string;
  url: string;
  author?: string;
  trending?: boolean;
  videos?: NewsVideo[];
}

const FALLBACK_IMAGES = {
  'Bitcoin': 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800&h=450',
  'Ethereum': 'https://images.unsplash.com/photo-1621416848440-23690bd1eb53?auto=format&fit=crop&q=80&w=800&h=450',
  'Altcoins': 'https://images.unsplash.com/photo-1642104704074-907c0698bcd9?auto=format&fit=crop&q=80&w=800&h=450',
  'Regulation': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800&h=450',
  'AI+Crypto': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=450',
  'Global Markets': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800&h=450',
  'Macro Economics': 'https://images.unsplash.com/photo-1611974714158-f8a4d46c6022?auto=format&fit=crop&q=80&w=800&h=450',
  'ETFs': 'https://images.unsplash.com/photo-1526303323656-919d6eef7000?auto=format&fit=crop&q=80&w=800&h=450'
};

const CATEGORIES = ['Bitcoin', 'Ethereum', 'Altcoins', 'ETFs', 'Regulation', 'AI+Crypto', 'Macro Economics', 'Global Markets'];
const SOURCES = ['Bloomberg', 'CoinDesk', 'Reuters', 'The Block', 'CNBC', 'Financial Times', 'CoinTelegraph', 'Bitcoin Magazine', 'Decrypt', 'WSJ', 'CryptoSlate'];
const IMPACTS: ('High' | 'Medium' | 'Low')[] = ['High', 'Medium', 'Medium', 'Low'];

const VIDEO_THUMBNAILS = [
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400&h=225',
  'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80&w=400&h=225',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400&h=225',
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400&h=225',
  'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=400&h=225'
];

// Dynamically generate a large dataset so categories are never empty
const generateNews = (): NewsItem[] => {
  const news: NewsItem[] = [];
  let idCounter = 1;

  CATEGORIES.forEach(category => {
    // Generate 25 articles per category
    for (let i = 0; i < 25; i++) {
      const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
      const impact = IMPACTS[Math.floor(Math.random() * IMPACTS.length)];
      const isTrending = Math.random() > 0.8;
      
      // Generate 2-4 videos for the article
      const numVideos = Math.floor(Math.random() * 3) + 2;
      const videos: NewsVideo[] = [];
      for (let v = 0; v < numVideos; v++) {
        videos.push({
          id: `vid-${idCounter}-${v}`,
          title: `${category} Market Analysis & Breakdown ${v + 1}`,
          thumbnail: VIDEO_THUMBNAILS[Math.floor(Math.random() * VIDEO_THUMBNAILS.length)],
          duration: `${Math.floor(Math.random() * 15) + 5}:${Math.floor(Math.random() * 50) + 10}`,
          views: `${(Math.random() * 500).toFixed(1)}K views`,
          channel: `${source} TV`
        });
      }

      news.push({
        id: `news-${idCounter++}`,
        title: `Major ${category} Update: Analysts from ${source} Break Down the Latest Market Trends and Price Action`,
        summary: `The latest developments in the ${category} sector suggest significant institutional movement. As markets react, ${source} provides comprehensive coverage on what this means for retail and institutional investors alike.`,
        content: `The ${category} ecosystem has experienced unprecedented activity over the past 48 hours. Institutional interest, previously sidelined by regulatory uncertainty, appears to be returning with renewed vigor.\n\nAccording to lead analysts at ${source}, the key drivers include shifting macroeconomic indicators and significant on-chain capital flows. "We are seeing a divergence between retail sentiment and institutional accumulation," noted one senior strategist.\n\nFurthermore, the impact of these developments extends beyond short-term price action. Infrastructure providers and layer-2 solutions are preparing for sustained elevated volume. The market's reaction in the coming weeks will likely dictate the trend for the remainder of the quarter. Investors are advised to closely monitor support levels and regulatory announcements.`,
        source: source,
        time: `${Math.floor(Math.random() * 59)}m ago`,
        category: category,
        impact: impact,
        image: FALLBACK_IMAGES[category as keyof typeof FALLBACK_IMAGES],
        url: 'https://example.com/news',
        author: `Analyst Team @ ${source}`,
        trending: isTrending,
        videos: videos
      });
    }
  });
  
  // Shuffle the array to mix categories for the "All" view
  return news.sort(() => Math.random() - 0.5);
};

const MOCK_NEWS = generateNews();

export const fetchNews = async (category: string = 'All', page: number = 1, limit: number = 12): Promise<NewsItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  let filtered = category === 'All' ? MOCK_NEWS : MOCK_NEWS.filter(item => item.category === category);
  
  // Dynamic time generation to make feed feel live
  const now = new Date();
  filtered = filtered.map((item, index) => {
    const minutesAgo = Math.floor(Math.random() * 59) + (page - 1) * 60;
    // We don't overwrite ID here to prevent duplicates in React state rendering, 
    // instead we ensure we have enough data (25 per category is enough for normal scrolling)
    return { ...item, time: `${minutesAgo}m ago` };
  });

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return filtered.slice(startIndex, endIndex);
};
