<template>
  <div class="reservas-view">
    <div class="page-header">
      <div>
        <h2 class="page-title">Gestión de Reservas</h2>
        <p class="page-subtitle">
          Reservas registradas para <strong>{{ authStore.user?.nombre_completo || 'Usuario Activo' }}</strong>
        </p>
      </div>

      <div class="header-actions">
        <button
          class="btn btn-secondary"
          @click="reservasStore.fetchReservas(authStore.user?.id)"
          :disabled="reservasStore.loading"
        >
          🔄 Refrescar
        </button>
        <router-link to="/viajes" class="btn btn-primary">
          + Reservar en un Viaje
        </router-link>
      </div>
    </div>

    <!-- Alerta cuando el MS Reservas está caído -->
    <div v-if="statusStore.isReservasDown" class="reservas-offline-banner card">
      <div class="banner-icon">⚡</div>
      <div class="banner-text">
        <h4>Microservicio de Reservas no disponible (Escenario B)</h4>
        <p>
          El contenedor <code>ms_reservas</code> está inactivo o desconectado. El API Gateway responderá
          con <strong>HTTP 503</strong> a cualquier intento de crear o modificar reservas, mientras que los viajes siguen funcionando fluidamente.
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="reservasStore.loading" class="loading-state card">
      <div class="spinner"></div>
      <p>Cargando reservas desde PostgreSQL (MS Reservas :5434)...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="reservasStore.error" class="error-state card">
      <div class="state-icon">❌</div>
      <h3>Error al consultar reservas</h3>
      <p>{{ reservasStore.error }}</p>
      <button class="btn btn-secondary" @click="reservasStore.fetchReservas(authStore.user?.id)">Reintentar</button>
    </div>

    <!-- Lista de Reservas -->
    <div v-else-if="reservasStore.reservas.length > 0" class="reservas-list">
      <ReservaCard
        v-for="reserva in reservasStore.reservas"
        :key="reserva.id"
        :reserva="reserva"
        @cancelar="handleCancelar"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state card">
      <div class="state-icon">📋</div>
      <h3>No tienes reservas activas</h3>
      <p>Explora los viajes disponibles y aparta tu cupo hacia o desde la universidad.</p>
      <router-link to="/viajes" class="btn btn-primary">
        Ver Catálogo de Viajes
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useReservasStore } from '../stores/reservas'
import { useSystemStatusStore } from '../stores/systemStatus'
import ReservaCard from '../components/reservas/ReservaCard.vue'

const authStore = useAuthStore()
const reservasStore = useReservasStore()
const statusStore = useSystemStatusStore()

function handleCancelar(id) {
  reservasStore.cancelarReserva(id, authStore.user?.id)
}

watch(() => authStore.user?.id, (newId) => {
  reservasStore.fetchReservas(newId)
})

onMounted(() => {
  reservasStore.fetchReservas(authStore.user?.id)
})
</script>

<style scoped>
.reservas-view {
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.page-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin-top: 0.2rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.reservas-offline-banner {
  background: #fffbeb;
  border-left: 4px solid #f59e0b;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.banner-icon {
  font-size: 1.5rem;
}

.banner-text h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.25rem;
}

.banner-text p {
  font-size: 0.85rem;
  color: #b45309;
  line-height: 1.4;
}

.reservas-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 3.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.state-icon {
  font-size: 2.5rem;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
