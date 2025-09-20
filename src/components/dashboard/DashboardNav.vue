<template>
  <nav class="dashboard-nav">
    <ul class="nav-list">
      <li v-for="item in navItems" :key="item.name" class="nav-item">
        <router-link 
          :to="item.path" 
          class="nav-link"
          :class="{ active: $route.path === item.path }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.name }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const navItems = ref([
  { name: 'Обзор', path: '/dashboard', icon: '📊' },
  { name: 'Мои курсы', path: '/my-courses', icon: '🎓' },
  { name: 'Прогресс', path: '/progress', icon: '📈' },
  { name: 'Профиль', path: '/profile', icon: '👤' },
  { name: 'Настройки', path: '/settings', icon: '⚙️' }
]);
</script>

<style scoped>
.dashboard-nav {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 8px;
}

.nav-item {
  flex: 1;
}

.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  text-decoration: none;
  color: #666;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.nav-link:hover {
  background: #f8f9fa;
  color: #8C4CC3;
}

.nav-link.active {
  background: #8C4CC3;
  color: white;
  border-color: #8C4CC3;
}

.nav-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.nav-text {
  font-size: 12px;
  font-weight: 500;
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
  .nav-list {
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .nav-item {
    flex: none;
    width: calc(33.333% - 8px);
  }
  
  .nav-link {
    padding: 8px;
  }
  
  .nav-text {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .nav-item {
    width: calc(50% - 4px);
  }
}
</style>