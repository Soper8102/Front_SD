import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ViajesView from '../views/ViajesView.vue'
import ReservasView from '../views/ReservasView.vue'
import SimuladorView from '../views/SimuladorView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/viajes',
    name: 'viajes',
    component: ViajesView
  },
  {
    path: '/reservas',
    name: 'reservas',
    component: ReservasView
  },
  {
    path: '/simulador',
    name: 'simulador',
    component: SimuladorView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
