import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { healthService } from '../services/api'
import { useNotifications } from './notification'

export const useSystemStatusStore = defineStore('systemStatus', () => {
  const notifications = useNotifications()

  const gateway = ref('DESCONOCIDO')
  const microservicios = ref({
    usuarios: 'DESCONOCIDO',
    viajes: 'DESCONOCIDO',
    reservas: 'DESCONOCIDO'
  })
  const loading = ref(false)
  const lastChecked = ref(null)
  let pollingInterval = null

  const isReservasDown = computed(() => microservicios.value.reservas === 'OFFLINE')
  const isViajesDown = computed(() => microservicios.value.viajes === 'OFFLINE')
  const isUsuariosDown = computed(() => microservicios.value.usuarios === 'OFFLINE')
  const isGatewayDown = computed(() => gateway.value === 'OFFLINE')

  const isDegraded = computed(() => {
    return isReservasDown.value || isViajesDown.value || isUsuariosDown.value
  })

  async function checkHealth(silent = false) {
    loading.value = true
    try {
      const response = await healthService.getSystemHealth()
      const data = response.data

      const previousReservas = microservicios.value.reservas

      gateway.value = data.gateway || 'OPERATIVO'
      if (data.microservicios) {
        microservicios.value = {
          usuarios: data.microservicios.usuarios || 'OFFLINE',
          viajes: data.microservicios.viajes || 'OFFLINE',
          reservas: data.microservicios.reservas || 'OFFLINE'
        }
      }

      lastChecked.value = new Date().toLocaleTimeString()

      // Detección del Escenario B: Reservas caído
      if (!silent && previousReservas === 'ONLINE' && microservicios.value.reservas === 'OFFLINE') {
        notifications.warning(
          'El microservicio de Reservas está OFFLINE. El sistema entra en MODO DEGRADADO: aún puedes consultar viajes con total transparencia.',
          'Alerta Distribuida (Escenario B)'
        )
      } else if (!silent && previousReservas === 'OFFLINE' && microservicios.value.reservas === 'ONLINE') {
        notifications.success(
          'El microservicio de Reservas se ha recuperado. Funcionalidad completa restaurada.',
          'Servicio Restaurado'
        )
      }
    } catch (err) {
      gateway.value = 'OFFLINE'
      microservicios.value = {
        usuarios: 'OFFLINE',
        viajes: 'OFFLINE',
        reservas: 'OFFLINE'
      }
      lastChecked.value = new Date().toLocaleTimeString()
      if (!silent) {
        notifications.error(
          'No se puede comunicar con el API Gateway en el puerto 8000. Verifica que los contenedores de Docker estén encendidos.',
          'Gateway Inaccesible'
        )
      }
    } finally {
      loading.value = false
    }
  }

  function startAutoPolling(intervalMs = 8000) {
    if (pollingInterval) clearInterval(pollingInterval)
    checkHealth(true)
    pollingInterval = setInterval(() => {
      checkHealth(true)
    }, intervalMs)
  }

  function stopAutoPolling() {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  return {
    gateway,
    microservicios,
    loading,
    lastChecked,
    isReservasDown,
    isViajesDown,
    isUsuariosDown,
    isGatewayDown,
    isDegraded,
    checkHealth,
    startAutoPolling,
    stopAutoPolling
  }
})
