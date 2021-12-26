import Vue from 'vue'
import App from './App.vue'
import router from './app/router'
import store from './app/store'
import request from './app/api/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import promiseFinally from './utils/promise-finally'
import '@/assets/css/iconfont/iconfont.css'
import '@/assets/css/index.css'

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$http = request
promiseFinally()

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')

window.needReload = false
