"use client";

import EChartsWrapper from './EChartsWrapper';

const EChartsScatterChart = ({
  data = [],
  title = '',
  style = { height: '400px' },
  className = '',
  show3DEffect = true,
  color = '#5470c6',
  gradient = true,
  bubble = false
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
      trigger: 'item',
      formatter: function(params) {
        if (bubble) {
          return `${params.data[2]}<br/>X: ${params.data[0]}<br/>Y: ${params.data[1]}<br/>크기: ${params.data[3] || 1}`;
        }
        return `${params.data[2] || '데이터'}<br/>X: ${params.data[0]}<br/>Y: ${params.data[1]}`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
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
        type: 'scatter',
        data: data,
        symbolSize: bubble ? function(data) {
          return data[3] || 10;
        } : 10,
        itemStyle: {
          color: gradient ? {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
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
          borderColor: '#fff',
          borderWidth: 2,
          shadowColor: show3DEffect ? 'rgba(0,0,0,0.3)' : 'transparent',
          shadowBlur: show3DEffect ? 10 : 0,
          shadowOffsetY: show3DEffect ? 5 : 0
        },
        emphasis: {
          itemStyle: {
            color: gradient ? {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
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
            shadowOffsetY: show3DEffect ? 8 : 0,
            scale: true,
            scaleSize: 1.5
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

export default EChartsScatterChart;
