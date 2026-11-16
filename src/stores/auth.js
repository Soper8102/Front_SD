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

  const isLoggedIn = computed(() => !!user.value)
  const isConductor = computed(() => !!user.value?.es_conductor)

  async function login(correo_institucional, password) {
    loading.value = true
    try {
      const response = await usuariosService.login({ correo_institucional, password })
      // El backend retorna { mensaje: "...", correo: "..." }
      // Para tener los datos completos del usuario, consultamos la lista de usuarios o perfil
      await fetchUsers()
      const foundUser = allUsers.value.find((u) => u.correo_institucional === correo_institucional)

      if (foundUser) {
        user.value = foundUser
      } else {
        // Fallback básico con el correo
        user.value = {
          id: 1,
          nombre_completo: correo_institucional.split('@')[0],
          correo_institucional,
          tipo_usuario: 'estudiante',
          es_conductor: false
        }
      }

      localStorage.setItem('uniride_user', JSON.stringify(user.value))
      notifications.success(`¡Bienvenido/a de nuevo, ${user.value.nombre_completo}!`, 'Inicio de Sesión')
      return true
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.mensaje || 'Error al iniciar sesión'
      notifications.error(msg, 'Error de Autenticación')
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    try {
      await usuariosService.registrar(userData)
      notifications.success('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.', 'Registro Completado')
      await fetchUsers()
      return true
    } catch (err) {
      const msg = err.response?.data?.detail || err.response?.data?.mensaje || 'Error al registrar usuario'
      notifications.error(msg, 'Error de Registro')
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchUsers() {
    try {
      const response = await usuariosService.getUsuarios()
      allUsers.value = Array.isArray(response.data) ? response.data : []
    } catch {
      // Silencioso si el MS de usuarios está caído
    }
  }

  function switchUser(selectedUser) {
    user.value = selectedUser
    localStorage.setItem('uniride_user', JSON.stringify(selectedUser))
    notifications.info(`Sesión cambiada a: ${selectedUser.nombre_completo} (${selectedUser.tipo_usuario})`, 'Simulación de Usuario')
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
    isLoggedIn,
    isConductor,
    login,
    register,
    fetchUsers,
    switchUser,
    logout
  }
})
