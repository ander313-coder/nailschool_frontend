<template>
  <div class="about-view">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              <p class="text-gradient">Zlobina Nails School</p>
            </h1>
            <p class="hero-description">
              Профессиональное обучение маникюру с 2018 года. 
              Готовим мастеров международного уровня для работы в премиальном сегменте.
            </p>
          </div>
          <div class="hero-visual">
            <div class="about-image">
              <img src="/src/assets/styles/pic/main.jpg" alt="О нас" class="about-img">
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Content Section -->
    <section class="about-content-section">
      <div class="container">
        <div class="content-grid">
          <div class="content-text">
            <!-- История - дополненная -->
            <div class="history-section">
              <h2>Наша история</h2>
              <p>
                Школа Zlobina Nails была основана в 2018 году Анной Злобиной - профессиональным мастером 
                с многолетним опытом работы в индустрии красоты. Начав с небольших мастер-классов, 
                мы выросли в полноценную образовательную платформу с собственной методикой обучения.
              </p>
              <p>
                За 6 лет работы мы выпустили более 500 квалифицированных специалистов, многие из которых 
                успешно работают в премиальных салонах России, Европы и открыли собственные студии. 
                Наши выпускники регулярно становятся призерами международных конкурсов nail-индустрии.
              </p>
              <p>
                Мы постоянно развиваемся и следим за последними тенденциями в nail-индустрии, 
                чтобы предоставлять нашим студентам только актуальные и востребованные знания. 
                Ежегодно обновляем программы обучения и добавляем новые курсы в соответствии с 
                запросами рынка и технологическими новинками.
              </p>
            </div>

            <!-- Миссия -->
            <div class="mission-section">
              <div class="section-header-inline">
                <h2>Наша миссия</h2>
              </div>
              <div class="quote-container">
                <div class="quote-content">
                  <p class="quote-text">
                    "Подготовить высококвалифицированных мастеров маникюра, которые смогут 
                    не только технически выполнять работу, но и понимать эстетику, тренды 
                    и бизнес-процессы в индустрии красоты."
                  </p>
                  <div class="quote-author">
                    <div class="author-name">Мария Злобина</div>
                    <div class="author-role">Основатель Zlobina Nails School</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Team Section -->
    <section class="team-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Наша команда</h2>
          <p class="section-subtitle">Профессиональные преподаватели с международным опытом</p>
        </div>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-photo">
              <img src="/src/assets/styles/pic/prepod.jpg" alt="Мария Злобина" class="member-img">
            </div>
            <div class="member-info">
              <h3>Мария Злобина</h3>
              <p class="member-role">Основатель школы</p>
              <p class="member-bio">
                Специализация: Бизнес-носультирование, командообразование и сервис.
              </p>
            </div>
          </div>
          
          <div class="team-member">
            <div class="member-photo">
              <img src="/src/assets/styles/pic/prepod.jpg" alt="Екатерина Суслова" class="member-img">
            </div>
            <div class="member-info">
              <h3>Екатерина Суслова</h3>
              <p class="member-role">Инструктор по педикюру</p>
              <p class="member-bio">
                Опыт работы более 10 лет. Специализация: Аппаратные и препаратные техники KART, Golden Trace.
              </p>
            </div>
          </div>
          
          <div class="team-member">
            <div class="member-photo">
              <img src="/src/assets/styles/pic/prepod.jpg" alt="Мила Семушина" class="member-img">
            </div>
            <div class="member-info">
              <h3>Мила Семушина</h3>
              <p class="member-role">Инструктор по маникюру</p>
              <p class="member-bio">
                Специалист по работе с гелями. 
                Автор курсов по современным техникам моделирования.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Готовы начать обучение?</h2>
          <p class="cta-description">
            Присоединяйтесь к сообществу профессиональных мастеров маникюра
          </p>
          <div class="cta-actions">
            <router-link to="/courses" class="btn btn-primary">
              Выбрать курс
            </router-link>
            <router-link to="/contacts" class="btn btn-secondary">
              Задать вопрос
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// Пока без логики
</script>

