<template>
  <div class="simulador-container">
    <div class="simulador-header">
      <div class="badge-sd">Laboratorio Académico</div>
      <h2>Simulador de Tolerancia a Fallos y Sistemas Distribuidos</h2>
      <p class="subtitle">
        Herramienta de pruebas interactivas para validar la alta disponibilidad, resiliencia y transparencia
        del API Gateway y los microservicios de UNIRIDE.
      </p>
    </div>

    <!-- Escenarios de Evaluación -->
    <div class="scenarios-grid">
      <!-- Escenario A: Normal -->
      <div class="scenario-card card" :class="{ 'scenario-active': !statusStore.isReservasDown }">
        <div class="scenario-badge badge-online">Escenario A: Funcionamiento Normal</div>
        <h3>Flujo Completo sin Fallos</h3>
        <p>Todos los microservicios y bases de datos están operativos en sus contenedores.</p>
        <ul class="scenario-steps">
          <li>✅ Gateway :8000 activo</li>
          <li>✅ MS Usuarios :8001 autentica</li>
          <li>✅ MS Viajes :8002 provee catálogo</li>
          <li>✅ MS Reservas :8003 descuenta cupos en Viajes</li>
        </ul>
        <div class="scenario-actions">
          <button class="btn btn-secondary btn-sm" @click="ejecutarPruebaCatalogo">
            Probar GET /viajes (200 OK)
          </button>
        </div>
      </div>

      <!-- Escenario B: Falla de Reservas -->
      <div class="scenario-card card card-scenario-b" :class="{ 'scenario-active': statusStore.isReservasDown }">
        <div class="scenario-badge badge-offline">Escenario B: Fallo Parcial de Reservas</div>
        <h3>Tolerancia a Fallos y Transparencia</h3>
        <p>Se simula la caída del contenedor <code>ms_reservas</code> apagándolo en Docker.</p>
        <ul class="scenario-steps">
          <li>⚡ <strong>Viajes:</strong> Sigue respondiendo con HTTP 200 OK (Alta Disponibilidad)</li>
          <li>⚡ <strong>Reservas:</strong> Gateway intercepta la caída y retorna HTTP 503 amigable</li>
          <li>⚡ <strong>Transparencia:</strong> El usuario puede seguir consultando viajes normalmente</li>
        </ul>
        <div class="docker-code-box">
          <code>docker compose stop ms_reservas</code>
          <button class="copy-btn" @click="copiarComando('docker compose stop ms_reservas')">Copiar</button>
        </div>
        <div class="scenario-actions">
          <button class="btn btn-danger btn-sm" @click="ejecutarPruebaFalloReserva">
            Probar POST /reservas (Esperado 503)
          </button>
        </div>
      </div>
    </div>

    <!-- Consola de Resultados en Tiempo Real -->
    <div class="console-card card">
      <div class="console-header">
        <div class="console-title">
          <span>📟 Consola de Peticiones y Respuestas HTTP</span>
        </div>
        <button class="btn btn-secondary btn-sm" @click="limpiarConsola">Limpiar</button>
      </div>

      <div class="console-body">
        <div v-if="logs.length === 0" class="console-placeholder">
          Ejecuta alguna prueba rápida desde los botones superiores o navega por la app para ver el registro en vivo de peticiones al API Gateway.
        </div>
        <div v-for="(log, idx) in logs" :key="idx" class="console-entry" :class="log.type">
          <span class="log-time">[{{ log.time }}]</span>
          <span class="log-method">{{ log.method }}</span>
          <span class="log-url">{{ log.url }}</span>
          <span class="log-status" :class="getStatusClass(log.status)">HTTP {{ log.status }}</span>
          <pre class="log-detail">{{ log.data }}</pre>
        </div>
      </div>
    </div>

    <!-- Guía de Comandos Docker -->
    <div class="guide-card card">
      <h3>🐳 Comandos Útiles de Docker para la Demostración</h3>
      <div class="commands-list">
        <div class="cmd-item">
          <div class="cmd-desc">1. Detener MS Reservas para simular caída (Escenario B):</div>
          <div class="docker-code-box">
            <code>docker compose stop ms_reservas</code>
            <button class="copy-btn" @click="copiarComando('docker compose stop ms_reservas')">Copiar</button>
          </div>
        </div>

        <div class="cmd-item">
          <div class="cmd-desc">2. Reactivar MS Reservas para restaurar el sistema:</div>
          <div class="docker-code-box">
            <code>docker compose start ms_reservas</code>
            <button class="copy-btn" @click="copiarComando('docker compose start ms_reservas')">Copiar</button>
          </div>
        </div>

        <div class="cmd-item">
          <div class="cmd-desc">3. Verificar estado de los 7 contenedores:</div>
          <div class="docker-code-box">
            <code>docker compose ps</code>
            <button class="copy-btn" @click="copiarComando('docker compose ps')">Copiar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSystemStatusStore } from '../stores/systemStatus'
import { useNotifications } from '../stores/notification'
import { viajesService, reservasService } from '../services/api'

