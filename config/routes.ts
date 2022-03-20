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
    name: '经营分析',
    icon: 'dashboard',
    component: './Welcome',
  },
  {
    path: '/exbilldetail/:number',
    component: '@/pages/ExBillDetail/[number]',
    name: '销售出库详情',
    exact: true,
    hideInMenu: true,
  },
  {
    path: '/inbilldetail/:number',
    name: '采购入库详情',
    component: '@/pages/InBillDetail/[number]',
    exact: true,
    hideInMenu: true,
  },
  {
    path: 'manager',
    name: '供应管理',
    icon: 'moneyCollect',
    routes: [
      {
        path: '/manager/exbill',
        name: '新增出库单',
        component: './ExBill',
      },
      {
        path: '/manager/inbill',
        name: '新增入库单',
        component: './InBill',
      },
    ],
  },
  {
    path: '/stock-table',
    name: '库存报表',
    icon: 'line-chart',
    routes: [
      {
        path: '/stock-table/exist',
        name: '现有库存',
        component: './ExistingStock',
      },
      {
        path: '/stock-table/ex',
        name: '销售出库明细表',
        component: './ExList',
      },
      {
        path: '/stock-table/in',
        name: '采购入库明细表',
        component: './InList',
      },
      {
        path: '/stock-table/list',
        name: '出入库明细',
        component: './IEList',
      },

    ],
  },
  {
    path: '/base',
    name: '基础设置',
    icon: 'setting',
    routes: [
      {
        path: '/base/product',
        name: '产品',
        component: './Product',
      },
      {
        path: '/base/custom',
        name: '客户',
        component: './Custom',
      },
      // {
      //   path: '/base/supplier',
      //   name: '供应商',
      //   component: './Supplier',
      // },
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
    name: '404'
  },
];
