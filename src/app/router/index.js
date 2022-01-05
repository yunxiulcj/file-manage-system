import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login/index'
import sharedSpace from './modules/sharedSpace'
import message from './modules/message'
import process from './modules/process'
import strategy from './modules/strategy'
import systemManage from './modules/systemManage'

Vue.use(VueRouter)

let defaultRouter = [
  ...sharedSpace,
  ...message,
  ...process,
  ...strategy,
  ...systemManage,
]
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/frame/index.vue'),
    redirect: '/sharedSpace',
    children: [...defaultRouter],
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

const router = new VueRouter({
  mode: 'history',
  routes,
})

export { defaultRouter }
export default router
