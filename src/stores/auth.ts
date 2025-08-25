import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types/api';
import apiClient from '@/api/client';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const isLoading = ref(false);

  // Вход пользователя
  const login = async (username: string, password: string) => {
    isLoading.value = true;
    try {
      const response = await apiClient.post('/auth/login/', {
        username,
        password,
      });
      
      const { access, refresh } = response.data;
      
      // Сохраняем токены
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      // Получаем информацию о пользователе
      await fetchUserProfile();
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Регистрация пользователя
  const register = async (username: string, password: string, email: string) => {
    isLoading.value = true;
    try {
      await apiClient.post('/auth/register/', {
        username,
        password,
        email,
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  // Получение профиля пользователя
  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.get('/users/profile/');
      user.value = response.data;
      isAuthenticated.value = true;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    }
  };

  // Выход
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    user.value = null;
    isAuthenticated.value = false;
  };

  // Проверка аутентификации при загрузке приложения
  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      await fetchUserProfile();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
    fetchUserProfile,
  };
});