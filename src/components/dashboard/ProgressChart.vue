<template>
  <div class="progress-chart">
    <div class="chart-header">
      <h3>Ваш прогресс за неделю</h3>
      <span class="chart-period">Обучение становится привычкой! 🚀</span>
    </div>
    
    <div class="chart-container">
      <div class="chart-bars">
        <div v-for="day in weekData" :key="day.name" class="day-column">
          <div class="bar-container">
            <div class="bar" :style="{ height: day.progress + '%' }">
              <span class="bar-value">{{ day.progress }}%</span>
            </div>
          </div>
          <div class="day-label">{{ day.name }}</div>
          <div class="day-activity" :class="{ active: day.activity }">
            {{ day.activity ? '✓' : '' }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="chart-stats">
      <div class="stat">
        <span class="stat-value">78%</span>
        <span class="stat-label">Средняя активность</span>
      </div>
      <div class="stat">
        <span class="stat-value">5.2ч</span>
        <span class="stat-label">Время обучения</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const weekData = [
  { name: 'Пн', progress: 85, activity: true },
  { name: 'Вт', progress: 60, activity: true },
  { name: 'Ср', progress: 45, activity: true },
  { name: 'Чт', progress: 90, activity: true },
  { name: 'Пт', progress: 75, activity: true },
  { name: 'Сб', progress: 30, activity: false },
  { name: 'Вс', progress: 65, activity: true }
];
</script>

<style scoped>
.progress-chart {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 2rem 0;
  border: 1px solid #e0e0e0;
}

.chart-header {
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.chart-period {
  color: #666;
  font-size: 0.9rem;
}

.chart-container {
  margin: 2rem 0;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 150px;
  gap: 0.5rem;
}

.day-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-container {
  height: 100%;
  display: flex;
  align-items: flex-end;
  width: 100%;
}

.bar {
  width: 100%;
  background: linear-gradient(to top, #8C4CC3, #a56dd1);
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.3s ease;
  min-height: 20px;
}

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
}

.day-label {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #666;
  font-weight: 600;
}

.day-activity {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.3rem;
  font-size: 0.7rem;
}

.day-activity.active {
  background: #4ECDC4;
  color: white;
}

.chart-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #8C4CC3;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .chart-bars {
    height: 120px;
  }
  
  .bar-value {
    top: -20px;
    font-size: 0.7rem;
  }
}
</style>