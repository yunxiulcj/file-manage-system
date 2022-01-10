export default [
  {
    path: '/process',
    name: 'process',
    component: () => import('@/frame/components/currentModule.vue'),
    redirect: '/process/myApplication',
    meta: {
      title: '流程',
    },
    children: [
      {
        path: '/process/myApplication',
        name: 'myApplication',
        component: () => import('@/views/process/myApplication.vue'),
        meta: {
          title: '我的申请',
          icon: 'myApplication',
        },
      },
      {
        path: '/process/myApproval',
        name: 'myApproval',
        component: () => import('@/views/process/myApproval.vue'),
        meta: {
          title: '我的审批',
          icon: 'myApproval',
        },
      },
      {
        path: '/process/approval',
        name: 'approval',
        component: () => import('@/views/process/approval.vue'),
        meta: {
          title: '审批详情',
          icon: 'approval',
        },
        hidden: true,
      },
    ],
  },
]
