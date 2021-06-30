import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '@/store'
const uuid = require('uuid')
export const platForm = 'cdl-cc'
export const requestType = {
  RETAIN: 0, //保留返回值，在 axios 拦截器中不做处理，直接返回到页面
  MESSAGE: 1 //在拦截器中使用 Element.ElMessage.error() 报错
}
export const baseUrl = '/ee/proxy/cdl-cc'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true, //send cookies when cross-domain requests
  crossDomain: true
  // ,timeout: 5000
  // headers: {
  //   'Access-Control-Allow-Origin': '*'
  // }
})

// request interceptor
service.interceptors.request.use(
  config => {
    config.headers['X-PLATFORM'] = platForm
    config.headers['x-request-id'] = uuid.v1()
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      if (response.config.requestType !== requestType.RETAIN) {
        ElMessage({
          message: res.msg || res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }
      if (res.code === 401) {
        store.dispatch('user/logout').then(() => {
          location.reload()
        }).catch(e => {
          ElMessage.error(e.message)
        })
      }
      return Promise.reject(res)
    } else {
      return Promise.resolve(res.result)
    }
  },
  error => {
    const estate = error.response.status
    if (estate === 403) {
      error.message = '无权限,请重新登录'
    } else if (estate === 401) {
      error.message = '登录失效,请重新登录'
      setTimeout(() => {
        store.dispatch('user/logout').then(() => {
          location.reload()
        }).catch(e => { this.$message.error(e.message) })
      }, 3000)
    }
    ElMessage.error(error.message)
    return Promise.reject(error)
  }
)

export const axiosGet = (url, params, options) => service.request({
  method: 'get',
  url,
  params,
  ...options
})

export const axiosPost = (url, data, options) => service.request({
  url,
  data,
  method: 'post',
  ...options
})

export const axiosPostJSON = (url, data, options) => service.request({
  url,
  data,
  method: 'post',
  headers: { 'Content-Type': 'application/json' },
  ...options
})

export default service
