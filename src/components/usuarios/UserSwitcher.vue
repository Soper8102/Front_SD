<template>
  <div class="user-switcher-card card">
    <div class="switcher-header">
      <span class="switcher-icon">👥</span>
      <div>
        <h4 class="switcher-title">Simulador de Usuarios (Sesión Activa)</h4>
        <p class="switcher-desc">Cambia rápidamente de identidad para probar reservas como Pasajero o creación de viajes como Conductor</p>
      </div>
    </div>

    <div class="switcher-body">
      <div v-if="authStore.allUsers.length === 0" class="no-users">
        <span>No hay usuarios cargados aún.</span>
        <button class="btn btn-secondary btn-sm" @click="authStore.fetchUsers()">Recargar Usuarios</button>
      </div>

      <div v-else class="user-chips">
        <button
          v-for="u in authStore.allUsers"
          :key="u.id"
          class="user-chip"
          :class="{ 'user-chip--active': authStore.user?.id === u.id }"
          @click="authStore.switchUser(u)"
        >
          <span class="user-avatar">{{ u.es_conductor ? '🚗' : '🎓' }}</span>
          <span class="user-name">{{ u.nombre_completo }}</span>
          <span class="user-role-badge">{{ u.tipo_usuario }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchUsers()
})
</script>

<style scoped>
.user-switcher-card {
  margin-bottom: 1.5rem;
  background: #f8fafc;
  border-left: 4px solid #3b82f6;
}

.switcher-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.switcher-icon {
  font-size: 1.5rem;
}

.switcher-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
}

.switcher-desc {
  font-size: 0.8rem;
  color: #64748b;
}

.user-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.user-chip:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.user-chip--active {
  background: #2563eb;
  color: #ffffff;
  border-color: #1d4ed8;
}

.user-chip--active .user-role-badge {
  background: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

.user-role-badge {
  font-size: 0.68rem;
  background: #e2e8f0;
  color: #475569;
  padding: 1px 6px;
  border-radius: 999px;
  text-transform: capitalize;
}

.no-users {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.85rem;
  color: #64748b;
}

.btn-sm {
  padding: 0.25rem 0.65rem;
  font-size: 0.75rem;
}
</style>
