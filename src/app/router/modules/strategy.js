export default [
  {
    path: '/strategy',
    name: 'strategy',
    component: () => import('@/frame/components/currentModule.vue'),
    redirect: '/strategy/approvalStrategy',
    meta: { title: '策略' },
    children: [
      {
        path: '/strategy/approvalStrategy',
        name: 'approvalStrategy',
        component: () => import('@/views/strategy/approvalStrategy.vue'),
        meta: { title: '审批策略', icon: 'approvalStrategy' },
      },
      {
        path: '/strategy/securityStrategy',
        name: 'securityStrategy',
        component: () => import('@/views/strategy/securityStrategy.vue'),
        meta: { title: '安全策略', icon: 'securityStrategy' },
      },
    ],
  },
]
