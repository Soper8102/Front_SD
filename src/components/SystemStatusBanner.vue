<template>
  <div class="system-status-container">
    <!-- Barra superior con el estado de cada nodo -->
    <div class="status-bar">
      <div class="status-left">
        <span class="status-title">
          <span class="pulse-indicator" :class="{ 'pulse-active': statusStore.gateway === 'OPERATIVO' }"></span>
          Estado del Cluster Distribuido
        </span>
      </div>

      <div class="services-indicators">
        <!-- API Gateway -->
        <div class="service-pill" :class="getServiceClass(statusStore.gateway)">
          <span class="service-icon">🌐</span>
          <span class="service-name">Gateway :8000</span>
          <span class="service-state">{{ statusStore.gateway }}</span>
        </div>

        <!-- MS Usuarios -->
        <div class="service-pill" :class="getServiceClass(statusStore.microservicios.usuarios)">
          <span class="service-icon">👤</span>
          <span class="service-name">Usuarios :8001</span>
          <span class="service-state">{{ statusStore.microservicios.usuarios }}</span>
        </div>

        <!-- MS Viajes -->
        <div class="service-pill" :class="getServiceClass(statusStore.microservicios.viajes)">
          <span class="service-icon">🚌</span>
          <span class="service-name">Viajes :8002</span>
          <span class="service-state">{{ statusStore.microservicios.viajes }}</span>
        </div>

        <!-- MS Reservas -->
        <div class="service-pill" :class="getServiceClass(statusStore.microservicios.reservas)">
          <span class="service-icon">📋</span>
          <span class="service-name">Reservas :8003</span>
          <span class="service-state">{{ statusStore.microservicios.reservas }}</span>
        </div>
      </div>

      <div class="status-actions">
        <button
          class="btn-ping"
          @click="statusStore.checkHealth(false)"
          :disabled="statusStore.loading"
          title="Verificar salud de todos los microservicios"
        >
          <span :class="{ 'spin-icon': statusStore.loading }">🔄</span>
          {{ statusStore.loading ? 'Pinging...' : 'Probar Conexión' }}
        </button>
      </div>
    </div>

    <!-- Banner de Alerta Transparente cuando MS Reservas está caído (Escenario B) -->
    <transition name="fade">
      <div v-if="statusStore.isReservasDown" class="degraded-alert">
        <div class="alert-icon">⚡</div>
        <div class="alert-content">
          <strong>Transparencia del Sistema Distribuido Activa (Escenario B):</strong>
          <span>
            El <strong>Microservicio de Reservas (8003)</strong> no responde. Sin embargo, gracias a la arquitectura desacoplada y la resiliencia del API Gateway,
            <strong>puedes seguir consultando el catálogo de viajes con normalidad y total transparencia</strong>.
          </span>
        </div>
      </div>
    </transition>

    <!-- Banner de Alerta cuando MS Viajes está caído -->
    <transition name="fade">
      <div v-if="statusStore.isViajesDown" class="degraded-alert alert-warning">
        <div class="alert-icon">⚠️</div>
        <div class="alert-content">
          <strong>Microservicio de Viajes Inaccesible:</strong>
          <span>El catálogo de viajes no está disponible temporalmente. Si tienes reservas previas, puedes consultarlas en modo degradado.</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useSystemStatusStore } from '../stores/systemStatus'

const statusStore = useSystemStatusStore()

function getServiceClass(state) {
  if (state === 'ONLINE' || state === 'OPERATIVO') return 'state-online'
  if (state === 'OFFLINE') return 'state-offline'
  if (state === 'DEGRADADO') return 'state-degraded'
  return 'state-unknown'
}

onMounted(() => {
  statusStore.startAutoPolling(6000)
})

onUnmounted(() => {
  statusStore.stopAutoPolling()
})
</script>

<style scoped>
.system-status-container {
  width: 100%;
  border-bottom: 1px solid #1e293b;
  background: #0f172a;
  color: #f8fafc;
}

.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.8rem;
}

.status-left {
  display: flex;
  align-items: center;
}

.status-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: #94a3b8;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.pulse-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
}

.pulse-active {
  background: #22c55e;
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  animation: pulse 1.8s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.services-indicators {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.service-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: #1e293b;
  border: 1px solid #334155;
  font-size: 0.75rem;
}

.service-icon {
  font-size: 0.8rem;
}

.service-name {
  color: #cbd5e1;
}

.service-state {
  font-weight: 700;
  font-size: 0.68rem;
  padding: 1px 5px;
  border-radius: 4px;
}

.state-online .service-state {
  background: #064e3b;
  color: #34d399;
}

.state-offline .service-state {
  background: #7f1d1d;
  color: #f87171;
}

.state-degraded .service-state {
  background: #78350f;
  color: #fbbf24;
}

.state-unknown .service-state {
  background: #334155;
  color: #94a3b8;
}

.btn-ping {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #1e293b;
  color: #cbd5e1;
  border: 1px solid #334155;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ping:hover:not(:disabled) {
  background: #334155;
  color: #ffffff;
}

.spin-icon {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

/* Degraded Alert Banner */
.degraded-alert {
  background: linear-gradient(90deg, #1e1b4b 0%, #312e81 100%);
  border-top: 1px solid #4338ca;
  padding: 0.65rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #e0e7ff;
  font-size: 0.85rem;
}

.degraded-alert.alert-warning {
  background: linear-gradient(90deg, #451a03 0%, #78350f 100%);
  border-top: 1px solid #b45309;
  color: #fef3c7;
}

.alert-icon {
  font-size: 1.25rem;
}

.alert-content strong {
  margin-right: 0.35rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
