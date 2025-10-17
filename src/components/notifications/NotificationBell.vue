<template>
  <div class="notification-bell">
    <!-- Кнопка с колокольчиком и счетчиком -->
    <button 
      class="bell-button"
      @click="toggleDropdown"
      :class="{ 'has-notifications': unreadCount > 0 }"
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
        <button 
          v-if="notificationStore.unreadNotifications.length > 0"
          @click="markAllAsRead"
          class="mark-all-read"
        >
          Прочитать все
        </button>
      </div>

      <div class="notifications-list">
        <div 
          v-for="notification in notificationStore.notifications.slice(0, 10)" 
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.read }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">
              {{ formatTime(notification.createdAt) }}
            </div>
          </div>
          <button 
            v-if="!notification.read"
            @click.stop="markAsRead(notification.id)"
            class="mark-read-btn"
            title="Отметить как прочитанное"
          >
            ●
          </button>
        </div>

        <div v-if="notificationStore.notifications.length === 0" class="empty-notifications">
          Уведомлений нет
        </div>
      </div>

      <div class="dropdown-footer">
        <button 
          v-if="notificationStore.notifications.length > 0"
          @click="clearAllNotifications"
          class="clear-all-btn"
        >
          Очистить все
        </button>
        <router-link 
          to="/homeworks" 
          class="view-all-link"
          @click="closeDropdown"
        >
          Все домашние работы
        </router-link>
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
const unreadCount = computed(() => 
  notificationStore.unreadNotifications.length
);

// Переключение dropdown
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Закрытие dropdown
const closeDropdown = () => {
  isDropdownOpen.value = false;
};

// Обработка клика по уведомлению
const handleNotificationClick = (notification: Notification) => {
  if (!notification.read) {
    notificationStore.markAsRead(notification.id);
  }
  
  // Если это уведомление о домашней работе - переходим к списку ДЗ
  if (notification.type === 'homework_status') {
    router.push('/homeworks');
  }
  
  closeDropdown();
};

// Отметить как прочитанное
const markAsRead = (notificationId: number) => {
  notificationStore.markAsRead(notificationId);
};

// Прочитать все
const markAllAsRead = () => {
  notificationStore.markAllAsRead();
};

// Очистить все уведомления
const clearAllNotifications = () => {
  notificationStore.clearAll();
};

// Форматирование времени
const formatTime = (date: Date) => {
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

// Периодическая проверка изменений статусов
let checkInterval: number;

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  
  // Проверяем изменения статусов каждые 30 секунд
  checkInterval = window.setInterval(() => {
    notificationStore.checkHomeworkStatusChanges();
  }, 30000);
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
  width: 350px;
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

.mark-all-read {
  background: none;
  border: none;
  color: #8C4CC3;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
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

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.notification-message {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
  line-height: 1.3;
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

.mark-read-btn:hover {
  opacity: 1;
}

.empty-notifications {
  padding: 32px 16px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.dropdown-footer {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  gap: 12px;
}

.clear-all-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 12px;
  text-decoration: underline;
}

.view-all-link {
  color: #8C4CC3;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
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
    width: 300px;
    right: -50px;
  }
}
</style>