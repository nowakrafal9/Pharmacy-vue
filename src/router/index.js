import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/userBrowser',
    name: 'userBrowser',
    component: () => import('../views/UserBrowserView.vue')
  },
  {
    path: '/userCreate',
    name: 'userCreate',
    component: () => import('../views/UserCreateView.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router