import React from 'react';
import { useMarketData, useGlobalData } from '../hooks/useMarketData';
import HeroSection from '../components/HeroSection';
import MarketOverview from '../components/MarketOverview';
import BtcDominanceChart from '../components/BtcDominanceChart';

const Overview: React.FC = () => {
  const { data: marketData, isLoading: isMarketLoading } = useMarketData();
  const { data: globalData, isLoading: isGlobalLoading } = useGlobalData();

  // Extract BTC dominance from global data
  const btcDominance = globalData?.data?.market_cap_percentage?.btc;
  
  // Calculate dynamic mock portfolio balance based on REAL live prices
  // Portfolio assumption: 1.5 BTC, 15 ETH, 250 SOL
  let totalBalance = 0;
  let previousTotalBalance = 0; // 24h ago
  
  if (marketData) {
    const holdings = [
      { id: 'bitcoin', amount: 1.5 },
      { id: 'ethereum', amount: 15.0 },
      { id: 'solana', amount: 250.0 }
    ];

    holdings.forEach(h => {
      const coin = marketData[h.id];
      if (coin) {
        const currentPrice = coin.usd;
        const changePct = coin.usd_24h_change;
        // Calculate price 24h ago
        const previousPrice = currentPrice / (1 + (changePct / 100));
        
        totalBalance += (currentPrice * h.amount);
        previousTotalBalance += (previousPrice * h.amount);
      }
    });
  }

  // Fallback if no data yet
  if (totalBalance === 0) totalBalance = 124560.50;
  
  // Calculate aggregate 24h portfolio change % and absolute value
  const changeValue = previousTotalBalance > 0 ? (totalBalance - previousTotalBalance) : 0;
  const portfolioChangePct = previousTotalBalance > 0 ? ((totalBalance - previousTotalBalance) / previousTotalBalance) * 100 : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <HeroSection 
        totalBalance={totalBalance} 
        portfolioChangePct={portfolioChangePct} 
        changeValue={changeValue} 
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MarketOverview marketData={marketData} isLoading={isMarketLoading} />
        </div>
        <div className="lg:col-span-1">
          <BtcDominanceChart currentDominance={btcDominance} isLoading={isGlobalLoading} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
