<template>
  <div class="homework-container">
    <!-- Пытаемся загрузить реальное ДЗ -->
    <HomeworkUpload 
      v-if="!isLoading && hasRealHomework" 
      :lesson-id="lessonId" 
    />
    
    <!-- Демо-версия если реального ДЗ нет -->
    <HomeworkDemo 
      v-else-if="!isLoading && !hasRealHomework" 
    />
    
    <!-- Индикатор загрузки -->
    <div v-else class="loading-homework">
      <p>Загрузка информации о домашнем задании...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useHomeworkStore } from '@/stores/homeworkStore';
import HomeworkUpload from './HomeworkUpload.vue';
import HomeworkDemo from './HomeworkDemo.vue';

const props = defineProps<{
  lessonId: number;
}>();

const homeworkStore = useHomeworkStore();
const isLoading = ref(true);

// Проверяем, есть ли реальный функционал ДЗ
const hasRealHomework = computed(() => {
  // Пока всегда возвращаем false для демо
  // В реальной версии можно проверять доступность API
  return false;
});

onMounted(async () => {
  try {
    // Пытаемся загрузить реальное ДЗ
    await homeworkStore.fetchHomeworkForLesson(props.lessonId);
  } catch (error) {
    console.log('Реальный функционал ДЗ недоступен, показываем демо');
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.loading-homework {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>