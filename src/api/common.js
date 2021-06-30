import { axiosGet, baseUrl, axiosPostJSON } from '@/libs/request'

// 获取更新最新日期
export const getLastUpdateTime = data => axiosGet(baseUrl + `/web/common/last/update/time`, data)

// 商品搜索
export const searchGoods = data => axiosPostJSON(baseUrl + `/web/common/search/goods`, data)
