<template>
  <div class="register-box card">
    <div class="auth-header">
      <h2>Registro de Usuario</h2>
      <p>Crea tu cuenta en la base de datos como Estudiante, Profesor o Administrativo</p>
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

    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="reg-nombre">Nombre Completo *</label>
        <input
          id="reg-nombre"
          v-model="form.nombre_completo"
          type="text"
          required
          class="form-control"
          placeholder="Ej: Jorge Lozano"
          autocomplete="name"
        />
      </div>

      <div class="form-group">
        <label for="reg-correo">Correo Institucional *</label>
        <input
          id="reg-correo"
          v-model="form.correo_institucional"
          type="email"
          required
          class="form-control"
          placeholder="usuario@uniminuto.edu.co"
          autocomplete="email"
        />
      </div>

      <div class="form-row">
        <div class="form-group form-col">
          <label for="reg-telefono">Teléfono / Celular *</label>
          <input
            id="reg-telefono"
            v-model="form.telefono"
            type="tel"
            required
            class="form-control"
            placeholder="314********"
            autocomplete="tel"
          />
        </div>

        <div class="form-group form-col">
          <label for="reg-tipo">Tipo de Usuario *</label>
          <select id="reg-tipo" v-model="form.tipo_usuario" class="form-control">
            <option value="estudiante">Estudiante</option>
            <option value="profesor">Profesor</option>
            <option value="administrativo">Administrativo</option>
          </select>
        </div>
      </div>

      <!-- Campo Contraseña con Ojo -->
      <div class="form-group">
        <label for="reg-password">Contraseña *</label>
        <div class="password-wrapper">
          <input
            id="reg-password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="form-control password-input"
            placeholder="Ej: MiClave#2026"
            autocomplete="new-password"
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

      <!-- Campo Confirmar Contraseña con Ojo -->
      <div class="form-group">
        <label for="reg-confirm-password">Confirmar Contraseña *</label>
        <div class="password-wrapper">
          <input
            id="reg-confirm-password"
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            required
            class="form-control password-input"
            placeholder="Repite la contraseña"
            autocomplete="new-password"
          />
          <button
            type="button"
            class="eye-toggle-btn"
            @click="showConfirmPassword = !showConfirmPassword"
            :title="showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
          >
            <span>{{ showConfirmPassword ? '👁️' : '🙈' }}</span>
          </button>
        </div>
      </div>

      <!-- Checklist visual de validación de seguridad -->
      <div class="password-requirements" v-if="form.password || confirmPassword">
        <div class="req-title">Requisitos de seguridad:</div>
        <ul class="req-list">
          <li :class="{ 'req-valid': hasMinLength }">
            <span class="req-icon">{{ hasMinLength ? '✅' : '⚪' }}</span>
            Mínimo 8 caracteres
          </li>
          <li :class="{ 'req-valid': hasUpperCase }">
            <span class="req-icon">{{ hasUpperCase ? '✅' : '⚪' }}</span>
            Al menos una letra mayúscula (A-Z)
          </li>
          <li :class="{ 'req-valid': hasLowerCase }">
            <span class="req-icon">{{ hasLowerCase ? '✅' : '⚪' }}</span>
            Al menos una letra minúscula (a-z)
          </li>
          <li :class="{ 'req-valid': hasSpecialChar }">
            <span class="req-icon">{{ hasSpecialChar ? '✅' : '⚪' }}</span>
            Al menos un carácter especial (!@#$%^&*...)
          </li>
          <li :class="{ 'req-valid': passwordsMatch }">
            <span class="req-icon">{{ passwordsMatch ? '✅' : '⚪' }}</span>
            Las contraseñas coinciden
          </li>
        </ul>
      </div>

      <button
        type="submit"
        class="btn btn-primary btn-block"
        :disabled="authStore.loading || (form.password && !isPasswordValid)"
      >
        <span v-if="authStore.loading" class="spin-icon">🔄</span>
        {{ authStore.loading ? 'Insertando en PostgreSQL...' : 'Completar Registro' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const emit = defineEmits(['registered'])
const authStore = useAuthStore()
const router = useRouter()

const errorMessage = ref('')
const successMessage = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const confirmPassword = ref('')

const form = reactive({
  nombre_completo: '',
  correo_institucional: '',
  password: '',
  telefono: '',
  tipo_usuario: 'estudiante'
})

// Reglas de validación
const hasMinLength = computed(() => form.password.length >= 8)
const hasUpperCase = computed(() => /[A-Z]/.test(form.password))
const hasLowerCase = computed(() => /[a-z]/.test(form.password))
const hasSpecialChar = computed(() => /[!@#$%^&*(),.?":{}|<>\-_=+[\]\\/`~]/.test(form.password))
const passwordsMatch = computed(() => form.password.length > 0 && form.password === confirmPassword.value)

const isPasswordValid = computed(() =>
  hasMinLength.value &&
  hasUpperCase.value &&
  hasLowerCase.value &&
  hasSpecialChar.value &&
  passwordsMatch.value
)

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!hasMinLength.value) {
    errorMessage.value = 'La contraseña debe tener mínimo 8 caracteres.'
    return
  }

  if (!hasUpperCase.value) {
    errorMessage.value = 'La contraseña debe incluir al menos una letra mayúscula.'
    return
  }

  if (!hasLowerCase.value) {
    errorMessage.value = 'La contraseña debe incluir al menos una letra minúscula.'
    return
  }

  if (!hasSpecialChar.value) {
    errorMessage.value = 'La contraseña debe incluir al menos un carácter especial (ej: !@#$%^&*).'
    return
  }

  if (!passwordsMatch.value) {
    errorMessage.value = 'Las contraseñas no coinciden. Por favor verifícalas.'
    return
  }

  const result = await authStore.register({ ...form })

  if (result.success) {
    successMessage.value = '¡Usuario registrado exitosamente en la base de datos! Iniciando sesión...'

    // Iniciar sesión automáticamente
    const loginResult = await authStore.login(form.correo_institucional, form.password)
    if (loginResult.success) {
      setTimeout(() => {
        router.push('/viajes')
      }, 500)
    } else {
      emit('registered', { correo: form.correo_institucional, password: form.password })
    }
  } else {
    errorMessage.value = result.message || 'Error al registrar el usuario en la base de datos.'
  }
}
</script>

<style scoped>
.register-box {
  max-width: 500px;
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

.form-row {
  display: flex;
  gap: 1rem;
}

.form-col {
  flex: 1;
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

/* Checklist de seguridad */
.password-requirements {
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  margin-top: -0.25rem;
  margin-bottom: 1.25rem;
  font-size: 0.78rem;
}

.req-title {
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.35rem;
}

.req-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.req-list li {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #64748b;
  transition: color 0.2s;
}

.req-list li.req-valid {
  color: #15803d;
  font-weight: 500;
}

.req-icon {
  font-size: 0.8rem;
}

.btn-block {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
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
