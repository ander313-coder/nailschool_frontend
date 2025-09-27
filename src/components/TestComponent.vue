<template>
  <div class="test-container">
    <!-- Всегда показываем демо-тест -->
    <TestDemo 
      :lesson-id="lessonId"
      @close="emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
import TestDemo from './TestDemo.vue';

defineProps<{
  testId: number;
  lessonId: number;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>