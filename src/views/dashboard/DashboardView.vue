<template>
  <div class="dashboard-view">
    <div class="container">
      <!-- Заголовок -->
      <div class="dashboard-header">
        <h1 class="dashboard-title">Личный кабинет</h1>
        <p class="dashboard-subtitle">Добро пожаловать, {{ userStore.user?.username }}!</p>
      </div>

      <!-- Быстрая навигация -->
      <div class="quick-nav">
        <router-link to="/my-courses" class="nav-card">
          <div class="nav-icon">📚</div>
          <div class="nav-content">
            <h3>Мои курсы</h3>
            <p>Продолжайте обучение</p>
          </div>
        </router-link>
        
        <router-link to="/profile" class="nav-card">
          <div class="nav-icon">👤</div>
          <div class="nav-content">
            <h3>Профиль</h3>
            <p>Настройки аккаунта</p>
          </div>
        </router-link>
      </div>

      <!-- Статистика -->
      <div class="stats-section">
        <h2 class="section-title">Общая статистика</h2>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.activeCourses || 0 }}</div>
            <div class="stat-label">Активных курсов</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.completedLessons || 0 }}</div>
            <div class="stat-label">Пройдено уроков</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.avgScore || 0 }}%</div>
            <div class="stat-label">Средний балл</div>
          </div>
        </div>
      </div>

      <!-- Активные курсы -->
      <div class="courses-section">
        <div class="section-header">
          <h2 class="section-title">Активные курсы</h2>
          <router-link to="/my-courses" class="view-all-link">
            Все курсы →
          </router-link>
        </div>
        <div class="courses-grid">
          <div class="empty-state" v-if="!stats.activeCourses">
            <div class="empty-icon">📚</div>
            <p>У вас пока нет активных курсов</p>
            <router-link to="/courses" class="btn btn-primary">
              Выбрать курс
            </router-link>
          </div>
          <div class="course-cards" v-else>
            <!-- Здесь будут карточки курсов -->
            <p>Список курсов будет здесь</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const userStore = useAuthStore()
const stats = ref({
  activeCourses: 0,
  completedLessons: 0,
  avgScore: 0
})

// Заглушка для загрузки статистики
onMounted(async () => {
  // Здесь будет загрузка реальных данных
  setTimeout(() => {
    stats.value = {
      activeCourses: 2,
      completedLessons: 15,
      avgScore: 87
    }
  }, 500)
})
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background: var(--gray-50);
  padding: 2rem 0;
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 1rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.dashboard-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

/* Быстрая навигация */
.quick-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.nav-card {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.nav-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.nav-icon {
  font-size: 2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-100);
  border-radius: 12px;
}

.nav-content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: var(--text-primary);
}

.nav-content p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

/* Статистика */
.stats-section {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: var(--border-radius);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Секция курсов */
.courses-section {
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-all-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

.view-all-link:hover {
  text-decoration: underline;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: var(--primary);
  color: var(--white);
}

.btn-primary:hover {
  background: var(--primary-dark);
}

/* Адаптивность */
@media (max-width: 768px) {
  .dashboard-view {
    padding: 1rem 0;
  }
  
  .dashboard-title {
    font-size: 1.75rem;
  }
  
  .quick-nav {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .view-all-link {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-card {
    padding: 1rem;
  }
  
  .nav-icon {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
}
</style>