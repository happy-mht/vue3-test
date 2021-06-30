// 数值型:1 时间型:2 枚举型:3  布尔型:4 行为标签：5
// 组合标签-枚举型:6  组合标签-布尔型:7
import component_1 from './number-node'
import component_2 from './date-node'
import component_3 from './map-node'
import component_4 from './boolean-node'
import component_5 from './action-node'
import component_6 from './map-node'
import component_7 from './boolean-node'
import operNode from './oper-node'
import addPanel from './add-panel'
import container from './container'
import group from './group'

export default {
  components: {
    component_1,
    component_2,
    component_3,
    component_4,
    component_5,
    component_6,
    component_7,
    operNode,
    addPanel,
    container,
    group
  }
}