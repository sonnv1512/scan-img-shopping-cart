import Vue from 'vue'
import Router from 'vue-router'
import UserLevel from '@/class/UserLevel'
import { getUserInfo } from '@/utils/auth'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/trade',
    component: Layout,
    redirect: '/trade',
    children: [{
      path: 'trade',
      name: 'Trade',
      component: () => import('@/views/trade/index'),
      meta: {
        title: 'Đăng ký BH',
        icon: 'el-icon-c-scale-to-original',
        permission: []
      }
    }],
    hidden: false
  },
  {
    path: '/noti',
    component: Layout,
    redirect: '/noti',
    children: [{
      path: 'noti',
      name: 'Notification',
      component: () => import('@/views/noti/index'),
      meta: {
        title: 'Thông báo',
        icon: 'el-icon-bell',
        permission: []
      }
    }],
    hidden: false
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: 'Trang chủ',
        icon: 'dashboard',
        permission: []
      }
    }],
    hidden: false
  },
  {
    path: '/approvement',
    component: Layout,
    permission: [UserLevel.staff, UserLevel.employee],
    children: [
      {
        path: 'approvement',
        name: 'Approvement',
        component: () => import('@/views/approvement/index'),
        meta: {
          title: 'Phê duyệt yêu cầu',
          icon: 'el-icon-guide',
          permission: [UserLevel.staff, UserLevel.employee]
        }
      }
    ],
    hidden: true
  },
  {
    path: '/user',
    component: Layout,
    permission: [UserLevel.admin, UserLevel.staff],
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: {
          title: 'Quản lý tài khoản',
          icon: 'el-icon-user',
          permission: [UserLevel.admin, UserLevel.staff]
        }
      }
    ],
    hidden: true
  },
  {
    path: '/point',
    component: Layout,
    permission: [],
    children: [
      {
        path: 'point',
        name: 'Point',
        component: () => import('@/views/point/index'),
        meta: {
          title: 'Khai báo điểm',
          icon: 'el-icon-location-outline',
          permission: []
        }
      }
    ],
    hidden: true
  },
  {
    path: '/history',
    component: Layout,
    permission: [UserLevel.admin, UserLevel.staff, UserLevel.employee],
    children: [
      {
        path: 'history',
        name: 'History',
        component: () => import('@/views/history/index'),
        meta: {
          title: 'Lịch sử phê duyệt',
          icon: 'el-icon-document',
          permission: [UserLevel.admin, UserLevel.staff, UserLevel.employee]
        }
      }
    ],
    hidden: true
  },
  {
    path: '/route',
    component: Layout,
    redirect: '/route/route',
    permission: [UserLevel.admin, UserLevel.staff, UserLevel.employee],
    meta: { title: 'Luồng xanh', icon: 'el-icon-rank' },
    children: [
      {
        path: 'route',
        name: 'Route',
        component: () => import('@/views/route/ManageSimpleRoute'),
        meta: {
          title: 'Quản lý luồng',
          icon: 'el-icon-plus',
          permission: [UserLevel.admin, UserLevel.staff, UserLevel.employee]
        }
      },
      {
        path: 'addRoute',
        name: 'AddRoute',
        component: () => import('@/views/route/SimpleRoute'),
        meta: {
          title: 'Tạo luồng',
          icon: 'el-icon-plus',
          permission: [UserLevel.admin, UserLevel.staff, UserLevel.employee]
        }
      }
    ],
    hidden: true
  },
  {
    path: '/reportTotal',
    component: Layout,
    redirect: '/report/reportApprovement',
    permission: [UserLevel.admin],
    children: [
      {
        path: 'reportTotal',
        name: 'ReportTotal',
        component: () => import('@/views/report/reportTotal'),
        meta: {
          title: 'Báo cáo Tổng cục',
          icon: 'el-icon-s-management',
          permission: [UserLevel.admin]
        }
      }
    ],
    hidden: true
  },
  {
    path: '/reportDivision',
    component: Layout,
    redirect: '/report/reportApprovement',
    permission: [UserLevel.staff, UserLevel.employee],
    children: [
      {
        path: 'reportDivision',
        name: 'ReportDivision',
        component: () => import('@/views/report/reportTotal'),
        meta: {
          title: 'Báo cáo Cấp cục',
          icon: 'el-icon-s-management',
          permission: [UserLevel.staff, UserLevel.employee]
        }
      }
    ],
    hidden: true
  },
  {
    path: '/tranferApprovement',
    component: Layout,
    permission: [UserLevel.admin],
    children: [
      {
        path: 'tranferApprovement',
        name: 'TranferApprovement',
        component: () => import('@/views/tranferApprovement/index'),
        meta: {
          title: 'Điều chuyển phân tải',
          icon: 'el-icon-sort',
          permission: [UserLevel.admin]
        }
      }
    ],
    hidden: true
  },
  {
    path: '/changeInfo',
    component: Layout,
    permission: [],
    children: [
      {
        path: 'changePassword',
        name: 'ChangePassword',
        component: () => import('@/views/user/changePassword'),
        meta: {
          title: 'Đổi mật khẩu',
          icon: 'el-icon-location-outline',
          permission: []
        }
      }
    ],
    hidden: true
  },
  // out of meta
  {
    path: '/importFile',
    component: Layout,
    permission: [],
    children: [
      {
        path: 'importFile',
        name: 'ImportFile',
        component: () => import('@/views/importFile/index'),
        meta: {
          title: 'Import Dữ liệu',
          icon: 'el-icon-location-outline',
          permission: []
        }
      }
    ],
    hidden: true
  },
  {
    path: '/changeVersion',
    component: Layout,
    permission: [],
    children: [
      {
        path: 'changeVersion',
        name: 'ChangeVersion',
        component: () => import('@/views/changeVersion/index'),
        meta: {
          title: 'Đổi version',
          icon: 'el-icon-location-outline',
          permission: []
        }
      }
    ],
    hidden: true
  },
  {
    path: '/approvementAuto',
    component: Layout,
    permission: [UserLevel.admin],
    children: [
      {
        path: 'approvementAuto',
        name: 'ApprovementAuto',
        component: () => import('@/views/approvement/approvementAuto'),
        meta: {
          title: 'Phê duyệt tự động',
          icon: 'el-icon-video-play',
          permission: [UserLevel.admin]
        }
      }
    ],
    hidden: true
  },
  // {
  //   path: '/report',
  //   component: Layout,
  //   redirect: '/report/reportApprovement',
  //   permission: [],
  //   meta: { title: 'Báo cáo cấp tỉnh', icon: 'el-icon-pie-chart' },
  //   children: [
  //     {
  //       path: 'reportApprovement',
  //       name: 'ReportApprovement',
  //       component: () => import('@/views/report/index'),
  //       meta: {
  //         title: 'Thống kê yêu cầu',
  //         icon: 'el-icon-plus',
  //         permission: []
  //       }
  //     },
  //     {
  //       path: 'reportApprovement2',
  //       name: 'ReportApprovement2',
  //       component: () => import('@/views/report/index'),
  //       meta: {
  //         title: 'Năng lực hành chính',
  //         icon: 'el-icon-plus',
  //         permission: []
  //       }
  //     }
  //   ],
  //   hidden: true
  // },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ],
    hidden: true
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ],
    hidden: true
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        name: 'Menu2',
        meta: { title: 'menu2' }
      }
    ],
    hidden: true
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://thumbs.gfycat.com/AcceptableJoyfulInganue-size_restricted.gif?imageView2/1/w/80/h/80',
        meta: { title: 'External Link', icon: 'link' }
      }
    ],
    hidden: true
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// router.beforeEach((to, from, next) => {
//   const userInfo = getUserInfo()
//   const userType = userInfo ? 1 : -1
//   const ListPermission = to.meta.permission
//   if (!ListPermission || ListPermission.length === 0) {
//     next()
//     return
//   }

//   const hasPermission = ListPermission.includes(userType) || userType === UserLevel.superAdmin
//   if (hasPermission) {
//     next()
//   } else {
//     next({ name: '404' })
//   }
// })

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
