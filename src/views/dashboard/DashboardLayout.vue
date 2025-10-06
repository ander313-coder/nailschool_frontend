<template>
  <div class="dashboard-layout">
    <!-- Хедер -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="logo">
          <router-link to="/dashboard">
            <h1>Zlobina Nails School</h1>
          </router-link>
        </div>
        <nav class="header-nav">
          <router-link to="/dashboard" class="nav-link">Дашборд</router-link>
          <router-link to="/my-courses" class="nav-link">Мои курсы</router-link>
          <router-link to="/progress" class="nav-link">Прогресс</router-link>
          <div class="user-menu">
            <span>Привет, {{ user?.username }}</span>
            <div class="user-dropdown">
              <router-link to="/profile">Профиль</router-link>
              <button @click="logout">Выйти</button>
            </div>
          </div>
        </nav>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="dashboard-main">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const user = authStore.user

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background: #f8f9fa;
}

.dashboard-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 70px;
}

.logo h1 {
  color: #8C4CC3;
  font-size: 24px;
  margin: 0;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #8C4CC3;
  color: white;
}

.user-menu {
  position: relative;
  cursor: pointer;
  padding: 8px 16px;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 8px;
  min-width: 120px;
  display: none;
}

.user-menu:hover .user-dropdown {
  display: block;
}

.dashboard-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>