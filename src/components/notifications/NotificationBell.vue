<template>
  <div class="notification-bell">
    <!-- Кнопка с колокольчиком и счетчиком -->
    <button 
      class="bell-button"
      @click="toggleDropdown"
      :class="{ 'has-notifications': unreadCount > 0 }"
      :title="unreadCount > 0 ? `${unreadCount} непрочитанных уведомлений` : 'Уведомления'"
    >
      <span class="bell-icon">🔔</span>
      <span v-if="unreadCount > 0" class="notification-count">
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Выпадающий список уведомлений -->
    <div v-if="isDropdownOpen" class="notifications-dropdown">
      <div class="dropdown-header">
        <h3>Уведомления</h3>
        <div class="header-actions">
          <button 
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="mark-all-read"
            :disabled="notificationStore.isLoading"
          >
            Прочитать все
          </button>
          <button 
            v-if="notificationStore.notifications.length > 0"
            @click="clearReadNotifications"
            class="clear-read-btn"
            :disabled="notificationStore.isLoading"
          >
            Очистить прочитанные
          </button>
        </div>
      </div>

      <div class="notifications-list">
        <div 
          v-for="notification in notificationStore.notifications.slice(0, 10)" 
          :key="notification.id"
          class="notification-item"
          :class="{ 
            unread: !notification.read,
            'homework-notification': notification.homework_id 
          }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-content">
            <div class="notification-title">
              {{ notification.title }}
              <span v-if="!notification.read" class="unread-dot"></span>
            </div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-meta">
              <span v-if="notification.lesson_title" class="lesson-name">
                {{ notification.lesson_title }}
              </span>
              <span class="notification-time">
                {{ formatTime(notification.created_at) }}
              </span>
            </div>
          </div>
          <button 
            v-if="!notification.read"
            @click.stop="markAsRead(notification.id)"
            class="mark-read-btn"
            :disabled="notificationStore.isLoading"
            title="Отметить как прочитанное"
          >
            ●
          </button>
        </div>

        <div v-if="notificationStore.isLoading" class="loading-notifications">
          Загрузка...
        </div>

        <div v-else-if="notificationStore.notifications.length === 0" class="empty-notifications">
          Уведомлений нет
        </div>
      </div>

      <div class="dropdown-footer">
        <router-link 
          to="/homeworks" 
          class="view-all-link"
          @click="closeDropdown"
        >
          Все домашние работы
        </router-link>
        <button 
          @click="refreshNotifications"
          class="refresh-btn"
          :disabled="notificationStore.isLoading"
          title="Обновить уведомления"
        >
          🔄
        </button>
      </div>
    </div>

    <!-- Затемнение фона при открытом dropdown -->
    <div 
      v-if="isDropdownOpen" 
      class="dropdown-overlay"
      @click="closeDropdown"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useNotificationStore } from '@/stores/notificationStore';
import { useRouter } from 'vue-router';
import type { Notification } from '@/stores/notificationStore';

const notificationStore = useNotificationStore();
const router = useRouter();
const isDropdownOpen = ref(false);

// Количество непрочитанных уведомлений
const unreadCount = computed(() => notificationStore.unreadCount);

