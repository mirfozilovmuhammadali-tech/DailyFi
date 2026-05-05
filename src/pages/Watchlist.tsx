import React from 'react';

const Watchlist: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading font-bold text-white">Watchlist</h1>
      <div className="glass-card p-8 min-h-[400px] flex items-center justify-center">
        <p className="text-gray-400 font-mono">No assets currently tracked</p>
      </div>
    </div>
  );
};

export default Watchlist;
