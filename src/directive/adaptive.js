import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'
const doResize = async (el, binding, vnode) => {
  const { componentInstance: $table } = vnode
  const { value } = binding
  if (!$table || el.style.display === 'none') return

  if (!$table.height) {
    throw new Error(`el-$table must set the height. Such as height='100px'`)
  }
  const bottomOffset = (value && value.bottomOffset) || 30

  const height = window.innerHeight - el.getBoundingClientRect().top - bottomOffset
  $table.layout.setHeight(height)
  $table.doLayout()
}

const adaptive = {
  bind(el, binding, vnode) {
    el.resizeListener = async() => {
      await doResize(el, binding, vnode)
    }
    addResizeListener(window.document.body, el.resizeListener)
    addResizeListener(el, el.resizeListener)
  },
  async inserted(el, binding, vnode) {
    await doResize(el, binding, vnode)
  },
  unbind(el) {
    removeResizeListener(el, el.resizeListener)
  },
}

const install = function(Vue) {
  Vue.directive('adaptive', adaptive)
}

adaptive.install = install
export default adaptive

