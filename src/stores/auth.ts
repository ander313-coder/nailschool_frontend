import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/api'
import apiClient from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  const testApiEndpoint = async () => {
    try {
      console.log('Testing API endpoints...')
      
      // Проверяем профиль
      const profileResponse = await apiClient.get('/users/profile/')
      console.log('Profile endpoint:', profileResponse.data)
      
      // Проверяем другие возможные endpoints
      try {
        const userResponse = await apiClient.get('/auth/user/')
        console.log('Auth user endpoint:', userResponse.data)
      } catch (e) {
        console.log('Auth user endpoint not available')
      }
      
    } catch (error) {
      console.error('API test failed:', error)
    }
  }
  // Вход пользователя
  const login = async (username: string, password: string) => {
    isLoading.value = true
    try {
      const response = await apiClient.post('/auth/login/', {
        username,
        password,
      })
      
      const { access, refresh } = response.data
      
      // Сохраняем токены
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Получение профиля пользователя
  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile...')
      
      // Делаем запрос к endpoint профиля
      const response = await apiClient.get('/users/profile/')
      console.log('Profile API response:', response.data)
      
      // Извлекаем данные из ответа
      const userData = response.data
      
      // Создаем объект пользователя, учитывая структуру ответа от бэкенда
      user.value = {
        id: userData.id,
        username: userData.username || userData.name || userData.email?.split('@')[0] || 'User',
        email: userData.email || '',
        role: userData.role || 'TRAINEE' // Значение по умолчанию
      }
      
      isAuthenticated.value = true
      console.log('Processed user data:', user.value)
      
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      
      // Временное решение: используем данные из localStorage
      const token = localStorage.getItem('access_token')
      if (token) {
        console.log('Using fallback user data')
        user.value = {
          id: 1,
          username: 'Student', // Временное значение
          email: 'student@example.com',
          role: 'TRAINEE'
        }
        isAuthenticated.value = true
      }
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

  // Выход
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    user.value = null
    isAuthenticated.value = false
    console.log('User logged out')
  }

  // Проверка аутентификации при загрузке приложения
  const checkAuth = async () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      console.log('Token found, checking authentication...')
      await fetchUserProfile()
    } else {
      console.log('No token found')
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
  }

})