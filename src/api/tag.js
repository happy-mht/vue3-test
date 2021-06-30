import { axiosGet, axiosPost, axiosPostJSON, baseUrl, requestType } from '@/libs/request'

// 创建组合标签
export const addOrUpdate = data => axiosPostJSON(baseUrl + '/web/combination/tag/createOrUpdate', data, { requestType: requestType.RETAIN })

// 获取组合标签可分发店铺
export const getShopList = data => axiosGet(baseUrl + '/web/combination/tag/can/choose/shop', data)

// 查看组合标签明细
export const getTagDetail = data => axiosGet(baseUrl + '/web/combination/tag/detail', data)

// 组合标签列表
export const getTagList = data => axiosPostJSON(baseUrl + '/web/combination/tag/list', data)

// 组合标签列表置顶
export const getTagTopList = data => axiosPostJSON(baseUrl + '/web/combination/tag/top/list', data)

// 获取店铺所有可用标签
export const getShopTags = data => axiosPostJSON(baseUrl + `/web/combination/tag/get/shop/tag`, data)

// 获取组合标签分发的店铺的计算状态
export const getShopTagStatus = data => axiosGet(`${baseUrl}/web/combination/tag/distribution/shop/status`, data)

// 模糊搜索标签名
export const getLabelName = labelName => axiosGet(`${baseUrl}/web/label/get/${labelName}`)

// 审核标签
export const reviewTag = data => axiosPostJSON(baseUrl + '/web/combination/tag/review', data)

// 删除标签
export const deleteTag = data => axiosGet(baseUrl + '/web/combination/tag/delete', data)

// 下线标签
export const getLabelOffline= data => axiosGet(`${baseUrl}/web/combination/tag/offline`, data)

// 获取待审核的数量
export const getLabelReviewCount = data => axiosGet(`${baseUrl}/web/combination/tag/wait/review/count`, data)

// 判断修改，查看，删除，下线是否存在其他修改操作
export const getLabelIsHasUpdate= data => axiosGet(`${baseUrl}/web/combination/tag/is/has/update/mark`, data)

// 组合标签取消正在修改的标识
export const labelCancelUpdate = data => axiosGet(`${baseUrl}/web/combination/tag/cancel/update/mark`, data)

// 组合标签设置正在修改标识
export const getLabelSetUpdate = data => axiosGet(`${baseUrl}/web/combination/tag/set/update/mark`, data)

// 获取当前更新人
export const getLabelEditPerson = data => axiosGet(`${baseUrl}/web/combination/tag/updating/user`, data)

// 获取组合标签分发的店铺的计算状态
export const getLabelShopStatus = data => axiosGet(`${baseUrl}/web/combination/tag/distribution/shop/status`, data)

export const updateTagEnum = data => axiosPost(baseUrl + '/web/combination/tag/update/enum', data)

export const setTagMark = data => axiosGet(`${baseUrl}/web/combination/tag/set/update/mark`, data)

export const cancelTagMark = data => axiosGet(`${baseUrl}/web/combination/tag/cancel/update/mark`, data)

export const checkDeleteShop = data => axiosGet(`${baseUrl}//web/combination/tag/check/shop/delete`, data, { requestType: requestType.RETAIN })