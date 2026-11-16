<template>
  <div class="viaje-card card">
    <div class="viaje-header">
      <div class="route-display">
        <div class="route-point">
          <span class="point-dot origin-dot"></span>
          <span class="point-name">{{ viaje.origen }}</span>
        </div>
        <div class="route-arrow">➔</div>
        <div class="route-point">
          <span class="point-dot dest-dot"></span>
          <span class="point-name">{{ viaje.destino }}</span>
        </div>
      </div>

      <div class="vehicle-badge">
        <span>{{ viaje.tipo_vehiculo === 'moto' ? '🏍️ Moto' : '🚗 Carro' }}</span>
        <span v-if="viaje.placa_vehiculo" class="plate">{{ viaje.placa_vehiculo }}</span>
      </div>
    </div>

    <div class="viaje-details">
      <div class="detail-item">
        <span class="detail-label">Salida:</span>
        <span class="detail-value">🕒 {{ formatDateTime(viaje.fecha_hora_salida) }}</span>
      </div>

      <div class="detail-item">
        <span class="detail-label">Conductor:</span>
        <span class="detail-value">👤 {{ viaje.conductor_nombre || `Conductor #${viaje.conductor_id}` }}</span>
      </div>

      <div class="detail-item">
        <span class="detail-label">Aporte sugerido:</span>
        <span class="detail-value price">${{ formatCOP(viaje.aporte_sugerido) }} COP</span>
      </div>
    </div>

    <p v-if="viaje.descripcion_ruta" class="viaje-desc">
      📝 {{ viaje.descripcion_ruta }}
    </p>

    <div class="viaje-footer">
      <div class="seats-badge" :class="viaje.cupos_disponibles > 0 ? 'seats-available' : 'seats-empty'">
        <strong>{{ viaje.cupos_disponibles }}</strong> / {{ viaje.cupos_totales }} cupos disponibles
      </div>

      <button
        class="btn btn-primary"
        :disabled="viaje.cupos_disponibles <= 0"
        @click="$emit('reservar', viaje)"
      >
        <span v-if="viaje.cupos_disponibles > 0">Reservar Cupo</span>
        <span v-else>Agotado</span>
      </button>
    </div>

    <!-- Indicador de transparencia si el MS de Reservas está caído -->
    <div v-if="isReservasDown" class="card-transparency-note">
      ⚡ Catálogo visible con alta disponibilidad. (La reserva se bloqueará elegantemente hasta reactivar Reservas).
    </div>
  </div>
</template>

<script setup>
defineProps({
  viaje: {
    type: Object,
    required: true
  },
  isReservasDown: {
    type: Boolean,
    default: false
  }
})

defineEmits(['reservar'])

function formatDateTime(isoString) {
  if (!isoString) return 'Por confirmar'
  const date = new Date(isoString)
  return date.toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

function formatCOP(amount) {
  if (!amount && amount !== 0) return '0'
  return Number(amount).toLocaleString('es-CO')
}
</script>

<style scoped>
.viaje-card {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  border-left: 4px solid var(--primary);
  position: relative;
  overflow: hidden;
}

.viaje-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.route-display {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-weight: 600;
  font-size: 1.05rem;
  color: #0f172a;
}

.route-point {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.point-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.origin-dot {
  background: #3b82f6;
}

.dest-dot {
  background: #10b981;
}

.route-arrow {
  color: #94a3b8;
  font-size: 0.9rem;
}

.vehicle-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  background: #f1f5f9;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  color: #475569;
}

.plate {
  font-family: monospace;
  font-weight: 700;
  background: #e2e8f0;
  padding: 1px 4px;
  border-radius: 3px;
}

.viaje-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.5rem;
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-label {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
}

.detail-value {
  font-weight: 500;
  color: #1e293b;
}

.detail-value.price {
  color: #059669;
  font-weight: 700;
}

.viaje-desc {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.4;
}

.viaje-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border);
}

.seats-badge {
  font-size: 0.85rem;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
}

.seats-available {
  background: #dcfce7;
  color: #15803d;
}

.seats-empty {
  background: #fee2e2;
  color: #b91c1c;
}

.card-transparency-note {
  font-size: 0.72rem;
  background: #f0fdf4;
  color: #166534;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-sm);
  border: 1px dashed #86efac;
}
</style>
