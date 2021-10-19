export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/base',
    name: '基础设置',
    icon: 'crown',
    routes: [
      {
        path: '/base/custom',
        name: '客户',
        component: './Custom',
      },
      {
        path: '/base/supplier',
        name: '供应商',
        component: './Supplier',
      },
      {
        path: '/base/custom-level',
        name: '客户等级',
        component: './CustomLevel',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
