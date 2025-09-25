<template>
  <div class="design-system">
    <!-- Герой-секция -->
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">Zlobina Nails School</h1>
        <p class="hero-subtitle">Система дизайна и руководство по компонентам</p>
        <div class="hero-meta">
          <span class="meta-item">Vue 3 • TypeScript • Pinia</span>
          <span class="meta-item">Mobile First • Минимализм</span>
        </div>
      </div>
    </section>

    <!-- Цветовая палитра -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Цветовая палитра</h2>
        <div class="colors-grid">
          <div v-for="color in colors" :key="color.name" class="color-card">
            <div class="color-swatch" :style="{ backgroundColor: color.value }"></div>
            <div class="color-info">
              <h3>{{ color.name }}</h3>
              <p>{{ color.value }}</p>
              <span class="color-usage">{{ color.usage }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Типографика -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Типографика</h2>
        <div class="typography-showcase">
          <div v-for="type in typography" :key="type.name" class="type-sample">
            <div :class="['type-preview', type.class]">{{ type.sample }}</div>
            <div class="type-specs">
              <span class="spec-name">{{ type.name }}</span>
              <span class="spec-details">{{ type.font }} • {{ type.size }} • {{ type.weight }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Компоненты интерфейса -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Компоненты интерфейса</h2>
        
        <!-- Кнопки -->
        <div class="component-group">
          <h3 class="component-title">Кнопки</h3>
          <div class="buttons-showcase">
            <button v-for="btn in buttons" :key="btn.type" :class="['btn', btn.type]">
              {{ btn.label }}
            </button>
          </div>
        </div>

        <!-- Формы -->
        <div class="component-group">
          <h3 class="component-title">Элементы форм</h3>
          <div class="forms-showcase">
            <div class="input-group">
              <label>Email адрес</label>
              <input type="email" placeholder="user@example.com">
            </div>
            <div class="input-group">
              <label>Выбор курса</label>
              <select>
                <option>Базовый маникюр</option>
                <option>Продвинутый дизайн</option>
                <option>Гель-лак</option>
              </select>
            </div>
            <div class="checkbox-group">
              <label class="checkbox">
                <input type="checkbox" checked>
                <span class="checkmark"></span>
                Запомнить настройки
              </label>
            </div>
          </div>
        </div>

        <!-- Карточки -->
        <div class="component-group">
          <h3 class="component-title">Карточки курсов</h3>
          <div class="cards-showcase">
            <div class="course-card">
              <div class="card-image"></div>
              <div class="card-content">
                <h4>Базовый курс nail-арта</h4>
                <p>Основы дизайна ногтей и техники выполнения</p>
                <div class="progress-container">
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 65%"></div>
                  </div>
                  <span>65% завершено</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Навигация -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Навигационная система</h2>
        
        <!-- Хедер -->
        <div class="component-group">
          <h3 class="component-title">Шапка приложения</h3>
          <div class="header-demo">
            <div class="app-header">
              <div class="header-brand">
                <span class="logo">Zlobina Nails School</span>
              </div>
              <nav class="header-nav">
                <a class="nav-item active">Дашборд</a>
                <a class="nav-item">Курсы</a>
                <a class="nav-item">Прогресс</a>
              </nav>
              <div class="header-user">
                <div class="user-avatar">А</div>
                <span>Анна</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Сайдбар уроков -->
        <div class="component-group">
          <h3 class="component-title">Боковая панель уроков</h3>
          <div class="sidebar-demo">
            <div class="lesson-sidebar">
              <div class="sidebar-header">
                <h4>Содержание курса</h4>
                <span>3/8 уроков завершено</span>
              </div>
              <div class="lessons-list">
                <div class="lesson-line completed">
                  <span class="lesson-status">✓</span>
                  <span class="lesson-title">Введение</span>
                  <span class="lesson-duration">15м</span>
                </div>
                <div class="lesson-line current">
                  <span class="lesson-status">▶</span>
                  <span class="lesson-title">Основы безопасности</span>
                  <span class="lesson-duration">20м</span>
                </div>
                <div class="lesson-line upcoming">
                  <span class="lesson-status">●</span>
                  <span class="lesson-title">Работа с инструментами</span>
                  <span class="lesson-duration">25м</span>
                </div>
                <div class="lesson-line locked">
                  <span class="lesson-status">🔒</span>
                  <span class="lesson-title">Продвинутые техники</span>
                  <span class="lesson-duration">30м</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Адаптивность -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Адаптивный дизайн</h2>
        <div class="responsive-showcase">
          <div v-for="device in devices" :key="device.type" class="device-frame">
            <div class="device-label">{{ device.label }}</div>
            <div class="device-screen" :class="device.type">
              <div class="screen-content">
                <h4>{{ device.title }}</h4>
                <p>{{ device.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Футер -->
    <footer class="footer">
      <div class="container">
        <p>Zlobina Nails School • Vue 3 + TypeScript • 2024</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Цветовая палитра - гармоничные нейтральные тона
const colors = [
  { 
    name: 'Основной', 
    value: '#7C4DFF', 
    usage: 'Главные действия, навигация' 
  },
  { 
    name: 'Вторичный', 
    value: '#424242', 
    usage: 'Текст, заголовки' 
  },
  { 
    name: 'Акцентный', 
    value: '#00BFA5', 
    usage: 'Успешные состояния, прогресс' 
  },
  { 
    name: 'Фон', 
    value: '#FAFAFA', 
    usage: 'Фон приложения' 
  },
  { 
    name: 'Поверхность', 
    value: '#FFFFFF', 
    usage: 'Карточки, панели' 
  },
  { 
    name: 'Граница', 
    value: '#E0E0E0', 
    usage: 'Разделители, границы' 
  }
];

// Типографика
const typography = [
  { 
    name: 'Заголовок 1', 
    class: 'h1',
    sample: 'Дашборд курсов',
    font: 'Inter, system-ui',
    size: '2.25rem',
    weight: '600'
  },
  { 
    name: 'Заголовок 2', 
    class: 'h2',
    sample: 'Мой прогресс обучения',
    font: 'Inter, system-ui',
    size: '1.75rem',
    weight: '600'
  },
  { 
    name: 'Основной текст', 
    class: 'body',
    sample: 'Изучите профессиональные техники nail-арта от экспертов индустрии',
    font: 'Inter, system-ui',
    size: '1rem',
    weight: '400'
  },
  { 
    name: 'Подпись', 
    class: 'caption',
    sample: 'Обновлено 2 часа назад',
    font: 'Inter, system-ui',
    size: '0.875rem',
    weight: '400'
  }
];

// Кнопки
const buttons = [
  { type: 'primary', label: 'Начать обучение' },
  { type: 'secondary', label: 'Смотреть курсы' },
  { type: 'outline', label: 'Сохранить прогресс' },
  { type: 'disabled', label: 'Недоступно' }
];

// Устройства для адаптивности
const devices = [
  { 
    type: 'mobile', 
    label: 'Мобильный (320px)',
    title: 'Оптимизировано для касаний',
    description: 'Удобный интерфейс для пальцев'
  },
  { 
    type: 'tablet', 
    label: 'Планшет (768px)',
    title: 'Сбалансированный макет',
    description: 'Оптимальная плотность контента'
  },
  { 
    type: 'desktop', 
    label: 'Десктоп (1200px)',
    title: 'Полный функционал',
    description: 'Максимальная продуктивность'
  }
];
</script>

<style scoped>
.design-system {
  background: #FAFAFA;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Герой-секция */
.hero {
  background: linear-gradient(135deg, #7C4DFF 0%, #00BFA5 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin: 0 0 30px 0;
}

.hero-meta {
  display: flex;
  gap: 30px;
  justify-content: center;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Секции */
.section {
  padding: 80px 0;
  background: white;
}

.section:nth-child(even) {
  background: #FAFAFA;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 600;
  text-align: center;
  margin: 0 0 60px 0;
  color: #424242;
  letter-spacing: -0.01em;
}

/* Цветовая палитра */
.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.color-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border: 1px solid #F0F0F0;
}

.color-swatch {
  width: 100%;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #E0E0E0;
}

.color-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  color: #424242;
}

.color-info p {
  margin: 0 0 10px 0;
  font-family: 'Monaco', monospace;
  color: #666;
}

.color-usage {
  font-size: 0.9rem;
  color: #888;
}

/* Типографика */
.typography-showcase {
  display: grid;
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.type-sample {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  border: 1px solid #F0F0F0;
}

.type-preview {
  flex: 2;
}

.type-specs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.spec-name {
  font-weight: 600;
  color: #424242;
}

.spec-details {
  font-size: 0.9rem;
  color: #666;
}

.h1 { font-size: 2.25rem; font-weight: 600; color: #424242; line-height: 1.2; }
.h2 { font-size: 1.75rem; font-weight: 600; color: #424242; line-height: 1.3; }
.body { font-size: 1rem; font-weight: 400; color: #424242; line-height: 1.6; }
.caption { font-size: 0.875rem; font-weight: 400; color: #666; line-height: 1.4; }

/* Компоненты */
.component-group {
  margin-bottom: 60px;
}

.component-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #424242;
  margin: 0 0 30px 0;
}

.buttons-showcase {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn.primary {
  background: #7C4DFF;
  color: white;
}

.btn.secondary {
  background: #424242;
  color: white;
}

.btn.outline {
  background: transparent;
  color: #7C4DFF;
  border: 2px solid #7C4DFF;
}

.btn.disabled {
  background: #E0E0E0;
  color: #9E9E9E;
  cursor: not-allowed;
}

.btn:hover:not(.disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(124, 77, 255, 0.2);
}

/* Формы */
.forms-showcase {
  display: grid;
  gap: 25px;
  max-width: 400px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: 500;
  color: #424242;
  font-size: 0.9rem;
}

.input-group input,
.input-group select {
  padding: 12px 16px;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  transition: border-color 0.2s ease;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #7C4DFF;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #E0E0E0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox input:checked + .checkmark {
  background: #7C4DFF;
  border-color: #7C4DFF;
  color: white;
}

/* Карточки */
.cards-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  border: 1px solid #F0F0F0;
}

.card-image {
  height: 120px;
  background: linear-gradient(135deg, #7C4DFF 0%, #00BFA5 100%);
}

.card-content {
  padding: 25px;
}

.card-content h4 {
  margin: 0 0 10px 0;
  color: #424242;
  font-size: 1.2rem;
}

.card-content p {
  margin: 0 0 20px 0;
  color: #666;
  line-height: 1.5;
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-bar {
  height: 4px;
  background: #E0E0E0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #00BFA5;
  border-radius: 2px;
}

/* Навигация */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  background: white;
  border-radius: 12px;
  border: 1px solid #F0F0F0;
}

.logo {
  font-size: 1.3rem;
  font-weight: 700;
  color: #7C4DFF;
}

.header-nav {
  display: flex;
  gap: 30px;
}

.nav-item {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  transition: color 0.2s ease;
}

.nav-item.active {
  color: #7C4DFF;
  border-bottom: 2px solid #7C4DFF;
}

.header-user {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #424242;
  font-weight: 500;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background: #7C4DFF;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Сайдбар */
.lesson-sidebar {
  width: 300px;
  background: white;
  border-radius: 12px;
  border: 1px solid #F0F0F0;
  padding: 25px;
}

.sidebar-header {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #E0E0E0;
}

.sidebar-header h4 {
  margin: 0 0 5px 0;
  color: #424242;
}

.sidebar-header span {
  font-size: 0.9rem;
  color: #666;
}

.lessons-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.lesson-line {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.lesson-line.completed {
  background: #E8F5E8;
  color: #2E7D32;
}

.lesson-line.current {
  background: #E3F2FD;
  color: #1565C0;
}

.lesson-line.upcoming {
  color: #666;
}

.lesson-line.locked {
  color: #9E9E9E;
}

.lesson-status {
  font-size: 0.8rem;
}

.lesson-title {
  flex: 1;
  font-weight: 500;
}

.lesson-duration {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* Адаптивность */
.responsive-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.device-frame {
  text-align: center;
}

.device-label {
  margin-bottom: 15px;
  font-weight: 600;
  color: #424242;
}

.device-screen {
  background: white;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  padding: 30px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.screen-content {
  text-align: center;
}

.screen-content h4 {
  margin: 0 0 10px 0;
  color: #424242;
}

.screen-content p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* Футер */
.footer {
  background: #424242;
  color: white;
  padding: 40px 0;
  text-align: center;
}

.footer p {
  margin: 0;
  opacity: 0.8;
}

/* Адаптивность для мобильных */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
  
  .type-sample {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .app-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .header-nav {
    gap: 20px;
  }
  
  .responsive-showcase {
    grid-template-columns: 1fr;
  }
}
</style>