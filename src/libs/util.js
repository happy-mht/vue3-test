export const trim = str => str.toString().replace(/(^\s*)|(\s*$)/g, "")

// 深度遍历查找第一个子元素
export const getFirstNode = tree => {
  let temp = ''
  let forFn = arr => {
    if (arr && arr.length > 0) {
      temp = arr[0]
      if (arr[0].children) {
        forFn(arr[0].children)
      }
    }
  }
  forFn(tree)
  return temp
}