# 🚗 UniRide — Frontend en Vue.js (Sistemas Distribuidos)

Este es el cliente web frontend desarrollado en **Vue.js 3 + Vite + Pinia + Vue Router** para el proyecto de Sistemas Distribuidos (UNIRIDE).

---

## 🏗️ Arquitectura y Comunicación con el Backend

El frontend se comunica **exclusivamente a través del API Gateway** en el puerto `8000`:

```
┌────────────────────────────────────────────────────────┐
│               Frontend Vue.js (Puerto 5173)            │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP Requests
                            ▼
┌────────────────────────────────────────────────────────┐
│               API Gateway (Puerto 8000)                │
└───────────────┬───────────┼────────────┬───────────────┘
                │           │            │
   /usuarios/*  │  /viajes/*│            │ /reservas/*
                ▼           ▼            ▼
         ┌────────────┐┌────────────┐┌────────────┐
         │MS Usuarios ││ MS Viajes  ││MS Reservas │
         │   (:8001)  ││   (:8002)  ││   (:8003)  │
         └────────────┘└────────────┘└────────────┘
```

---

## ⚡ Simulación de Transparencia y Tolerancia a Fallos

El frontend implementa de forma visual los dos escenarios de evaluación del sistema distribuido:

### 1. Monitor en Vivo del Cluster (SystemStatusBanner)
En la parte superior de la aplicación se visualiza en tiempo real el estado de salud de los 4 componentes:
* 🌐 **API Gateway :8000**
* 👤 **MS Usuarios :8001**
* 🚌 **MS Viajes :8002**
* 📋 **MS Reservas :8003**

### 2. Escenario A: Funcionamiento Normal (Flujo Completo)
* Se registran o inician sesión usuarios con rol de estudiante, profesor o conductor.
* Los conductores publican viajes especificando origen, destino, cupos, aporte y vehículo.
* Los pasajeros consultan el catálogo y reservan cupos. El microservicio de Reservas sincroniza y descuenta el cupo automáticamente en el microservicio de Viajes.

### 3. Escenario B: Caída Parcial del MS Reservas (`docker compose stop ms_reservas`)
* **Alta Disponibilidad:** El catálogo de viajes sigue respondiendo fluidamente con **HTTP 200 OK**.
* **Transparencia:** El usuario puede seguir consultando, filtrando y explorando viajes sin interrupción.
* **Degradación Elegante:** Al intentar realizar una reserva, el API Gateway intercepta la caída y retorna **HTTP 503**, el cual es capturado por la interfaz mostrando el mensaje exacto de resiliencia sin romper la aplicación:
  > *"El servicio de reservas no está disponible. Puede consultar los viajes, pero no realizar una reserva."*
* Al reactivar el servicio con `docker compose start ms_reservas`, el sistema se auto-recupera de inmediato.

---

## 🚀 Cómo Iniciar el Frontend

1. Asegúrate de estar en la carpeta `Front_SD`:
```powershell
cd C:\Users\jorge\Documents\proyecto_Sis_Dis\Front_SD
```

2. Ejecuta el servidor de desarrollo:
```powershell
npm run dev
```

3. Abre tu navegador en [http://localhost:5173](http://localhost:5173).

---

## 📁 Estructura del Código

* `src/services/api.js`: Cliente Axios configurado para apuntar al API Gateway (`http://localhost:8000`).
* `src/stores/`:
  * `systemStatus.js`: Polling y detección de salud del cluster distribuido.
  * `auth.js`: Sesión de usuario, login y simulación de roles.
  * `viajes.js`: Catálogo y filtros de viajes.
  * `reservas.js`: Gestión de reservas con manejo del error 503 en Escenario B.
  * `notification.js`: Sistema de toasts para alertas y fallbacks.
* `src/components/`:
  * `SystemStatusBanner.vue`: Barra superior de monitoreo y alertas de degradación.
  * `usuarios/`: Formularios de login, registro y switch rápido de identidades.
  * `viajes/`: Tarjetas de viajes, filtros y modal de publicación.
  * `reservas/`: Lista de reservas, modal de confirmación y cancelación.
* `src/views/`:
  * `HomeView.vue`: Panel principal con explicación de la arquitectura distribuida.
  * `ViajesView.vue`: Catálogo interactivo de viajes.
  * `ReservasView.vue`: Gestión de reservas activas.
  * `SimuladorView.vue`: Laboratorio interactivo con consola HTTP y comandos Docker.
  * `LoginView.vue`: Autenticación y cuentas de prueba rápidas.
