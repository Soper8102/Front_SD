<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in notificationStore.notifications"
        :key="toast.id"
        class="toast-item"
        :class="`toast-${toast.type}`"
      >
        <div class="toast-icon">
          <span v-if="toast.type === 'success'">✅</span>
          <span v-else-if="toast.type === 'error'">❌</span>
          <span v-else-if="toast.type === 'warning'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>
        <div class="toast-body">
          <div v-if="toast.title" class="toast-title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button class="toast-close" @click="notificationStore.remove(toast.id)">&times;</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotifications } from '../stores/notification'

const notificationStore = useNotifications()
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  max-width: 420px;
  width: 100%;
}

.toast-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
}

.toast-success {
  border-left-color: #10b981;
}

.toast-error {
  border-left-color: #ef4444;
}

.toast-warning {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.toast-info {
  border-left-color: #3b82f6;
}

.toast-icon {
  font-size: 1.1rem;
  margin-top: 1px;
}

.toast-body {
  flex: 1;
}

.toast-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 2px;
}

.toast-message {
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.35;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  line-height: 1;
  color: #94a3b8;
  cursor: pointer;
  padding: 0 2px;
}

.toast-close:hover {
  color: #0f172a;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
