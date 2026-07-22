import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('../views/home/index.vue')
        },
        {
          path: 'fund',
          component: () => import('../layouts/modules/FundLayout.vue'),
          redirect: '/fund/main-force',
          children: [
            {
              path: 'main-force',
              name: 'FundMainForce',
              component: () => import('../views/fund/MainForce.vue')
            },
            {
              path: 'northbound',
              name: 'FundNorthbound',
              component: () => import('../views/fund/Northbound.vue')
            },
            {
              path: 'ratio',
              name: 'FundRatio',
              component: () => import('../views/fund/Ratio.vue')
            },
            {
              path: 'market-share',
              name: 'FundMarketShare',
              component: () => import('../views/fund/MarketShare.vue')
            },
            {
              path: 'index-fund',
              name: 'FundIndexFund',
              component: () => import('../views/fund/IndexFund.vue')
            },
            {
              path: 'estimate',
              name: 'FundEstimate',
              component: () => import('../views/fund/Estimate.vue')
            },
            {
              path: 'flow',
              name: 'FundFlow',
              component: () => import('../views/fund/Flow.vue')
            }
          ]
        },
        {
          path: 'index',
          name: 'Index',
          component: () => import('../views/index/index.vue')
        },
        {
          path: 'plate',
          name: 'Plate',
          component: () => import('../views/plate/index.vue')
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

export default router
