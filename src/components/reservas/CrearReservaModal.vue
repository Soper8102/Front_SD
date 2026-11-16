<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>📋 Confirmar Reserva de Cupo</h3>
        <button class="modal-close" @click="$emit('close')">&times;</button>
      </div>

      <!-- Alerta especial si el Gateway respondió 503 (Escenario B) -->
      <div v-if="fallbackAlert" class="modal-fallback-alert">
        <div class="alert-icon">⚡</div>
        <div>
          <strong>Demostración de Tolerancia a Fallos (Escenario B):</strong>
          <p>{{ fallbackAlert }}</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="modal-body">
          <!-- Resumen del Viaje -->
          <div class="trip-summary">
            <div class="summary-route">
              <strong>{{ viaje.origen }}</strong>
              <span>➔</span>
              <strong>{{ viaje.destino }}</strong>
            </div>
            <div class="summary-details">
              <span>👤 Conductor: {{ viaje.conductor_nombre || `#${viaje.conductor_id}` }}</span>
              <span>💰 Aporte: ${{ formatCOP(viaje.aporte_sugerido) }} COP / cupo</span>
              <span>🟢 Disponibles: {{ viaje.cupos_disponibles }} cupos</span>
            </div>
          </div>

          <!-- Campos de Reserva -->
          <div class="form-row">
            <div class="form-group form-col">
              <label for="cupos_res">Cupos a Reservar *</label>
              <input
                id="cupos_res"
                v-model.number="form.cupos_reservados"
                type="number"
                min="1"
                :max="Math.min(viaje.cupos_disponibles, 4)"
                required
                class="form-control"
              />
              <span class="form-hint">Máx 4 cupos por reserva</span>
            </div>

            <div class="form-group form-col">
              <label>Aporte Total Estimado</label>
              <div class="total-aporte">
                ${{ formatCOP(form.cupos_reservados * (viaje.aporte_sugerido || 0)) }} COP
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="punto">Punto de Encuentro Sugerido *</label>
            <input
              id="punto"
              v-model="form.punto_encuentro"
              type="text"
              required
              class="form-control"
              placeholder="Ej: Frente a la panadería de la estación"
              maxlength="150"
            />
          </div>

          <div class="form-group">
            <label for="comentarios">Comentarios para el Conductor</label>
            <textarea
              id="comentarios"
              v-model="form.comentarios"
              rows="2"
              class="form-control"
              placeholder="Ej: Llevo mochila pequeña, estaré 5 minutos antes..."
              maxlength="255"
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Cerrar</button>
          <button type="submit" class="btn btn-primary" :disabled="reservasStore.loading">
            {{ reservasStore.loading ? 'Sincronizando con Viajes...' : 'Confirmar Reserva' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useReservasStore } from '../../stores/reservas'

const props = defineProps({
  viaje: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'reserved'])
const authStore = useAuthStore()
const reservasStore = useReservasStore()

const fallbackAlert = ref(null)

const form = reactive({
  cupos_reservados: 1,
  punto_encuentro: 'Entrada principal de la estación',
  comentarios: ''
})

function formatCOP(val) {
  if (!val && val !== 0) return '0'
  return Number(val).toLocaleString('es-CO')
}

async function handleSubmit() {
  fallbackAlert.value = null
  const user = authStore.user || {
    id: 2,
    nombre_completo: 'Pasajero Demo',
    correo_institucional: 'pasajero@uniminuto.edu.co'
  }

  const payload = {
    viaje_id: props.viaje.id,
    pasajero_id: user.id,
    pasajero_nombre: user.nombre_completo,
    pasajero_correo: user.correo_institucional,
    cupos_reservados: form.cupos_reservados,
    punto_encuentro: form.punto_encuentro,
    comentarios: form.comentarios
  }

  const result = await reservasStore.crearReserva(payload)
  if (result.success) {
    emit('reserved', result.data)
    emit('close')
  } else if (result.fallback) {
    // Escenario B: el Gateway respondió 503 con mensaje de resiliencia
    fallbackAlert.value = result.message
  }
}
</script>

<style scoped>
.trip-summary {
  background: #f1f5f9;
  border-radius: var(--radius-sm);
  padding: 0.85rem;
  margin-bottom: 1rem;
}

.summary-route {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #0f172a;
  margin-bottom: 0.4rem;
}

.summary-details {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #475569;
  flex-wrap: wrap;
}

.form-row {
  display: flex;
  gap: 0.75rem;
}

.form-col {
  flex: 1;
}

.total-aporte {
  padding: 0.55rem 0.85rem;
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-weight: 700;
  color: #059669;
  font-size: 1.05rem;
}

.modal-fallback-alert {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-left: 4px solid #f59e0b;
  padding: 0.75rem 1.25rem;
  margin: 0.75rem 1.5rem 0;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: #92400e;
  display: flex;
  gap: 0.65rem;
}

.modal-fallback-alert .alert-icon {
  font-size: 1.2rem;
}

.modal-fallback-alert p {
  margin-top: 0.2rem;
  font-size: 0.8rem;
  color: #b45309;
}
</style>
