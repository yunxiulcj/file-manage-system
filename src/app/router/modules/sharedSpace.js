export default [
  {
    path: '/sharedSpace',
    name: 'sharedSpace',
    id: 1,
    component: () => import('@/frame/components/currentModule.vue'),
    redirect: '/sharedSpace/soFile',
    meta: { title: '网盘' },
    children: [
      {
        path: '/sharedSpace/soFile',
        name: 'soFile',
        id: 101,
        component: () => import('@/views/sharedSpace/soFile.vue'),
        meta: { title: '所有文件', icon: 'soFile' },
      },
      // {
      //   path: '/sharedSpace/filePool',
      //   name: 'filePool',
      //   component: () => import('@/views/sharedSpace/filePool.vue'),
      //   meta: { title: '文件池', icon: 'filePool' },
      // },
      // {
      //   path: '/sharedSpace/inbox',
      //   name: 'inbox',
      //   component: () => import('@/views/sharedSpace/inbox.vue'),
      //   meta: { title: '收集箱', icon: 'inbox' },
      // },
      {
        path: '/sharedSpace/transferStop',
        name: 'transferStop',
        id: 102,
        component: () => import('@/views/sharedSpace/transferStop.vue'),
        meta: { title: '中转站', icon: 'transferStop' },
      },
      // {
      //   path: '/sharedSpace/sendLink',
      //   name: 'sendLink',
      //   component: () => import('@/views/sharedSpace/sendLink.vue'),
      //   meta: { title: '发出的链接', icon: 'sendLink' },
      // },
      // {
      //   path: '/sharedSpace/recycleBin',
      //   name: 'recycleBin',
      //   component: () => import('@/views/sharedSpace/recycleBin.vue'),
      //   meta: { title: '回收站', icon: 'recycleBin' },
      // },
    ],
  },
]
