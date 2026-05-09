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
    
    // Clear previous widget
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

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol, theme]);

  return (
    <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }}>
      <div id="tradingview_widget" ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};
