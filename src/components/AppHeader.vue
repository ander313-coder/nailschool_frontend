<template>
  <header class="app-header">
    <div class="container">
      <div class="logo">
        <router-link to="/">
          <h1>Zlobina Nails School</h1>
          <span class="logo-subtitle">Corporate Education</span>
        </router-link>
      </div>
      <nav class="navigation">
        <div class="courses-dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <button class="nav-link courses-btn">Мои курсы</button>
          <div v-if="showDropdown" class="dropdown-menu">
            <router-link to="/courses/active" class="dropdown-item">Активные</router-link>
            <router-link to="/courses/completed" class="dropdown-item">Завершенные</router-link>
          </div>
        </div>
        <template v-if="authStore.isAuthenticated">
          <router-link to="/profile" class="user-avatar">
            <img :src="authStore.user?.avatarUrl || defaultAvatar" alt="avatar" class="avatar-img" />
          </router-link>
        </template>
        <div v-else class="auth-buttons">
          <router-link to="/login" class="nav-link">Войти</router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const showDropdown = ref(false)
</script>

<style scoped>
.app-header {
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 0.75rem 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid #e5e5e5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  flex-direction: column;
}

.logo a {
  text-decoration: none;
}

.logo h1 {
  color: #2c3e50;
  font-size: 1.5rem;
  font-family: 'Arial', sans-serif;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
}

.logo-subtitle {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: #2c3e50;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: #f8f9fa;
  color: #1a73e8;
}

.courses-dropdown {
  position: relative;
}

.courses-btn {
  background: none;
  border: none;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0; /* Изменено с right: 0 на left: 0 для выпадения вниз */
  background: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  min-width: 200px;
  margin-top: 0.5rem;
  border: 1px solid #e5e5e5;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #1a73e8;
}

.user-avatar {
  margin-left: 1rem;
}

.avatar-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e5e5;
  transition: border-color 0.2s ease;
}

.avatar-img:hover {
  border-color: #1a73e8;
}

.auth-buttons .nav-link {
  color: #1a73e8;
  border: 1px solid #1a73e8;
}

.auth-buttons .nav-link:hover {
  background: #1a73e8;
  color: #ffffff;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .logo h1 {
    font-size: 1.2rem;
  }

  .navigation {
    gap: 1rem;
  }

  .nav-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>