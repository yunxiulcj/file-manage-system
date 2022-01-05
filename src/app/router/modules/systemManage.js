export default [
  {
    path: '/systemManage',
    name: 'systemManage',
    component: () => import('@/frame/components/currentModule.vue'),
    redirect: '/systemManage/cloudManage',
    meta: {
      title: '系统管理',
    },
    children: [
      // {
      //   path: '/systemManage/spaceManage',
      //   name: 'spaceManage',
      //   component: () => import('@/views/systemManage/spaceManage.vue'),
      //   meta: {
      //     title: '空间管理',
      //     icon: 'spaceManage',
      //   },
      // },
      {
        path: '/systemManage/cloudManage',
        name: 'cloudManage',
        component: () => import('@/views/systemManage/cloudManage.vue'),
        meta: {
          title: '网盘管理',
          icon: 'cloudManage',
        },
      },
      // {
      //   path: '/systemManage/security',
      //   name: 'security',
      //   component: () => import('@/views/systemManage/security.vue'),
      //   meta: {
      //     title: '安全',
      //     icon: 'security',
      //   },
      // },
      {
        path: '/systemManage/systemLog',
        name: 'systemLog',
        component: () => import('@/views/systemManage/systemLog.vue'),
        meta: {
          title: '系统日志',
          icon: 'systemLog',
        },
      },
      {
        path: '/systemManage/operatingRecord',
        name: 'operatingRecord',
        component: () => import('@/views/systemManage/operatingRecord.vue'),
        meta: {
          title: '文件操作记录',
          icon: 'operatingRecord',
        },
      },
      // {
      //   path: '/systemManage/approvalFlow',
      //   name: 'approvalFlow',
      //   component: () => import('@/views/systemManage/approvalFlow.vue'),
      //   meta: {
      //     title: '流程审批系统',
      //     icon: 'approvalFlow',
      //   },
      // },
      {
        path: '/systemManage/adminConfig',
        name: 'adminConfig',
        component: () => import('@/views/systemManage/adminConfig.vue'),
        meta: { title: '管理员配置', icon: 'adminConfig' },
      },
      {
        path: '/systemManage/emailConfig',
        name: 'emailConfig',
        component: () => import('@/views/systemManage/emailConfig.vue'),
        meta: {
          title: '邮件配置',
          icon: 'emailConfig',
        },
      },
      // {
      //   path: '/systemManage/storeFrontConfig',
      //   name: 'storeFrontConfig',
      //   component: () => import('@/views/systemManage/storeFrontConfig.vue'),
      //   meta: {
      //     title: 'StoreFront配置',
      //     icon: 'storeFrontConfig',
      //   },
      // },
    ],
  },
]
