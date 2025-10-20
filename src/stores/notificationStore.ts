import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/api/client'
import type { Homework } from '@/types/api'

export interface Notification {
  id: number
  type: 'HOMEWORK_SUBMITTED' | 'HOMEWORK_STATUS_CHANGED' | string
  title: string
  message: string
  homework_id: number | null
  lesson_title: string
  read: boolean
  created_at: string
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const isLoading = ref(false)
  const lastCheck = ref<Date | null>(null)

  // Непрочитанные уведомления
  const unreadNotifications = computed(() =>
    notifications.value.filter((notification) => !notification.read),
  )

  // Количество непрочитанных
  const unreadCount = computed(() => unreadNotifications.value.length)

  // Уведомления о домашних работах
  const homeworkNotifications = computed(() =>
    notifications.value.filter((n) => n.homework_id !== null),
  )

  // Загрузить уведомления с сервера
  const fetchNotifications = async (force = false) => {
    // Если уже загружаем, не делаем повторный запрос
    if (isLoading.value && !force) return

    isLoading.value = true
    try {
      console.log('🔔 Загрузка уведомлений с сервера...')
      // ИСПРАВЛЕНО: убрали дублирование /api/
      const response = await apiClient.get('/notifications/')

      notifications.value = response.data.notifications
      lastCheck.value = new Date()

      console.log(`✅ Загружено ${notifications.value.length} уведомлений`)
      return notifications.value
    } catch (error: any) {
      console.error('❌ Ошибка загрузки уведомлений:', error)
      console.error('❌ Ответ сервера:', error.response?.data)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Отметить как прочитанное
  const markAsRead = async (notificationId: number) => {
    try {
      // ИСПРАВЛЕНО: убрали дублирование /api/
      await apiClient.post('/notifications/', { notification_id: notificationId })

      // Обновляем локально
      const notification = notifications.value.find((n) => n.id === notificationId)
      if (notification) {
        notification.read = true
      }

      console.log(`✅ Уведомление ${notificationId} отмечено как прочитанное`)
    } catch (error: any) {
      console.error('❌ Ошибка отметки уведомления как прочитанного:', error)
      console.error('❌ Ответ сервера:', error.response?.data)
      throw error
    }
  }

  // Отметить все как прочитанные
  const markAllAsRead = async () => {
    try {
      const unreadIds = unreadNotifications.value.map((n) => n.id)

      // Отмечаем каждое уведомление на сервере
      for (const id of unreadIds) {
        await markAsRead(id)
      }

      console.log(`✅ Все уведомления (${unreadIds.length}) отмечены как прочитанные`)
    } catch (error) {
      console.error('❌ Ошибка отметки всех уведомлений:', error)
      throw error
    }
  }

  // Удалить все прочитанные уведомления
  const clearReadNotifications = async () => {
    try {
      // ИСПРАВЛЕНО: убрали дублирование /api/
      await apiClient.delete('/notifications/')

      // Удаляем локально только прочитанные
      notifications.value = notifications.value.filter((n) => !n.read)

      console.log('✅ Прочитанные уведомления очищены')
    } catch (error: any) {
      console.error('❌ Ошибка очистки уведомлений:', error)
      console.error('❌ Ответ сервера:', error.response?.data)
      throw error
    }
  }

  // Очистить все уведомления (только локально)
  const clearAllLocal = () => {
    notifications.value = []
    console.log('🗑️ Все уведомления очищены локально')
  }

  // Проверить новые уведомления (для периодической проверки)
  const checkForNewNotifications = async (): Promise<boolean> => {
    try {
      console.log('🔄 Проверка новых уведомлений...')

      const oldCount = unreadCount.value
      await fetchNotifications(true)
      const newCount = unreadCount.value

      const hasNew = newCount > oldCount
      if (hasNew) {
        console.log(`🎉 Обнаружено ${newCount - oldCount} новых уведомлений`)
      }

      return hasNew
    } catch (error) {
      console.warn('⚠️ Ошибка при проверке новых уведомлений:', error)
      return false
    }
  }

  // Получить уведомления по домашней работе
  const getHomeworkNotifications = (homeworkId: number) => {
    return notifications.value.filter((n) => n.homework_id === homeworkId)
  }

  // Добавить уведомление локально (для real-time, если будете делать WebSockets)
  const addNotificationLocal = (notification: Notification) => {
    // Проверяем нет ли уже такого уведомления
    const exists = notifications.value.some((n) => n.id === notification.id)
    if (!exists) {
      notifications.value.unshift(notification)

      // Ограничиваем историю
      if (notifications.value.length > 50) {
        notifications.value = notifications.value.slice(0, 50)
      }

      console.log('📨 Добавлено новое уведомление локально')
    }
  }

  return {
    // State
    notifications,
    isLoading,
    lastCheck,

    // Getters
    unreadNotifications,
    unreadCount,
    homeworkNotifications,

    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearReadNotifications,
    clearAllLocal,
    checkForNewNotifications,
    getHomeworkNotifications,
    addNotificationLocal,
  }
})
