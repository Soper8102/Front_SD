<template>
  <div class="filter-card card">
    <div class="filter-inputs">
      <div class="filter-group">
        <label>Origen</label>
        <input
          type="text"
          v-model="localFiltros.origen"
          @input="applyFilters"
          placeholder="Ej: Portal 80, Soacha..."
          class="form-control"
        />
      </div>

      <div class="filter-group">
        <label>Destino</label>
        <input
          type="text"
          v-model="localFiltros.destino"
          @input="applyFilters"
          placeholder="Ej: UNIMINUTO Calle 80..."
          class="form-control"
        />
      </div>

      <div class="filter-group filter-small">
        <label>Vehículo</label>
        <select v-model="localFiltros.tipo_vehiculo" @change="applyFilters" class="form-control">
          <option value="">Todos</option>
          <option value="carro">🚗 Carro</option>
          <option value="moto">🏍️ Moto</option>
        </select>
      </div>

      <div class="filter-actions">
        <button class="btn btn-secondary" @click="handleReset" title="Limpiar Filtros">
          Limpiar
        </button>
        <button class="btn btn-primary" @click="$emit('crear')">
          + Publicar Viaje
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  filtros: {
    type: Object,
    default: () => ({ origen: '', destino: '', tipo_vehiculo: '' })
  }
})

const emit = defineEmits(['update:filtros', 'crear', 'reset'])

const localFiltros = reactive({
  origen: props.filtros.origen || '',
  destino: props.filtros.destino || '',
  tipo_vehiculo: props.filtros.tipo_vehiculo || ''
})

function applyFilters() {
  emit('update:filtros', { ...localFiltros })
}

function handleReset() {
  localFiltros.origen = ''
  localFiltros.destino = ''
  localFiltros.tipo_vehiculo = ''
  emit('reset')
}
</script>

<style scoped>
.filter-card {
  margin-bottom: 1.5rem;
  padding: 1rem 1.25rem;
}

.filter-inputs {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 180px;
}

.filter-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.3rem;
  text-transform: uppercase;
}

.filter-small {
  max-width: 140px;
  min-width: 120px;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
