import { axiosGet, axiosPost, axiosPostJSON, baseUrl } from '@/libs/request'

// 看板内的标签排序
export const sortTag = data => axiosPost(baseUrl + `/web/panel/tag/sort`, data)

// 店铺可选择的标签
export const getTagList = () => axiosGet(baseUrl + `/web/panel/tag/selector/list`)

// 看板内标签的详情信息
export const getTagDetail = data => axiosGet(baseUrl + `/web/panel/tag/detail`, data)

// 看板内的标签删除
export const deleteTag = data => axiosGet(baseUrl + `/web/panel/tag/delete`, data)

// 获取看板内的标签数据
export const getTagData = data => axiosGet(baseUrl + `/web/panel/tag/data`, data)

// 看板list
export const getPanelList = data => axiosGet(baseUrl + `/web/panel/list`, data)

// 修改看板内的标签
export const editPanelTag = data => axiosPost(baseUrl + `/web/panel/update/tag`, data)

// 删除看板
export const delPanel = data => axiosGet(baseUrl + `/web/panel/delete`, data)

// 创建看板
export const createOrUpdatePanel = data => axiosPostJSON(baseUrl + `/web/panel/createOrUpdate`, data)

// 获取看板内已经选择的标签和未选择的标签
export const getSelectTag = data => axiosGet(baseUrl + `/web/panel/tag/al/selector/list`, data)

// 记录当前选择的模板
export const selectPanel = data => axiosGet(baseUrl + `/web/panel/select`, data)

// 批量修改标签
export const batchAddTag = data => axiosPostJSON(baseUrl + `/web/panel/batch/add/tag`, data)

// 获取店铺人数
export const getPanelPeople = data => axiosGet(baseUrl + `/web/panel/total/people`, data)
