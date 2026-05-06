import React from 'react';
import AnimatedCounter from './AnimatedCounter';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface HeroSectionProps {
  totalBalance: number;
  portfolioChangePct: number;
  changeValue: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ totalBalance, portfolioChangePct, changeValue }) => {
  const isPositive = portfolioChangePct >= 0;

  return (
    <div className="glass-card p-8 md:p-10 relative overflow-hidden mb-8 group">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px] -mr-20 -mt-20 transition-all duration-700 group-hover:bg-gold/10"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan/5 rounded-full blur-[60px] -ml-10 -mb-10 transition-all duration-700 group-hover:bg-cyan/10"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-xs font-bold text-gold mb-2 tracking-wide uppercase">
            <div className="w-2 h-2 bg-gold rotate-45"></div>
            <span>DailyFi Premium</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white tracking-tight">
            My Crypto Portfolio
          </h1>
          <p className="text-gray-400 text-lg">Smart Investments for the Future</p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-gray-400 text-sm font-medium mb-1 uppercase tracking-wider">Total Balance</p>
          <div className="text-5xl md:text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight drop-shadow-sm">
            <AnimatedCounter value={totalBalance} prefix="$" decimals={2} />
          </div>
          
          <div className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-sm font-bold ${
            isPositive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <AnimatedCounter value={Math.abs(changeValue)} prefix={isPositive ? '+$' : '-$'} decimals={2} />
            <span className="opacity-80 ml-1">({isPositive ? '+' : ''}{portfolioChangePct.toFixed(2)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
