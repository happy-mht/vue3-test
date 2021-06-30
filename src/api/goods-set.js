import { axiosGet, axiosPostJSON, baseUrl } from '@/libs/request'

// 店铺商品集列表
export const getShopGoodsList = data => axiosGet(baseUrl + `/web/shopGoodsSet/list`, data)

// 商品集宝贝详情
export const getDetail = data => axiosGet(baseUrl + '/web/shopGoodsSet/detail/list', data)

// 商品集名称校验
export const checkSetName = data => axiosGet(baseUrl + `/web/shopGoodsSet/checkName`, data)

// 新增商品集
export const addGoodsSet = data => axiosPostJSON(baseUrl + `/web/shopGoodsSet/add`, data)

// 修改商品集
export const updateGoodsSet = data => axiosPostJSON(baseUrl + '/web/shopGoodsSet/update', data)

// 删除商品集
export const delSet = data => axiosGet(baseUrl + '/web/shopGoodsSet/delete', data)

// 店铺商品集-数据字典
export const getDict = data => axiosGet(baseUrl + '/web/shopGoodsSet/dataDict', data)