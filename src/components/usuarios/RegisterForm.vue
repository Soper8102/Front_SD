<template>
  <div class="register-box card">
    <div class="auth-header">
      <h2>Registro de Usuario</h2>
      <p>Crea tu cuenta como Estudiante, Profesor o Administrativo</p>
    </div>

    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="reg-nombre">Nombre Completo</label>
        <input
          id="reg-nombre"
          v-model="form.nombre_completo"
          type="text"
          required
          class="form-control"
          placeholder="Ej: David Jerez"
        />
      </div>

      <div class="form-group">
        <label for="reg-correo">Correo Institucional</label>
        <input
          id="reg-correo"
          v-model="form.correo_institucional"
          type="email"
          required
          class="form-control"
          placeholder="usuario@uniminuto.edu.co"
        />
      </div>

      <div class="form-row">
        <div class="form-group form-col">
          <label for="reg-telefono">Teléfono / Celular</label>
          <input
            id="reg-telefono"
            v-model="form.telefono"
            type="tel"
            required
            class="form-control"
            placeholder="3101234567"
          />
        </div>

        <div class="form-group form-col">
          <label for="reg-tipo">Tipo de Usuario</label>
          <select id="reg-tipo" v-model="form.tipo_usuario" class="form-control">
            <option value="estudiante">Estudiante</option>
            <option value="profesor">Profesor</option>
            <option value="administrativo">Administrativo</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label for="reg-password">Contraseña (mínimo 8 caracteres)</label>
        <input
          id="reg-password"
          v-model="form.password"
          type="password"
          required
          minlength="8"
          class="form-control"
          placeholder="••••••••"
        />
      </div>

      <button type="submit" class="btn btn-primary btn-block" :disabled="authStore.loading">
        {{ authStore.loading ? 'Registrando...' : 'Completar Registro' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '../../stores/auth'

const emit = defineEmits(['registered'])
const authStore = useAuthStore()

const form = reactive({
  nombre_completo: '',
  correo_institucional: '',
  password: '',
  telefono: '',
  tipo_usuario: 'estudiante'
})

async function handleRegister() {
  const success = await authStore.register({ ...form })
  if (success) {
    emit('registered')
  }
}
</script>

<style scoped>
.register-box {
  max-width: 480px;
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

.btn-block {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
}
</style>
