<template>
  <div class="page-container ranking-container">
    <BackButton />

    <h1 class="title">ランキング</h1>
    <p class="subtitle">丹波篠山の人気スポット（※仮データ）</p>

    <!-- カテゴリ切り替え -->
    <div class="rank-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id" 
        class="rank-tab"
        :class="{ active: selectedTab === tab.id }"
        @click="selectedTab = tab.id"
      >
        {{ tab.icon }} {{ tab.name }}
      </button>
    </div>

    <!-- ランキングリスト -->
    <div class="rank-list">
      <router-link 
        v-for="(spot, index) in rankedSpots" 
        :key="spot.id" 
        :to="'/detail/' + spot.id"
        class="rank-card fade-up-enter"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="rank-number" :class="{ gold: index === 0, silver: index === 1, bronze: index === 2 }">
          {{ index + 1 }}
        </div>
        <img :src="spot.imageUrl" :alt="spot.name" class="rank-img">
        <div class="rank-info">
          <h3 class="rank-name">{{ spot.name }}</h3>
          <p class="rank-feature">{{ spot.feature }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { spots } from '../data/spots'
import BackButton from '../components/BackButton.vue'

const selectedTab = ref('popular')

const tabs = [
  { id: 'popular', name: '総合', icon: '👑' },
  { id: 'food', name: 'グルメ', icon: '🍽️' },
  { id: 'nature', name: '自然', icon: '🌿' },
  { id: 'culture', name: '文化', icon: '🏯' }
]

// 仮のランキングデータ（スポットが増えてきたら本格的に調整する）
const rankedSpots = computed(() => {
  let filtered = [...spots]
  switch (selectedTab.value) {
    case 'food':
      filtered = spots.filter(s => s.category === 'food')
      break
    case 'nature':
      filtered = spots.filter(s => s.category === 'sightseeing')
      break
    case 'culture':
      filtered = spots.filter(s => s.category === 'history' || s.category === 'festival')
      break
  }
  // 仮の並び順（今はそのまま表示。今後スコアを付けて並び替え可能）
  return filtered
})
</script>

<style scoped>
.ranking-container {
  padding-top: 72px;
}

.rank-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.rank-tab {
  white-space: nowrap;
  font-size: 13px;
  font-weight: 800;
  padding: 10px 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.rank-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.rank-tab.active {
  background: linear-gradient(135deg, var(--primary-color), var(--festival-color));
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(138, 58, 58, 0.2);
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rank-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.rank-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.rank-number {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 18px;
  color: var(--text-light);
  background: rgba(0, 0, 0, 0.05);
  margin-left: 16px;
  flex-shrink: 0;
}

.rank-number.gold {
  background: linear-gradient(135deg, #FFD700, #F39C12);
  color: white;
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.4);
}

.rank-number.silver {
  background: linear-gradient(135deg, #E0E0E0, #95A5A6);
  color: white;
  box-shadow: 0 4px 12px rgba(149, 165, 166, 0.4);
}

.rank-number.bronze {
  background: linear-gradient(135deg, #E67E22, #D35400);
  color: white;
  box-shadow: 0 4px 12px rgba(211, 84, 0, 0.4);
}

.rank-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  flex-shrink: 0;
  transition: transform 0.5s;
}

.rank-card:hover .rank-img {
  transform: scale(1.05);
}

.rank-info {
  padding: 14px 16px 14px 0;
  min-width: 0;
  flex: 1;
}

.rank-name {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.rank-feature {
  font-size: 12px;
  color: var(--text-light);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}
</style>
