// 文章相关的接口
import { request } from '@/utils/request'

// 获取频道列表
function getChannelListAPI() {
  return request({
    method: 'GET',
    url: '/channels'
  })
}

// 提交文章表单
function createArticle(data) {
  return request({
    method: 'POST',
    url: '/mp/articles?draft=false',
    data
  })
}

// 获取文章列表
function getArticleListAPI(params) {
  return request({
    method: 'GET',
    url: '/mp/articles',
    params
  })
}

// 删除文章
function deleteArticleAPI(id) {
  return request({
    method: 'DELETE',
    url: `/mp/articles/${id}`
  })
}

// 获取文章详情
function getArticleDetailAPI(id) {
  return request({
    method: 'GET',
    url: `/mp/articles/${id}`
  })
}

// 编辑文章
function updateArticleAPI(data) {
  return request({
    method: 'PUT',
    url: `/mp/articles/${data.id}?draft=false`,
    data
  })
}



export { 
  getChannelListAPI, 
  createArticle, 
  getArticleListAPI, 
  deleteArticleAPI, 
  getArticleDetailAPI, 
  updateArticleAPI 
}
