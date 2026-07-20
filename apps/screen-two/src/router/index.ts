import { createRouter, createWebHistory } from 'vue-router'
import { tokenStorage } from '@my-repo/hooks'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { public: true }
    },
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      redirect: '/home',
      children: [
        // —— 无侧栏 ——
        {
          path: 'home',
          name: 'Home',
          component: () => import('../views/home/index.vue')
        },
        {
          path: 'fund',
          name: 'Fund',
          component: () => import('../views/fund/index.vue')
        },
        {
          path: 'plate',
          name: 'Plate',
          component: () => import('../views/plate/index.vue')
        },

        // —— 有侧栏：指数 ——
        {
          path: 'index',
          component: () => import('../layouts/modules/IndexLayout.vue'),
          redirect: '/index/index-1', // 点顶栏「指数」默认进指数1
          children: [
            {
              path: 'index-1',
              name: 'Index1',
              component: () => import('../views/index/Index1.vue')
            },
            {
              path: 'index-2',
              name: 'Index2',
              component: () => import('../views/index/Index2.vue')
            },
            {
              path: 'v-shape',
              name: 'VShape',
              component: () => import('../views/index/VShape.vue')
            },
            {
              path: 'v-reverse',
              name: 'VReverse',
              component: () => import('../views/index/VReverse.vue')
            },
            {
              path: 'v-composite',
              name: 'VComposite',
              component: () => import('../views/index/VComposite.vue')
            },
            {
              path: 'intraday',
              name: 'Intraday',
              component: () => import('../views/index/Intraday.vue')
            }
          ]
        },

        {
          path: 'stock',
          name: 'Stock',
          component: () => import('../views/stock/index.vue')
        },
        {
          path: 'time',
          name: 'Time',
          component: () => import('../views/time/index.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to) => {
  const token = tokenStorage.get()
  if (to.meta.public) {
    if (token && to.name === 'Login') return { name: 'Home' }
    return true
  }
  if (to.meta.requiresAuth && !token) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
