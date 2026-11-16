<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h3>🚗 Publicar Nuevo Viaje</h3>
        <button class="modal-close" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="modal-body">
          <div class="form-row">
            <div class="form-group form-col">
              <label for="origen">Origen de Salida *</label>
              <input
                id="origen"
                v-model="form.origen"
                type="text"
                required
                class="form-control"
                placeholder="Ej: Portal 80"
              />
            </div>

            <div class="form-group form-col">
              <label for="destino">Destino *</label>
              <input
                id="destino"
                v-model="form.destino"
                type="text"
                required
                class="form-control"
                placeholder="Ej: UNIMINUTO Calle 80"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group form-col">
              <label for="fecha">Fecha y Hora de Salida *</label>
              <input
                id="fecha"
                v-model="form.fecha_hora_salida"
                type="datetime-local"
                required
                class="form-control"
              />
            </div>

            <div class="form-group form-col">
              <label for="cupos">Cupos Disponibles *</label>
              <input
                id="cupos"
                v-model.number="form.cupos_totales"
                type="number"
                min="1"
                max="8"
                required
                class="form-control"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group form-col">
              <label for="aporte">Aporte Sugerido (COP) *</label>
              <input
                id="aporte"
                v-model.number="form.aporte_sugerido"
                type="number"
                min="0"
                step="500"
                required
                class="form-control"
                placeholder="4000"
              />
            </div>

            <div class="form-group form-col">
              <label for="vehiculo">Tipo de Vehículo</label>
              <select id="vehiculo" v-model="form.tipo_vehiculo" class="form-control">
                <option value="carro">🚗 Carro</option>
                <option value="moto">🏍️ Moto</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label for="placa">Placa del Vehículo</label>
            <input
              id="placa"
              v-model="form.placa_vehiculo"
              type="text"
              class="form-control"
              placeholder="Ej: XYZ-789"
              maxlength="15"
            />
          </div>

          <div class="form-group">
            <label for="desc">Ruta / Paradas Intermedias</label>
            <textarea
              id="desc"
              v-model="form.descripcion_ruta"
              rows="2"
              class="form-control"
              placeholder="Detalla puntos de paso o instrucciones para los pasajeros..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn btn-primary" :disabled="viajesStore.loading">
            {{ viajesStore.loading ? 'Publicando...' : 'Publicar en Catálogo' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useViajesStore } from '../../stores/viajes'

const emit = defineEmits(['close', 'created'])
const authStore = useAuthStore()
const viajesStore = useViajesStore()

// Hora de salida por defecto: mañana a las 7:30 AM
const defaultDate = new Date()
defaultDate.setDate(defaultDate.getDate() + 1)
defaultDate.setHours(7, 30, 0, 0)
const defaultISO = defaultDate.toISOString().slice(0, 16)

const form = reactive({
  origen: '',
  destino: 'UNIMINUTO Sede Principal Calle 80',
  fecha_hora_salida: defaultISO,
  cupos_totales: 4,
  aporte_sugerido: 4000,
  tipo_vehiculo: 'carro',
  placa_vehiculo: '',
  descripcion_ruta: ''
})

async function handleSubmit() {
  const user = authStore.user || { id: 1, nombre_completo: 'Conductor Demo' }

  const payload = {
    ...form,
    conductor_id: user.id,
    conductor_nombre: user.nombre_completo
  }

  try {
    await viajesStore.crearViaje(payload)
    emit('created')
    emit('close')
  } catch {
    // Manejado por el store
  }
}
</script>

<style scoped>
.form-row {
  display: flex;
  gap: 0.75rem;
}

.form-col {
  flex: 1;
}
</style>
