import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Overview from './pages/Overview';
import Portfolio from './pages/Portfolio';
import Watchlist from './pages/Watchlist';
import Dashboard from './pages/Dashboard';
import Strategy from './pages/Strategy';
import MacroEconomics from './pages/MacroEconomics';
import News from './pages/News';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="strategy" element={<Strategy />} />
          <Route path="macro" element={<MacroEconomics />} />
          <Route path="news" element={<News />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
