// 自定义hooks：获取文章频道列表
import { getChannelListAPI } from '@/apis/article'
import { useState, useEffect } from 'react'

function useChannel() {
  // 获取频道列表的所有逻辑
  const [channelList, setChannelList] = useState([])
  
  useEffect(() => {
    const getChannelList = async () => {
      const res = await getChannelListAPI()
      setChannelList(res.data.channels)
    }
    getChannelList()
  }, [])
  // 2. 把组件要用到的数据return出去
  return {
    channelList
  }
}

export { useChannel }