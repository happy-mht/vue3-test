import { axiosGet, axiosPost, baseUrl } from '@/libs/request'

// 营销事件(翻页)
export const getIncidentList = data => axiosPost(baseUrl + `/web/incident/task/set/list/track/total`, data)

// 任务投放按钮
export const pushTask = data => axiosPost(baseUrl + '/web/incident/task/set/push', data)

// 任务失效
export const invalidTask = data => axiosPost(baseUrl + `/web/incident/task/set/invalid`, data)

// 终止任务
export const terminitedTask = data => axiosPost(baseUrl + `/web/incident/task/set/terminited`, data)

// 事件详情-基础信息
export const getIncidentBase = data => axiosGet(baseUrl + '/web/inquiry/crowd/set/incident/base', data)

// 事件详情-人群投放设置及详情
export const getCrowdSetBase = data => axiosGet(baseUrl + '/web/inquiry/crowd/set/list/crowd', data)

//事件详情-事件查询转化追踪详情-整个事件数据
export const getTrackTotal = data => axiosGet(baseUrl + '/web/inquiry/crowd/set/list/track/total', data)

//事件详情-查看转化详情-整个商品集
export const getTrackTotalDetail = data => axiosGet(baseUrl + '/web/inquiry/crowd/set/list/track/detail/total', data)

//事件详情-查看转化详情
export const getTrackDetail = data => axiosGet(baseUrl + '/web/inquiry/crowd/set/list/track/detail', data)

// 事件详情-日志查询
export const getLogList = data => axiosPost(baseUrl + `/web/common/logs/list`, data)
