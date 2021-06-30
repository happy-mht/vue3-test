<template>
  <div class="logical-wrapper">
    <template v-if="isEdit">
      <div :class="['logical', value === 0 && 'active_1']" @click="change(0)">和</div>
      <div :class="['logical', value === 1 && 'active_0']" @click="change(1)">或</div>
    </template>
   <template v-else>
     <div :class="['logical', value === 0 && 'active_1', value === 1 && 'active_0']" >{{value === 0 ? '和' : '或'}}</div>
   </template>
  </div>
</template>

<script>
export default {
  name: 'OperNode',
  props: {
    value: {
      type: Number,
      default: 1
    },
    isEdit: Boolean
  },
  methods: {
    change(e) {
      if (!this.isEdit) return
      this.$emit('input', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.logical {
  width: 40px;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
}
.active_1 {
  color: #FD4378;
  background: linear-gradient(270deg, rgba(255, 235, 240, 0.75) 0%, rgba(255, 235, 240, 0) 100%);
}
.active_0 {
  color: #298CFF;
  background: linear-gradient(270deg, rgba(235, 244, 255, 0) 0%, #EBF4FF 100%);
}
.logical-wrapper {
  display: flex;
  justify-content: center;
}
</style>