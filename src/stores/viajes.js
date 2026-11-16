import { defineStore } from 'pinia'
import { ref } from 'vue'
import { viajesService } from '../services/api'
import { useNotifications } from './notification'

export const useViajesStore = defineStore('viajes', () => {
  const notifications = useNotifications()

  const viajes = ref([])
  const selectedViaje = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const filtros = ref({
    origen: '',
    destino: '',
    tipo_vehiculo: '',
    estado: 'PROGRAMADO'
  })

  async function fetchViajes() {
    loading.value = true
    error.value = null
    try {
      const response = await viajesService.getViajes(filtros.value)
      viajes.value = Array.isArray(response.data) ? response.data : []
    } catch (err) {
      const msg = err.response?.data?.detail || 'No se pudo cargar el catálogo de viajes.'
      error.value = msg
      notifications.error(msg, 'Error en MS Viajes')
    } finally {
      loading.value = false
    }
  }

  async function crearViaje(viajeData) {
    loading.value = true
    try {
      const response = await viajesService.crearViaje(viajeData)
      notifications.success('¡Viaje publicado exitosamente!', 'Nuevo Viaje')
      await fetchViajes()
      return response.data
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al publicar el viaje'
      notifications.error(msg, 'Error en MS Viajes')
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchViajeById(id) {
    loading.value = true
    try {
      const response = await viajesService.getViajeById(id)
      selectedViaje.value = response.data
      return response.data
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al consultar el detalle del viaje'
      notifications.error(msg, 'Error en MS Viajes')
      return null
    } finally {
      loading.value = false
    }
  }

  function setFiltro(key, value) {
    filtros.value[key] = value
    fetchViajes()
  }

  function limpiarFiltros() {
    filtros.value = {
      origen: '',
      destino: '',
      tipo_vehiculo: '',
      estado: 'PROGRAMADO'
    }
    fetchViajes()
  }

  return {
    viajes,
    selectedViaje,
    loading,
    error,
    filtros,
    fetchViajes,
    crearViaje,
    fetchViajeById,
    setFiltro,
    limpiarFiltros
  }
})
