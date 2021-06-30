import { axiosGet, axiosPostJSON, baseUrl } from '@/libs/request'

// 路径分析
export const getPathAnalysisList = data => axiosPostJSON(baseUrl + `/web/related/repurchase/path/analysis/list`, data)

export const getSetStatus = data => axiosGet(baseUrl + '/web/related/repurchase/setting/status', data)

// 关联购设置场景页面监控商品与排除规则数据
export const getMonitorData = data => axiosGet(baseUrl + `/web/related/repurchase/monitor/goods/data`, data)

// 关联购场景设置，保存监控商品和排除规则
export const setMonitorData = data => axiosPostJSON(baseUrl + `/web/related/repurchase/monitor/goods/setting`, data)

// 搜索监控商品
export const getMonitorGoods = data => axiosGet(baseUrl + '/web/related/repurchase/monitor/goods/search', data)
