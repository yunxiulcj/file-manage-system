export default [
  {
    path: '/systemManage',
    name: 'systemManage',
    id: 5,
    component: () => import('@/frame/components/currentModule.vue'),
    redirect: '/systemManage/cloudManage',
    meta: {
      title: '系统管理',
    },
    children: [
      {
        path: '/systemManage/cloudManage',
        name: 'cloudManage',
        id: 501,
        component: () => import('@/views/systemManage/cloudManage.vue'),
        meta: {
          title: '网盘管理',
          icon: 'cloudManage',
        },
      },
      {
        path: '/systemManage/systemLog',
        name: 'systemLog',
        id: 502,
        component: () => import('@/views/systemManage/systemLog.vue'),
        meta: {
          title: '系统日志',
          icon: 'systemLog',
        },
      },
      {
        path: '/systemManage/operatingRecord',
        name: 'operatingRecord',
        id: 503,
        component: () => import('@/views/systemManage/operatingRecord.vue'),
        meta: {
          title: '文件操作记录',
          icon: 'operatingRecord',
        },
      },
      {
        path: '/systemManage/adminConfig',
        name: 'adminConfig',
        id: 504,
        component: () => import('@/views/systemManage/adminConfig.vue'),
        meta: { title: '管理员配置', icon: 'adminConfig' },
      },
      {
        path: '/systemManage/emailConfig',
        name: 'emailConfig',
        id: 505,
        component: () => import('@/views/systemManage/emailConfig.vue'),
        meta: {
          title: '邮件配置',
          icon: 'emailConfig',
        },
      },
    ],
  },
]
