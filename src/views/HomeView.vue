<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="hero-section card">
      <div class="hero-content">
        <div class="hero-badge">Sistemas Distribuidos • UNIMINUTO</div>
        <h1 class="hero-title">🚗 UniRide — Simulador Distribuido</h1>
        <p class="hero-subtitle">
          Plataforma de viajes compartidos universitarios basada en una arquitectura de
          <strong>Microservicios desacoplados con API Gateway</strong>, diseñada con resiliencia,
          transparencia de acceso y tolerancia a fallos parciales.
        </p>
        <div class="hero-buttons">
          <router-link to="/viajes" class="btn btn-primary">
            🗺️ Explorar Viajes Disponibles
          </router-link>
          <router-link to="/simulador" class="btn btn-secondary">
            🧪 Laboratorio de Simulación Distribuida
          </router-link>
        </div>
      </div>
    </div>

    <!-- Cluster Status Cards Grid -->
    <div class="architecture-grid">
      <!-- Nodo Gateway -->
      <div class="node-card card">
        <div class="node-icon">🌐</div>
        <div class="node-info">
          <h3>API Gateway</h3>
          <span class="node-port">Puerto :8000</span>
          <p>Punto único de entrada. Enruta el tráfico, maneja timeouts y captura caídas con fallbacks transparentes.</p>
        </div>
        <div class="node-status">
          <span class="badge" :class="statusStore.gateway === 'OPERATIVO' ? 'badge-online' : 'badge-offline'">
            {{ statusStore.gateway }}
          </span>
        </div>
      </div>

      <!-- Nodo Usuarios -->
      <div class="node-card card">
        <div class="node-icon">👤</div>
        <div class="node-info">
          <h3>MS Usuarios (Auth)</h3>
          <span class="node-port">Puerto :8001 • BD :5431</span>
          <p>Gestión de estudiantes, profesores y conductores con base de datos PostgreSQL aislada.</p>
        </div>
        <div class="node-status">
          <span class="badge" :class="statusStore.microservicios.usuarios === 'ONLINE' ? 'badge-online' : 'badge-offline'">
            {{ statusStore.microservicios.usuarios }}
          </span>
        </div>
      </div>

      <!-- Nodo Viajes -->
      <div class="node-card card">
        <div class="node-icon">🚌</div>
        <div class="node-info">
          <h3>MS Viajes (Rutas)</h3>
          <span class="node-port">Puerto :8002 • BD :5433</span>
          <p>Catálogo de viajes, rutas, horarios y cupos disponibles con alta disponibilidad.</p>
        </div>
        <div class="node-status">
          <span class="badge" :class="statusStore.microservicios.viajes === 'ONLINE' ? 'badge-online' : 'badge-offline'">
            {{ statusStore.microservicios.viajes }}
          </span>
        </div>
      </div>

      <!-- Nodo Reservas -->
      <div class="node-card card">
        <div class="node-icon">📋</div>
        <div class="node-info">
          <h3>MS Reservas</h3>
          <span class="node-port">Puerto :8003 • BD :5434</span>
          <p>Coordinación de reservas y descuento sincronizado de cupos con transacción compensatoria.</p>
        </div>
        <div class="node-status">
          <span class="badge" :class="statusStore.microservicios.reservas === 'ONLINE' ? 'badge-online' : 'badge-offline'">
            {{ statusStore.microservicios.reservas }}
          </span>
        </div>
      </div>
    </div>

    <!-- Distributed System Highlights -->
    <div class="principles-section">
      <h2 class="section-title">Principios de Sistemas Distribuidos Demostrados</h2>
      <div class="principles-grid">
        <div class="principle-card card">
          <div class="principle-icon">🛡️</div>
          <h4>Tolerancia a Fallos y Alta Disponibilidad</h4>
          <p>
            Si se apaga el contenedor de <strong>MS Reservas</strong> (<code>docker compose stop ms_reservas</code>),
            el sistema <strong>mantiene la transparencia</strong>: el catálogo de viajes sigue funcionando y respondiendo de forma normal e inmediata.
          </p>
        </div>

        <div class="principle-card card">
          <div class="principle-icon">🔄</div>
          <h4>Transparencia de Fallas y Fallback (503)</h4>
          <p>
            Cuando un cliente intenta reservar mientras el servicio de reservas está inactivo, el API Gateway
            captura el timeout y retorna un error 503 descriptivo y amigable sin romper la aplicación.
          </p>
        </div>

        <div class="principle-card card">
          <div class="principle-icon">⚡</div>
          <h4>Coordinación Inter-Servicios (Patrón Saga)</h4>
          <p>
            Al crear una reserva, el microservicio de Reservas se comunica sincrónicamente con Viajes para validar
            y descontar el cupo. En caso de fallo local, revierte la operación.
          </p>
        </div>

        <div class="principle-card card">
          <div class="principle-icon">🗄️</div>
          <h4>Base de Datos por Servicio (Database per Service)</h4>
          <p>
            Cada microservicio tiene su propio contenedor PostgreSQL independiente con puertos dedicados (5431, 5433, 5434), garantizando aislamiento de datos.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSystemStatusStore } from '../stores/systemStatus'

const statusStore = useSystemStatusStore()
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero-section {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #ffffff;
  padding: 3rem 2.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid #334155;
}

.hero-badge {
  display: inline-block;
  background: #3b82f6;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 1.05rem;
  color: #cbd5e1;
  max-width: 720px;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.architecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.node-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-top: 4px solid var(--primary);
}

.node-icon {
  font-size: 1.8rem;
}

.node-info h3 {
  font-size: 1.05rem;
  color: #0f172a;
}

.node-port {
  display: inline-block;
  font-family: monospace;
  font-size: 0.75rem;
  background: #f1f5f9;
  color: #475569;
  padding: 1px 6px;
  border-radius: 4px;
  margin: 0.25rem 0 0.5rem;
}

.node-info p {
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.4;
}

.node-status {
  margin-top: auto;
  padding-top: 0.5rem;
}

.section-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1.25rem;
}

.principles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.principle-card {
  border-left: 3px solid #10b981;
}

.principle-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.principle-card h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.4rem;
}

.principle-card p {
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.45;
}
</style>
