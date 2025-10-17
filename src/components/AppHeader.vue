<template>
  <header class="app-header">
    <div class="container">
      <!-- Левая часть - Логотип -->
      <div class="logo">
        <router-link to="/" class="logo-link">
          <span class="logo-text">Zlobina Nails School</span>
          <div class="logo-sub-text">
            <p>PROF EDUCATION</p>
          </div>
        </router-link>
      </div>

      <!-- Правая часть - Навигация и Авторизация -->
      <div class="right-section">

        <!-- Центральная часть - Навигация -->
        <nav class="navigation">
          <router-link to="/" class="nav-link">Главная</router-link>
          <router-link to="/courses" class="nav-link">Все курсы</router-link>
          <router-link to="/about" class="nav-link">О школе</router-link>
        </nav>
        <NotificationBell />
        <!-- Правая часть - Авторизация -->
        <div class="auth-section">
          <template v-if="authStore.isAuthenticated">
            <div class="dropdown">
              <button class="dropdown-toggle" @click="toggleUserDropdown">
                <div class="user-menu">
                  <button class="user-button">
                    <span class="user-avatar">{{ getUserInitials }}</span>
                  </button>
                </div>
              </button>
              <div class="dropdown-menu user-dropdown" v-show="isUserDropdownOpen">
                <!-- Информация о пользователе -->
                <div class="user-info">
                  <div class="user-avatar-large">
                    {{ getUserInitials }}
                  </div>
                  <div class="user-details">
                    <div class="user-name">{{ userName }}</div>
                    <div class="user-role">{{ userRole }}</div>
                  </div>
                </div>
                
                <div class="dropdown-divider"></div>
                
                <!-- Навигация дашборда -->
                <router-link 
                  to="/dashboard" 
                  class="dropdown-item"
                  @click="closeDropdown"
                >
                  Обзор
                </router-link>
                
                <router-link 
                  to="/my-courses" 
                  class="dropdown-item"
                  @click="closeDropdown"
                >
                  Мои курсы
                </router-link>            
                
                <!-- Настройки и выход -->
                <router-link 
                  to="/profile" 
                  class="dropdown-item"
                  @click="closeDropdown"
                >
                  Профиль
                </router-link>                
                
                <div class="dropdown-divider"></div>
                
                <button class="dropdown-item logout-item" @click="handleLogout">
                  Выйти
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <router-link to="/login" class="auth-link">Войти</router-link>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, ref, onUnmounted, onMounted } from 'vue'
import NotificationBell from '@/components/notifications/NotificationBell.vue';
const authStore = useAuthStore()
const isUserDropdownOpen = ref(false)

const getUserInitials = computed(() => {
  const username = authStore.user?.first_name || authStore.user?.username;
  if (!username) return 'U';
  return username.charAt(0).toUpperCase();
})

const userName = computed(() => {
  if (!authStore.user) return 'Пользователь';
  return authStore.user.first_name || authStore.user.username || 'Пользователь';
})

const userRole = computed(() => {
  if (!authStore.user) return '';
  const roleMap: Record<string, string> = {
    'TRAINEE': 'Стажер',
    'MASTER': 'Мастер',
    'INSTRUCTOR': 'Инструктор'
  };
  return roleMap[authStore.user.role] || authStore.user.role;
})

const toggleUserDropdown = () => {
  isUserDropdownOpen.value = !isUserDropdownOpen.value
}

const closeDropdown = () => {
  isUserDropdownOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  closeDropdown()
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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

.auth-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.auth-link {
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.auth-link:hover {
  color: var(--primary);
}

.auth-link-primary {
  background: var(--primary);
  color: white;
}

.auth-link-primary:hover {
  background: var(--primary-dark);
  color: white;
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

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.user-button:hover {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.user-avatar {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--accent);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Выпадающее меню пользователя */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  padding: 1rem 0;
  min-width: 200px;
  margin-top: 10px;
  z-index: 1001;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 0 1.5rem 1rem;
  margin-bottom: 0.5rem;
}

.user-avatar-large {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  margin-right: 0.75rem;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: 0.2rem;
  font-size: 1.5rem;
}

.user-role {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0.5rem 0;
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
  font-size: 0.9rem;
}

.dropdown-item:hover {
  color: var(--primary);
  background: var(--gray-50);
}

.logout-item {
  color: var(--error);
}

.logout-item:hover {
  color: var(--error);
  background: var(--error-light);
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
  
  .user-button {
    width: 40px;
    height: 40px;
  }
  
  .user-avatar {
    font-size: 1rem;
  }

  .logo-text {
    font-size: 1rem;
  }
  
  .user-dropdown {
    min-width: 180px;
    right: -10px;
  }
}

@media (max-width: 480px) {
  .user-button {
    width: 38px;
    height: 38px;
  }
  
  .user-avatar {
    font-size: 0.9rem;
  }
  
  .auth-link {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
  
  .user-dropdown {
    min-width: 160px;
  }
  
  .user-info {
    padding: 0 1rem 0.75rem;
  }
  
  .dropdown-item {
    padding: 0.6rem 1rem;
  }
}
</style>