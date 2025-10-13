<template>
    <div class="profile-settings">
      <div class="settings-header">
        <h1>Настройки профиля</h1>
        <p>Управление вашими персональными данными и настройками аккаунта</p>
      </div>

      <div class="settings-content">
        <!-- Основная информация -->
        <div class="settings-section">
          <h2>Основная информация</h2>
          <div class="section-content">

            <!-- Форма данных -->
            <form @submit.prevent="updateProfile" class="profile-form">
              <div class="form-grid">
                <div class="form-group">
                  <label for="username">Имя пользователя</label>
                  <input
                    id="username"
                    v-model="formData.username"
                    type="text"
                    :disabled="true"
                    class="form-input"
                  />
                  <span class="field-hint">Имя пользователя нельзя изменить</span>
                </div>

                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    :disabled="true"
                    class="form-input"
                  />
                  <span class="field-hint">Email нельзя изменить</span>
                </div>

                <div class="form-group">
                  <label for="firstName">Имя</label>
                  <input
                    id="firstName"
                    v-model="formData.first_name"
                    type="text"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="lastName">Фамилия</label>
                  <input
                    id="lastName"
                    v-model="formData.last_name"
                    type="text"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="phone">Телефон</label>
                  <input
                    id="phone"
                    v-model="formData.phone"
                    type="tel"
                    class="form-input"
                    placeholder="79123456789"
                  />
                </div>
              </div>

              <div class="form-actions">
                <button 
                  type="submit" 
                  :disabled="!isFormChanged || isLoading"
                  class="save-btn"
                >
                  {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
                </button>
                <button 
                  type="button" 
                  @click="resetForm"
                  :disabled="!isFormChanged"
                  class="cancel-btn"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Смена пароля -->
        <div class="settings-section">
          <h2>Безопасность</h2>
          <div class="section-content">
            <form @submit.prevent="changePassword" class="password-form">
              <div class="form-group">
                <label for="currentPassword">Текущий пароль</label>
                <input
                  id="currentPassword"
                  v-model="passwordData.current_password"
                  type="password"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="newPassword">Новый пароль</label>
                <input
                  id="newPassword"
                  v-model="passwordData.new_password"
                  type="password"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label for="confirmPassword">Подтвердите новый пароль</label>
                <input
                  id="confirmPassword"
                  v-model="passwordData.confirm_password"
                  type="password"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-actions">
                <button 
                  type="submit" 
                  :disabled="!isPasswordFormValid || isChangingPassword"
                  class="save-btn"
                >
                  {{ isChangingPassword ? 'Смена пароля...' : 'Сменить пароль' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { ProfileFormData } from '@/types/api'

const authStore = useAuthStore()

// Данные формы
const formData = reactive<ProfileFormData>({
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  bio: ''
})

const passwordData = reactive({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

// Состояния
const isLoading = ref(false)
const isChangingPassword = ref(false)
const originalData = ref<ProfileFormData>({} as ProfileFormData)

// Вычисляемые свойства
const isFormChanged = computed(() => {
  return JSON.stringify(formData) !== JSON.stringify(originalData.value)
})

const isPasswordFormValid = computed(() => {
  const hasAllFields = 
    passwordData.current_password && 
    passwordData.new_password && 
    passwordData.confirm_password;
  
  const passwordsMatch = passwordData.new_password === passwordData.confirm_password;
  const validLength = passwordData.new_password.length >= 3;

  const isValid = hasAllFields && passwordsMatch && validLength;
  
  console.log('🔍 Детальная проверка пароля:', {
    current_length: passwordData.current_password.length,
    new_length: passwordData.new_password.length,
    confirm_length: passwordData.confirm_password.length,
    hasAllFields,
    passwordsMatch, 
    validLength,
    isValid
  });
  
  return isValid;
});

// Добавим watch для отладки
watch(passwordData, (newVal) => {
  console.log('🔄 Изменение данных пароля:', newVal)
  console.log('✅ Валидность формы:', isPasswordFormValid.value)
}, { deep: true })


// Инициализация
onMounted(() => {
  initializeForm()
})

const initializeForm = () => {
  if (authStore.user) {
    const currentUser = authStore.user
    Object.assign(formData, {
      username: currentUser.username || '',
      email: currentUser.email || '',
      first_name: currentUser.first_name || '',
      last_name: currentUser.last_name || '',
      phone: currentUser.phone || '',
      bio: currentUser.bio || ''
    })
    originalData.value = { ...formData }
  }
}

// Методы

const updateProfile = async () => {
  isLoading.value = true
  try {
    await authStore.updateProfile(formData)
    originalData.value = { ...formData }
    console.log('Профиль успешно обновлен')
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error)
  } finally {
    isLoading.value = false
  }
}

const changePassword = async () => {
  isChangingPassword.value = true
  try {
    await authStore.changePassword({
      current_password: passwordData.current_password,
      new_password: passwordData.new_password,
      confirm_password: passwordData.confirm_password
    })
    Object.assign(passwordData, {
      current_password: '',
      new_password: '',
      confirm_password: ''
    })
    console.log('Пароль успешно изменен')
  } catch (error) {
    console.error('Ошибка при смене пароля:', error)
  } finally {
    isChangingPassword.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, originalData.value)
}
</script>

<style scoped>
.profile-settings {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-header {
  margin-bottom: 2rem;
  text-align: center;
}

.settings-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.settings-header p {
  color: #666;
  font-size: 1.1rem;
}

.settings-section {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-section h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #8C4CC3;
  padding-bottom: 0.5rem;
}

/* Аватар секция */
.avatar-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #8C4CC3;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.avatar-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.avatar-input {
  display: none;
}

.avatar-btn {
  padding: 0.5rem 1rem;
  background: #8C4CC3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.avatar-btn:hover {
  background: #7a3cb0;
}

.avatar-remove-btn {
  padding: 0.5rem 1rem;
  background: #FF6B6B;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.avatar-remove-btn:hover {
  background: #e55a5a;
}

/* Формы */
.profile-form,
.password-form {
  width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #8C4CC3;
}

.form-input:disabled {
  background: #f5f5f5;
  color: #666;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.field-hint {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-start;
}

.save-btn {
  padding: 0.75rem 2rem;
  background: #8C4CC3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.save-btn:hover:not(:disabled) {
  background: #7a3cb0;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.cancel-btn {
  padding: 0.75rem 2rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.cancel-btn:hover:not(:disabled) {
  background: #5a6268;
}

.cancel-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Адаптивность */
@media (max-width: 768px) {
  .profile-settings {
    padding: 1rem;
  }
  
  .settings-section {
    padding: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>