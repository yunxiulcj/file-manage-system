export default [
  {
    path: '/message',
    name: 'message',
    id: 2,
    component: () => import('@/views/message/index.vue'),
    meta: { title: '消息', i18nTitle: 'cs_menu.cs_1' },
  },
]
