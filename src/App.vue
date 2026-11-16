<template>
  <div id="app-container">
    <!-- Monitor superior del Cluster Distribuido (API Gateway + 3 Microservicios) -->
    <SystemStatusBanner />

    <!-- Barra de Navegación Principal -->
    <nav class="navbar">
      <div class="navbar-brand">
        <router-link to="/" class="logo">
          <span class="logo-icon">🚗</span>
          <span class="logo-text">UniRide</span>
          <span class="logo-badge">Distribuido</span>
        </router-link>
      </div>

      <div class="navbar-menu">
        <router-link to="/viajes" class="nav-link">
          <span class="nav-icon">🗺️</span> Viajes
        </router-link>
        <router-link to="/reservas" class="nav-link">
          <span class="nav-icon">📋</span> Reservas
        </router-link>
        <router-link to="/simulador" class="nav-link">
          <span class="nav-icon">🧪</span> Simulador SD
        </router-link>

        <template v-if="authStore.isLoggedIn">
          <div class="nav-user">
            <span>{{ authStore.user?.es_conductor ? '🚗' : '🎓' }}</span>
            <span>{{ authStore.user?.nombre_completo }}</span>
          </div>
          <button class="btn-logout" @click="authStore.logout(); $router.push('/')">
            Salir
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link nav-link--accent">
            Iniciar Sesión
          </router-link>
        </template>
      </div>
    </nav>

    <!-- Contenido dinámico de las vistas -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Footer Informativo -->
    <footer class="footer">
      <p>UniRide © 2026 — Proyecto 4: Simulador de Sistemas Distribuidos con FastAPI, Docker y Vue.js</p>
    </footer>

    <!-- Notificaciones flotantes globales -->
    <NotificationToast />
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import SystemStatusBanner from './components/SystemStatusBanner.vue'
import NotificationToast from './components/NotificationToast.vue'

const authStore = useAuthStore()
</script>
