<template>
  <div class="instructor-homeworks">
    <div class="page-header">
      <h1>Проверка домашних заданий</h1>
      <p>Домашние задания, ожидающие вашей проверки</p>
    </div>

    <!-- Временный контент для отладки -->
    <div class="debug-section">
      <h3>Отладка данных:</h3>
      <p>Всего ДЗ: {{ instructorStore.allHomeworks.length }}</p>
      
      <div v-for="hw in instructorStore.allHomeworks" :key="hw.id" class="debug-item">
        <h4>ДЗ ID: {{ hw.id }}</h4>
        <p>Статус: {{ hw.status }}</p>
        <p>User: {{ hw.user }}</p>
        <p>Lesson: {{ hw.lesson }}</p>
        <button @click="testNavigation(hw.id)" class="test-button">
          Тест перехода к ДЗ {{ hw.id }}
        </button>
        <hr>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInstructorStore } from '../../stores/instructorStore'
import { useCoursesStore } from '../../stores/courses'

const router = useRouter()
const instructorStore = useInstructorStore()
const coursesStore = useCoursesStore()

const testNavigation = (homeworkId: number) => {
  console.log('🎯 Тест перехода к ДЗ ID:', homeworkId)
  console.log('📋 Текущий route:', router.currentRoute.value)
  router.push(`/instructor/homeworks/${homeworkId}`)
}

const loadHomeworks = async () => {
  try {
    await instructorStore.loadAllHomeworks()
    await coursesStore.fetchUserCourses()
    
    console.log('📊 Все ДЗ:', instructorStore.allHomeworks)
  } catch (err: any) {
    console.error('❌ Ошибка загрузки ДЗ:', err)
  }
}

onMounted(() => {
  loadHomeworks()
})
</script>

<style scoped>
.instructor-homeworks {
  max-width: 1000px;
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

.debug-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.debug-item {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
}

.test-button {
  background: #8C4CC3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.test-button:hover {
  background: #7b3fb3;
}
</style>