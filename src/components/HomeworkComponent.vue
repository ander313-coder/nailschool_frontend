<template>
  <div class="homework-container">
    <!-- Реальная форма ДЗ -->
    <HomeworkUpload 
      v-if="!isLoading" 
      :lesson-id="lessonId" 
    />
    
    <!-- Индикатор загрузки -->
    <div v-else class="loading-homework">
      <p>Загрузка информации о домашнем задании...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useHomeworkStore } from '@/stores/homeworkStore';
import HomeworkUpload from './HomeworkUpload.vue';

const props = defineProps<{
  lessonId: number;
}>();

const homeworkStore = useHomeworkStore();
const isLoading = ref(true);

onMounted(async () => {
  try {
    await homeworkStore.fetchHomeworkForLesson(props.lessonId);
  } catch (error) {
    console.log('ДЗ для этого урока не найдено');
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.no-homework {
  margin: 2rem 0;
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.no-homework-content h3 {
  color: #666;
  margin-bottom: 1rem;
}

.loading-homework {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>