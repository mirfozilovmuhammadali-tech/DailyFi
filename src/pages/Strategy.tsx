
import { Target } from 'lucide-react';

const Strategy = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-heading font-bold text-white tracking-tight">
            Strategy
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Advanced trading strategies and algorithmic signals. (Coming Soon)
          </p>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="glass-card p-12 flex flex-col items-center justify-center border border-dashed border-white/10 opacity-70">
        <Target className="w-16 h-16 text-gold mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Strategy Lab</h2>
        <p className="text-gray-400 text-center max-w-md">
          This section is currently being completely rebuilt. We are preparing new automated trading strategies, backtesting models, and signaling logic.
        </p>
      </div>
    </div>
  );
};

export default Strategy;
