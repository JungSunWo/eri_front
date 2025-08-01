"use client";

import EChartsWrapper from './EChartsWrapper';

const EChartsPieChart = ({
  data = [],
  title = '',
  style = { height: '400px' },
  className = '',
  show3DEffect = true,
  colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4'],
  gradient = true,
  roseType = false
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
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: '#666'
      }
    },
    series: [
      {
        name: '데이터',
        type: 'pie',
        radius: roseType ? ['30%', '70%'] : '50%',
        center: ['50%', '60%'],
        roseType: roseType ? 'radius' : false,
        data: data,
        itemStyle: {
          borderRadius: show3DEffect ? 8 : 0,
          borderColor: '#fff',
          borderWidth: 2,
          shadowColor: show3DEffect ? 'rgba(0,0,0,0.3)' : 'transparent',
          shadowBlur: show3DEffect ? 10 : 0,
          shadowOffsetY: show3DEffect ? 5 : 0
        },
        label: {
          show: true,
          formatter: '{b}: {d}%',
          color: '#666'
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: '#ddd'
          }
        },
        emphasis: {
          itemStyle: {
            shadowColor: show3DEffect ? 'rgba(0,0,0,0.5)' : 'transparent',
            shadowBlur: show3DEffect ? 15 : 0,
            shadowOffsetY: show3DEffect ? 8 : 0,
            scale: true,
            scaleSize: 5
          }
        }
      }
    ],
    color: colors,
    animation: true,
    animationDuration: 2000,
    animationEasing: 'cubicOut'
  };

  // 그라데이션 효과 적용
  if (gradient && show3DEffect) {
    option.series[0].itemStyle = {
      ...option.series[0].itemStyle,
      color: function(params) {
        const color = colors[params.dataIndex % colors.length];
        return {
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
        };
      }
    };
  }

  return (
    <EChartsWrapper
      option={option}
      style={style}
      className={className}
    />
  );
};

export default EChartsPieChart;