const statusStore = useSystemStatusStore()
const notifications = useNotifications()

const logs = ref([])

function registrarLog(method, url, status, data, type = 'info') {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    method,
    url,
    status,
    data: typeof data === 'object' ? JSON.stringify(data, null, 2) : data,
    type
  })
}

function getStatusClass(status) {
  if (status >= 200 && status < 300) return 'status-ok'
  if (status === 503) return 'status-503'
  return 'status-error'
}

async function ejecutarPruebaCatalogo() {
  try {
    const res = await viajesService.getViajes()
    registrarLog('GET', '/viajes', res.status, res.data, 'log-success')
    notifications.success('Petición GET /viajes exitosa (HTTP 200)', 'Catálogo Disponible')
  } catch (err) {
    const status = err.response?.status || 500
    const detail = err.response?.data || err.message
    registrarLog('GET', '/viajes', status, detail, 'log-error')
  }
}

async function ejecutarPruebaFalloReserva() {
  const dummyPayload = {
    viaje_id: 1,
    pasajero_id: 2,
    cupos_reservados: 1,
    punto_encuentro: 'Prueba desde Simulador'
  }

  try {
    const res = await reservasService.crearReserva(dummyPayload)
    registrarLog('POST', '/reservas', res.status, res.data, 'log-success')
    notifications.success('Reserva creada exitosamente (El servicio estaba activo)', 'Resultado')
  } catch (err) {
    const status = err.response?.status || 500
    const detail = err.response?.data || err.message
    registrarLog('POST', '/reservas', status, detail, status === 503 ? 'log-warning' : 'log-error')
    if (status === 503) {
      notifications.warning('Capturado HTTP 503 con fallback transparente del Gateway', 'Prueba Escenario B Exitosa')
    }
  }
}

function limpiarConsola() {
  logs.value = []
}

function copiarComando(cmd) {
  navigator.clipboard.writeText(cmd)
  notifications.info(`Copiado al portapapeles: "${cmd}"`, 'Comando Copiado')
}
</script>

<style scoped>
.simulador-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.simulador-header {
  margin-bottom: 0.5rem;
}

.badge-sd {
  display: inline-block;
  background: #4338ca;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  margin-bottom: 0.5rem;
}

.simulador-header h2 {
  font-size: 1.6rem;
  color: #0f172a;
}

.subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
}

.scenario-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-top: 4px solid #94a3b8;
  transition: all 0.2s;
}

.scenario-active {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  border-top-color: #2563eb;
}

.card-scenario-b.scenario-active {
  border-top-color: #ef4444;
}

.scenario-badge {
  align-self: flex-start;
  font-size: 0.75rem;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-weight: 700;
}

.scenario-card h3 {
  font-size: 1.15rem;
  color: #0f172a;
}

.scenario-card p {
  font-size: 0.85rem;
  color: #64748b;
}

.scenario-steps {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #334155;
  background: #f8fafc;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
}

.scenario-actions {
  margin-top: auto;
  padding-top: 0.5rem;
}

.docker-code-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0f172a;
  color: #38bdf8;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.82rem;
}

.copy-btn {
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  cursor: pointer;
}

.copy-btn:hover {
  color: #ffffff;
  background: #334155;
}

/* Consola */
.console-card {
  padding: 0;
  overflow: hidden;
  background: #0f172a;
  border: 1px solid #1e293b;
}

.console-header {
  padding: 0.65rem 1.25rem;
  background: #1e293b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #e2e8f0;
  font-size: 0.85rem;
  font-weight: 600;
}

.console-body {
  padding: 1rem 1.25rem;
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-family: monospace;
  font-size: 0.8rem;
}

.console-placeholder {
  color: #64748b;
  font-style: italic;
  padding: 1.5rem 0;
  text-align: center;
}

.console-entry {
  background: #1e293b;
  padding: 0.6rem 0.85rem;
  border-radius: 6px;
  border-left: 3px solid #38bdf8;
  color: #f8fafc;
}

.console-entry.log-success {
  border-left-color: #22c55e;
}

.console-entry.log-warning {
  border-left-color: #f59e0b;
}

.console-entry.log-error {
  border-left-color: #ef4444;
}

.log-time {
  color: #64748b;
  margin-right: 0.5rem;
}

.log-method {
  font-weight: 700;
  margin-right: 0.5rem;
  color: #a855f7;
}

.log-url {
  color: #38bdf8;
  margin-right: 0.5rem;
}

.log-status {
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.status-ok {
  background: #064e3b;
  color: #34d399;
}

.status-503 {
  background: #78350f;
  color: #fbbf24;
}

.status-error {
  background: #7f1d1d;
  color: #f87171;
}

.log-detail {
  margin-top: 0.4rem;
  color: #cbd5e1;
  font-size: 0.75rem;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Guía de Comandos */
.guide-card h3 {
  font-size: 1.1rem;
  color: #0f172a;
  margin-bottom: 1rem;
}

.commands-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.cmd-desc {
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 0.3rem;
}
</style>
