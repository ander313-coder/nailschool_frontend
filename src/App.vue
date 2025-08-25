<template>
  <div id="app">
    <AppHeader />
    
    <main class="main-content">
      <router-view />
    </main>
    
    <AppFooter />
    
    <div v-if="authStore.isLoading" class="loading-overlay">
      <div class="loading-spinner">Загрузка...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Проверяем аутентификацию при загрузке приложения
authStore.checkAuth()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f8f9fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* Отступ для фиксированного хедера */
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}
</style>