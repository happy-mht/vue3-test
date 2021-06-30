<template>
  <router-view v-if="lastUpdateTime[page]" />
  <no-open :msg="msg" v-else />
</template>
<script>
import { mapGetters } from 'vuex'
import noOpen from '@/components/no-open'
export default {
  name: 'second-menu',
  components: { noOpen },
  computed: {
    ...mapGetters([
      'shop',
      'lastUpdateTime'
    ])
  },
  data() {
    return {
      page: 'unpurchased',
      msg: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        if (route.matched && route.matched[1]) {
          this.page = route.matched[1].name.split('_')[0]
          if (route.meta.parent[0] === 'scene_analysis') {
            this.$store.dispatch('scene/changeScene', this.page)
          }
        }
        if (route.matched && route.matched[1] && route.matched[1].meta) {
          const pageName = route.matched[1].meta.title
          this.msg = `该店铺尚未开通【${pageName}】场景`
        }
      },
      immediate: true
    },
    shop: {
      handler: async function() {
        try {
          if (this.$route.meta.parent[0] === 'scene_analysis') {
            await this.$store.dispatch('scene/changeScene', this.page)
          }
        } catch (e) {
          console.log(e)
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>