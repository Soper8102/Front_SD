<template>
  <div class="viajes-view">
    <!-- Switcher de Usuario para facilidad de pruebas -->
    <UserSwitcher />

    <div class="page-header">
      <div>
        <h2 class="page-title">Catálogo de Viajes Universitarios</h2>
        <p class="page-subtitle">Explora rutas disponibles entre sedes de UNIMINUTO y la ciudad</p>
      </div>
      <button class="btn btn-primary" @click="showCrearModal = true">
        + Publicar Viaje
      </button>
    </div>

    <!-- Filtros de búsqueda -->
    <ViajeFilter
      :filtros="viajesStore.filtros"
      @update:filtros="handleUpdateFiltros"
      @reset="viajesStore.limpiarFiltros"
      @crear="showCrearModal = true"
    />

    <!-- Estado de carga -->
    <div v-if="viajesStore.loading" class="loading-state card">
      <div class="spinner"></div>
      <p>Consultando el Microservicio de Viajes vía API Gateway...</p>
    </div>

    <!-- Error al consultar -->
    <div v-else-if="viajesStore.error" class="error-state card">
      <div class="state-icon">⚠️</div>
      <h3>No se pudo cargar el catálogo de viajes</h3>
      <p>{{ viajesStore.error }}</p>
      <button class="btn btn-secondary" @click="viajesStore.fetchViajes">Reintentar</button>
    </div>

    <!-- Lista de Viajes -->
    <div v-else-if="viajesStore.viajes.length > 0" class="viajes-grid">
      <ViajeCard
        v-for="viaje in viajesStore.viajes"
        :key="viaje.id"
        :viaje="viaje"
        :is-reservas-down="statusStore.isReservasDown"
        @reservar="abrirModalReserva"
      />
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state card">
      <div class="state-icon">🚌</div>
      <h3>No hay viajes registrados</h3>
      <p>Sé el primero en compartir tu vehículo para la comunidad universitaria.</p>
      <button class="btn btn-primary" @click="showCrearModal = true">
        Publicar el Primer Viaje
      </button>
    </div>

    <!-- Modales -->
    <CrearViajeModal
      v-if="showCrearModal"
      @close="showCrearModal = false"
      @created="viajesStore.fetchViajes"
    />

    <CrearReservaModal
      v-if="showReservaModal && selectedViaje"
      :viaje="selectedViaje"
      @close="showReservaModal = false"
      @reserved="handleReservaCreada"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useViajesStore } from '../stores/viajes'
import { useSystemStatusStore } from '../stores/systemStatus'
import UserSwitcher from '../components/usuarios/UserSwitcher.vue'
import ViajeFilter from '../components/viajes/ViajeFilter.vue'
import ViajeCard from '../components/viajes/ViajeCard.vue'
import CrearViajeModal from '../components/viajes/CrearViajeModal.vue'
import CrearReservaModal from '../components/reservas/CrearReservaModal.vue'

const router = useRouter()
const viajesStore = useViajesStore()
const statusStore = useSystemStatusStore()

const showCrearModal = ref(false)
const showReservaModal = ref(false)
const selectedViaje = ref(null)

function handleUpdateFiltros(newFiltros) {
  viajesStore.filtros.origen = newFiltros.origen
  viajesStore.filtros.destino = newFiltros.destino
  viajesStore.filtros.tipo_vehiculo = newFiltros.tipo_vehiculo
  viajesStore.fetchViajes()
}

function abrirModalReserva(viaje) {
  selectedViaje.value = viaje
  showReservaModal.value = true
}

function handleReservaCreada() {
  showReservaModal.value = false
  // Opcional: navegar a mis reservas
  router.push('/reservas')
}

onMounted(() => {
  viajesStore.fetchViajes()
})
</script>

<style scoped>
.viajes-view {
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

.viajes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
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
