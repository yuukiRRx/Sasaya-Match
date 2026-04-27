<template>
  <div class="page-container fav-container">
    <BackButton />

    <h1 class="title">お気に入り</h1>
    <p class="subtitle">{{ favSpots.length }}件のスポットを保存中</p>

    <!-- お気に入りリスト -->
    <div v-if="favSpots.length > 0" class="fav-list">
      <div 
        v-for="(spot, index) in favSpots" 
        :key="spot.id" 
        class="fav-card fade-up-enter"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <router-link :to="'/detail/' + spot.id" class="fav-link">
          <img :src="spot.imageUrl" :alt="spot.name" class="fav-img">
          <div class="fav-info">
            <h3 class="fav-name">{{ spot.name }}</h3>
            <p class="fav-feature">{{ spot.feature }}</p>
            <span class="fav-budget">💰 {{ spot.budget }}</span>
          </div>
        </router-link>
        <button @click="removeFav(spot.id)" class="remove-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>

    <!-- 空の状態 -->
    <div v-else class="empty-state">
      <span class="empty-emoji">💔</span>
      <p class="empty-title">まだお気に入りがありません</p>
      <p class="empty-desc">スポットの詳細画面で ❤️ ボタンを押すと<br>ここに保存されます。</p>
      <router-link to="/explore" class="btn-primary empty-btn">スポットを探す</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { store } from '../store'
import { spots } from '../data/spots'
import { playPopSound } from '../utils/sound.ts'
import BackButton from '../components/BackButton.vue'

const favSpots = computed(() => {
  return spots.filter(s => store.favorites.includes(s.id))
})

const removeFav = (id: string) => {
  playPopSound()
  store.favorites = store.favorites.filter(fid => fid !== id)
}
</script>

<style scoped>
.fav-container {
  padding-top: 72px;
}

.fav-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fav-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fav-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.fav-link {
  display: flex;
  flex: 1;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}

.fav-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  flex-shrink: 0;
  transition: transform 0.5s;
}

.fav-card:hover .fav-img {
  transform: scale(1.05);
}

.fav-info {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.fav-name {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.fav-feature {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.fav-budget {
  font-size: 12px;
  font-weight: 800;
  color: var(--primary-color);
}

.remove-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(231, 76, 60, 0.08);
  color: #E74C3C;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 16px;
  flex-shrink: 0;
  transition: all 0.3s;
}

.remove-btn:hover {
  background: #E74C3C;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}

/* 空の状態 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  padding: 40px 0;
}

.empty-emoji {
  font-size: 56px;
  margin-bottom: 20px;
}

.empty-title {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-main);
}

.empty-desc {
  font-size: 13px;
  color: var(--text-light);
  line-height: 1.8;
  margin-bottom: 24px;
}

.empty-btn {
  width: auto;
  padding: 12px 32px;
}
</style>
