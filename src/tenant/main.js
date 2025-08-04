import Vue from 'vue'
import { ToastPlugin, ModalPlugin, SidebarPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'
import VueExcelEditor from 'vue-excel-editor'

Vue.component('Tenant', require('./App.vue').default)

import router from './router'
import store from '../store'

// Global Components
import '../global-components'
import '../libs/filters'

// 3rd party plugins
import '@/libs/portal-vue'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import moment from "moment";

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)
Vue.use(SidebarPlugin)
// Composition API
Vue.use(VueCompositionAPI)
Vue.use(VueExcelEditor)

// import core styles
require('@core/scss/core.scss')

require('@core/scss/vue/libs/vue-good-table.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false

new Vue({
  router,
  store,
}).$mount('#tenant')
