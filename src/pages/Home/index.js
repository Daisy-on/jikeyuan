import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'
import BarChart from './components/BarChart'

const Home = () => {
  
  return (
    <div>
      <BarChart title="三大框架使用情况" />
      <BarChart title="三大框架满意度" />
    </div>
  )
}

export default Home