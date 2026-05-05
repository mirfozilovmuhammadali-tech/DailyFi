import React, { useState } from 'react';
import AnimatedCounter from './AnimatedCounter';
import AssetDetailModal from './AssetDetailModal';

interface MarketOverviewProps {
  marketData: Record<string, any>;
  isLoading: boolean;
}

const COIN_MAP: Record<string, { name: string; symbol: string; logo: string; color: string }> = {
  'bitcoin': { name: 'Bitcoin', symbol: 'BTC', logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', color: 'border-l-[#f7931a]' },
  'ethereum': { name: 'Ethereum', symbol: 'ETH', logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', color: 'border-l-[#627eea]' },
  'solana': { name: 'Solana', symbol: 'SOL', logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', color: 'border-l-[#14f195]' },
  'chainlink': { name: 'Chainlink', symbol: 'LINK', logo: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png', color: 'border-l-[#2a5ada]' },
  'avalanche-2': { name: 'Avalanche', symbol: 'AVAX', logo: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png', color: 'border-l-[#e84142]' },
  'fetch-ai': { name: 'Fetch.ai', symbol: 'FET', logo: 'https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg', color: 'border-l-[#1e222d]' },
};

const MarketOverview: React.FC<MarketOverviewProps> = ({ marketData, isLoading }) => {
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  if (isLoading || !marketData) {
    return (
      <div className="glass-card p-6 animate-pulse">
        <h3 className="text-xl font-heading font-bold text-white mb-6">Market Overview</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-white/5 rounded-xl w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  const sortedCoins = Object.entries(marketData).sort((a, b) => b[1].usd_market_cap - a[1].usd_market_cap);

  return (
    <div className="glass-card p-6 border-t-2 border-t-cyan">
      <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan animate-pulse shadow-[0_0_8px_#00f5ff]"></div>
        Live Market Overview
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-sm font-medium uppercase tracking-wider">
              <th className="pb-3 pl-4">Asset</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">24h Change</th>
              <th className="pb-3 text-right pr-4">Market Cap</th>
            </tr>
          </thead>
          <tbody>
            {sortedCoins.map(([id, data]) => {
              const meta = COIN_MAP[id];
              if (!meta) return null;
              
              const isPositive = data.usd_24h_change >= 0;
              
              return (
                <tr 
                  key={id} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                  onClick={() => setSelectedAsset({ ...data, id, name: meta.name, symbol: meta.symbol, logo: meta.logo })}
                >
                  <td className="py-4 pl-4 flex items-center gap-3">
                    <div className={`border-l-2 ${meta.color} pl-3 flex items-center gap-3`}>
                      <img src={meta.logo} alt={meta.name} className="w-8 h-8 rounded-full shadow-lg" />
                      <div>
                        <div className="font-bold text-white text-base">{meta.name}</div>
                        <div className="text-xs text-gray-500 font-medium">{meta.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-mono font-medium text-gray-200">
                    <AnimatedCounter value={data.usd} prefix="$" decimals={id === 'fetch-ai' ? 3 : 2} />
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-bold ${
                      isPositive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                    }`}>
                      {isPositive ? '+' : ''}{data.usd_24h_change?.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-4 text-right pr-4 font-mono text-gray-400">
                    <AnimatedCounter value={data.usd_market_cap} prefix="$" decimals={0} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal Overlay */}
      <AssetDetailModal 
        isOpen={!!selectedAsset} 
        onClose={() => setSelectedAsset(null)} 
        asset={selectedAsset} 
      />
    </div>
  );
};

export default MarketOverview;
