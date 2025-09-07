<template>
  <footer class="app-footer">
    <div class="container">
      <!-- Верхняя часть футера -->
      <div class="footer-main">
        <!-- Лого и описание -->
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="../assets/styles/pic/logo-wight.png" alt="Zlobina Nails School" class="logo-image">
          </div>
        </div>
        <!-- Соцсети -->
        <div class="footer-social">
          <div class="social-links">
            <a href="#" class="social-link">
              <img src="../assets/styles/pic/vk.png" alt="VK" class="social-icon">
            </a>
            <a href="#" class="social-link">
              <img src="../assets/styles/pic/tg.png" alt="TG" class="social-icon">
            </a>
            <a href="#" class="social-link">
              <img src="../assets/styles/pic/wa.png" alt="WA" class="social-icon">
            </a>
            <a href="#" class="social-link">
              <img src="../assets/styles/pic/ins.png" alt="INS" class="social-icon">
            </a>
          </div>
        </div>
      </div>

      <!-- Нижняя часть футера -->
      <div class="footer-bottom">
        <div class="legal-info">
          <p>ИП Злобин А.С.</p>
          <p>ИНН 430100854380</p>
          <p>Киров, 2025 г.</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Логика пока не нужна
</script>

<style scoped>
.app-footer {
  background: var(--gray-900);
  color: var(--white);
  padding: 3rem 0 1.5rem;
  margin-top: auto;
}

.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--gray-700);
}

.footer-brand {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.1;
  color: var(--white);
  background: linear-gradient(135deg, var(--primary-light), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
}

.footer-social {
  margin-left: auto;
}

.social-links {
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  justify-content: flex-end;  
}

.social-link {
  display: flex;
  align-items: center;  
  gap: 0.75rem;
  color: var(--gray-400);
  text-decoration: none;
  font-size: 0.95rem;
  transition: var(--transition);
  padding: 0.5rem 0;
}

.social-link:hover {
  color: var(--primary-light);
}

.social-icon {
  font-size: 1.2rem;
  width: 48px;
  text-align: center;
}

/* Нижняя часть футера */
.footer-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--gray-400);
  font-size: 0.9rem;
}

.legal-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  text-align: center;
}

.legal-info p {
  margin: 0;
  line-height: 1.4;
}

/* Адаптивность */
@media (max-width: 968px) {
  .footer-main {
    flex-direction: column;
    gap: 2rem;
  }

  .footer-social {
    margin-left: 0;
    width: 100%;
  }

  .social-links {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0 1rem;
  }
  
  .footer-main {
    padding-bottom: 2rem;
    margin-bottom: 2rem;
  }
  
  .logo-text {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .footer-main {
    gap: 1.5rem;
  }
  
  .social-links {
    gap: 0.5rem;
  }
  
  .social-link {
    font-size: 0.9rem;
  }
}

.logo-image {
  max-width: 150px;
  height: auto;
}
</style>