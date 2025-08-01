"use client";

import EChartsWrapper from './EChartsWrapper';

const EChartsLineChart = ({
  data = { categories: [], values: [] },
  title = '',
  style = { height: '400px' },
  className = '',
  show3DEffect = true,
  color = '#5470c6',
  gradient = true
}) => {
  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.categories,
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      },
      axisLabel: {
        color: '#666'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      },
      axisLabel: {
        color: '#666'
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    },
    series: [
      {
        name: '데이터',
        type: 'line',
        data: data.values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 4,
          color: color,
          shadowColor: show3DEffect ? 'rgba(0,0,0,0.3)' : 'transparent',
          shadowBlur: show3DEffect ? 10 : 0,
          shadowOffsetY: show3DEffect ? 5 : 0
        },
        itemStyle: {
          color: color,
          borderColor: '#fff',
          borderWidth: 2,
          shadowColor: show3DEffect ? 'rgba(0,0,0,0.3)' : 'transparent',
          shadowBlur: show3DEffect ? 10 : 0,
          shadowOffsetY: show3DEffect ? 5 : 0
        },
        areaStyle: gradient ? {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: color + '80' // 50% 투명도
              },
              {
                offset: 1,
                color: color + '10' // 10% 투명도
              }
            ]
          }
        } : undefined
      }
    ],
    animation: true,
    animationDuration: 2000,
    animationEasing: 'cubicOut'
  };

  return (
    <EChartsWrapper
      option={option}
      style={style}
      className={className}
    />
  );
};

export default EChartsLineChart;
