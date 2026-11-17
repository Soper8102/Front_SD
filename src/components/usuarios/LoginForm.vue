<template>
  <div class="login-box card">
    <div class="auth-header">
      <h2>Iniciar Sesión</h2>
      <p>Accede con tu correo institucional UNIMINUTO registrado en la base de datos</p>
    </div>

    <!-- Alerta de Error en el Formulario -->
    <div v-if="errorMessage" class="form-alert form-alert-error">
      <span>⚠️</span>
      <div>{{ errorMessage }}</div>
    </div>

    <!-- Alerta de Éxito en el Formulario -->
    <div v-if="successMessage" class="form-alert form-alert-success">
      <span>✅</span>
      <div>{{ successMessage }}</div>
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
          autocomplete="email"
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <div class="password-wrapper">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="form-control password-input"
            placeholder="••••••••"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="eye-toggle-btn"
            @click="showPassword = !showPassword"
            :title="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
          >
            <span>{{ showPassword ? '👁️' : '🙈' }}</span>
          </button>
        </div>
      </div>

      <button type="submit" class="btn btn-primary btn-block" :disabled="authStore.loading">
        <span v-if="authStore.loading" class="spin-icon">🔄</span>
        {{ authStore.loading ? 'Verificando con PostgreSQL...' : 'Entrar a UniRide' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const correo = ref('')
const password = ref('')
const showPassword = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!correo.value || !password.value) {
    errorMessage.value = 'Por favor ingresa tu correo y contraseña.'
    return
  }

  const result = await authStore.login(correo.value, password.value)
  if (result.success) {
    successMessage.value = '¡Autenticación exitosa! Redirigiendo...'
    const destination = route.query.redirect || '/viajes'
    setTimeout(() => {
      router.push(destination)
    }, 400)
  } else {
    errorMessage.value = result.message || 'Correo o contraseña incorrectos en la base de datos.'
  }
}

defineExpose({
  setCredentials(c, p, msg = '') {
    correo.value = c
    password.value = p
    if (msg) successMessage.value = msg
  }
})
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

/* Input con botón de ojo */
.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  padding-right: 2.75rem;
}

.eye-toggle-btn {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.35rem;
  font-size: 1.1rem;
  line-height: 1;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: opacity 0.2s;
}

.eye-toggle-btn:hover {
  opacity: 0.8;
}

.btn-block {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
}

.form-alert {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
  line-height: 1.4;
}

.form-alert-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.form-alert-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}

.spin-icon {
  display: inline-block;
  animation: spin 1s linear infinite;
  margin-right: 0.35rem;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}
</style>
