export default [
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/message/index.vue'),
    meta: { title: '消息' },
  },
]
