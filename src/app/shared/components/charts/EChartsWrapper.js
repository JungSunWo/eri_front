"use client";

import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';

const EChartsWrapper = ({
  option,
  style = { height: '400px' },
  className = '',
  loading = false,
  theme = 'default',
  onChartReady,
  onEvents
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        style={style}
        className={`flex items-center justify-center bg-gray-50 rounded ${className}`}
      >
        <div className="text-gray-500">차트 로딩 중...</div>
      </div>
    );
  }

  return (
    <ReactECharts
      option={option}
      style={style}
      className={className}
      loading={loading}
      theme={theme}
      onChartReady={onChartReady}
      onEvents={onEvents}
      opts={{ renderer: 'canvas' }}
    />
  );
};

export default EChartsWrapper;
