<template>
  <header class="app-header">
    <div class="container">
      <div class="logo">
        <router-link to="/">
          <h1>Nail School</h1>
        </router-link>
      </div>
      
      <nav class="navigation">
        <router-link to="/courses" class="nav-link">Курсы</router-link>
        <router-link to="/lessons" class="nav-link">Уроки</router-link>
        <router-link to="/tests" class="nav-link">Тесты</router-link>
      </nav>
      
      <div class="auth-section">
        <template v-if="authStore.isAuthenticated">
          <router-link to="/profile" class="nav-link">
            {{ authStore.user?.username }}
          </router-link>
          <button @click="logout" class="logout-btn">Выйти</button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">Войти</router-link>
          <router-link to="/register" class="register-btn">Регистрация</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
}
</script>

<style scoped>
.app-header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo h1 {
  color: #ff6b6b;
  font-size: 1.5rem;
  margin: 0;
}

.navigation {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #ff6b6b;
}

.auth-section {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.register-btn {
  background: #ff6b6b;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
}

.logout-btn {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.logout-btn:hover {
  background: #e9ecef;
}
</style>