<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Nail School</h3>
          <p>Онлайн-обучение маникюру для начинающих и профессионалов</p>
        </div>
        
        <div class="footer-section">
          <h4>Навигация</h4>
          <router-link to="/courses" class="footer-link">Курсы</router-link>
          <router-link to="/lessons" class="footer-link">Уроки</router-link>
          <router-link to="/tests" class="footer-link">Тесты</router-link>
        </div>
        
        <div class="footer-section">
          <h4>Контакты</h4>
          <p>Email: info@nailschool.ru</p>
          <p>Телефон: +7 (999) 123-45-67</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 Nail School. Все права защищены.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Пока не нужно логики
</script>

<style scoped>
.app-footer {
  background: #2c3e50;
  color: white;
  padding: 2rem 0 1rem;
  margin-top: auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
  color: #ff6b6b;
}

.footer-link {
  display: block;
  color: #bdc3c7;
  text-decoration: none;
  margin-bottom: 0.5rem;
}

.footer-link:hover {
  color: #ff6b6b;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 1rem;
  text-align: center;
  color: #bdc3c7;
}
</style>