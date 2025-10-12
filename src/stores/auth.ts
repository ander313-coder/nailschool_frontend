import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/api'
import apiClient from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  // Вход пользователя
  const login = async (username: string, password: string) => {
    isLoading.value = true
    try {
      const response = await apiClient.post('/auth/login/', {
        username,
        password,
      })

      console.log('✅ Login response:', response.data) // Логируем ответ

      const { access, refresh } = response.data

      // Сохраняем токены
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)

      // Получаем информацию о пользователе
      await fetchUserProfile()

      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }
  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get('/users/profile/')
      console.log('✅ User profile response:', response.data) // Логируем профиль
      const userData = response.data

      user.value = {
        id: userData.id,
        username: userData.username || userData.name || 'User',
        email: userData.email || '',
        role: (userData.role as 'TRAINEE' | 'MASTER' | 'INSTRUCTOR') || 'TRAINEE',
        first_name: userData.first_name || userData.firstName || '',
        last_name: userData.last_name || userData.lastName || '',
        phone: userData.phone || '',
        bio: userData.bio || '',
        avatar: userData.avatar || undefined,
        progress: userData.progress || 0,
        next_role_display: userData.next_role_display || null,
        // Совместимость со старым форматом
        name: userData.username || userData.name,
        level: userData.role_display || userData.level,
      }
      isAuthenticated.value = true
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error)
      logout()
    }
  }

  // Регистрация пользователя
  const register = async (username: string, password: string, email: string) => {
    isLoading.value = true
    try {
      await apiClient.post('/auth/register/', {
        username,
        password,
        email,
      })
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Обновление профиля
  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const response = await apiClient.patch('/users/profile/update/', profileData)
      user.value = { ...user.value, ...response.data }
      return response.data
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  // Смена пароля
  const changePassword = async (passwordData: {
    current_password: string
    new_password: string
    confirm_password: string
  }) => {
    try {
      const response = await apiClient.post('/users/change-password/', passwordData)
      return response.data
    } catch (error) {
      console.error('Password change error:', error)
      throw error
    }
  }

  // Загрузка аватарки
  const uploadAvatar = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await apiClient.post('/users/avatar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      user.value = { ...user.value, ...response.data }
      return response.data
    } catch (error) {
      console.error('Avatar upload error:', error)
      throw error
    }
  }

  // Удаление аватарки
  const removeAvatar = async () => {
    try {
      const response = await apiClient.delete('/users/avatar/')
      user.value = { ...user.value, ...response.data }
      return response.data
    } catch (error) {
      console.error('Avatar remove error:', error)
      throw error
    }
  }

  // Выход
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    user.value = null
    isAuthenticated.value = false
  }

  // Проверка аутентификации при загрузке приложения
  const checkAuth = async () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      await fetchUserProfile()
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    fetchUserProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
    removeAvatar,
  }
})
