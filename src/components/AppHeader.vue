<template>
  <header class="app-header">
    <div class="container">
      <!-- Левая часть - Логотип -->
      <div class="logo">
        <router-link to="/" class="logo-link">
          <span class="logo-text">Zlobina Nails School</span>
          <div class="logo-sub-text">
          <p>CORPORATE EDUCATION</p>
          </div>
        </router-link>
      </div>

      <!-- Правая часть - Навигация и Авторизация -->
      <div class="right-section">
        <!-- Центральная часть - Навигация -->
        <nav class="navigation">
          <router-link to="/" class="nav-link">Главная</router-link>
          <!-- Выпадающее меню "Мои курсы" -->
          <div class="dropdown" @mouseenter="isDropdownOpen = true" @mouseleave="isDropdownOpen = false">
            <button class="dropdown-toggle">
              Мои курсы
              <span class="dropdown-arrow">▼</span>
            </button>
            <div class="dropdown-menu" v-show="isDropdownOpen">
              <router-link to="/courses/active" class="dropdown-item">
                Активные
              </router-link>
              <router-link to="/courses/completed" class="dropdown-item">
                Завершенные
              </router-link>
            </div>
          </div>
        </nav>

        <!-- Правая часть - Авторизация -->
        <div class="auth-section">
          <template v-if="authStore.isAuthenticated">
            <div class="user-menu">
              <button class="user-button">
                <div class="user-avatar">
                  <span>{{ getUserInitials }}</span>
                </div>
                <span class="user-name">{{ authStore.user?.username }}</span>
              </button>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="auth-link">Войти</router-link>
            <router-link to="/login" class="auth-link">
              <img src="../assets/styles/pic/default-avatar.png" alt="avatar" class="avatar-img">
            </router-link>            
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'

const authStore = useAuthStore()
const isDropdownOpen = ref(false)

const getUserInitials = computed(() => {
  if (!authStore.user?.username) return 'U'
  return authStore.user.username.charAt(0).toUpperCase()
})


// Закрываем dropdown при клике вне его
const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown')) {
    isDropdownOpen.value = false
  }
}

// Добавляем обработчик клика по документу
document.addEventListener('click', closeDropdown)
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
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 2rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-link {
  text-decoration: none;
}

.logo {
  max-width: 200px;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-sub-text {
  font-size: 0.8rem;
  color: var(--primary);
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navigation {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.nav-link:hover {
  color: var(--primary);
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: var(--transition);
}

.dropdown-toggle:hover {
  color: var(--primary);
}

.dropdown-arrow {
  font-size: 0.8rem;
  transition: var(--transition);
}

.dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  padding: 0.5rem 0;
  min-width: 180px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 0.75rem 1.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--gray-50);
  color: var(--primary);
}

.auth-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.auth-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.auth-link:hover {
  color: var(--primary);
}

.avatar-img {
  max-width: 50px;
  height: auto;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .navigation {
    display: none;
  }
  
  .right-section {
    gap: 1rem;
  }
  
  .auth-section {
    gap: 1rem;
  }
  
  .auth-button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .logo-text {
    font-size: 1rem;
  }
}
</style>