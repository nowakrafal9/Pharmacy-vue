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
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/productBrowser',
    name: 'productBrowser',
    component: () => import('../views/ProductBrowserView.vue')
  },
  {
    path: '/orderBrowser',
    name: 'orderBrowser',
    component: () => import('../views/OrderBrowserView.vue')
  },
  {
    path: '/orderCreate',
    name: 'orderCreate',
    component: () => import('../views/OrderCreateView.vue')
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