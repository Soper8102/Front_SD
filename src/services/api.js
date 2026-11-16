import axios from 'axios'

// La URL base apunta al API Gateway en el puerto 8000
const GATEWAY_BASE_URL = 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: GATEWAY_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Servicio de Monitoreo y Salud del Sistema Distribuido
export const healthService = {
  getSystemHealth() {
    return apiClient.get('/health')
  },
  getGatewayStatus() {
    return apiClient.get('/')
  }
}

// Servicio de Usuarios (MS Usuarios - 8001 via Gateway)
export const usuariosService = {
  registrar(usuario) {
    return apiClient.post('/usuarios/registro', usuario)
  },
  login(credenciales) {
    return apiClient.post('/usuarios/login', credenciales)
  },
  getUsuarios() {
    return apiClient.get('/usuarios')
  },
  getUsuarioById(id) {
    return apiClient.get(`/usuarios/${id}`)
  }
}

// Servicio de Viajes (MS Viajes - 8002 via Gateway)
export const viajesService = {
  getViajes(filtros = {}) {
    const params = new URLSearchParams()
    if (filtros.origen) params.append('origen', filtros.origen)
    if (filtros.destino) params.append('destino', filtros.destino)
    if (filtros.tipo_vehiculo) params.append('tipo_vehiculo', filtros.tipo_vehiculo)
    if (filtros.estado) params.append('estado', filtros.estado)
    if (filtros.conductor_id) params.append('conductor_id', filtros.conductor_id)

    const queryString = params.toString()
    return apiClient.get(queryString ? `/viajes?${queryString}` : '/viajes')
  },
  getViajeById(id) {
    return apiClient.get(`/viajes/${id}`)
  },
  crearViaje(viaje) {
    return apiClient.post('/viajes', viaje)
  }
}

// Servicio de Reservas (MS Reservas - 8003 via Gateway)
export const reservasService = {
  getReservas(filtros = {}) {
    const params = new URLSearchParams()
    if (filtros.viaje_id) params.append('viaje_id', filtros.viaje_id)
    if (filtros.pasajero_id) params.append('pasajero_id', filtros.pasajero_id)
    if (filtros.estado) params.append('estado', filtros.estado)

    const queryString = params.toString()
    return apiClient.get(queryString ? `/reservas?${queryString}` : '/reservas')
  },
  getReservaById(id) {
    return apiClient.get(`/reservas/${id}`)
  },
  crearReserva(reserva) {
    return apiClient.post('/reservas', reserva)
  },
  cancelarReserva(id) {
    return apiClient.delete(`/reservas/${id}`)
  }
}

export default apiClient
