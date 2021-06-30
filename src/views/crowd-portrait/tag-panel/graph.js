import { measureTextWidth } from '@antv/g2plot'

// 数值型:1 柱状图（默认）、面积图 蓝色
// 时间型:2 直方图（默认）、面积图 红色
// 枚举型:3 条形图 （默认） 柱状图  绿色
// 布尔型:4 黄色（条形图、柱状图、 环形图 ）
// 组合标签-枚举型:6  组合标签-布尔型:7

// 数字格式化
export const numFormat = num => (num + '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')

const renderAxisLabel = (v, num) => {
  let len = measureTextWidth(v, { fontSize: 12 })
  if (len > 72) {
    let index = num
    for (let i = 0; i < 6; i++) {
      if (v.charCodeAt(i) < 255) index++
    }
    return v.substring(0, index) + '…'
  }
  else return v
}

const renderStatistic = (containerWidth, text, style) => {
  let textWidth = measureTextWidth(text, style)
  const textWidth2 = measureTextWidth('人', { fontSize: '12px' })
  const R = containerWidth / 2
  let scale = 1
  textWidth += textWidth2
  if (containerWidth < textWidth) {
    scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2)))), 1)
  }
  const textStyleStr = `width:${containerWidth}px;`
  return `
    <div style="${textStyleStr};font-size:${scale}em;line-height:${scale < 1 ? 1 : 'inherit'};color: inherit;">${text}<span style="font-size: 12px">人</span>
    </div>
  `
}

