<template>
  <div class="detail-container">
    <div class="header-image" v-if="spot">
      <img :src="spot.imageUrl" :alt="spot.name">
      <div class="image-gradient"></div>
      
      <button @click="router.back()" class="back-icon-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>

      <!-- お気に入りボタン -->
      <button @click="toggleFavorite" class="favorite-btn" :class="{ 'is-favorite': isFavorite }">
        <svg v-if="isFavorite" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#C0392B" stroke="#C0392B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </button>
    </div>
    
    <div class="content-body" v-if="spot">
      <div class="tags">
        <span v-for="tag in spot.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      
      <h1 class="spot-title">{{ spot.name }}</h1>
      <p class="spot-desc">{{ spot.description }}</p>
      
      <div class="info-grid">
        <div class="info-item">
          <span class="info-icon">💰</span>
          <div class="info-text">
            <span class="info-label">予算の目安</span>
            <span class="info-value">{{ spot.budget }}</span>
          </div>
        </div>
        <div class="info-item">
          <span class="info-icon">⏱️</span>
          <div class="info-text">
            <span class="info-label">滞在時間の目安</span>
            <span class="info-value">{{ spot.duration }}</span>
          </div>
        </div>
      </div>
      
      <a 
        :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.mapQuery || spot.name)}`" 
        target="_blank" 
        class="map-btn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        Google Mapsで経路を見る
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { spots } from '../data/spots'
import { store } from '../store'
import { playPopSound } from '../utils/sound.ts'

const route = useRoute()
const router = useRouter()
const spotId = route.params.id as string

const spot = computed(() => {
  return spots.find(s => s.id === spotId)
})

const isFavorite = computed(() => {
  return store.favorites.includes(spotId)
})

const toggleFavorite = () => {
  playPopSound()
  if (isFavorite.value) {
    store.favorites = store.favorites.filter(id => id !== spotId)
  } else {
    store.favorites.push(spotId)
  }
}
</script>

<style scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: transparent;
}

.header-image {
  position: relative;
  height: 350px;
  width: 100%;
}

@media (min-width: 768px) {
  .header-image {
    height: 450px;
  }
}

.header-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 60%;
  background: linear-gradient(to top, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);
  z-index: 1;
}

.back-icon-btn {
  position: absolute;
  top: 24px;
  left: 20px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
  z-index: 2;
  transition: all 0.3s;
}

.back-icon-btn:hover {
  transform: scale(1.05);
  background: white;
}

.favorite-btn {
  position: absolute;
  bottom: -28px;
  right: 28px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 11;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(10px);
}

.favorite-btn:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
}

.favorite-btn:active {
  transform: scale(0.95);
}

.favorite-btn svg {
  color: #ccc;
  transition: all 0.3s;
}

.favorite-btn.is-favorite svg {
  color: #C0392B;
  animation: heartBurst 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes heartBurst {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.content-body {
  padding: 32px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 32px 32px 0 0;
  margin-top: -32px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 10;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.05);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.tag {
  color: var(--primary-color);
  font-size: 12px;
  font-weight: 800;
  background: rgba(138, 58, 58, 0.1);
  padding: 6px 14px;
  border-radius: 16px;
  letter-spacing: 0.5px;
}

.spot-title {
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 20px;
  color: var(--text-main);
  line-height: 1.3;
}

.spot-desc {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-main);
  margin-bottom: 32px;
  font-weight: 500;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 36px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.85);
  padding: 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
}

.info-icon {
  font-size: 28px;
  background: rgba(0, 0, 0, 0.03);
  width: 48px; height: 48px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

.info-text {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 11px;
  color: var(--text-light);
  font-weight: 700;
  margin-bottom: 2px;
}

.info-value {
  font-size: 14px;
  font-weight: 900;
  color: var(--text-main);
}

.map-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(135deg, #4285F4, #3367D6);
  color: white;
  text-decoration: none;
  padding: 20px;
  border-radius: 30px;
  font-weight: 800;
  font-size: 16px;
  box-shadow: 0 8px 20px rgba(66, 133, 244, 0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-top: auto;
  border: 2px solid rgba(255,255,255,0.2);
}

.map-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(66, 133, 244, 0.4);
}

.map-btn:active {
  transform: scale(0.98);
}
</style>
