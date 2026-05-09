import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import BackgroundGlobe from '../components/BackgroundGlobe';
import { MiniChartWidget, AdvancedChartWidget, MarketOverviewWidget } from '../components/TradingViewWidgets';

const MacroEconomics: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative min-h-screen">
      {/* 3D Holographic Globe Background */}
      <BackgroundGlobe />
      
      {/* Main Content Overlay */}
      <motion.div 
        className="relative z-10 space-y-8 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-white tracking-tight">Macro Economics</h1>
            <p className="text-gray-400 mt-2 text-lg">Official TradingView Data Feeds & Market Intelligence.</p>
          </div>
          <div className="flex items-center gap-3 glass-card-laser px-6 py-3">
            <Zap size={18} className="text-[#00ff9d] animate-pulse" />
            <span className="text-sm font-bold text-[#00ff9d] uppercase tracking-widest laser-badge">Live TVC Feed: Connected</span>
          </div>
        </motion.div>

        {/* Top Mini Charts Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card-laser p-4 h-[200px] overflow-hidden bg-black/20 backdrop-blur-md border border-white/10 hover:border-[#00ff9d]/50 transition-all duration-300">
            <MiniChartWidget symbol="TVC:DXY" />
          </div>
          <div className="glass-card-laser p-4 h-[200px] overflow-hidden bg-black/20 backdrop-blur-md border border-white/10 hover:border-[#00ff9d]/50 transition-all duration-300">
            <MiniChartWidget symbol="TVC:US10Y" />
          </div>
          <div className="glass-card-laser p-4 h-[200px] overflow-hidden bg-black/20 backdrop-blur-md border border-white/10 hover:border-[#00ff9d]/50 transition-all duration-300">
            <MiniChartWidget symbol="FRED:M2SL" />
          </div>
          <div className="glass-card-laser p-4 h-[200px] overflow-hidden bg-black/20 backdrop-blur-md border border-white/10 hover:border-[#00ff9d]/50 transition-all duration-300">
            <MiniChartWidget symbol="TVC:W5000" />
          </div>
        </motion.div>

        {/* Large Interactive Charts */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card-laser p-6 h-[500px] bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl">
            <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></span>
              DXY Dollar Index (Advanced)
            </h3>
            <div className="h-[calc(100%-4rem)] w-full rounded-xl overflow-hidden border border-white/5 shadow-2xl">
              <AdvancedChartWidget symbol="TVC:DXY" />
            </div>
          </div>
          <div className="glass-card-laser p-6 h-[500px] bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl">
            <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></span>
              US 10-Year Treasury Yield
            </h3>
            <div className="h-[calc(100%-4rem)] w-full rounded-xl overflow-hidden border border-white/5 shadow-2xl">
              <AdvancedChartWidget symbol="TVC:US10Y" />
            </div>
          </div>
        </motion.div>

        {/* Comprehensive Market Overview (Backup & Full Data) */}
        <motion.div variants={itemVariants} className="glass-card-laser p-6 h-[600px] bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></span>
              Global Macro Intelligence Overview
            </span>
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Live Multi-Asset Stream</span>
          </h3>
          <div className="h-[calc(100%-4rem)] w-full rounded-xl overflow-hidden border border-white/5 bg-black/40">
            <MarketOverviewWidget />
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default MacroEconomics;

