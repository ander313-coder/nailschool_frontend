<template>
  <div class="login-view">
    <div class="login-container">
      <!-- Левая часть - приветствие -->
      <div class="login-welcome">
        <div class="welcome-content">
          <h1 class="welcome-title">Zlobina Nails School</h1>
          <p class="welcome-subtitle">CORPORATE EDUCATION</p>
        </div>
      </div>

      <!-- Правая часть - форма -->
      <div class="login-form-section">
        <div class="form-container">
          <div class="form-tabs">
            <button 
              class="tab-button active"
              @click="switchTab('login')"
            >
              Login
            </button>
            <button 
              class="tab-button"
              @click="switchTab('register')"
              disabled
            >
              Register
            </button>
          </div>

          <form class="login-form" @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="username" class="form-label">User name</label>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="form-input"
                placeholder="Enter your User name"
                required
              />
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                class="form-input"
                placeholder="Enter your Password"
                required
              />
            </div>

            <button 
              type="submit" 
              class="login-button"
              :disabled="isLoading"
            >
              <span v-if="!isLoading">Login</span>
              <span v-else class="loading">Logging in...</span>
            </button>

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>
          </form>

          <div class="admin-info">
            <p>Для получения логина и пароля обратитесь к администратору</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  username: '',
  password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')
const activeTab = ref('login')

const switchTab = (tab: string) => {
  activeTab.value = tab
}

const handleLogin = async () => {
  if (!formData.value.username || !formData.value.password) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const success = await authStore.login(
      formData.value.username,
      formData.value.password
    )

    if (success) {
      router.push('/')
    } else {
      errorMessage.value = 'Invalid username or password'
    }
  } catch (error) {
    errorMessage.value = 'Login failed. Please try again.'
    console.error('Login error:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gray-50);
  padding: 2rem;
}

.login-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1000px;
  width: 100%;
  background: var(--white);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  min-height: 600px;
}

.login-welcome {
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.welcome-content {
  text-align: center;
  max-width: 400px;
}

.welcome-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
  font-family: var(--font-family);
}

.welcome-subtitle {
  font-size: 0.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  opacity: 0.9;
}

.login-form-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-tabs {
  display: flex;
  margin-bottom: 2.5rem;
  border-bottom: 2px solid var(--gray-200);
}

.tab-button {
  background: none;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gray-400);
  cursor: pointer;
  transition: var(--transition);
  position: relative;
}

.tab-button.active {
  color: var(--primary);
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary);
}

.tab-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tab-button:not(:disabled):hover {
  color: var(--primary);
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.95rem;
}

.form-input {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  transition: var(--transition);
}

.form-input:focus {
  border-color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.form-input::placeholder {
  color: var(--gray-400);
}

.login-button {
  background: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  transition: var(--transition);
  margin-top: 1rem;
}

.login-button:hover:not(:disabled) {
  background: var(--primary-dark);
  transform: translateY(-1px);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.loading::after {
  content: '';
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  background: rgba(var(--primary), 0.1);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  text-align: center;
}

.admin-info {
  background: var(--gray-50);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 2rem;
  padding: 1rem;
  border-radius: var(--border-radius);
  text-align: center;
}

.admin-info p {
  margin: 0;
  color: var(--gray-600);
  font-size: 0.9rem;
  line-height: 1.4;
}

/* Адаптивность */
@media (max-width: 768px) {
  .login-container {
    grid-template-columns: 1fr;
    max-width: 400px;
  }
  
  .login-welcome {
    display: none;
  }
  
  .login-form-section {
    padding: 1.5rem;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .login-view {
    padding: 1rem;
  }
  
  .form-tabs {
    margin-bottom: 2rem;
  }
  
  .tab-button {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
  }
  
  .welcome-title {
    font-size: 1.75rem;
  }
  
  .welcome-subtitle {
    font-size: 1rem;
  }
}
</style>