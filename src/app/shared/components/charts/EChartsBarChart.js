"use client";

import EChartsWrapper from './EChartsWrapper';

const EChartsBarChart = ({
  data = { categories: [], values: [] },
  title = '',
  style = { height: '400px' },
  className = '',
  show3DEffect = true,
  color = '#91cc75',
  gradient = true,
  horizontal = false
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
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: horizontal ? {
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
    } : {
      type: 'category',
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
    yAxis: horizontal ? {
      type: 'category',
      data: data.categories,
      axisLine: {
        lineStyle: {
          color: '#ddd'
        }
      },
      axisLabel: {
        color: '#666'
      }
    } : {
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
        type: 'bar',
        data: data.values,
        barWidth: '60%',
        itemStyle: {
          color: gradient ? {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: color
              },
              {
                offset: 1,
                color: color + '80' // 50% 투명도
              }
            ]
          } : color,
          borderRadius: show3DEffect ? [4, 4, 0, 0] : 0,
          shadowColor: show3DEffect ? 'rgba(0,0,0,0.3)' : 'transparent',
          shadowBlur: show3DEffect ? 10 : 0,
          shadowOffsetY: show3DEffect ? 5 : 0
        },
        emphasis: {
          itemStyle: {
            color: gradient ? {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: color + 'CC' // 80% 투명도
                },
                {
                  offset: 1,
                  color: color + '99' // 60% 투명도
                }
              ]
            } : color + 'CC',
            shadowColor: show3DEffect ? 'rgba(0,0,0,0.5)' : 'transparent',
            shadowBlur: show3DEffect ? 15 : 0,
            shadowOffsetY: show3DEffect ? 8 : 0
          }
        }
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

export default EChartsBarChart;
