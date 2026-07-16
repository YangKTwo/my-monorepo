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
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/Dashboard.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to) => {
  const token = tokenStorage.get()
  if (to.meta.public) {
    if (token && to.name === 'Login') return { name: 'Dashboard' }
    return true
  }

  if (to.meta.requiresAuth && !token) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  return true
})

export default router
