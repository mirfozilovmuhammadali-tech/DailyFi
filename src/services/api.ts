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

const VIDEO_THUMBNAILS = [
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400&h=225',
  'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&q=80&w=400&h=225',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400&h=225',
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=400&h=225',
  'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=400&h=225'
];

const generateVideosForCategory = (category: string, idPrefix: string): NewsVideo[] => {
  const numVideos = Math.floor(Math.random() * 3) + 2; // 2 to 4 videos
  const videos: NewsVideo[] = [];
  const displayCategory = category === 'All' ? 'Crypto' : category;
  
  for (let v = 0; v < numVideos; v++) {
    videos.push({
      id: `vid-${idPrefix}-${v}`,
      title: `${displayCategory} Deep Dive Analysis & Market Prediction`,
      thumbnail: VIDEO_THUMBNAILS[Math.floor(Math.random() * VIDEO_THUMBNAILS.length)],
      duration: `${Math.floor(Math.random() * 15) + 5}:${Math.floor(Math.random() * 50) + 10}`,
      views: `${(Math.random() * 500).toFixed(1)}K views`,
      channel: `DailyFi TV`
    });
  }
  return videos;
};

export const fetchNews = async (category: string = 'All', page: number = 1, limit: number = 15): Promise<NewsItem[]> => {
  const categoryMap: Record<string, string> = {
    'Bitcoin': 'BTC',
    'Ethereum': 'ETH',
    'Altcoins': 'ALTCOIN',
    'Regulation': 'REGULATION',
    'ETFs': 'ETF',
    'AI+Crypto': 'AI',
    'Global Markets': 'MARKET',
    'Macro Economics': 'MACRO'
  };

  let url = 'https://data-api.cryptocompare.com/news/v1/article/list?lang=EN';
  if (category !== 'All' && categoryMap[category]) {
    url += `&categories=${categoryMap[category]}`;
  }

  try {
    const response = await fetch(url);
    const json = await response.json();
    
    if (!json.Data) return [];

    const realNews: NewsItem[] = json.Data.map((article: any) => {
      // Calculate real time ago
      const publishedDate = new Date(article.PUBLISHED_ON * 1000);
      const minutesAgo = Math.floor((Date.now() - publishedDate.getTime()) / 60000);
      let timeStr = `${minutesAgo}m ago`;
      if (minutesAgo > 60) {
        timeStr = `${Math.floor(minutesAgo / 60)}h ago`;
      }
      if (minutesAgo > 1440) {
        timeStr = `${Math.floor(minutesAgo / 1440)}d ago`;
      }

      // Map Sentiment to Impact
      let impact: 'High' | 'Medium' | 'Low' = 'Medium';
      if (article.SENTIMENT === 'POSITIVE' || article.SENTIMENT === 'NEGATIVE') {
        impact = 'High';
      }

      return {
        id: article.ID.toString(),
        title: article.TITLE,
        summary: article.BODY.length > 200 ? article.BODY.substring(0, 200) + '...' : article.BODY,
        content: article.BODY,
        source: article.SOURCE_DATA.NAME,
        time: timeStr,
        category: category !== 'All' ? category : (article.KEYWORDS.split('|')[0] || 'Market'),
        impact: impact,
        image: article.IMAGE_URL,
        url: article.URL,
        author: article.AUTHORS || `${article.SOURCE_DATA.NAME} Desk`,
        trending: article.UPVOTES > 5 || article.SENTIMENT === 'POSITIVE',
        videos: generateVideosForCategory(category, article.ID.toString())
      };
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Allow endless scrolling by looping the fetched 50 items
    return realNews.slice(startIndex, endIndex).length > 0 
      ? realNews.slice(startIndex, endIndex)
      : realNews.slice(0, limit); 
  } catch (error) {
    console.error("Failed to fetch real news:", error);
    return [];
  }
};
