export default [
  {
    path: '/sharedSpace',
    name: 'sharedSpace',
    id: 1,
    component: () => import('@/frame/components/currentModule.vue'),
    redirect: '/sharedSpace/soFile',
    meta: { title: '网盘', i18nTitle: 'cs_menu.cs_2' },
    children: [
      {
        path: '/sharedSpace/soFile',
        name: 'soFile',
        id: 101,
        component: () => import('@/views/sharedSpace/soFile.vue'),
        meta: { title: '所有文件', icon: 'soFile', i18nTitle: 'cs_menu.cs_3' },
      },
      {
        path: '/sharedSpace/transferStop',
        name: 'transferStop',
        id: 102,
        component: () => import('@/views/sharedSpace/transferStop.vue'),
        meta: {
          title: '中转站',
          icon: 'transferStop',
          i18nTitle: 'cs_menu.cs_4',
        },
      },
    ],
  },
]
