import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, PieChart, LineChart, Target, Globe, Newspaper } from 'lucide-react';

const Layout: React.FC = () => {
  const navItems = [
    { name: 'Overview', path: '/overview', icon: <LayoutDashboard size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <Target size={18} /> },
    { name: 'Portfolio', path: '/portfolio', icon: <PieChart size={18} /> },
    { name: 'Watchlist', path: '/watchlist', icon: <LineChart size={18} /> },
    { name: 'Strategy', path: '/strategy', icon: <Target size={18} /> },
    { name: 'Macro Economics', path: '/macro', icon: <Globe size={18} /> },
    { name: 'News', path: '/news', icon: <Newspaper size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col font-sans">
      {/* Top Navigation */}
      <nav className="glass-nav sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Diamond Faceted Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold via-gold-dark to-gold-light rounded-lg rotate-45 shadow-[0_0_20px_rgba(234,179,8,0.3)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all duration-500"></div>
            {/* Monogram */}
            <span className="relative z-10 text-black font-heading font-black text-xl leading-none mt-0.5">D</span>
            {/* Subtle Cyan Micro-glow */}
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-cyan rounded-full blur-[2px] animate-pulse"></div>
          </div>
          <span className="font-heading font-bold text-2xl tracking-[0.2em] text-white">DAILY<span className="text-gold">FI</span></span>
        </div>

        <div className="hidden md:flex items-center gap-2 glass-card px-2 py-1.5 rounded-full">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-gold/10 text-gold shadow-[inset_0_0_10px_rgba(255,215,0,0.2)]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 rounded-full border border-dark-border text-sm font-medium hover:bg-white/5 transition-colors">
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
