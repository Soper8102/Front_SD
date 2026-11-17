import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usuariosService } from '../services/api'
import { useNotifications } from './notification'

export const useAuthStore = defineStore('auth', () => {
  const notifications = useNotifications()
  const savedUser = localStorage.getItem('uniride_user')
  const user = ref(savedUser ? JSON.parse(savedUser) : null)
  const allUsers = ref([])
  const loading = ref(false)
  const lastError = ref(null)

  const isLoggedIn = computed(() => !!user.value)
  const isConductor = computed(() => !!user.value?.es_conductor)

  async function login(correo_institucional, password) {
    loading.value = true
    lastError.value = null
    const cleanEmail = (correo_institucional || '').trim().toLowerCase()
    const cleanPassword = (password || '').trim()

    try {
      await usuariosService.login({
        correo_institucional: cleanEmail,
        password: cleanPassword
      })

      // Consultar usuarios actualizados desde la base de datos de PostgreSQL
      await fetchUsers()
      const foundUser = allUsers.value.find(
        (u) => (u.correo_institucional || '').toLowerCase().trim() === cleanEmail
      )

      if (foundUser) {
        user.value = foundUser
      } else {
        // Fallback en caso de que no lo encuentre en la lista
        user.value = {
          id: 1,
          nombre_completo: cleanEmail.split('@')[0],
          correo_institucional: cleanEmail,
          tipo_usuario: 'estudiante',
          es_conductor: false
        }
      }

      localStorage.setItem('uniride_user', JSON.stringify(user.value))
      notifications.success(`¡Bienvenido/a de nuevo, ${user.value.nombre_completo}!`, 'Inicio de Sesión')
      return { success: true, user: user.value }
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.mensaje || err.message || 'Error al iniciar sesión'
      lastError.value = msg
      notifications.error(msg, 'Error de Autenticación')
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    lastError.value = null
    const payload = {
      nombre_completo: (userData.nombre_completo || '').trim(),
      correo_institucional: (userData.correo_institucional || '').trim().toLowerCase(),
      password: (userData.password || '').trim(),
      telefono: (userData.telefono || '').trim(),
      tipo_usuario: (userData.tipo_usuario || 'estudiante').trim().toLowerCase()
    }

    try {
      await usuariosService.registrar(payload)
      notifications.success('¡Usuario registrado con éxito en la base de datos!', 'Registro Completado')
      await fetchUsers()
      return {
        success: true,
        email: payload.correo_institucional,
        password: payload.password
      }
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.mensaje || err.message || 'Error al registrar usuario'
      lastError.value = msg
      notifications.error(msg, 'Error de Registro')
      return { success: false, message: msg }
    } finally {
      loading.value = false
    }
  }

  async function fetchUsers() {
    try {
      const response = await usuariosService.getUsuarios()
      allUsers.value = Array.isArray(response.data) ? response.data : []
    } catch {
      // Silencioso si el MS de usuarios no responde
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('uniride_user')
    notifications.info('Has cerrado sesión correctamente.', 'Hasta pronto')
  }

  return {
    user,
    allUsers,
    loading,
    lastError,
    isLoggedIn,
    isConductor,
    login,
    register,
    fetchUsers,
    logout
  }
})
