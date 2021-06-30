import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const rolesList = store.getters && store.getters.functions

  const roles = rolesList.map(item => item.code)

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value
      const hasPermission = roles.some(role => permissionRoles.includes(role))
      if (!hasPermission) el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

const params = {
  mounted(el, binding) {
    checkPermission(el, binding)
  },
  updated(el, binding) {
    checkPermission(el, binding)
  }
}

const install = function(app) {
  app.directive('permission', params)
}

params.install = install
export default params
