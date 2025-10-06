<template>
  <div class="student-dashboard">
    <div class="dashboard-header">
      <h1>Мой прогресс обучения</h1>
      <p>Продолжайте обучение и достигайте новых высот в маникюрном искусстве</p>
    </div>

    <!-- Статистика -->
    <StatsCards />

    <!-- Быстрые действия -->
    <div class="quick-actions">
      <h2>Быстрые действия</h2>
      <div class="actions-grid">
        <router-link to="/my-courses" class="action-card">
          <div class="action-icon">📚</div>
          <div class="action-text">Мои курсы</div>
          <div class="action-description">Продолжить обучение</div>
        </router-link>

        <router-link to="/progress" class="action-card">
          <div class="action-icon">📊</div>
          <div class="action-text">Мой прогресс</div>
          <div class="action-description">Посмотреть статистику</div>
        </router-link>

        <router-link to="/courses" class="action-card">
          <div class="action-icon">🔍</div>
          <div class="action-text">Все курсы</div>
          <div class="action-description">Найти новые курсы</div>
        </router-link>

        <router-link to="/profile" class="action-card">
          <div class="action-icon">👤</div>
          <div class="action-text">Мой профиль</div>
          <div class="action-description">Настройки аккаунта</div>
        </router-link>
      </div>
    </div>

    <!-- Активные курсы -->
    <div class="active-courses" v-if="coursesStore.courses.length > 0">
      <h2>Активные курсы</h2>
      <div class="courses-grid">
        <div 
          v-for="course in coursesStore.courses.slice(0, 3)" 
          :key="course.id"
          class="course-card"
          @click="$router.push(`/courses/${course.id}`)"
        >
          <div class="course-image" v-if="course.cover_image">
            <img :src="course.cover_image" :alt="course.title">
          </div>
          <div class="course-info">
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-description">{{ course.description }}</p>
            <div class="course-meta">
              <span class="lessons-count">{{ course.lesson_count || 0 }} уроков</span>
              <span class="course-level" :class="course.access_level?.toLowerCase()">
                {{ getLevelDisplayName(course.access_level) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCoursesStore } from '../../stores/courses'
import StatsCards from './StatsCards.vue'

const coursesStore = useCoursesStore()

const getLevelDisplayName = (level: string | undefined) => {
  const levelMap: Record<string, string> = {
    'BASIC': 'Начальный',
    'ADVANCED': 'Продвинутый',
    'ALL': 'Все уровни'
  }
  return level ? levelMap[level] || level : 'Все уровни'
}
</script>

<style scoped>
.student-dashboard {
  padding: 0;
}

.dashboard-header {
  margin-bottom: 40px;
}

.dashboard-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
}

.dashboard-header p {
  color: #666;
  font-size: 16px;
  line-height: 1.5;
}

.quick-actions {
  margin-bottom: 40px;
}

.quick-actions h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.action-card {
  display: flex;
  flex-direction: column;
  padding: 24px;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #8C4CC3;
}

.action-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.action-text {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.action-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.active-courses {
  margin-top: 40px;
}

.active-courses h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.course-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.course-image {
  height: 160px;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-info {
  padding: 20px;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.course-description {
  color: #666;
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lessons-count {
  font-size: 14px;
  color: #666;
}

.course-level {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.course-level.basic {
  background: #e3f2fd;
  color: #1976d2;
}

.course-level.advanced {
  background: #f3e5f5;
  color: #7b1fa2;
}

.course-level.all {
  background: #e8f5e8;
  color: #388e3c;
}

@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .courses-grid {
    grid-template-columns: 1fr;
  }
  
  .action-card {
    padding: 20px;
  }
}
</style>