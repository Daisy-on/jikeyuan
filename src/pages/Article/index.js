import { Link } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Popconfirm } from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN' // 时间选择器汉化包
import { Table, Tag, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { useChannel } from '@/hooks/useChannel'
import { getArticleListAPI, deleteArticleAPI } from '@/apis/article'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const { RangePicker } = DatePicker

const Article = () => {
  // 跳转编辑页
  const navigate = useNavigate()
  const onEdit = (data) => {
    navigate(`/publish?id=${data.id}`)
  }
  // 获取频道列表
  const { channelList } = useChannel()
  // 状态枚举
  const status = {
    1: <Tag color="warning">待审核</Tag>,
    2: <Tag color="success">审核通过</Tag>,
  }
  // 准备列数据
  const columns = [
    {
      title: '封面',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      // data：当前状态status
      render: data => status[data]
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={() => onEdit(data)} />
            <Popconfirm
              title="删除文章"
              description="确认要删除该文章吗？"
              onConfirm={() => onConfirm(data)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        )
      }
    }
  ]

  // 筛选文章
  const [requestParam, setRequestParam] = useState({
    status: '',
    channel_id: '',
    begin_pubdate: '',
    end_pubdate: '',
    page: 1,
    per_page: 4,
  })

  // 获取文章列表
  const [articleList, setArticleList] = useState([])
  const [count, setCount] = useState(0)
  useEffect(() => {
    async function getArticleList() {
      const res = await getArticleListAPI(requestParam)
      setArticleList(res.data.results)
      setCount(res.data.total_count)
    }
    getArticleList()
  }, [requestParam])


  // 2.筛选数据提交回调函数
  const onFinish = (formValue) => {
    console.log(formValue)
    // 3.将表单筛选到的数据放入requestParam
    setRequestParam({
      ...requestParam,
      status: formValue.status,
      channel_id: formValue.channel_id,
      begin_pubdate: formValue.date?.[0]?.format('YYYY-MM-DD') || '',
      end_pubdate: formValue.date?.[1]?.format('YYYY-MM-DD') || '',
    })
    // 4.重新渲染文章列表 requestParam 依赖项发生变化会触发 useEffect 重新执行副作用函数获取文章列表
  }

  // 分页切换回调函数
  const onPageChange = (page) => {
    console.log(page)
    setRequestParam({
      ...requestParam,
      page
    })
  }

  // 删除文章
  const onConfirm = async (data) => {
    await deleteArticleAPI(data.id)
    // 更新参数触发重新拉取列表
    // 如果当前页只有一条数据，且不是第一页，删除后应跳回上一页
    if (articleList.length === 1 && requestParam.page > 1) {
      setRequestParam({
        ...requestParam,
        page: requestParam.page - 1
      })
    } else {
      setRequestParam({
        ...requestParam
      })
    }
  }

  return (
    <div>
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: '文章列表' },
          ]} />
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: '' }} onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={''}>全部</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 120 }}
              options={channelList.map(item => ({
                label: item.name,
                value: item.id
              }))}
            />
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 40 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 表格区域 */}
      <Card title={`根据筛选条件共查询到 ${count} 条结果：`}>
        <Table rowKey="id" columns={columns} dataSource={articleList} pagination={{
          total: count,
          pageSize: requestParam.per_page,
          current: requestParam.page,
          onChange: onPageChange
        }} />
      </Card>
    </div>
  )
}

export default Article