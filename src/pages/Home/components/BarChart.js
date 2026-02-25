// 柱状图组件 把可变的部分抽象成props参数
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

const BarChart = ({ title }) => {
  const chartRef = useRef(null);
  useEffect(() => {
    // 1. 获取渲染图表的 DOM 节点
    const chartDom = chartRef.current;

    // 2. 初始化图表实例
    const myChart = echarts.init(chartDom);

    // 3. 配置图表参数
    const option = {
      title: {
        text: title
      },
      xAxis: {
        type: 'category',
        data: ['Vue', 'React', 'Angular']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150],
          type: 'bar'
        }
      ]
    };
    // 4. 使用图表参数渲染图表
    option && myChart.setOption(option);

    // 5. 图表实例销毁
    return () => {
      myChart.dispose();
    }
  }, [])

  return (
    <div ref={chartRef} style={{ width: '600px', height: '400px' }}></div>
  )
}

export default BarChart