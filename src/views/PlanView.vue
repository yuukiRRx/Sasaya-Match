<template>
  <div class="page-container plan-container">
    <h1 class="title">あなた専用の旅行計画</h1>
    <p class="subtitle" v-if="planSpots.length > 0">お気に入りに登録したスポットから、自動で旅行スケジュールを作成しました。</p>
    <p class="subtitle" v-else>まだお気に入りがありません。スポットを保存して、あなただけの計画を作りましょう！</p>
    
    <div class="timeline" v-if="planSpots.length > 0">
      <div v-for="(spot, index) in planSpots" :key="spot.id" class="timeline-item fade-up-enter" :style="{ animationDelay: `${index * 0.2}s` }">
        <div class="time-marker">
          <span class="time">{{ 10 + index * 2 }}:00</span>
          <div class="line" v-if="index !== planSpots.length - 1"></div>
        </div>
        <div class="timeline-content">
          <router-link :to="'/detail/' + spot.id" class="plan-card">
            <img :src="spot.imageUrl" :alt="spot.name" class="plan-img">
            <div class="plan-info">
              <h3 class="plan-name">{{ spot.name }}</h3>
              <p class="plan-duration">滞在予定: {{ spot.duration }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    
    <router-link to="/" class="btn-secondary back-btn">トップに戻る</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { store } from '../store'
import { spots } from '../data/spots'

const planSpots = computed(() => {
  // お気に入りのスポットを取得
  const favs = spots.filter(s => store.favorites.includes(s.id))
  // お気に入りがない場合は、診断履歴に関連するものを適当にピックアップ
  if (favs.length === 0) {
    if (store.history.length > 0) {
      const lastCategory = store.history[store.history.length - 1]
      return spots.filter(s => s.category === lastCategory).slice(0, 3)
    }
    return []
  }
  return favs
})
</script>

<style scoped>
.plan-container {
  padding: 32px 24px;
}

.timeline {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.timeline-item {
  display: flex;
  gap: 16px;
  position: relative;
}

.time-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
  flex-shrink: 0;
}

.time {
  font-weight: 900;
  color: var(--primary-color);
  font-size: 16px;
  background: rgba(255,255,255,0.8);
  padding: 4px 8px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.line {
  width: 2px;
  flex: 1;
  background: var(--secondary-color);
  opacity: 0.5;
  margin-top: 8px;
  margin-bottom: -16px;
}

.timeline-content {
  flex: 1;
  padding-bottom: 24px;
}

.plan-card {
  display: flex;
  background: var(--white);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  border: 1px solid rgba(0,0,0,0.03);
}

.plan-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.plan-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.plan-info {
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.plan-name {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--text-main);
}

.plan-duration {
  font-size: 12px;
  color: var(--text-light);
}

.back-btn {
  margin-top: 32px;
}
</style>
