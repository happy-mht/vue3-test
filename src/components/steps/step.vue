<template>
  <div class="step" :style="style">
    <div v-if="!isLast" :class="['step-line', !isCompleted && 'grey']" ></div>
    <div :class="['step-content', isActive && 'active', !isCompleted && !isActive && 'grey']" >
      <span class="icon">
        <i v-if="isCompleted && !isActive" class="el-icon-check" />
        <span v-else>{{ index + 1 }}</span>
      </span>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Step',
  props: {
    width: {
      type: String,
      default: '500px'
    }
  },
  computed: {
    isLast() {
      const parent = this.$parent
      return parent.steps[parent.steps.length - 1] === this
    },
    index() {
      const parent = this.$parent
      return parent.steps.indexOf(this)
    },
    isActive() {
      return this.index === this.$parent.active
    },
    style() {
      return this.isLast ? 'width: auto' : `width: ${this.width}`
    },
    isCompleted() {
      return this.$parent.completedStep >= this.index
    }
  },
  beforeCreate() {
    this.$parent.steps.push(this)
  },
  beforeDestroy() {
    const steps = this.$parent.steps
    steps.splice(this.index, 1)
  }
}
</script>
<style lang="scss" scoped>
.step {
  position: relative;
  text-align: left
}
.step-line {
  position: absolute;
  border-color: inherit;
  background-color: #61646D;
  top: 16px;
  left: 0;
  right: 0;
  height: 10px;
  background: #FFFFFF;
  &.grey {
    background-color: #F2F1F8;
  }
}
.step-content {
  z-index: 1;
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  box-sizing: border-box;
  width: 300px;
  height: 40px;
  background-color: white;
  box-shadow: 0px 4px 17px -7px #C6C8CC;
  border-radius: 30px;
  font-weight: 500;
  &.active {
    color: #FD4378;
    .icon {
      background: linear-gradient(90deg, #EBF4FF 0%, #FFEBF0 100%);
    }
    .el-icon-check, span {
      color: #FD4378;
    }
  }
  &.grey {
    color: #BEBFC5;
    background: #F2F1F8;
    .icon {
      background-color: #D2D3D8;
    }
    span {
      color: white;
    }
  }
}
.icon {
  width: 20px;
  height: 20px;
  border-radius: 8px;
  text-align: center;
  line-height: 20px;
  display: inline-block;
  margin-right: 10px;
  color: #62656E;
  background: #F1F3FE;
  border-radius: 8px;
  filter: blur(0px);
}
</style>