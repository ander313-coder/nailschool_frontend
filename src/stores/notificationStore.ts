import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useHomeworkStore } from '@/stores/homeworkStore'
import type { Homework } from '@/types/api'

export interface Notification {
  id: number
  type: 'homework_status'
  title: string
  message: string
  homeworkId: number
  read: boolean
  createdAt: Date
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  const homeworkStore = useHomeworkStore()

  // Следующие ID для новых уведомлений
  let nextId = 1

  // Непрочитанные уведомления (computed)
  const unreadNotifications = computed(() =>
    notifications.value.filter((notification) => !notification.read),
  )

  // Непрочитанные уведомления о ДЗ
  const unreadHomeworkNotifications = computed(() =>
    unreadNotifications.value.filter((n) => n.type === 'homework_status'),
  )

  // Добавить уведомление
  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: nextId++,
      read: false,
      createdAt: new Date(),
    }

    notifications.value.unshift(newNotification) // Добавляем в начало

    // Ограничиваем историю уведомлений (последние 50)
    if (notifications.value.length > 50) {
      notifications.value = notifications.value.slice(0, 50)
    }
  }

  // Отметить как прочитанное
  const markAsRead = (notificationId: number) => {
    const notification = notifications.value.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  }

  // Отметить все как прочитанные
  const markAllAsRead = () => {
    notifications.value.forEach((notification) => {
      notification.read = true
    })
  }

  // Удалить уведомление
  const removeNotification = (notificationId: number) => {
    notifications.value = notifications.value.filter((n) => n.id !== notificationId)
  }

  // Очистить все уведомления
  const clearAll = () => {
    notifications.value = []
  }

  // Проверить изменения статусов домашних работ
  const checkHomeworkStatusChanges = async (): Promise<Homework[]> => {
    try {
      const changedHomeworks = await homeworkStore.checkStatusChanges()

      changedHomeworks.forEach((homework) => {
        const statusText = getStatusText(homework.status)

        addNotification({
          type: 'homework_status',
          title: 'Статус домашней работы изменен',
          message: `Домашняя работа "${getHomeworkLessonTitle(homework)}" ${statusText.toLowerCase()}`,
          homeworkId: homework.id,
        })
      })

      return changedHomeworks
    } catch (error) {
      console.error('Error checking homework status changes:', error)
      return []
    }
  }

  // Вспомогательные функции
  const getStatusText = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      PENDING: 'на проверке',
      APPROVED: 'принята',
      REJECTED: 'отправлена на доработку',
    }
    return statusMap[status] || status
  }

  const getHomeworkLessonTitle = (homework: Homework): string => {
    if (typeof homework.lesson === 'object' && homework.lesson !== null) {
      return homework.lesson.title || 'Без названия'
    }
    return 'Без названия'
  }

  return {
    notifications,
    unreadNotifications,
    unreadHomeworkNotifications,

    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    checkHomeworkStatusChanges,
  }
})
