<template>
    <div class="user-courses-page">
      <!-- Заголовок страницы -->
      <div class="page-header">
        <h1>Мои курсы</h1>
        <p>Все курсы, доступные для вашего обучения</p>
      </div>
      <UserCourses />
    </div>
</template>

<script setup lang="ts">
import UserCourses from '@/components/dashboard/UserCourses.vue'; 
</script>

<style scoped>
.user-courses-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #333;
}

.page-header p {
  color: #666;
  font-size: 16px;
}
</style>