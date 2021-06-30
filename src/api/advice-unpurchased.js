import { axiosGet, axiosPostJSON, baseUrl, axiosPost } from '@/libs/request'

// 咨询未购设置

// 商品集方案列表
export const getProjectList = data => axiosGet(baseUrl + `/web/product/set/project/list`, data)

// 创建商品集方案
export const createProject = data => axiosPost(baseUrl + '/web/product/set/project/create', data)

// 创建或修改商品集
export const updateSet = data => axiosPost(baseUrl + `/web/product/set/createOrUpdate`, data)

// 商品集列表
export const getProjectSetList = data => axiosGet(baseUrl + `/web/product/set/list/${data}`)

//查看商品集详情-商品集下商品信息
export const getSetDetail = data => axiosPost(baseUrl + `/web/product/set/detail`, data)

//商品集删除
export const deleteSet = data => axiosPost(baseUrl + `/web/product/set/delete`, data)

// 商品集方案优先级变化
export const updatePriority = data => axiosPostJSON(baseUrl + `/web/product/set/update/priority`, data)

// 商品集添加营销信息设置
export const addSetMsg = data => axiosPost(baseUrl + `/web/product/set/add/message`, data)

// 引入店铺商品集
export const inputShopSet = data => axiosPost(baseUrl + `/web/product/set/input/shopGoodsSet`, data)

//基础设置创建自动投放/修改
export const addShopAutoPut = data => axiosPost(baseUrl + `/web/shopAutoPutSet/add`, data)

// 基础设置-查询
export const checkShopAutoSet = data => axiosPost(baseUrl + `/web/shopAutoPutSet/check`, data)

// 咨询未购-店铺商品集列表下拉
export const getShopGoodsSet = () => axiosGet(baseUrl + `/web/shopGoodsSet/listGoods`)

// 咨询未购-商品集开启关闭
export const switchSetOpened = data => axiosPost(baseUrl + `/web/product/set/set/opened`, data)

// 咨询未购-基础设置-开启/关闭
export const switchShopAutoPutSet = data => axiosPost(baseUrl + `/web/shopAutoPutSet/open`, data)

//咨询未购-商品集方案删除
export const delProject = productProjectId => axiosPost(baseUrl + `/web/product/set/project/delete/${productProjectId}`)

// 咨询未购场景

// 快速新建
export const createTask = data => axiosPost(baseUrl + `/web/incident/task/set/create`, data)

// 自动投放任务统计数据
export const getAutoParam = data => axiosGet(baseUrl + `/web/inquiry/no/buy/auto/param`, data)

// 营销事件(翻页)
export const getMarkingList = data => axiosGet(baseUrl + `/web/inquiry/no/buy/list/marking`, data)

// 分商品集收益
export const getSetsAmount = data => axiosGet(baseUrl + `/web/inquiry/no/buy/list/sets/amount`, data)

// 历史商品集收益
export const getHisAmount = data => axiosGet(baseUrl + `/web/inquiry/no/buy/list/his/sets/amount`, data)

// 判断是否有重复的天数
export const judgeRepeat = data => axiosPost(baseUrl + `/web/incident/task/set/repeat`, data)

// 统计数据
export const getInquiryTotal = data => axiosGet(baseUrl + `/web/inquiry/no/buy/inquiry/total`, data)

// 统计数据-折线图
export const getInquiryDetail = data => axiosGet(baseUrl + `/web/inquiry/no/buy/inquiry/detail`, data)

// 场景数据
export const getInquiryParam = data => axiosGet(baseUrl + `/web/inquiry/no/buy/inquiry/param`, data)

