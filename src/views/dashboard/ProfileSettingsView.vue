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
            <!-- Аватар -->
            <div class="avatar-section">
              <div class="avatar-preview">
                <img 
                  v-if="user.avatar" 
                  :src="user.avatar" 
                  :alt="user.username"
                  class="avatar-image"
                />
                <div v-else class="avatar-placeholder">
                  {{ user.first_name?.charAt(0) || user.username?.charAt(0) }}
                </div>
              </div>
              <div class="avatar-controls">
                <input 
                  type="file" 
                  ref="avatarInput"
                  accept="image/*"
                  @change="handleAvatarUpload"
                  class="avatar-input"
                />
                <button @click="triggerAvatarUpload" class="avatar-btn">
                  {{ user.avatar ? 'Изменить' : 'Загрузить' }} фото
                </button>
                <button 
                  v-if="user.avatar" 
                  @click="removeAvatar"
                  class="avatar-remove-btn"
                >
                  Удалить
                </button>
              </div>
            </div>

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
                  />
                </div>

                <div class="form-group full-width">
                  <label for="bio">О себе</label>
                  <textarea
                    id="bio"
                    v-model="formData.bio"
                    rows="4"
                    class="form-textarea"
                    placeholder="Расскажите о себе..."
                  ></textarea>
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
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const avatarInput = ref<HTMLInputElement>()

// Данные формы
const formData = reactive({
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
const originalData = ref({})

// Вычисляемые свойства
const user = computed(() => authStore.user || {})
const isFormChanged = computed(() => {
  return JSON.stringify(formData) !== JSON.stringify(originalData.value)
})

const isPasswordFormValid = computed(() => {
  return passwordData.current_password && 
         passwordData.new_password && 
         passwordData.confirm_password &&
         passwordData.new_password === passwordData.confirm_password &&
         passwordData.new_password.length >= 6
})

// Инициализация
onMounted(() => {
  initializeForm()
})

const initializeForm = () => {
  if (authStore.user) {
    Object.assign(formData, {
      username: authStore.user.username || '',
      email: authStore.user.email || '',
      first_name: authStore.user.first_name || '',
      last_name: authStore.user.last_name || '',
      phone: authStore.user.phone || '',
      bio: authStore.user.bio || ''
    })
    originalData.value = { ...formData }
  }
}

// Методы
const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    // TODO: Реализовать загрузку аватарки
    console.log('Загружаем аватар:', file)
  }
}

const removeAvatar = async () => {
  // TODO: Реализовать удаление аватарки
  console.log('Удаляем аватар')
}

const updateProfile = async () => {
  isLoading.value = true
  try {
    // TODO: Реализовать обновление профиля
    await authStore.updateProfile(formData)
    originalData.value = { ...formData }
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error)
  } finally {
    isLoading.value = false
  }
}

const changePassword = async () => {
  isChangingPassword.value = true
  try {
    // TODO: Реализовать смену пароля
    console.log('Меняем пароль:', passwordData)
    // Сброс формы пароля
    Object.assign(passwordData, {
      current_password: '',
      new_password: '',
      confirm_password: ''
    })
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
}

.settings-header h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.settings-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.settings-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.settings-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

/* Аватар */
.avatar-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--gray-100);
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
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
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
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.avatar-remove-btn {
  padding: 0.5rem 1rem;
  background: var(--error-light);
  color: var(--error);
  border: 1px solid var(--error);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

/* Формы */
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
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.form-input:disabled {
  background: var(--gray-50);
  color: var(--text-secondary);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.field-hint {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* Кнопки */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.save-btn {
  padding: 0.75rem 2rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: var(--primary-dark);
}

.save-btn:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
}

.cancel-btn {
  padding: 0.75rem 2rem;
  background: white;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover:not(:disabled) {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

.cancel-btn:disabled {
  opacity: 0.5;
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
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>