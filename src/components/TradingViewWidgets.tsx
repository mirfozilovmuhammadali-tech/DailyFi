import React, { useEffect, useRef } from 'react';

interface WidgetProps {
  symbol: string;
  height?: number | string;
  theme?: 'light' | 'dark';
}

export const TradingViewMiniChart: React.FC<WidgetProps> = ({ symbol, height = 220, theme = 'dark' }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "symbol": symbol,
      "width": "100%",
      "height": height,
      "locale": "en",
      "dateRange": "1M",
      "colorTheme": theme,
      "isTransparent": true,
      "autosize": true,
      "largeChartUrl": ""
    });
    container.current.appendChild(script);
  }, [symbol, height, theme]);

  return <div className="tradingview-widget-container" ref={container} />;
};

export const TradingViewAdvancedChart: React.FC<WidgetProps> = ({ symbol, height = 500, theme = 'dark' }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": symbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": theme,
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": false,
      "calendar": false,
      "support_host": "https://www.tradingview.com",
      "backgroundColor": "rgba(0, 0, 0, 0)",
      "gridColor": "rgba(0, 245, 255, 0.06)",
      "height": height,
      "width": "100%"
    });
    container.current.appendChild(script);
  }, [symbol, height, theme]);

  return <div className="tradingview-widget-container" ref={container} />;
};
