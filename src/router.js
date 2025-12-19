import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
import Catalog from './views/Catalog.vue'
import ProductDetail from './views/ProductDetail.vue'
import Auth from './views/Auth.vue'
import Profile from './views/Profile.vue'
import NotFound from './views/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: Catalog
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/auth/telegram',
    name: 'AuthTelegram',
    component: Auth
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

