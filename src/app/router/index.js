import Vue from 'vue'
import login from '@/views/login/index'
import initialScript from '@/app/initial-script/index'
import vueSystem from '@/app/vue-system'
import sharedSpace from './modules/sharedSpace'
import message from './modules/message'
import process from './modules/process'
import strategy from './modules/strategy'
import systemManage from './modules/systemManage'
import { clone } from '../../utils/obj-operation'
Vue.use(vueSystem.router)

let defaultRouter = [
  ...sharedSpace,
  ...message,
  ...process,
  ...strategy,
  ...systemManage,
]
let listRouter
let refreshRouter = function () {
  listRouter = clone(defaultRouter)
  let routerAuth
  if (localStorage.getItem('menuList')) {
    routerAuth = JSON.parse(localStorage.getItem('menuList'))
  }
  if (routerAuth) {
    let setHidden = function (item) {
      if (routerAuth && !routerAuth.includes(item.id)) {
        item.hidden = true
      }
      if (item.children) {
        item.children.map((obj) => {
          setHidden(obj)
        })
      }
    }
    listRouter.map((item) => {
      setHidden(item)
    })
  }
}
refreshRouter()
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/frame/index.vue'),
    redirect: '/sharedSpace',
    children: [...listRouter],
  },
  {
    path: '/login',
    name: 'login',
    component: login,
  },
  {
    path: '*',
    name: 'error',
    component: () => import('@/views/error/index.vue'),
  },
]

const router = new vueSystem.router({
  mode: 'hash',
  routes,
})

router.registerInitScript(() => {
  return initialScript()
    .then(() => {
      console.log('挂载全局函数成功')
    })
    .catch((e) => {
      console.log('初始化全局script失败')
      console.log(e)
    })
})

router.beforeEach((to, from, next) => {
  // request.reqManage && request.reqManage.cancelRouterReq(from.path)
  if (from.path == '/login') {
    refreshRouter()
  }
  next()
})
export { listRouter }
export default router
