<template>
  <div class="reserva-card card">
    <div class="reserva-header">
      <div class="reserva-id-group">
        <span class="reserva-badge-id">Reserva #{{ reserva.id }}</span>
        <span class="badge" :class="getEstadoBadgeClass(reserva.estado)">
          {{ reserva.estado }}
        </span>
      </div>

      <div class="reserva-date">
        Registrada: {{ formatDateTime(reserva.created_at || reserva.fecha_reserva) }}
      </div>
    </div>

    <div class="reserva-body">
      <div class="reserva-route">
        <strong>{{ reserva.origen_viaje || `Viaje #${reserva.viaje_id}` }}</strong>
        <span v-if="reserva.destino_viaje">➔</span>
        <strong v-if="reserva.destino_viaje">{{ reserva.destino_viaje }}</strong>
      </div>

      <div class="reserva-info-grid">
        <div class="info-block">
          <span class="info-label">Cupos Reservados:</span>
          <span class="info-value">🎟️ {{ reserva.cupos_reservados }} cupo(s)</span>
        </div>

        <div class="info-block">
          <span class="info-label">Aporte Acordado:</span>
          <span class="info-value price">${{ formatCOP(reserva.aporte_acordado) }} COP</span>
        </div>

        <div class="info-block" v-if="reserva.conductor_nombre">
          <span class="info-label">Conductor:</span>
          <span class="info-value">👤 {{ reserva.conductor_nombre }}</span>
        </div>

        <div class="info-block" v-if="reserva.punto_encuentro">
          <span class="info-label">Punto de Encuentro:</span>
          <span class="info-value">📍 {{ reserva.punto_encuentro }}</span>
        </div>
      </div>

      <p v-if="reserva.comentarios" class="reserva-comments">
        💬 "{{ reserva.comentarios }}"
      </p>
    </div>

    <div class="reserva-footer">
      <div class="reserva-driver-hint">
        ID Viaje Asociado: <strong>#{{ reserva.viaje_id }}</strong>
      </div>

      <div class="reserva-actions">
        <button
          v-if="reserva.estado === 'CONFIRMADA'"
          class="btn btn-danger btn-sm"
          :disabled="loading"
          @click="confirmarCancelacion"
        >
          Cancelar Reserva
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  reserva: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['cancelar', 'ver-detalle'])
const loading = ref(false)

function getEstadoBadgeClass(estado) {
  if (estado === 'CONFIRMADA') return 'badge-online'
  if (estado === 'CANCELADA') return 'badge-offline'
  return 'badge-degradado'
}

function formatDateTime(isoString) {
  if (!isoString) return 'N/A'
  const date = new Date(isoString)
  return date.toLocaleString('es-CO', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

function formatCOP(val) {
  if (!val && val !== 0) return '0'
  return Number(val).toLocaleString('es-CO')
}

function confirmarCancelacion() {
  if (confirm(`¿Estás seguro de cancelar la Reserva #${props.reserva.id}? Los cupos serán restituidos en el MS de Viajes automáticamente.`)) {
    emit('cancelar', props.reserva.id)
  }
}
</script>

<style scoped>
.reserva-card {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  border-left: 4px solid #10b981;
}

.reserva-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.reserva-id-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reserva-badge-id {
  font-weight: 700;
  font-size: 0.95rem;
  color: #0f172a;
}

.reserva-date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.reserva-route {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.reserva-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
}

.info-block {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
}

.info-value {
  font-weight: 500;
  color: #1e293b;
}

.info-value.price {
  color: #059669;
  font-weight: 700;
}

.reserva-comments {
  font-size: 0.8rem;
  color: #64748b;
  font-style: italic;
  margin-top: 0.4rem;
}

.reserva-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border);
}

.reserva-driver-hint {
  font-size: 0.75rem;
  color: #64748b;
}

.btn-sm {
  padding: 0.3rem 0.75rem;
  font-size: 0.8rem;
}
</style>
