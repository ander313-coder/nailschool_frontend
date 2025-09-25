<template>
  <div class="homework-upload">
    <h3>📎 Домашнее задание</h3>
    
    <!-- Статус ДЗ -->
    <div v-if="homework" class="homework-status" :class="homework.status">
      <span v-if="homework.status === 'PENDING'">⏳ На проверке</span>
      <span v-else-if="homework.status === 'APPROVED'">✅ Принято</span>
      <span v-else-if="homework.status === 'REJECTED'">❌ На доработку</span>
    </div>

    <!-- Форма загрузки -->
    <div v-if="!homework || homework.status === 'REJECTED'" class="upload-form">
      <textarea 
        v-model="comment" 
        placeholder="Комментарий к работе (необязательно)"
        class="comment-field"
      ></textarea>
      
      <div class="file-upload">
        <input 
          type="file" 
          ref="fileInput"
          multiple 
          accept="image/*,video/*"
          @change="handleFileSelect"
          class="file-input"
        >
        <button @click="triggerFileInput" class="upload-btn">
          📎 Выбрать файлы
        </button>
        <span class="file-hint">Можно загрузить фото или видео работы</span>
      </div>

      <!-- Список выбранных файлов -->
      <div v-if="selectedFiles.length" class="selected-files">
        <h4>Выбранные файлы:</h4>
        <ul>
          <li v-for="(file, index) in selectedFiles" :key="index" class="file-item">
            {{ file.name }}
            <button @click="removeFile(index)" class="remove-btn">×</button>
          </li>
        </ul>
      </div>

      <button 
        @click="submitHomework" 
        :disabled="!selectedFiles.length || isSubmitting"
        class="submit-btn"
      >
        {{ isSubmitting ? 'Отправка...' : 'Отправить на проверку' }}
      </button>
    </div>

    <!-- Загруженные файлы -->
    <div v-if="homework && homework.files.length" class="uploaded-files">
      <h4>Загруженные файлы:</h4>
      <div class="files-grid">
        <div v-for="file in homework.files" :key="file.id" class="file-card">
          <a :href="file.file" target="_blank" class="file-link">
            📎 {{ getFileName(file.file) }}
          </a>
          <span class="file-date">{{ formatDate(file.uploaded_at) }}</span>
        </div>
      </div>
    </div>

    <!-- Сообщения об ошибках -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useHomeworkStore } from '@/stores/homeworkStore';
import type { HomeworkSubmission } from '@/types/api';

const props = defineProps<{
  lessonId: number;
}>();

const homeworkStore = useHomeworkStore();
const fileInput = ref<HTMLInputElement>();
const comment = ref('');
const selectedFiles = ref<File[]>([]);
const isSubmitting = ref(false);

const homework = computed(() => homeworkStore.currentHomework);
const error = computed(() => homeworkStore.error);

// Методы
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    selectedFiles.value = Array.from(target.files);
  }
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const submitHomework = async () => {
  isSubmitting.value = true;
  
  try {
    const submission: HomeworkSubmission = {
      lesson_id: props.lessonId,
      comment: comment.value,
      files: selectedFiles.value
    };
    
    await homeworkStore.submitHomework(submission);
    selectedFiles.value = [];
    comment.value = '';
  } catch (err) {
    console.error('Homework submission failed:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const getFileName = (fileUrl: string) => {
  return fileUrl.split('/').pop() || 'file';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ru-RU');
};
</script>

<style scoped>
.homework-upload {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
}

.homework-status {
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: bold;
}

.homework-status.PENDING {
  background: #fff3cd;
  color: #856404;
}

.homework-status.APPROVED {
  background: #d4edda;
  color: #155724;
}

.homework-status.REJECTED {
  background: #f8d7da;
  color: #721c24;
}

.upload-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-field {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 80px;
  resize: vertical;
}

.file-upload {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-input {
  display: none;
}

.upload-btn {
  padding: 0.5rem 1rem;
  background: #8C4CC3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.file-hint {
  font-size: 0.9rem;
  color: #666;
}

.selected-files ul {
  list-style: none;
  padding: 0;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: white;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}

.remove-btn {
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.submit-btn {
  padding: 1rem;
  background: #4ECDC4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.uploaded-files .files-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.file-card {
  padding: 1rem;
  background: white;
  border-radius: 4px;
  text-align: center;
}

.file-link {
  color: #8C4CC3;
  text-decoration: none;
}

.error-message {
  color: #FF6B6B;
  margin-top: 1rem;
}
</style>