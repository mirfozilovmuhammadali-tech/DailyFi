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

// Real Dynamic News Service
export interface NewsVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  channel: string;
  url: string;
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

// Cache for YouTube videos to avoid hitting rate limits
let cachedVideos: NewsVideo[] = [];

const fetchRealVideos = async (): Promise<NewsVideo[]> => {
  if (cachedVideos.length > 0) return cachedVideos;
  
  try {
    // Fetch real recent videos from CoinBureau via rss2json
    const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCqK_GSMbpiV8spgD3ZGloSw');
    const data = await response.json();
    
    if (data.items) {
      cachedVideos = data.items.map((item: any) => ({
        id: item.guid.replace('yt:video:', ''),
        title: item.title,
        thumbnail: item.thumbnail,
        duration: '12:45', // RSS doesn't provide exact duration easily
        views: 'Live',
        channel: item.author,
        url: item.link
      }));
    }
    return cachedVideos;
  } catch (err) {
    console.error("Failed to fetch YouTube videos", err);
    return [];
  }
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
    // Fetch News and Videos in parallel
    const [newsResponse, videos] = await Promise.all([
      fetch(url),
      fetchRealVideos()
    ]);
    
    const json = await newsResponse.json();
    if (!json.Data) return [];

    const realNews: NewsItem[] = json.Data.map((article: any) => {
      const publishedDate = new Date(article.PUBLISHED_ON * 1000);
      const minutesAgo = Math.floor((Date.now() - publishedDate.getTime()) / 60000);
      let timeStr = `${minutesAgo}m ago`;
      if (minutesAgo > 60) {
        timeStr = `${Math.floor(minutesAgo / 60)}h ago`;
      }
      if (minutesAgo > 1440) {
        timeStr = `${Math.floor(minutesAgo / 1440)}d ago`;
      }

      let impact: 'High' | 'Medium' | 'Low' = 'Medium';
      if (article.SENTIMENT === 'POSITIVE' || article.SENTIMENT === 'NEGATIVE') {
        impact = 'High';
      }

      // Title-based search simulation using the real fetched videos
      // Shuffle videos and pick 2-4 randomly to simulate related results
      const shuffledVideos = [...videos].sort(() => 0.5 - Math.random());
      const selectedVideos = shuffledVideos.slice(0, Math.floor(Math.random() * 3) + 2);

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
        videos: selectedVideos
      };
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Allow endless scrolling
    return realNews.slice(startIndex, endIndex).length > 0 
      ? realNews.slice(startIndex, endIndex)
      : realNews.slice(0, limit); 
  } catch (error) {
    console.error("Failed to fetch real news:", error);
    return [];
  }
};
