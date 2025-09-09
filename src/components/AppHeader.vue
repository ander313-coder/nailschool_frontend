<template>
  <header class="app-header">
    <div class="container">
      <!-- Левая часть - Логотип -->
      <div class="logo">
        <router-link to="/" class="logo-link">
          <span class="logo-text">Zlobina Nails School</span>
        </router-link>
      </div>

      <!-- Простая отладочная информация -->
      <div class="auth-info">
        <div v-if="authStore.isAuthenticated" class="user-badge">
          <span>👤 {{ authStore.user?.username || 'Пользователь' }}</span>
          <button @click="handleLogout" class="logout-btn-small">Выйти</button>
        </div>
        <div v-else class="auth-buttons">
          <router-link to="/login" class="auth-link">Войти</router-link>
          <router-link to="/register" class="auth-button">Регистрация</router-link>
        </div>
      </div>

      <!-- Большая заметная кнопка отладки -->
      <button @click="showDebugInfo" class="big-debug-button">
        🔍 ПОКАЗАТЬ ИНФОРМАЦИЮ ДЛЯ РАЗРАБОТЧИКА
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const showDebugInfo = () => {
  // Простой alert с информацией
  const token = localStorage.getItem('access_token')
  const userInfo = authStore.user ? JSON.stringify(authStore.user) : 'Нет данных'
  
  alert(`🐛 ИНФОРМАЦИЯ ДЛЯ РАЗРАБОТЧИКА:
  
Статус авторизации: ${authStore.isAuthenticated ? 'ВОЙДЕН' : 'НЕ ВОЙДЕН'}
Данные пользователя: ${userInfo}
Токен в localStorage: ${token ? 'ЕСТЬ' : 'НЕТ'}

Нажмите F12 → Console чтобы увидеть подробности`)

  // Также выводим в консоль
  console.log('=== ИНФОРМАЦИЯ ДЛЯ РАЗРАБОТЧИКА ===')
  console.log('Статус авторизации:', authStore.isAuthenticated)
  console.log('Данные пользователя:', authStore.user)
  console.log('Токен в localStorage:', token)
  console.log('===================================')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: var(--white);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-link {
  text-decoration: none;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.auth-info {
  display: flex;
  align-items: center;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--gray-50);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
}

.logout-btn-small {
  background: var(--gray-200);
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
}

.logout-btn-small:hover {
  background: var(--gray-300);
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.auth-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
}

.auth-button {
  background: var(--primary);
  color: var(--white);
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
}

/* Большая заметная кнопка отладки */
.big-debug-button {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: bold;
  margin-left: 2rem;
}

.big-debug-button:hover {
  background: #e55a5a;
}
</style>