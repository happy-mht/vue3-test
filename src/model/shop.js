import { reactive } from 'vue'
import { getShopList, chooseShop, getChooseShop } from '@/api/user'

export default function shopList() {
  const state = reactive({
    list: [],
    shopId: '',
    shopCode: '',
    shopName: ''
  })

  function getList() {
    return getShopList().then(res => {
      state.list = res
    })
  }

  async function selectShop(shopId, shopCode) {
    try {
      await chooseShop({ shopId, shopCode })
    } catch (e) {
      console.log(e)
    }
  }

  function getShop() {
    return getChooseShop().then(res => {
      state.shopCode = res.shopCode
      state.shopId = res.shopId
      state.shopName = res.shopName
    })
  }

  getList()
  getShop()

  return {
    state,
    selectShop
  }
}