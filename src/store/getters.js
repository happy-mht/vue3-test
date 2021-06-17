const getters = {
  token: state => state.user.token,
  name: state => state.user.name,
  roles: state => state.user.roles,
  userId: state => state.user.userId,
  menus: state => state.user.menus,
  functions: state => state.user.functions,
  shopList: state => state.user.shopList,
  shop: state => state.user.shop,
  lastUpdateTime: state => state.scene.lastUpdateTime,
  currentScene: state => state.scene.currentScene,
  firstPage: state => state.user.firstPage
}
export default getters
