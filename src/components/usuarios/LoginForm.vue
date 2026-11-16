<template>
  <div class="login-box card">
    <div class="auth-header">
      <h2>Iniciar Sesión</h2>
      <p>Accede con tu correo institucional UNIMINUTO</p>
    </div>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="correo">Correo Institucional</label>
        <input
          id="correo"
          v-model="correo"
          type="email"
          required
          class="form-control"
          placeholder="ejemplo@uniminuto.edu.co"
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="form-control"
          placeholder="••••••••"
        />
      </div>

      <button type="submit" class="btn btn-primary btn-block" :disabled="authStore.loading">
        {{ authStore.loading ? 'Validando...' : 'Entrar a UniRide' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const correo = ref('david.jerez@uniminuto.edu.co')
const password = ref('password123')

async function handleLogin() {
  const success = await authStore.login(correo.value, password.value)
  if (success) {
    router.push('/viajes')
  }
}
</script>

<style scoped>
.login-box {
  max-width: 440px;
  margin: 0 auto;
  padding: 2rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.auth-header h2 {
  font-size: 1.4rem;
  color: #0f172a;
}

.auth-header p {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 0.3rem;
}

.btn-block {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
}
</style>
