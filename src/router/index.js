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
    component: ViajesView,
    meta: { requiresAuth: true }
  },
  {
    path: '/reservas',
    name: 'reservas',
    component: ReservasView,
    meta: { requiresAuth: true }
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

// Guardia de navegación para proteger rutas
router.beforeEach((to, from, next) => {
  const savedUser = localStorage.getItem('uniride_user')
  const isLoggedIn = !!savedUser

  if (to.meta.requiresAuth && !isLoggedIn) {
    // Si intenta acceder a una ruta protegida sin iniciar sesión, redirige al login
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && isLoggedIn) {
    // Si ya está autenticado e intenta ir al login, llévalo a viajes
    next({ name: 'viajes' })
  } else {
    next()
  }
})

export default router
