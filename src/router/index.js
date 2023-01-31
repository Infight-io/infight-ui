import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/games',
      name: 'games',
      component: () => import('../views/Games.vue')
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
    }
  ]
})

export default router
