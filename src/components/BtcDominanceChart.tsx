import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BtcDominanceChartProps {
  currentDominance?: number;
  isLoading: boolean;
}

const BtcDominanceChart: React.FC<BtcDominanceChartProps> = ({ currentDominance, isLoading }) => {
  // Generate mock historical data and append the live current dominance at the end
  const chartData = useMemo(() => {
    let data = [];
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 29); // 30 days
    
    // Base trend
    for (let i = 0; i < 29; i++) {
      let trend = 59.5 + Math.sin(i * 0.2) * 1.5 + (Math.random() - 0.5) * 0.5;
      
      const month = currentDate.toLocaleString('default', { month: 'short' });
      const day = currentDate.getDate();
      
      data.push({
        date: `${month} ${day}`,
        dominance: Number(trend.toFixed(2)),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Add real live data point for today if available
    if (currentDominance) {
      data.push({
        date: 'Today',
        dominance: Number(currentDominance.toFixed(2)),
      });
    }

    return data;
  }, [currentDominance]);

  if (isLoading) {
    return (
      <div className="glass-card p-6 min-h-[350px] animate-pulse flex flex-col">
        <div className="h-6 w-48 bg-white/5 rounded mb-2"></div>
        <div className="h-10 w-24 bg-white/5 rounded mb-6"></div>
        <div className="flex-1 bg-white/5 rounded-xl w-full"></div>
      </div>
    );
  }

  const currentVal = currentDominance || chartData[chartData.length - 1].dominance;

  return (
    <div className="glass-card p-6 border-t-2 border-t-gold relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-[50px] transition-all duration-700 group-hover:bg-gold/10"></div>
      
      <div className="relative z-10 mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-heading font-medium text-gray-400">BTC Dominance</h3>
          <div className="text-3xl font-mono font-bold text-white mt-1">
            {currentVal.toFixed(2)}<span className="text-gold text-xl">%</span>
          </div>
        </div>
        <div className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-xs font-bold text-gold">
          LIVE
        </div>
      </div>

      <div className="h-[220px] w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorDom" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffd700" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ffd700" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#666', fontSize: 12 }}
              minTickGap={30}
            />
            <YAxis 
              domain={['dataMin - 0.5', 'dataMax + 0.5']} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#666', fontSize: 12 }}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', borderColor: 'rgba(255,215,0,0.2)', borderRadius: '8px' }}
              itemStyle={{ color: '#ffd700', fontWeight: 'bold' }}
              labelStyle={{ color: '#888' }}
              formatter={(value: any) => [`${value}%`, 'Dominance']}
            />
            <Area 
              type="monotone" 
              dataKey="dominance" 
              stroke="#ffd700" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorDom)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BtcDominanceChart;
