<template>
  <div class="dashboard">
    <!-- 顶部 -->
    <header class="dashboard-header">
      <img src="" alt="智能分析系统" class="header-logo" />
      <nav class="header-nav">
        <span
          v-for="item in navItems"
          :key="item"
          class="nav-item"
          :class="{ active: item === '首页' }"
        >
          {{ item }}
        </span>
      </nav>
      <time class="dashboard-time">{{ currentTime }}</time>
    </header>

    <!-- 主体 -->
    <main class="dashboard-body">
      <!-- 统计卡片 -->
      <section class="stat-row">
        <UiCard variant="dashboard" class="stat-item" v-for="(stat, index) in stats" :key="index">
          <div class="stat-number">
            {{ stat.value }}
          </div>
          <div class="stat-label">
            {{ stat.label }}
          </div>
        </UiCard>
      </section>

      <!-- 图表区域 -->
      <section class="chart-row">
        <UiCard variant="dashboard" class="chart-main">
          <div class="chart-placeholder">📈 趋势图</div>
        </UiCard>
        <UiCard variant="dashboard" class="chart-side">
          <div class="chart-placeholder">📊 数据分布</div>
        </UiCard>
      </section>

      <!-- 表格 -->
      <UiCard variant="dashboard" class="table-area">
        <div class="table-placeholder">📋 数据列表</div>
      </UiCard>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { UiCard } from '@my-repo/ui'

// ===== 时间 =====
const currentTime = ref('')
let timer: ReturnType<typeof setInterval> | null = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// ===== 导航数据 =====
const navItems = ['首页', '资金', '指数', '板块', '个股', '时间', '科技']

// ===== 统计卡片数据（4个卡片） =====
const stats = [
  { label: '总用户', value: '1,284' },
  { label: '活跃用户', value: '862' },
  { label: '转化率', value: '23.6%' },
  { label: '总访问量', value: '2.3M' }
]
</script>

<style scoped lang="scss">
.dashboard {
  width: 100vw;
  height: 100vh;
  padding: 1.5vh 2vw;
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
  background: transparent;
  box-sizing: border-box;
  overflow: hidden;
}

/* ===== 顶部 ===== */
.dashboard-header {
  flex-shrink: 0;
  height: 7vh;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-logo {
    height: 100%;
    width: auto;
    object-fit: contain;
  }

  .header-nav {
    display: flex;
    gap: 0.5vw;

    .nav-item {
      padding: 0.6vh 1.2vw;
      font-size: 1.1vw;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: 0.3s;
      border-radius: 4px;
      white-space: nowrap;

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.08);
      }

      &.active {
        color: #409eff;
        background: rgba(64, 158, 255, 0.15);
      }
    }
  }

  .dashboard-time {
    font-size: 1vw;
    color: rgba(255, 255, 255, 0.6);
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }
}

/* ===== 主体 ===== */
.dashboard-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
  min-height: 0;
}

/* ===== 统计卡片行 ===== */
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5vh;
  flex-shrink: 0;
  min-height: 12vh;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2vh 1vw;
  min-height: 10vh;
  width: 100%;
  box-sizing: border-box;

  .stat-number {
    font-size: 2.2vw;
    font-weight: 600;
    color: #fff;
    line-height: 1.2;
  }

  .stat-label {
    font-size: 0.9vw;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 0.5vh;
  }
}

/* ===== 图表行 ===== */
.chart-row {
  display: flex;
  gap: 1.5vh;
  flex: 1;
  min-height: 0;
}

.chart-main {
  flex: 2;
  padding: 1.5vh 1.5vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-side {
  flex: 1;
  padding: 1.5vh 1.5vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.2);
  font-size: 1.2vw;
}

/* ===== 表格 ===== */
.table-area {
  flex-shrink: 0;
  height: 22vh;
  min-height: 100px;
  padding: 1.5vh 1.5vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.2);
  font-size: 1.2vw;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .stat-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .stat-item .stat-number {
    font-size: 4vw;
  }

  .stat-item .stat-label {
    font-size: 2vw;
  }
}
</style>
