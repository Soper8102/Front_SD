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

    <!-- Cuentas Rápidas de Prueba -->
    <div class="quick-accounts card">
      <span class="quick-title">⚡ Cuentas de Prueba Rápidas (Postman / Docker):</span>
      <div class="quick-buttons">
        <button class="quick-btn" @click="setAccount('david.jerez@uniminuto.edu.co', 'password123')">
          👤 David Jerez (Pasajero)
        </button>
        <button class="quick-btn" @click="setAccount('jorge.lozano@uniminuto.edu.co', 'segura1234')">
          🚗 Jorge Lozano (Conductor)
        </button>
      </div>
    </div>

    <div class="auth-content">
      <LoginForm v-if="activeTab === 'login'" ref="loginRef" />
      <RegisterForm v-else @registered="activeTab = 'login'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '../components/usuarios/LoginForm.vue'
import RegisterForm from '../components/usuarios/RegisterForm.vue'

const activeTab = ref('login')
const loginRef = ref(null)

function setAccount(correo, password) {
  activeTab.value = 'login'
  if (loginRef.value) {
    loginRef.value.correo = correo
    loginRef.value.password = password
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

.quick-accounts {
  background: #f8fafc;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  border-left: 3px solid #3b82f6;
}

.quick-title {
  display: block;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
}

.quick-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.quick-btn {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  cursor: pointer;
  color: #1e293b;
  transition: all 0.2s;
}

.quick-btn:hover {
  border-color: #3b82f6;
  color: #2563eb;
  background: #eff6ff;
}
</style>
