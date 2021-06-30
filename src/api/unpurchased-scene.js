import { axiosGet, axiosPost, axiosPostJSON, baseUrl, platForm, request_type } from '@/libs/request'
import qs from 'qs'

// 查看商品集详情-商品集内的商品
export const productSetDetail = productSetId => axiosGet(baseUrl + `/web/product/set/detail/${productSetId}`)

// 创建商品集方案
export const createProject = data => axiosPost(baseUrl + `/web/product/set/project/create`, data)

// 询单未购列表查询
export const getNoBuyList = data => axiosPost(baseUrl + `/web/inquiry/no/buy/list`, data)

// 获取询单未购更新最新日期
export const getLastUpdateTime = () => axiosGet(baseUrl + `/web/inquiry/no/buy/last/update/time`)

// 商品集方案列表
export const getProjectList = () => axiosGet(baseUrl + `/web/product/set/project/list`)

// 商品集列表
export const getProductList = productProjectId => axiosGet(baseUrl + `/web/product/set/list/${productProjectId}`)

// 创建/修改商品集
export const createOrUpdateSet = data => axiosPostJSON(baseUrl + `/web/product/set/createOrUpdate`, data, { requestType: request_type.RETAIN })

// 商品集方案上移下移
export const updatePriority = data => axiosPost(baseUrl + `/web/product/set/update/priority`, data)

// 商品集方案状态修改-启用-停用
export const updateStatus = data => axiosPost(baseUrl + `/web/product/set/update/status`, data)

// 创建投放人群范围任务
export const createTask = data => axiosPost(baseUrl + `/web/inquiry/put/task/create`, data)

// 删除任务
export const deleteTask = taskId => axiosGet(baseUrl + `/web/inquiry/put/task/delete/${taskId}`)

// 投放任务信息
export const getTaskInfo = taskId => axiosGet(baseUrl + `/web/inquiry/put/task/info/${taskId}`)

// 投放任务列表
export const getPutTaskList = () => axiosGet(baseUrl + `/web/inquiry/put/task/list`)

// 导出文件
export const downloadFile = ( url, params ) => {
  const obj = {
    ...params,
    'x-platform': platForm
  }
  window.open(`${process.env.VUE_APP_BASE_API + baseUrl + url + '?' + qs.stringify(obj)}`, '_self')
}

// 设置追踪时间
export const setTrackTime = data => axiosPost(baseUrl + `/web/inquiry/put/task/set/track/time`, data)

// 商品集删除
export const delProductSet = data => axiosPost(baseUrl + `/web/product/set/delete`, data)
