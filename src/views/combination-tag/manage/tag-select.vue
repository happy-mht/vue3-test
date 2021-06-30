<template>
  <div
    @click="press = !press"
    :class="[isPress || press ? 'block-press' : '', 'block']"
  >
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "tag-select",
  props: {
    text: {
      type: String,
      default: "",
    },
    isPress: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      press: false,
    }
  },
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.block {
  cursor: pointer;
  margin: 0 4px;
  width: 60px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 10px;
  transition: all .2s ease-in;
  &.active {
    background: #7086b5;
    color: white;
  }
  &:hover {
    background: #7086b5;
    opacity: 0.8;
    color: white;
  }
}
.block-press {
  background: #7086b5;
  color: white;
}
</style>