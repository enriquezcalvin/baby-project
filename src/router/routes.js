
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      { path: '', component: () => import('pages/index') }
    ]
  },

  {
    path: '/baby',
    component: () => import('layouts/default'),
    children: [
      {
        path: '',
        component: () => import('pages/baby'),
        children: [
          {
            path: '',
            component: () => import('pages/baby/feeding')
          }
        ]
      },
      {
        path: 'output',
        component: () => import('pages/baby'),
        children: [
          {
            path: '',
            component: () => import('pages/baby/output')
          }
        ]
      }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
