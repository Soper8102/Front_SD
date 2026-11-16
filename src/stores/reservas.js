import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reservasService } from '../services/api'
import { useNotifications } from './notification'
import { useViajesStore } from './viajes'

export const useReservasStore = defineStore('reservas', () => {
  const notifications = useNotifications()
  const viajesStore = useViajesStore()

  const reservas = ref([])
  const selectedReserva = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const lastError503 = ref(null) // Para registrar el mensaje de falla transparente

  async function fetchReservas(pasajeroId = null) {
    loading.value = true
    error.value = null
    lastError503.value = null
    try {
      const response = await reservasService.getReservas(pasajeroId ? { pasajero_id: pasajeroId } : {})
      reservas.value = Array.isArray(response.data) ? response.data : []
    } catch (err) {
      if (err.response?.status === 503) {
        lastError503.value = err.response.data?.detail || 'El servicio de reservas no está disponible. Puede consultar los viajes, pero no realizar una reserva.'
        notifications.warning(lastError503.value, 'Tolerancia a Fallos (503)')
      } else {
        const msg = err.response?.data?.detail || 'Error al obtener la lista de reservas'
        error.value = msg
        notifications.error(msg, 'Error en Reservas')
      }
    } finally {
      loading.value = false
    }
  }

  async function crearReserva(reservaData) {
    loading.value = true
    error.value = null
    lastError503.value = null
    try {
      // El backend de reservas acepta cupos_reservados y logical fields
      const payload = {
        viaje_id: Number(reservaData.viaje_id),
        pasajero_id: Number(reservaData.pasajero_id),
        cupos_reservados: Number(reservaData.cupos_reservados || 1),
        punto_encuentro: reservaData.punto_encuentro || 'Punto acordado',
        comentarios: reservaData.comentarios || '',
        pasajero_nombre: reservaData.pasajero_nombre || '',
        pasajero_correo: reservaData.pasajero_correo || ''
      }

      const response = await reservasService.crearReserva(payload)
      notifications.success(
        `¡Reserva #${response.data.id} creada con éxito! El cupo ha sido descontado automáticamente en el MS de Viajes.`,
        'Reserva Confirmada'
      )

      // Actualizar viajes para reflejar cupos descontados
      await viajesStore.fetchViajes()
      await fetchReservas(reservaData.pasajero_id)
      return { success: true, data: response.data }
    } catch (err) {
      if (err.response?.status === 503) {
        // ESCENARIO B: DEMOSTRACIÓN DE FALLO PARCIAL Y DEGRADACIÓN ELEGANTE
        const fallbackMsg = err.response.data?.detail || 'El servicio de reservas no está disponible. Puede consultar los viajes, pero no realizar una reserva.'
        lastError503.value = fallbackMsg
        notifications.warning(fallbackMsg, 'Escenario B: Fallo Parcial Detectado (503)')
        return { success: false, fallback: true, message: fallbackMsg }
      } else {
        const detailMsg = err.response?.data?.detail || 'No fue posible completar la reserva.'
        error.value = detailMsg
        notifications.error(detailMsg, 'Error al Crear Reserva')
        return { success: false, fallback: false, message: detailMsg }
      }
    } finally {
      loading.value = false
    }
  }

  async function cancelarReserva(id, pasajeroId = null) {
    loading.value = true
    try {
      const response = await reservasService.cancelarReserva(id)
      notifications.success(
        response.data?.mensaje || 'Reserva cancelada exitosamente y cupos devueltos al viaje.',
        'Reserva Cancelada'
      )
      // Refrescar viajes y reservas
      await viajesStore.fetchViajes()
      await fetchReservas(pasajeroId)
      return true
    } catch (err) {
      if (err.response?.status === 503) {
        notifications.warning(
          err.response.data?.detail || 'El servicio de reservas no está disponible en este momento.',
          'Tolerancia a Fallos'
        )
      } else {
        const msg = err.response?.data?.detail || 'Error al cancelar la reserva'
        notifications.error(msg, 'Error')
      }
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchReservaById(id) {
    loading.value = true
    try {
      const response = await reservasService.getReservaById(id)
      selectedReserva.value = response.data
      return response.data
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al consultar reserva'
      notifications.error(msg, 'Error')
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    reservas,
    selectedReserva,
    loading,
    error,
    lastError503,
    fetchReservas,
    crearReserva,
    cancelarReserva,
    fetchReservaById
  }
})
