<template>
  <div class="steps">
   <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'Steps',
  props: {
    active: {
      type: Number
    },
    completedStep: {
      type: Number
    }
  },
  data() {
    return {
      steps: []
    }
  }
}
</script>

<style lang="scss" scoped>
.steps {
  padding: 10px;
  display: flex;
  justify-content: center;
}
</style>