<style scoped>
/* ... сохраняем ваши существующие стили ... */

.about-view {
  min-height: 100vh;
}

.hero-section {
  padding: 120px 0 80px;
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--white) 100%);
  min-height: 400px;
  display: flex;
  align-items: center;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
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
  max-width: 500px;
}

.about-image {
  height: 300px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.about-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: var(--border-radius-lg);
}

/* About Content Section */
.about-content-section {
  padding: 80px 0;
  background: var(--white);
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
}

.content-text h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 3rem 0 1.5rem 0;
}

.content-text h2:first-child {
  margin-top: 0;
}

.content-text p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

/* Оформление для миссии и преимуществ */
.section-header-inline {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 3rem 0 2rem 0;
}

.section-header-inline h2 {
  margin: 0;
}

.icon-wrapper {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--accent) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Миссия */
.mission-content {
  background: var(--gray-50);
  padding: 2.5rem;
  border-radius: var(--border-radius-lg);
  border-left: 4px solid var(--primary);
}

.mission-statement {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 2rem !important;
}

/* Стили для цитаты */
.quote-container {
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--white) 100%);
  padding: 3rem;
  border-radius: var(--border-radius-lg);
  border-left: 4px solid var(--primary);
  text-align: center;
  margin: 2rem 0;
}

.quote-content {
  max-width: 600px;
  margin: 0 auto;
}

.quote-text {
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.6;
  color: var(--text-primary);
  margin-bottom: 2rem !important;
  font-style: italic;
  position: relative;
}

.quote-text::before {
  content: '"';
  font-size: 4rem;
  color: var(--primary);
  opacity: 0.3;
  position: absolute;
  top: -1rem;
  left: -2rem;
  font-family: serif;
}

.quote-author {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.author-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.author-role {
  font-size: 0.95rem;
  color: var(--text-secondary);
}

/* Адаптивность для цитаты */
@media (max-width: 768px) {
  .quote-container {
    padding: 2rem;
  }
  
  .quote-text {
    font-size: 1.2rem;
  }
  
  .quote-text::before {
    font-size: 3rem;
    left: -1rem;
  }
}

@media (max-width: 480px) {
  .quote-container {
    padding: 1.5rem;
  }
  
  .quote-text {
    font-size: 1.1rem;
  }
  
  .quote-text::before {
    font-size: 2.5rem;
    top: -0.5rem;
    left: -0.5rem;
  }
}

/* Преимущества */
.advantages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.advantage-card {
  background: var(--gray-50);
  padding: 2rem;
  border-radius: var(--border-radius);
  text-align: center;
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.advantage-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.advantage-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.advantage-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.advantage-card p {
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

/* Team Section */
.team-section {
  padding: 80px 0;
  background: var(--gray-50);
}

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

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.team-member {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.member-photo {
  height: 150px;
  width: 150px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.member-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.member-info h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.member-role {
  color: var(--primary);
  font-weight: 500;
  margin-bottom: 1rem;
}

.member-bio {
  color: var(--text-secondary);
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: var(--white);
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--white);
}

.cta-description {
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
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
  background: var(--white);
  color: var(--primary);
}

.btn-primary:hover {
  background: var(--gray-100);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: var(--white);
  border: 2px solid var(--white);
}

.btn-secondary:hover {
  background: var(--white);
  color: var(--primary);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 968px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .advantages-grid {
    grid-template-columns: 1fr;
  }
  
  .mission-highlights {
    grid-template-columns: 1fr;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 100px 0 60px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .content-text h2 {
    font-size: 1.75rem;
  }
  
  .section-header-inline {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
  
  .mission-content,
  .advantage-card {
    padding: 1.5rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .cta-description {
    font-size: 1.1rem;
  }
}
</style>