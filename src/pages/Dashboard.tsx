import { useState } from 'react';
import { 
  Briefcase, Bitcoin, Coins, ArrowRightLeft, 
  Flame, Sparkles, PieChart, BarChart2, BarChart, 
  Activity, TrendingUp 
} from 'lucide-react';
import FearAndGreedModal from '../components/FearAndGreedModal';
import SpotMarketModal from '../components/SpotMarketModal';
import BtcDominanceModal from '../components/BtcDominanceModal';
import AltcoinSeasonModal from '../components/AltcoinSeasonModal';
import ExchangeFlowsModal from '../components/ExchangeFlowsModal';
import StandardMetricModal from '../components/StandardMetricModal';
import EtfFlowsModal from '../components/EtfFlowsModal';
import TechnicalAnalysisModal from '../components/TechnicalAnalysisModal';
import FundingRatesModal from '../components/FundingRatesModal';

const Dashboard = () => {
  const [isFngOpen, setIsFngOpen] = useState(false);
  const [isSpotOpen, setIsSpotOpen] = useState(false);
  const [isBtcDomOpen, setIsBtcDomOpen] = useState(false);
  const [isAltSeasonOpen, setIsAltSeasonOpen] = useState(false);
  const [isExchangeFlowsOpen, setIsExchangeFlowsOpen] = useState(false);
  const [isFundingRatesOpen, setIsFundingRatesOpen] = useState(false);
  
  // Standard Modal State
  const [standardModalState, setStandardModalState] = useState({
    isOpen: false,
    title: '',
    value: '',
    change: '',
    description: '',
    colorTheme: 'cyan' as 'gold' | 'cyan' | 'green' | 'blue' | 'purple' | 'yellow'
  });

  // ETF Modal State
  const [etfModalState, setEtfModalState] = useState({
    isOpen: false,
    assetType: 'BTC' as 'BTC' | 'ETH'
  });

  // TA Modal State
  const [taModalState, setTaModalState] = useState({
    isOpen: false,
    metricType: 'RSI' as 'RSI' | 'MACD'
  });

  const categories = [
    {
      title: 'Markets',
      items: [
        { title: 'Spot Market', value: '$84B Vol', change: '+12.5%', icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
        { title: 'Bitcoin Treasuries', value: '2.1M BTC', change: 'Held', icon: Bitcoin, color: 'text-gold', bg: 'bg-gold/10' },
        { title: 'BNB Treasuries', value: '45M BNB', change: 'Held', icon: Coins, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { title: 'Exchange Flows', value: '-$1.2B', change: 'Outflow', icon: ArrowRightLeft, color: 'text-bullish glow-bullish', bg: 'bg-bullish/10' },
      ]
    },
    {
      title: 'Indicators',
      items: [
        { title: 'Fear & Greed Index', value: '74', change: 'Greed', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { title: 'Altcoin Season', value: '42', change: 'BTC Season', icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        { title: 'BTC Dominance', value: '54.2%', change: '+0.1%', icon: PieChart, color: 'text-gold', bg: 'bg-gold/10' },
        { title: 'CMC20 Index', value: '4,250', change: '+2.4%', icon: BarChart2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { title: 'CMC100 Index', value: '1,840', change: '+4.1%', icon: BarChart, color: 'text-purple-400', bg: 'bg-purple-400/10' },
      ]
    },
    {
      title: 'ETF Flows',
      items: [
        { title: 'Bitcoin ETFs', value: '+$145M', change: 'Net Flow', icon: Bitcoin, color: 'text-gold', bg: 'bg-gold/10' },
        { title: 'Ethereum ETFs', value: '+$45M', change: 'Net Flow', icon: Activity, color: 'text-[#627eea]', bg: 'bg-[#627eea]/10' },
      ]
    },
    {
      title: 'Technical Analysis',
      items: [
        { title: 'RSI (14)', value: '62.4', change: 'Bullish', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
        { title: 'MACD', value: 'Signal Cross', change: 'Buy', icon: TrendingUp, color: 'text-bullish glow-bullish', bg: 'bg-bullish/10' },
      ]
    },
    {
      title: 'Derivatives',
      items: [
        { title: 'Funding Rates', value: '+0.0100%', change: 'Bullish', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-500/10' },
      ]
    }
  ];

  const handleCardClick = (item: any) => {
    switch (item.title) {
      case 'Spot Market':
        setIsSpotOpen(true);
        break;
      case 'Fear & Greed Index':
        setIsFngOpen(true);
        break;
      case 'BTC Dominance':
        setIsBtcDomOpen(true);
        break;
      case 'Altcoin Season':
        setIsAltSeasonOpen(true);
        break;
      case 'Exchange Flows':
        setIsExchangeFlowsOpen(true);
        break;
      case 'Funding Rates':
        setIsFundingRatesOpen(true);
        break;
      case 'Bitcoin ETFs':
        setEtfModalState({ isOpen: true, assetType: 'BTC' });
        break;
      case 'Ethereum ETFs':
        setEtfModalState({ isOpen: true, assetType: 'ETH' });
        break;
      case 'RSI (14)':
        setTaModalState({ isOpen: true, metricType: 'RSI' });
        break;
      case 'MACD':
        setTaModalState({ isOpen: true, metricType: 'MACD' });
        break;
      // Standard Modals Fallback
      case 'Bitcoin Treasuries':
        setStandardModalState({
          isOpen: true, title: item.title, value: item.value, change: item.change,
          description: 'Public companies and private entities holding Bitcoin on their balance sheets.', colorTheme: 'yellow'
        });
        break;
      case 'BNB Treasuries':
        setStandardModalState({
          isOpen: true, title: item.title, value: item.value, change: item.change,
          description: 'Binance Coin held in exchange reserves and smart contracts.', colorTheme: 'yellow'
        });
        break;
      case 'CMC20 Index':
        setStandardModalState({
          isOpen: true, title: item.title, value: item.value, change: item.change,
          description: 'Index tracking the performance of the top 20 cryptocurrencies by market capitalization.', colorTheme: 'blue'
        });
        break;
      case 'CMC100 Index':
        setStandardModalState({
          isOpen: true, title: item.title, value: item.value, change: item.change,
          description: 'Broad market index tracking the performance of the top 100 cryptocurrencies.', colorTheme: 'purple'
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white tracking-tight">
            Markets & Analytics Dashboard
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Core markets, sentiment indicators, and asset flows at a glance.
          </p>
        </div>
      </div>

      <div className="space-y-12">
        {categories.map((category, idx) => (
          <section key={idx} className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
              <span className="w-1.5 h-6 bg-gold rounded-full"></span>
              {category.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.items.map((item, i) => {
                const Icon = item.icon;
                const isPositiveChange = item.change.includes('+') || item.change === 'Buy' || item.change === 'Greed';
                const isNegativeChange = item.change.includes('-') || item.change === 'Sell' || item.change === 'Fear';
                
                let changeBadgeClass = 'text-gray-400 bg-white/5 border border-white/10';
                if (isPositiveChange) {
                  changeBadgeClass = 'text-bullish glow-bullish bg-bullish/10 border border-bullish/20';
                } else if (isNegativeChange) {
                  changeBadgeClass = 'text-bearish glow-bearish bg-bearish/10 border border-bearish/20';
                }
                
                return (
                  <div 
                    key={i} 
                    onClick={() => handleCardClick(item)}
                    className="glass-card p-6 flex flex-col justify-between hover:bg-white/5 transition-all cursor-pointer group border border-white/5 hover:border-white/20 hover:shadow-[0_0_30px_rgba(255,255,255,0.03)] h-[160px]"
                  >
                    <div className="flex justify-between items-start w-full">
                      <div className={"w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 " + item.bg}>
                        <Icon className={"w-6 h-6 " + item.color} />
                      </div>
                      <span className={"text-xs font-bold px-2 py-1 rounded-md shadow-sm " + changeBadgeClass}>
                        {item.change}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex flex-col">
                      <h3 className="text-sm font-medium text-gray-400 mb-1 group-hover:text-gray-300 transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-2xl font-bold text-white font-mono drop-shadow-md">
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Specific Modals */}
      <FearAndGreedModal isOpen={isFngOpen} onClose={() => setIsFngOpen(false)} />
      <SpotMarketModal isOpen={isSpotOpen} onClose={() => setIsSpotOpen(false)} />
      <BtcDominanceModal isOpen={isBtcDomOpen} onClose={() => setIsBtcDomOpen(false)} />
      <AltcoinSeasonModal isOpen={isAltSeasonOpen} onClose={() => setIsAltSeasonOpen(false)} />
      <ExchangeFlowsModal isOpen={isExchangeFlowsOpen} onClose={() => setIsExchangeFlowsOpen(false)} />
      <FundingRatesModal isOpen={isFundingRatesOpen} onClose={() => setIsFundingRatesOpen(false)} />
      
      {/* Dynamic Unified Modals */}
      <StandardMetricModal 
        isOpen={standardModalState.isOpen} 
        onClose={() => setStandardModalState(prev => ({...prev, isOpen: false}))}
        title={standardModalState.title}
        value={standardModalState.value}
        change={standardModalState.change}
        description={standardModalState.description}
        colorTheme={standardModalState.colorTheme}
      />
      <EtfFlowsModal 
        isOpen={etfModalState.isOpen} 
        onClose={() => setEtfModalState(prev => ({...prev, isOpen: false}))}
        assetType={etfModalState.assetType}
      />
      <TechnicalAnalysisModal 
        isOpen={taModalState.isOpen} 
        onClose={() => setTaModalState(prev => ({...prev, isOpen: false}))}
        metricType={taModalState.metricType}
      />

    </div>
  );
};

export default Dashboard;

