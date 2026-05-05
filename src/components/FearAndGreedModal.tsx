import React, { useEffect, useState } from 'react';
import { X, Info, CalendarDays, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface FearAndGreedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FearAndGreedModal: React.FC<FearAndGreedModalProps> = ({ isOpen, onClose }) => {
  const [animationClass, setAnimationClass] = useState('opacity-0 scale-95');

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setAnimationClass('opacity-100 scale-100'), 10);
    } else {
      setAnimationClass('opacity-0 scale-95');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentValue = 40;
  const currentStatus = "Neutral";
  
  // Gauge Data
  const gaugeData = [
    { name: 'Extreme Fear', value: 25, color: '#ef4444' },
    { name: 'Fear', value: 25, color: '#f97316' },
    { name: 'Neutral', value: 25, color: '#eab308' },
    { name: 'Greed', value: 25, color: '#84cc16' },
  ];

  // Mock Historical Chart Data
  const historicalData = [
    { date: 'Apr 24', value: 74 },
    { date: 'Apr 25', value: 68 },
    { date: 'Apr 26', value: 62 },
    { date: 'Apr 27', value: 55 },
    { date: 'Apr 28', value: 48 },
    { date: 'Apr 29', value: 42 },
    { date: 'Apr 30', value: 40 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className={`relative w-full max-w-5xl bg-dark-bg/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(250,204,21,0.05)] overflow-hidden transition-all duration-300 transform ${animationClass} max-h-[90vh] flex flex-col`}>
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <span className="text-2xl">🧭</span>
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-white">Fear & Greed Index</h2>
              <p className="text-sm font-medium text-gray-400">Crypto Market Sentiment</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Gauge & Current Status */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden h-[300px]">
                <div className="absolute top-4 left-4 flex items-center gap-2 text-sm text-gray-400">
                  <CalendarDays size={16} /> Today
                </div>
                
                {/* Recharts Semi-Circle Gauge */}
                <div className="w-full h-[200px] mt-8 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={gaugeData}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {gaugeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Gauge Center Value */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-6xl font-heading font-black text-white">{currentValue}</span>
                    <span className="text-lg font-bold text-yellow-500 uppercase tracking-widest mt-1">{currentStatus}</span>
                  </div>
                </div>
              </div>

              {/* Historical Quick Stats */}
              <div className="glass-card p-6">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Historical Values</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-300">Yesterday</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">42</span>
                      <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded">Neutral</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-300">Last Week</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">65</span>
                      <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">Greed</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-white/5">
                    <span className="text-gray-300">Last Month</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">74</span>
                      <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded">Greed</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-300">1 Year Ago</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">35</span>
                      <span className="text-xs bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded">Fear</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Chart & Info */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* 7-Day Trend Chart */}
              <div className="glass-card p-6 h-[300px] flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-heading font-bold text-white">7-Day Trend</h3>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-orange-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                  </div>
                </div>
                <div className="flex-1 -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicalData}>
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 12 }} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                        contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#333', borderRadius: '8px' }} 
                      />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30}>
                        {historicalData.map((entry, index) => {
                          let color = '#ef4444'; // Extreme Fear
                          if (entry.value > 25) color = '#f97316'; // Fear
                          if (entry.value > 45) color = '#eab308'; // Neutral
                          if (entry.value > 55) color = '#84cc16'; // Greed
                          if (entry.value > 75) color = '#22c55e'; // Extreme Greed
                          return <Cell key={`cell-${index}`} fill={color} opacity={0.8} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Yearly High / Low & Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Yearly Stats */}
                <div className="glass-card p-6">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Yearly Extremes</h4>
                  <div className="flex items-center gap-6 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 text-green-400">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <span className="block text-gray-400 text-sm">Yearly High</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">88</span>
                        <span className="text-sm text-green-500 font-medium">(Extreme Greed)</span>
                      </div>
                      <span className="text-xs text-gray-500">Mar 14, 2024</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-white/5 my-4"></div>
                  
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400">
                      <TrendingDown size={24} />
                    </div>
                    <div>
                      <span className="block text-gray-400 text-sm">Yearly Low</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">34</span>
                        <span className="text-sm text-orange-500 font-medium">(Fear)</span>
                      </div>
                      <span className="text-xs text-gray-500">Sep 11, 2023</span>
                    </div>
                  </div>
                </div>

                {/* Description Text */}
                <div className="glass-card p-6 bg-gradient-to-br from-white/5 to-transparent">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Info size={16} /> About this index
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    The crypto market behavior is very emotional. People tend to get greedy when the market is rising which results in FOMO. Also, people often sell their coins in irrational reaction of seeing red numbers.
                  </p>
                  <ul className="text-sm space-y-2 text-gray-400">
                    <li className="flex items-start gap-2">
                      <ArrowRight size={14} className="text-gold mt-0.5 shrink-0" />
                      <span><strong>Extreme fear</strong> can be a sign that investors are too worried. That could be a buying opportunity.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight size={14} className="text-gold mt-0.5 shrink-0" />
                      <span>When Investors are getting too <strong>greedy</strong>, that means the market is due for a correction.</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FearAndGreedModal;