const renderTooltip = data => {
  if (data[0]) {
    const val = Number.isNaN(data[1].value) ? data[1].value : numFormat(data[1].value)
    return `<div style="padding: 8px 0;">
      <div style="margin-bottom: 8px">
        <span style="color: rgba(0,0,0,0.45)">${data[0].value}</span>
      </div>
      <div style="color: rgba(0,0,0,0.65)">
        <span style="margin-right: 8px">${data[1].name}</span>
        <span style="font-weight: 600;">${val}</span>
      </div>
    </div>`
  }
}
// 环形图（布尔-黄色）
const PieConfig = {
  autoFit: true,
  angleField: 'value',
  colorField: 'key',
  radius: 0.75,
  innerRadius: 0.7,
  label: {
    type: 'spider',
    labelHeight: 28,
    style: {
      fontSize: 12,
      color: '#2C3542',
    },
    formatter: data => {
      return `${data.key}\n${numFormat(data.value)}人`
    }
  },
  tooltip: {
    fields: ['key', 'value', 'ratio'],
    customContent: (title, data) => {
      if (data[0]) {
        const val = Number.isNaN(data[1].value) ? data[1].value : numFormat(data[1].value)
        return `<div style="padding: 8px 0;">
          <div style="margin-bottom: 8px">
            <span class="g2-tooltip-marker" style="background: ${data[0].color};"></span>
            <span style="margin-left: -8px;color: rgba(0,0,0,0.45)">${data[0].value}</span>
          </div>
          <div style="font-weight: 600;color: rgba(0,0,0,0.65)">
            <span style="margin-right: 8px">${val}人</span>
            <span>${data[2].value}%</span>
          </div>
        </div>`
      }
    }
  },
  theme: {
    colors10: ['#FDC220', '#FFE08C']
  },
  legend: {
    layout: 'horizontal',
    position: 'bottom'
  },
  statistic: {
    title: {
      style: {
        fontSize: '12px',
        color: '#2C3542'
      },
      offsetY: -10,
      formatter: () => '总人数'
    },
    content: {
      offsetY: -4,
      style: {
        fontSize: '32px',
        fontWeight: 500,
        color: '#2C3542'
      },
      customHtml: (container, view, datum, data) => {
        const { width } = container.getBoundingClientRect()
        const text = numFormat(data.reduce((r, d) => r + d.value, 0))
        return renderStatistic(width, text, { fontSize: 32 })
      },
    },
  },
  interactions: [{ type: 'element-highlight' }]
}
// 折线图（枚举-绿色）
const LineConfig = {
  autoFit: true,
  padding: 'auto',
  xField: 'key',
  yField: 'value',
  color: '#82D6B8',
  meta: {
    value: {
      alias: '人数'
    },
  },
  yAxis: {
    label: {
      formatter: numFormat
    },
    grid: {
      line: {
        style: {
          stroke: 'rgba(65, 97, 128, 0.15)'
        }
      }
    }
  },
  xAxis: {
    tickCount: 5,
  },
  lineStyle: {
    shadowColor: 'rgba(130, 214, 184, 0.47)',
    shadowOffsetY: 5,
    shadowOffsetX: 4,
    shadowBlur: 7
  },
  tooltip: {
    fields: ['key', 'value'],
    customContent: (title, data) => renderTooltip(data)
  },
}
// 直方图（数值-蓝色，时间-红色）
// const HistogramConfig = {
//   autoFit: true,
//   binField: 'key',
//   binWidth: 4,
//   interactions: [
//     {
//       type: 'element-highlight',
//     },
//   ],
//   /** range 为 x 轴代表字段，count 为 y 轴统计个数字段 */
//   meta: {
//     range: {
//       min: 0,
//       tickInterval: 2,
//     },
//     count: {
//       max: 20,
//       nice: true,
//     },
//   },
//   tooltip: {
//     fields: ['range', 'count'],
//     customContent: (title, data) => renderTooltip(data)
//   },
//   yAxis: {
//     grid: {
//       line: {
//         style: {
//           stroke: 'rgba(65, 97, 128, 0.15)'
//         }
//       }
//     }
//   }
// }
const HistogramConfig = {
  autoFit: true,
  // padding: [10, 10, 56, 60],
  xField: 'key',
  yField: 'value',
  columnWidthRatio: 1,
  xAxis: {
    label: {
      autoRotate: true,
      formatter: v => renderAxisLabel(v, 4)
    },
  },
  yAxis: {
    label: {
      formatter: numFormat
    },
    grid: {
      line: {
        style: {
          stroke: 'rgba(65, 97, 128, 0.15)'
        }
      }
    }
  },
  minColumnWidth: 16,
  meta: {
    value: {
      alias: '人数',
    },
  },
  interactions: [
    {
      type: 'element-highlight',
    },
  ],
  tooltip: {
    fields: ['key', 'value'],
    customContent: (title, data) => renderTooltip(data)
  },
}
// 面积图（数值-蓝色，时间-红色）
const AreaConfig = {
  autoFit: true,
  xField: 'key',
  yField: 'value',
  xAxis: {
    range: [0, 1],
  },
  yAxis: {
    grid: {
      line: {
        style: {
          stroke: 'rgba(65, 97, 128, 0.15)'
        }
      }
    },
    label: {
      formatter: numFormat
    }
  },
  meta: {
    value: {
      alias: '人数'
    },
  },
  tooltip: {
    fields: ['key', 'value'],
    customContent: (title, data) => renderTooltip(data)
  },
  color: '#FF83A8',
  areaStyle: () => {
    return {
      fill: 'l(270) 0:#ffffff 1:#FF83A8'
    }
  }
}
// 条形图（枚举-绿色，布尔-黄色）
const BarConfig = {
  // padding: [0, 0, 20, 100],
  autoFit: true,
  xField: 'value',
  yField: 'key',
  xAxis: {
    label: {
      formatter: numFormat
    },
    grid: {
      line: {
        style: {
          stroke: 'rgba(65, 97, 128, 0.15)'
        }
      }
    }
  },
  yAxis: {
    label: {
      formatter: numFormat
    }
  },
  meta: {
    value: {
      alias: '人数',
    },
  },
  minBarWidth: 16,
  maxBarWidth: 20,
  tooltip: {
    fields: ['key', 'value'],
    customContent: (title, data) => renderTooltip(data)
  },
  interactions: [
    {
      type: 'element-highlight',
    },
  ],
  label: {
    // 可手动配置 label 数据标签位置
    position: 'left', // 'top', 'bottom', 'middle',
    layout: [
      // 数据标签防遮挡
      { type: 'interval-hide-overlap' },
      // 数据标签文颜色自动调整
      { type: 'adjust-color' }
    ],
    style: {
      fill: '#FFFFFF',
    },
    formatter: data => numFormat(data.value)
  },
  color: '#7DC9AD'
}
// 柱状图（枚举-绿色，布尔-黄色）
const ColumnConfig = {
  autoFit: true,
  // padding: [10, 0, 56, 40],
  xField: 'key',
  yField: 'value',
  xAxis: {
    label: {
      autoRotate: true,
      formatter: v => renderAxisLabel(v, 4)
    },
  },
  yAxis: {
    label: {
      formatter: numFormat
    },
    grid: {
      line: {
        style: {
          stroke: 'rgba(65, 97, 128, 0.15)'
        }
      }
    }
  },
  minColumnWidth: 18,
  maxColumnWidth: 24,
  meta: {
    value: {
      alias: '人数',
    },
  },
  tooltip: {
    fields: ['key', 'value'],
    customContent: (title, data) => renderTooltip(data)
  },
  interactions: [
    {
      type: 'element-highlight',
    },
  ]
}

export {
  PieConfig,
  LineConfig,
  HistogramConfig,
  AreaConfig,
  BarConfig,
  ColumnConfig
}
