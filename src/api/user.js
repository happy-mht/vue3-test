import { axiosGet, axiosPost, baseUrl } from '@/libs/request'

export const login = data => axiosPost('/ee/web/verify/simpleLogin', data)

export const getInfo = data => axiosPost('/ee/web/auth/common/data', data)

export const logout = () => axiosGet('/ee/web/verify/logout')

// 获取业务分组
export const getShopList = () => axiosGet(baseUrl + '/web/common/shop/list')

export const chooseShop = data => axiosGet(baseUrl + `/web/common/choose/shop/${data.shopId}/${data.shopCode}`)

export const getChooseShop = () => axiosGet(baseUrl + `/web/common/get/choose/shop`)
