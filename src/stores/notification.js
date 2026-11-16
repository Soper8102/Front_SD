import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = ref

export const useNotifications = defineStore('notifications', () => {
  const notifications = ref([])

  function add({ type = 'info', title = '', message = '', duration = 5000 }) {
    const id = Date.now() + Math.random()
    notifications.value.push({ id, type, title, message })

    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  function success(message, title = 'Éxito') {
    add({ type: 'success', title, message })
  }

  function error(message, title = 'Error') {
    add({ type: 'error', title, message, duration: 7000 })
  }

  function warning(message, title = 'Advertencia del Sistema') {
    add({ type: 'warning', title, message, duration: 6000 })
  }

  function info(message, title = 'Información') {
    add({ type: 'info', title, message })
  }

  function remove(id) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return {
    notifications,
    add,
    success,
    error,
    warning,
    info,
    remove
  }
})
