import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import installElementPlus from './plugins/element'
import installTableEmpty from './plugins/table-empty'
import '@/assets/global.scss'
import '@/assets/element.scss'
import utils from '@/libs/global'
import permission from '@/directive/permission'

const app = createApp(App)
installElementPlus(app)
installTableEmpty(app)
app.config.globalProperties.$utils = utils
app.use(router).use(store).use(permission).mount('#app')