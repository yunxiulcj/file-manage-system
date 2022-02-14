export default [
  {
    path: '/strategy',
    name: 'strategy',
    id: 4,
    component: () => import('@/frame/components/currentModule.vue'),
    redirect: '/strategy/approvalStrategy',
    meta: { title: '策略', i18nTitle: 'cs_menu.cs_9' },
    children: [
      {
        path: '/strategy/approvalStrategy',
        name: 'approvalStrategy',
        id: 401,
        component: () => import('@/views/strategy/approvalStrategy.vue'),
        meta: {
          title: '审批策略',
          icon: 'approvalStrategy',
          i18nTitle: 'cs_menu.cs_10',
        },
      },
      {
        path: '/strategy/securityStrategy',
        name: 'securityStrategy',
        id: 402,
        component: () => import('@/views/strategy/securityStrategy.vue'),
        meta: {
          title: '安全策略',
          icon: 'securityStrategy',
          i18nTitle: 'cs_menu.cs_11',
        },
      },
      {
        path: '/strategy/relation',
        name: 'relation',
        id: 403,
        component: () => import('@/views/strategy/relation.vue'),
        meta: {
          title: '审批关系',
          icon: 'relation',
          i18nTitle: 'cs_menu.cs_12',
        },
      },
    ],
  },
]
