<template>
  <div class="home-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Профессиональное обучение 
              <span class="text-gradient">маникюру</span>
            </h1>
            <p class="hero-description">
              Онлайн-платформа для подготовки мастеров международного уровня. 
              От основ до продвинутых техник под руководством опытных наставников.
            </p>
            <div class="hero-actions">
              <router-link v-if="!authStore.isAuthenticated" to="/login" class="btn btn-primary">
                Начать обучение
              </router-link>
              <router-link v-else to="/courses" class="btn btn-primary">
                Мои курсы
              </router-link>
              <router-link to="/about" class="btn btn-secondary">
                О школе
              </router-link>
            </div>
          </div>
          <div class="hero-visual">
            <iframe 
                width="100%" 
                height="300" 
                src="https://play.boomstream.com/sXuALQMy?color=%23ffffff&title=0&size=cover&volume=20"
                frameborder="0" 
                allowfullscreen>
            </iframe>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="features-title">Почему выбирают нашу школу</h2>
          <p class="features-subtitle">Ключевые преимущества обучения в Zlobina Nails School</p>
        </div>
        <div class="features-columns">
          <div class="feature-column">
            <div class="feature-item">
              <div class="feature-icon"><img src="/src/assets/styles/icons/school.svg" alt="Профессиональные курсы"></div>
              <div class="feature-content">
                <h3>Профессиональные курсы</h3>
                <p>Обучение от базовых техник до сложного дизайна с сертификацией</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon"><img src="/src/assets/styles/icons/glasses.svg" alt="Опытные преподаватели"></div>
              <div class="feature-content">
                <h3>Опытные преподаватели</h3>
                <p>Мастера с международным опытом и педагогическим образованием</p>
              </div>
            </div>
          </div>
          
          <div class="feature-column">
            <div class="feature-item">
              <div class="feature-icon"><img src="/src/assets/styles/icons/online.svg" alt="Онлайн-формат"></div>
              <div class="feature-content">
                <h3>Онлайн-формат</h3>
                <p>Учитесь из любой точки мира в удобное время с поддержкой куратора</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon"><img src="/src/assets/styles/icons/practise.svg" alt="Практические задания"></div>
              <div class="feature-content">
                <h3>Практические задания</h3>
                <p>Реальные кейсы и домашние задания с проверкой преподавателя</p>
              </div>
            </div>
          </div>
          
          <div class="feature-column">
            <div class="feature-item">
              <div class="feature-icon"><img src="/src/assets/styles/icons/structure.svg" alt="Структурированная программа"></div>
              <div class="feature-content">
                <h3>Структурированная программа</h3>
                <p>Пошаговое обучение от простого к сложному с закреплением материала</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon"><img src="/src/assets/styles/icons/test.svg" alt="Автоматические тесты"></div>
              <div class="feature-content">
                <h3>Автоматические тесты</h3>
                <p>Итоговое тестирование на знание пройденного материала</p>
              </div>
            </div>
          </div>
          
          <div class="feature-column">
            <div class="feature-item">
              <div class="feature-icon"><img src="/src/assets/styles/icons/infinity.svg" alt="Пожизненный доступ"></div>
              <div class="feature-content">
                <h3>Пожизненный доступ</h3>
                <p>Возможность повторять материалы в любое время после обучения</p>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon"><img src="/src/assets/styles/icons/career.svg" alt="Карьерная поддержка"></div>
              <div class="feature-content">
                <h3>Карьерная поддержка</h3>
                <p>Помощь в трудоустройстве и запуске собственного бизнеса</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section - новый блок -->
    <section class="how-it-works-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Как это работает</h2>
          <p class="section-subtitle">Простой и понятный процесс обучения от регистрации до сертификации</p>
        </div>
        <div class="process-steps">
          <div class="process-step">
            <div class="step-number">01</div>
            <div class="step-content">
              <h3>Регистрация и выбор курса</h3>
              <p>Создайте аккаунт и выберите подходящую программу обучения. Получите доступ к личному кабинету.</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-number">02</div>
            <div class="step-content">
              <h3>Изучение теоретических материалов</h3>
              <p>Осваивайте теорию через видеоуроки, презентации и текстовые материалы в удобном темпе.</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-number">03</div>
            <div class="step-content">
              <h3>Практические задания</h3>
              <p>Выполняйте практические работы, отрабатывая полученные знания на реальных кейсах.</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-number">04</div>
            <div class="step-content">
              <h3>Проверка и обратная связь</h3>
              <p>Преподаватель проверяет ваши работы, дает подробные комментарии и рекомендации.</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-number">05</div>
            <div class="step-content">
              <h3>Тестирование и сертификация</h3>
              <p>Проходите финальное тестирование и получайте сертификат об успешном завершении курса.</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-number">06</div>
            <div class="step-content">
              <h3>Карьерное развитие</h3>
              <p>Получайте поддержку в трудоустройстве или запуске собственного nail-бизнеса.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Courses Preview Section -->
    <section class="courses-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Популярные курсы</h2>
          <p class="section-subtitle">Выберите подходящую программу обучения</p>
        </div>
        <div class="courses-grid">
          <div class="course-card">
            <div class="course-image">
              <img src="/src/assets/styles/pic/pilki.jpg" alt="Основы маникюра" class="course-img">
            </div>
            <div class="course-content">
              <h3>Основы маникюра</h3>
              <p>Базовый курс для начинающих мастеров</p>
              <div class="course-meta">
                <span class="meta-item">⏱ 24 урока</span>
                <span class="meta-item">👥 Для начинающих</span>
              </div>
            </div>
          </div>
          <div class="course-card">
            <div class="course-image">
              <img src="/src/assets/styles/pic/pilki.jpg" alt="Пилки + Плёнки" class="course-img">
            </div>
            <div class="course-content">
              <h3>Пилки + Плёнки</h3>
              <p>Пилочный маникюр с покрытием плёнки</p>
              <div class="course-meta">
                <span class="meta-item">⏱ 36 уроков</span>
                <span class="meta-item">👥 Для мастеров</span>
              </div>
            </div>
          </div>
          <div class="course-card">
            <div class="course-image">
              <img src="/src/assets/styles/pic/pilki.jpg" alt="Пилочный маникюр для себя" class="course-img">
            </div>
            <div class="course-content">
              <h3>Пилочный маникюр для себя</h3>
              <p>Как сделать красивый манюкир самостоятельно</p>
              <div class="course-meta">
                <span class="meta-item">⏱ 18 уроков</span>
                <span class="meta-item">👥 Для всех уровней</span>
              </div>
            </div>
          </div>
        </div>
        <div class="section-actions">
          <router-link to="/courses" class="btn btn-outline">
            Смотреть все курсы
          </router-link>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">50+</div>
            <div class="stat-label">Выпускников</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">95%</div>
            <div class="stat-label">Трудоустроились</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">100+</div>
            <div class="stat-label">Уроков</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Поддержка</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Готовы начать карьеру мастера?</h2>
          <p class="cta-description">
            Присоединяйтесь к сообществу профессионалов и начните обучение уже сегодня
          </p>
          <div class="cta-actions">
            <router-link v-if="!authStore.isAuthenticated" to="/register" class="btn btn-primary">
              Зарегистрироваться
            </router-link>
            <router-link v-else to="/courses" class="btn btn-primary">
              Продолжить обучение
            </router-link>
            <router-link to="/contacts" class="btn btn-secondary">
              Консультация
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.home-view {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  padding: 120px 0 80px;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--white) 100%);
  min-height: 600px;
  display: flex;
  align-items: center;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.text-gradient {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn {
  padding: 1rem 2rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: var(--white);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-secondary:hover {
  background: var(--primary);
  color: var(--white);
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}

.btn-outline:hover {
  background: var(--primary);
  color: var(--white);
}

.hero-visual {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

/* Sections Common */
.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

.section-actions {
  text-align: center;
  margin-top: 3rem;
}

/* Features Section */
.features-section {
  padding: 80px 0;
  background: var(--primary);
}

.features-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--white);
  margin-bottom: 1rem;
}

.features-subtitle {
  font-size: 1.25rem;
  color: var(--white);
  max-width: 600px;
  margin: 0 auto;
}

.features-columns {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.feature-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.feature-item {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 0 rem;
}

.feature-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--white);
  margin-bottom: 0.5rem;
}

