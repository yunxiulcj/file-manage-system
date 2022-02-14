export default [
  {
    path: '/process',
    name: 'process',
    id: 3,
    component: () => import('@/frame/components/currentModule.vue'),
    redirect: '/process/myApplication',
    meta: {
      title: '流程',
      i18nTitle: 'cs_menu.cs_5',
    },
    children: [
      {
        path: '/process/myApplication',
        name: 'myApplication',
        id: 301,
        component: () => import('@/views/process/myApplication.vue'),
        meta: {
          title: '我的申请',
          icon: 'myApplication',
          i18nTitle: 'cs_menu.cs_6',
        },
      },
      {
        path: '/process/myApproval',
        name: 'myApproval',
        id: 302,
        component: () => import('@/views/process/myApproval.vue'),
        meta: {
          title: '我的审批',
          icon: 'myApproval',
          i18nTitle: 'cs_menu.cs_7',
        },
      },
      {
        path: '/process/approval',
        name: 'approval',
        component: () => import('@/views/process/approval.vue'),
        meta: {
          title: '审批详情',
          icon: 'approval',
          i18nTitle: 'cs_menu.cs_8',
        },
        hidden: true,
      },
      {
        path: '/process/newOrEditApply',
        name: 'newOrEditApply',
        component: () => import('@/components/newOrEditApply.vue'),
        meta: {
          title: '新建或编辑申请',
          icon: 'fileDownload',
          i18nTitle: 'cs_menu.',
        },
        hidden: true,
      },
    ],
  },
]
