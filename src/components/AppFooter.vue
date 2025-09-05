<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-left">
          <div class="footer-logo">
            <h2>Zlobina Nails School</h2>
            <span class="footer-subtitle">Corporate Education</span>
          </div>
        </div>
        <div class="footer-nav">
          <div class="footer-section">
            <h3>Обучение</h3>
            <router-link to="/courses/active" class="footer-link">Активные курсы</router-link>
            <router-link to="/courses/completed" class="footer-link">Завершенные курсы</router-link>
          </div>
          <div class="footer-section">
            <h3>Контакты</h3>
            <a href="tel:+7XXXXXXXXXX" class="footer-link">+7 (XXX) XXX-XX-XX</a>
            <a href="mailto:info@example.com" class="footer-link">info@example.com</a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; 2024 Zlobina Nails School. Все права защищены</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Пока не нужно логики
</script>

<style scoped>
.app-footer {
  background: #ffffff;
  border-top: 1px solid #e5e5e5;
  padding: 3rem 0 0;
  width: 100vw;
  min-width: 100%;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.08);
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 4rem;
}

.footer-left {
  min-width: 300px;
}

.footer-nav {
  display: flex;
  gap: 6rem;
  flex: 1;
  justify-content: flex-start;
  min-width: 0;
}

.footer-section {
  min-width: 200px;
}

.footer-bottom {
  width: 100vw;
  min-width: 100%;
  margin-top: 3rem;
  padding: 1.5rem 0;
  border-top: 1px solid #e5e5e5;
  background: #f8f9fa;
}

.footer-logo h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  font-family: 'Arial', sans-serif;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
}

.footer-subtitle {
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: block;
  margin-top: 0.5rem;
}

.footer-section h3 {
  color: #2c3e50;
  font-size: 1rem;
  margin: 0 0 1rem;
  font-weight: 600;
}

.footer-link {
  display: block;
  color: #2c3e50;
  text-decoration: none;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #1a73e8;
}

.footer-bottom .container {
  justify-content: center;
}

.footer-bottom p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  text-align: center;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 2rem;
  }

  .footer-nav {
    flex-direction: column;
    gap: 2rem;
  }

  .footer-section {
    min-width: 100%;
  }
}
</style>