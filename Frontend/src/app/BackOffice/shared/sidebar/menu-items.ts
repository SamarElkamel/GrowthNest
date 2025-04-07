import { RouteInfo } from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
 
  {
    path: '/admin/dashboard',
    title: 'Dashboard',
    icon: 'bi bi-speedometer2',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/admin/orders',
    title: 'Orders',
    icon: 'bi bi-people',
    class: '',
    extralink: false,
    submenu: []
  },
  {
    path: '/admin/coupon',
    title: 'Coupons',
    icon: 'bi bi-people',
    class: '',
    extralink: false,
    submenu: []
  }
];
