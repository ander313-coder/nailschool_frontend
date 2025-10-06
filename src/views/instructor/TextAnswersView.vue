<template>
  <div class="text-answers">
    <div class="debug-info" style="background: #e3f2fd; padding: 10px; border-radius: 6px; margin-bottom: 20px;">
      <strong>DEBUG:</strong> TextAnswersView загружен! 🎉 Route: {{ $route.path }}
    </div>

    <div class="page-header">
      <h1>Текстовые ответы в тестах</h1>
      <p>Ответы студентов, требующие проверки</p>
    </div>

    <!-- Временный контент -->
    <div class="test-content">
      <h2>Страница текстовых ответов работает! 📝</h2>
      <p>Здесь будут ответы студентов на текстовые вопросы в тестах.</p>
      
      <div class="debug-data" style="margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 8px;">
        <h3>Данные из store:</h3>
        <p>Текстовых ответов на проверку: {{ instructorStore.pendingTextAnswersCount }}</p>
      </div>

      <div class="test-actions">
        <button @click="$router.back()" class="back-button">← Назад</button>
        <button @click="$router.push('/instructor/homeworks')" class="next-button">
          Перейти к ДЗ ←
        </button>
        <button @click="reloadPage" class="reload-button">
          🔄 Перезагрузить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useInstructorStore } from '../../stores/instructorStore'

const instructorStore = useInstructorStore()

console.log('🎯 TextAnswersView загружен!')

const reloadPage = () => {
  window.location.reload()
}

onMounted(() => {
  console.log('🚀 TextAnswersView mounted!')
})
</script>

<style scoped>
.text-answers {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
}

.page-header p {
  color: #666;
  font-size: 16px;
}

.test-content {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.test-content h2 {
  color: #8C4CC3;
  margin-bottom: 16px;
}

.test-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
  flex-wrap: wrap;
}

.back-button, .next-button, .reload-button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button {
  background: #6c757d;
  color: white;
}

.back-button:hover {
  background: #5a6268;
}

.next-button {
  background: #8C4CC3;
  color: white;
}

.next-button:hover {
  background: #7b3fb3;
}

.reload-button {
  background: #17a2b8;
  color: white;
}

.reload-button:hover {
  background: #138496;
}
</style>