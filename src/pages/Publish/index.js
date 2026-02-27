import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import './index.scss'
import { createArticle, getArticleDetailAPI, updateArticleAPI } from '@/apis/article'
import { getToken } from '@/utils'
import { useChannel } from '@/hooks/useChannel'
import { useSearchParams, useNavigate } from 'react-router-dom'

const Publish = () => {
  // 获取频道列表
  const { channelList } = useChannel()
  // 路由跳转
  const navigate = useNavigate()

  // 提交表单
  const onFinish = async (formValue) => {
    console.log(formValue)
    // 先校验封面图片数量是否和imageType一致
    if (imageType > 0 && imageList.length !== imageType) {
      message.warning(`请上传${imageType}张图片`)
      return
    }
    // 处理表单数据
    const { title, channel_id, content } = formValue
    const requestData = {
      title: title,
      channel_id: channel_id,
      content: content,
      cover: {
        type: imageType, // 封面模式
        // 这里只能处理新增文章的封面图片, 编辑文章的封面图片需要单独处理
        images: imageList.map(item => {
          if (item.response) {
            return item.response.data.url
          }
          return item.url
        })
      }
    }

    // 调用接口提交文章表单
    // 如果是新增文章，则为新增接口，如果是编辑文章，则为编辑接口 通过有无id判断
    if (articleId) {
      await updateArticleAPI({ ...requestData, id: articleId })
    } else {
      await createArticle(requestData)
    }
    message.success('发布成功')
    // 发布成功后, 跳转到文章列表页
    navigate('/article')
  }

  // 上传图片回调
  const [imageList, setImageList] = useState([])
  const onChange = (info) => {
    console.log(info)
    setImageList(info.fileList)
  }
  // 封面类型改变回调
  const [imageType, setImageType] = useState(0)
  const onTypeChange = (event) => {
    console.log('切换封面模式了', event.target.value)
    setImageType(event.target.value)
  }

  // 编辑文章回填数据
  const [form] = Form.useForm()
  const [searchParams] = useSearchParams()
  const articleId = searchParams.get('id')
  useEffect(() => {
    // 1.通过id获取文章详情
    async function getArticleDetail() {
      const res = await getArticleDetailAPI(articleId)
      // 2.调用Form组件的setFieldsValue方法回填数据
      const data = res.data
      const { cover } = data
      form.setFieldsValue({
        ...data,
        // 封面类型需要单独处理，用cover中的type字段回填
        type: cover.type,
      })
      // 回填图片列表
      setImageType(cover.type)
      setImageList(cover.images.map(url => {
        return { url }
      }))
    }
    // 只有有id的时候才调用, 因为只有编辑文章才需要回填数据
    if (articleId) {
      getArticleDetail()
    }
  }, [articleId, form])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: `${articleId ? '编辑' : '发布'}文章` },
          ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道"
              style={{ width: 400 }}
              options={channelList.map(item => ({
                label: item.name,
                value: item.id
              }))}
            />
          </Form.Item>
          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {/* listType决定选择文件框的外观样式 showUploadList决定是否显示已上传文件列表 */}
            {imageType > 0 && <Upload
              listType="picture-card"
              showUploadList
              name="image"
              action={'http://geek.itheima.net/v1_0/upload'}
              onChange={onChange}
              maxCount={imageType}
              headers={{
                Authorization: `Bearer ${getToken()}`
              }}
              fileList={imageList}
            >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>}

          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            {/* 富文本编辑器 */}
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish