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
    }
  ]
})

export default router
