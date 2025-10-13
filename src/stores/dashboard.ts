import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from '@/api/client'

export interface DashboardData {
  active_courses: Array<{
    id: number
    title: string
    completed_lessons: number
    total_lessons: number
  }>
  pending_tests: Array<{
    id: number
    title: string
    lesson_title: string
  }>
  completed_lessons_count: number
}

export const useDashboardStore = defineStore('dashboard', () => {
  const dashboardData = ref<DashboardData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchDashboardData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await apiClient.get('/users/dashboard/')
      dashboardData.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Не удалось загрузить данные дашборда'
      console.error('Dashboard data fetch error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    dashboardData,
    isLoading,
    error,
    fetchDashboardData,
  }
})
