import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, PieChart, LineChart, Target, Globe, Newspaper } from 'lucide-react';

const Layout: React.FC = () => {
  const navItems = [
    { name: 'Overview', path: '/', icon: <LayoutDashboard size={18} /> },
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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.4)]">
            <span className="text-black font-heading font-bold text-lg leading-none pt-0.5">V</span>
          </div>
          <span className="font-heading font-bold text-2xl tracking-widest text-white">VAULT<span className="text-gold">X</span></span>
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
