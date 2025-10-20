<template>
  <div class="homework-list-view">
    <div class="page-header">
      <h1>Мои домашние задания</h1>
      <p>Здесь вы можете отслеживать статус проверки ваших работ</p>
    </div>

    <!-- Фильтры -->
    <div class="filters-section">
      <div class="filter-group">
        <label for="status-filter">Статус:</label>
        <select 
          id="status-filter" 
          v-model="selectedStatus"
          @change="loadHomeworks"
          class="filter-select"
        >
          <option value="">Все статусы</option>
          <option value="PENDING">На проверке</option>
          <option value="APPROVED">Принято</option>
          <option value="REJECTED">На доработку</option>
        </select>
      </div>
      
      <button 
        @click="loadHomeworks" 
        :disabled="homeworkStore.isLoading"
        class="refresh-btn"
      >
        {{ homeworkStore.isLoading ? 'Загрузка...' : 'Обновить' }}
      </button>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="homeworkStore.isLoading" class="loading-state">
      <p>Загрузка домашних заданий...</p>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-else-if="homeworkStore.error" class="error-state">
      <p class="error-message">{{ homeworkStore.error }}</p>
      <button @click="loadHomeworks" class="retry-btn">Попробовать снова</button>
    </div>

    <!-- Пустой список -->
    <div v-else-if="homeworkStore.homeworkList.length === 0" class="empty-state">
      <p>У вас пока нет домашних заданий</p>
    </div>

    <!-- Список домашних работ -->
    <div v-else class="homework-list">
      <div 
        v-for="homework in homeworkStore.homeworkList" 
        :key="homework.id"
        class="homework-card"
        :class="`status-${homework.status.toLowerCase()}`"
      >
        <div class="homework-header">
          <h3 class="lesson-title">
            {{ homework.lesson_title || 'Без названия' }}
          </h3>
          <span class="status-badge" :class="homework.status.toLowerCase()">
            {{ getStatusText(homework.status) }}
          </span>
        </div>

        <div class="homework-meta">
          <span class="course-name">
            Курс: {{ homework.course_title || 'Без курса' }}
          </span>
          <span class="submission-date">
            Отправлено: {{ formatDate(homework.created_at) }}
          </span>
        </div>

        <!-- Комментарий студента -->
        <div v-if="homework.comment" class="student-comment">
          <strong>Ваш комментарий:</strong>
          <p>{{ homework.comment }}</p>
        </div>

        <!-- Комментарий преподавателя -->
        <div v-if="homework.instructor_comment" class="instructor-feedback">
          <strong>Комментарий преподавателя:</strong>
          <p>{{ homework.instructor_comment }}</p>
        </div>

        <!-- Файлы -->
        <div v-if="homework.files.length > 0" class="homework-files">
          <strong>Прикрепленные файлы:</strong>
          <ul>
            <li v-for="file in homework.files" :key="file.id">
              <a :href="file.url || file.file" target="_blank" class="file-link">
                📎 {{ getFileName(file.file) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Информация об обновлении статуса -->
        <div v-if="homework.updated_at !== homework.created_at" class="status-update">
          <small>Статус обновлен: {{ formatDate(homework.updated_at) }}</small>
          <router-link :to="`/homeworks/${homework.id}`" class="view-link">Подробнее</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useHomeworkStore } from '@/stores/homeworkStore';

const homeworkStore = useHomeworkStore();
const selectedStatus = ref('');

// Загрузка домашних работ
const loadHomeworks = async () => {
  const filters = selectedStatus.value ? { status: selectedStatus.value } : undefined;
  await homeworkStore.fetchUserHomeworks(filters);
};

// Форматирование даты
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getFileName = (filePath: string) => {
  try {
    const decoded = decodeURIComponent(filePath.split('/').pop() || 'Файл')
    return decoded
  } catch {
    return filePath.split('/').pop() || 'Файл'
  }
}

// Тексты статусов
const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'PENDING': 'На проверке',
    'APPROVED': 'Принято', 
    'REJECTED': 'На доработку'
  };
  return statusMap[status] || status;
};

// Загружаем данные при монтировании компонента
onMounted(() => {
  loadHomeworks();
});
</script>

<style scoped>
.homework-list-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #8C4CC3;
  margin-bottom: 8px;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 24px;
  gap: 16px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.refresh-btn, .retry-btn, .view-link {
  padding: 8px 16px;
  background-color: #8C4CC3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.refresh-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.homework-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  background: white;
}

.homework-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
}

.lesson-title {
  margin: 0;
  color: #333;
  flex: 1;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background-color: #d1edff;
  color: #0c5460;
}

.status-badge.rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.homework-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.student-comment, .instructor-feedback, .homework-files {
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.instructor-feedback {
  background-color: #e7f3ff;
  border-left: 4px solid #8C4CC3;
}

.homework-files ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.file-link {
  color: #8C4CC3;
  text-decoration: none;
}

.file-link:hover {
  text-decoration: underline;
}

.status-update {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  font-size: 12px;
  color: #888;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-message {
  color: #dc3545;
  margin-bottom: 16px;
}

/* Адаптивность */
@media (max-width: 768px) {
  .homework-list-view {
    padding: 16px;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .homework-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .homework-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>