import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'games',
      component: () => import('../views/Games.vue')
    },
    {
      path: '/games/:teamId/:gameId',
      name: 'gameBoard',
      component: () => import('../views/gameBoard.vue')
    },
    {
      path: '/guild/:teamId',
      name: 'Guild',
      component: () => import('../views/Guild.vue')
    },
    {
      path: '/leaderboards',
      name: 'leaderboards',
      component: () => import('../views/Leaderboards.vue')
    },
    {
      path: '/authResponse',
      name: 'authresponse',
      component: () => import('../views/AuthResponse.vue')
    },
    {
      path: '/FAQ',
      name: 'faq',
      component: () => import('../views/FAQ.vue')
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/Terms.vue')
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/Privacy.vue')
    }
  ]
})

export default router
