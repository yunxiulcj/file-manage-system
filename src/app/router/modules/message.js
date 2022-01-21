export default [
  {
    path: '/message',
    name: 'message',
    id: 2,
    component: () => import('@/views/message/index.vue'),
    meta: { title: '消息' },
  },
]
