export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', routes: [{ name: '登录', path: '/user/login', component: './user/Login' }] },
      { component: './404' },
    ],
  },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  { path: '/exbilldetail/:number', component: '@/pages/ExBillDetail' },
  { path: '/inbilldetail/:number', component: '@/pages/InBillDetail' },
  {
    path: 'manager',
    icon: 'moneyCollect',
    routes: [
      { path: '/manager/exbill', component: './ExBill' },
      { path: '/manager/inbill', component: './InBill' },
      { path: '/manager/ex', component: './ExList' },
      { path: '/manager/in', component: './InList' },
    ],
  },
  {
    path: '/base',
    icon: 'setting',
    routes: [
      { path: '/base/custom', component: './Custom' },
      { path: '/base/supplier', component: './Supplier' },
      { path: '/base/custom-level', component: './CustomLevel' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { component: './404' },
];
