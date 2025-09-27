<template>
  <div class="homework-demo">
    <div class="demo-header">
      <h3>📎 Домашнее задание</h3>
      <span class="demo-badge">Демо-режим</span>
    </div>
    
    <div class="demo-content">
      <div class="demo-instructions">
        <h4>Инструкция по выполнению:</h4>
        <div class="steps">
          <div v-for="(step, index) in instructions" :key="index" class="step">
            <span class="step-number">{{ index + 1 }}</span>
            <span class="step-text">{{ step }}</span>
          </div>
        </div>
      </div>

      <div class="demo-upload-area">
        <h4>Пример загрузки работы:</h4>
        <div class="upload-preview">
          <div class="file-type" v-for="type in fileTypes" :key="type.name">
            <div class="file-icon">{{ type.icon }}</div>
            <span class="file-name">{{ type.name }}</span>
            <span class="file-desc">{{ type.description }}</span>
          </div>
        </div>
        
        <button class="demo-upload-btn" @click="simulateUpload">
          📤 Попробовать загрузить (демо)
        </button>
      </div>

      <div class="demo-feedback">
        <h4>Как будет работать проверка:</h4>
        <div class="feedback-flow">
          <div class="flow-step" v-for="step in feedbackSteps" :key="step.text">
            <div class="flow-icon">{{ step.icon }}</div>
            <div class="flow-text">{{ step.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const instructions = [
  'Выполните практическое задание согласно уроку',
  'Сфотографируйте результат работы или снимите видео процесса',
  'Загрузите файлы через форму ниже',
  'Дождитесь проверки преподавателем'
];

const fileTypes = [
  { icon: '📸', name: 'Фото работы', description: 'JPG, PNG до 10MB' },
  { icon: '🎥', name: 'Видео процесса', description: 'MP4 до 50MB' },
  { icon: '📄', name: 'Документы', description: 'PDF, DOC до 5MB' }
];

const feedbackSteps = [
  { icon: '⏳', text: 'Отправка на проверку' },
  { icon: '👩‍🏫', text: 'Проверка преподавателем' },
  { icon: '💬', text: 'Обратная связь' },
  { icon: '✅', text: 'Задание принято' }
];

const simulateUpload = () => {
  // Имитация процесса загрузки
  alert('Демо-режим: В реальной версии здесь будет форма загрузки файлов.\n\nПреподаватель получит вашу работу и оставит подробный комментарий с рекомендациями.');
};
</script>

<style scoped>
.homework-demo {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 2px solid #8C4CC3;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f5ff 0%, #fff 100%);
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.demo-badge {
  background: #FF6B6B;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.demo-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.step {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #8C4CC3;
}

.step-number {
  width: 30px;
  height: 30px;
  background: #8C4CC3;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.upload-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.file-type {
  padding: 1.5rem;
  text-align: center;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.file-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.file-name {
  display: block;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.file-desc {
  font-size: 0.9rem;
  color: #666;
}

.demo-upload-btn {
  width: 100%;
  padding: 1rem;
  background: #4ECDC4;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.demo-upload-btn:hover {
  background: #3bbbb3;
}

.feedback-flow {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.flow-step {
  text-align: center;
  padding: 1rem;
}

.flow-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.flow-text {
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .upload-preview {
    grid-template-columns: 1fr;
  }
  
  .feedback-flow {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>