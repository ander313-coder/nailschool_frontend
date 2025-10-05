<template>
  <div class="stats-cards">
    <!-- Карточка ДЗ на проверку -->
    <div class="stat-card">
      <div class="stat-icon"><img src="/src/assets/styles/icons/assignment.svg" alt="ДЗ на проверку"></div>
      <div class="stat-content">
        <h3>ДЗ на проверку</h3>
        <p class="stat-number">{{ pendingHomeworksCount }}</p>
        <p class="stat-label">ожидают проверки</p>
      </div>
    </div>

    <!-- Карточка текстовых ответов -->
    <div class="stat-card">
      <div class="stat-icon"><img src="/src/assets/styles/icons/description.svg" alt="Текстовые ответы"></div>
      <div class="stat-content">
        <h3>Ответы в тестах</h3>
        <p class="stat-number">{{ pendingTextAnswersCount }}</p>
        <p class="stat-label">требуют проверки</p>
      </div>
    </div>

    <!-- Карточка активных студентов -->
    <div class="stat-card">
      <div class="stat-icon"><img src="/src/assets/styles/icons/people.svg" alt="Активные студенты"></div>
      <div class="stat-content">
        <h3>Активных студентов</h3>
        <p class="stat-number">{{ activeStudentsCount }}</p>
        <p class="stat-label">учатся сейчас</p>
      </div>
    </div>

    <!-- Карточка проверенных работ -->
    <div class="stat-card">
      <div class="stat-icon"><img src="/src/assets/styles/icons/verified.svg" alt="Проверенные работы"></div>
      <div class="stat-content">
        <h3>Проверено работ</h3>
        <p class="stat-number">{{ reviewedWorksCount }}</p>
        <p class="stat-label">за всё время</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useInstructorStore } from '@/stores/instructorStore';
import { useCoursesStore } from '@/stores/coursesStore';

const instructorStore = useInstructorStore();
const coursesStore = useCoursesStore();

// Статистика для преподавателя
const pendingHomeworksCount = computed(() => instructorStore.pendingHomeworksCount);
const pendingTextAnswersCount = computed(() => instructorStore.pendingTextAnswersCount);

// Демо-данные (позже можно заменить на реальные)
const activeStudentsCount = computed(() => 24); // Можно получить из API
const reviewedWorksCount = computed(() => instructorStore.homeworksByStatus.APPROVED.length);
</script>
<style scoped>
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  background: #f8f9fa;
}

.stat-icon img {
  width: 32px;
  height: 32px;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  margin-bottom: 8px;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

/* Адаптивность */
@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stat-card {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .stat-icon {
    width: 50px;
    height: 50px;
    margin-right: 12px;
  }
  
  .stat-icon img {
    width: 24px;
    height: 24px;
  }
  
  .stat-number {
    font-size: 28px;
  }
}
</style>