<template>
  <span :class="classes" @click="onClick">{{ text }}</span>
</template>

<script>
export default {
  props: {
    text: {
      type: [String, Number],
      default: "",
      required: true
    },
    font: {
      type: String,
      default: "main",
      validator: function (value) {
        return ['h1', 'h2', 'main', 'assist', 'link'].indexOf(value) !== -1
      },
    },
  },
  computed: {
    classes() {
      return {
        "cdl-text": true,
        [`cdl-text-${this.font}`]: true,
      }
    },
  },
  methods: {
    onClick(){
      this.font === "link" && this.$emit('onClick')
    }
  }
}
</script>

<style lang="scss">
.cdl-text {
  font-family: PingFangSC-Medium, PingFang SC;
  @mixin textHandle($fz, $fw, $fc) {
    font-size: $fz;
    font-weight: $fw;
    color: $fc;
    text-shadow: 0px 0px 4px rgba(228, 228, 228, 0.5);
  }
  &-h1 {
    @include textHandle(18px, 600, #353c47);
  }
  &-h2 {
    @include textHandle(14px, 600, #353c47);
  }
  &-main {
    @include textHandle(12px, 500, #353c47);
  }
  &-assist {
    @include textHandle(12px, 500, #bdc2c8);
  }
  &-link {
    @include textHandle(12px, 500, #ff74ac);
    &:hover{
      cursor: pointer;
      text-decoration: underline;
    }
  }
}
</style>