.feature-content p {
  color: var(--white);
  line-height: 1.5;
  font-size: 0.95rem;
}

/* How It Works Section - новый */
.how-it-works-section {
  padding: 80px 0;
  background: var(--gray-50);
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.process-step {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--white);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--primary);
}

.step-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
  min-width: 50px;
}

.step-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.step-content p {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Courses Section */
.courses-section {
  padding: 80px 0;
  background: var(--gray-50);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.course-card {
  background: var(--white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

.course-image {
  height: 200px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.course-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.course-content {
  padding: 1.5rem;
}

.course-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.course-content p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.course-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 0.9rem;
  color: var(--gray-500);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Stats Section */
.stats-section {
  padding: 60px 0;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: var(--white);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-item {
  padding: 1rem;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* CTA Section */
.cta-section {
  padding: 80px 0;
  background: var(--white);
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .features-columns {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .features-columns {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .feature-column {
    gap: 1.5rem;
  }
  
  .process-step {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .step-number {
    align-self: center;
  }
}

@media (max-width: 640px) {
  .features-section,
  .how-it-works-section {
    padding: 60px 0;
  }
  
  .feature-item {
    text-align: center;
  }
  
  .feature-icon {
    font-size: 2rem;
  }
  
  .process-step {
    padding: 1rem;
  }
  
  .step-content h3 {
    font-size: 1.1rem;
  }
  
  .step-content p {
    font-size: 0.9rem;
  }
}
</style>