// Переключение dropdown
const toggleDropdown = async () => {
  if (!isDropdownOpen.value) {
    // При открытии загружаем свежие уведомления
    try {
      await notificationStore.fetchNotifications();
    } catch (error) {
      console.warn('⚠️ Не удалось загрузить уведомления:', error);
    }
  }
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Закрытие dropdown
const closeDropdown = () => {
  isDropdownOpen.value = false;
};

// Обновить уведомления
const refreshNotifications = async () => {
  try {
    await notificationStore.fetchNotifications(true);
  } catch (error) {
    console.warn('⚠️ Не удалось обновить уведомления:', error);
  }
};

// Обработка клика по уведомлению
const handleNotificationClick = async (notification: Notification) => {
  // Отмечаем как прочитанное если не прочитано
  if (!notification.read) {
    try {
      await notificationStore.markAsRead(notification.id);
    } catch (error) {
      console.warn('⚠️ Не удалось отметить уведомление как прочитанное:', error);
    }
  }
  
  // 🔥 ОБНОВЛЕННАЯ НАВИГАЦИЯ ДЛЯ ТЕСТОВ
  if (notification.homework_id) {
    // Уведомления о ДЗ - переходим к списку ДЗ
    router.push('/homeworks');
  } else if (notification.type === 'TEST_SUBMITTED') {
    // 🔥 ДЛЯ ПРЕПОДАВАТЕЛЯ: переходим к проверке конкретного теста
    router.push(`/instructor/text-answers`);
  } else if (notification.type === 'TEST_REVIEWED') {
    // 🔥 ДЛЯ СТУДЕНТА: переходим к уроку с этим тестом
    router.push(`/my-courses/`);
  } else {
    // Общие уведомления - переходим на главную
    router.push('/');
  }
  
  closeDropdown();
};

// Отметить как прочитанное
const markAsRead = async (notificationId: number) => {
  try {
    await notificationStore.markAsRead(notificationId);
  } catch (error) {
    console.warn('⚠️ Не удалось отметить уведомление как прочитанное:', error);
  }
};

// Прочитать все
const markAllAsRead = async () => {
  try {
    await notificationStore.markAllAsRead();
  } catch (error) {
    console.warn('⚠️ Не удалось отметить все уведомления как прочитанные:', error);
  }
};

// Очистить прочитанные уведомления
const clearReadNotifications = async () => {
  try {
    await notificationStore.clearReadNotifications();
  } catch (error) {
    console.warn('⚠️ Не удалось очистить прочитанные уведомления:', error);
  }
};

// Форматирование времени
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин назад`;
  if (diffHours < 24) return `${diffHours} ч назад`;
  if (diffDays === 1) return 'вчера';
  if (diffDays < 7) return `${diffDays} дн назад`;
  
  return date.toLocaleDateString('ru-RU');
};

// Закрытие по клику вне компонента
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.notification-bell')) {
    closeDropdown();
  }
};

// Периодическая проверка новых уведомлений
let checkInterval: number;

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  // Загружаем уведомления при монтировании
  notificationStore.fetchNotifications().catch(error => {
    console.warn('⚠️ Не удалось загрузить уведомления при старте:', error);
  });
  
  // Проверяем новые уведомления каждые 60 секунд
  checkInterval = window.setInterval(async () => {
    try {
      const hasNew = await notificationStore.checkForNewNotifications();
      if (hasNew && !isDropdownOpen.value) {
        // Можно добавить визуальное уведомление о новых уведомлениях
        console.log('🎉 Есть новые уведомления!');
      }
    } catch (error) {
      console.warn('⚠️ Ошибка при периодической проверке уведомлений:', error);
    }
  }, 60000);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (checkInterval) {
    clearInterval(checkInterval);
  }
});
</script>

<style scoped>
.notification-bell {
  position: relative;
  display: inline-block;
}

.bell-button {
  position: relative;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
  font-size: 20px;
}

.bell-button:hover {
  background-color: #f5f5f5;
}

.bell-button.has-notifications {
  animation: pulse 2s infinite;
}

.notification-count {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 400px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 8px;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.dropdown-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.mark-all-read,
.clear-read-btn {
  background: none;
  border: none;
  color: #8C4CC3;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
  padding: 4px;
}

.mark-all-read:disabled,
.clear-read-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-item.unread {
  background-color: #f0f7ff;
}

.notification-item.homework-notification {
  border-left: 3px solid #8C4CC3;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.unread-dot {
  width: 8px;
  height: 8px;
  background-color: #8C4CC3;
  border-radius: 50%;
  display: inline-block;
}

.notification-message {
  font-size: 13px;
  color: #666;
  margin-bottom: 6px;
  line-height: 1.3;
}

.notification-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #999;
}

.lesson-name {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
}

.notification-time {
  font-size: 11px;
  color: #999;
}

.mark-read-btn {
  background: none;
  border: none;
  color: #8C4CC3;
  cursor: pointer;
  font-size: 12px;
  padding: 4px;
  opacity: 0.7;
}

.mark-read-btn:hover:not(:disabled) {
  opacity: 1;
}

.mark-read-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.loading-notifications,
.empty-notifications {
  padding: 32px 16px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.dropdown-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  gap: 12px;
}

.view-all-link {
  color: #8C4CC3;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
}

.refresh-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* Адаптивность */
@media (max-width: 480px) {
  .notifications-dropdown {
    width: 320px;
    right: -50px;
  }
  
  .dropdown-header {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
  
  .header-actions {
    align-self: flex-end;
  }
}
</style>