<template>
  <div class="lesson-view">
    <div class="lesson-header">
      <h1>Урок {{ lessonId }}</h1>
      <p>Страница урока в разработке</p>
    </div>
    
    <div class="lesson-content">
      <div class="coming-soon">
        <div class="coming-soon-content">
          <span class="icon">📚</span>
          <h2>Страница урока скоро будет доступна</h2>
          <p>Мы работаем над этим разделом</p>
          <router-link to="/dashboard" class="back-button">
            ← Назад к дашборду
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Получаем ID урока из параметров маршрута
const lessonId = computed(() => route.params.id);
</script>

<style scoped>
.lesson-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.lesson-header {
  margin-bottom: 32px;
}

.lesson-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
}

.lesson-header p {
  color: #666;
  font-size: 16px;
}

.lesson-content {
  margin-top: 24px;
}

.coming-soon {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.coming-soon-content {
  text-align: center;
  color: #666;
}

.coming-soon-content .icon {
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
}

.coming-soon-content h2 {
  font-size: 24px;
  margin-bottom: 8px;
  color: #333;
}

.back-button {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #8C4CC3;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background: #7b3fb3;
}
</style>