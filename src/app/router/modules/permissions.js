export default [
  {
    path: '/permissions',
    name: 'permissions',
    component: () => import('@/frame/components/currentModule.vue'),
    redirect: '/permissions/userManage',
    meta: { title: '权限' },
    children: [
      {
        path: '/permissions/userManage',
        name: 'userManage',
        component: () => import('@/views/permissions/userManage.vue'),
        meta: { title: '用户管理', icon: 'userManage' },
      },
      {
        path: '/permissions/adminConfig',
        name: 'adminConfig',
        component: () => import('@/views/permissions/adminConfig.vue'),
        meta: { title: '管理员配置', icon: 'adminConfig' },
      },
    ],
  },
]
