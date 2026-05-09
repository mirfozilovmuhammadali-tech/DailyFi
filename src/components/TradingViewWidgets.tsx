import React, { useEffect, useRef } from 'react';

interface AdvancedChartWidgetProps {
  symbol?: string;
  theme?: 'dark' | 'light';
}

export const AdvancedChartWidget: React.FC<AdvancedChartWidgetProps> = ({ 
  symbol = 'FX:EURUSD', 
  theme = 'dark' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: theme,
      style: '1',
      locale: 'en',
      enable_publishing: false,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      gridColor: 'rgba(255, 255, 255, 0.06)',
      hide_top_toolbar: true,
      hide_legend: true,
      save_image: false,
      container_id: 'tradingview_widget'
    });

    containerRef.current.appendChild(script);
  }, [symbol, theme]);

  return (
    <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
      <div id="tradingview_widget" ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export const MiniChartWidget: React.FC<{ symbol: string }> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: "100%",
      height: "100%",
      locale: "en",
      dateRange: "1M",
      colorTheme: "dark",
      isTransparent: true,
      autosize: true,
      largeChartUrl: ""
    });

    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
      <div ref={containerRef} className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
};

export const MarketOverviewWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      colorTheme: "dark",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      width: "100%",
      height: "100%",
      tabs: [
        {
          title: "Macro",
          symbols: [
            { s: "TVC:DXY", d: "U.S. Dollar Index" },
            { s: "TVC:US10Y", d: "US 10Y Treasury" },
            { s: "FRED:M2SL", d: "M2 Money Supply" },
            { s: "TVC:W5000", d: "Wilshire 5000" }
          ]
        }
      ]
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
      <div ref={containerRef} className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
};
