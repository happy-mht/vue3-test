<template>
  <div class="content-wrapper" v-if="lastUpdateTime.unpurchased">
    <el-tabs v-model="activeName" :before-leave="handleBeforeLeave">
      <el-tab-pane label="基础信息" name="basic">
        <basic-info ref="basic" />
      </el-tab-pane>
      <el-tab-pane label="商品集方案" name="plan">
        <product-set-plan />
      </el-tab-pane>
    </el-tabs>
  </div>
  <no-open v-else msg="该店铺尚未开通【询单未购】场景" />
</template>

<script>
import { mapGetters } from 'vuex'
import noOpen from '@/components/no-open'
import BasicInfo from './basic-info.vue'
import ProductSetPlan from './product-set-plan.vue'

export default {
  name: 'inquiry_unpurchased_setting',
  components: { noOpen, BasicInfo, ProductSetPlan },
  data() {
    return {
      activeName: 'basic'
    }
  },
  computed: {
    ...mapGetters([
      'lastUpdateTime'
    ])
  },
  created() {
    this.$store.dispatch('scene/changeScene', 'unpurchased')
  },
  methods: {
    handleBeforeLeave(activeName) {
      if (activeName === 'basic') this.$refs.basic.getProjectList()
      return true
    }
  }
}
</script>