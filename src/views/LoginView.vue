<template>
  <div class="auth-view-container">
    <div class="auth-tabs">
      <button
        class="tab-btn"
        :class="{ 'tab-active': activeTab === 'login' }"
        @click="activeTab = 'login'"
      >
        Iniciar Sesión
      </button>
      <button
        class="tab-btn"
        :class="{ 'tab-active': activeTab === 'register' }"
        @click="activeTab = 'register'"
      >
        Crear Cuenta
      </button>
    </div>

    <div class="auth-content">
      <LoginForm v-if="activeTab === 'login'" ref="loginRef" />
      <RegisterForm v-else @registered="handleRegistered" />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import LoginForm from '../components/usuarios/LoginForm.vue'
import RegisterForm from '../components/usuarios/RegisterForm.vue'

const activeTab = ref('login')
const loginRef = ref(null)

function handleRegistered(payload) {
  activeTab.value = 'login'
  if (payload && payload.correo) {
    nextTick(() => {
      if (loginRef.value) {
        loginRef.value.setCredentials(
          payload.correo,
          payload.password || '',
          '¡Cuenta creada exitosamente en PostgreSQL! Haz clic en Entrar.'
        )
      }
    })
  }
}
</script>

<style scoped>
.auth-view-container {
  max-width: 500px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.auth-tabs {
  display: flex;
  background: #e2e8f0;
  padding: 4px;
  border-radius: var(--radius-md);
}

.tab-btn {
  flex: 1;
  padding: 0.65rem;
  border: none;
  background: none;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-active {
  background: #ffffff;
  color: var(--primary);
  box-shadow: var(--shadow-sm);
}
</style>
