<template>
  <div class="real-test-view">
    <h3>Реальный тест</h3>
    <p>Здесь будет реальный функционал тестирования</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  testId: number;
  lessonId: number;
}>();
</script>