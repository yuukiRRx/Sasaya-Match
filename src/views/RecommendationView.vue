<template>
  <div class="swipe-container">
    <!-- 上部ナビゲーション -->
    <div class="swipe-nav">
      <button @click="goBack" class="nav-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span class="nav-counter">{{ currentIndex + 1 }} / {{ filteredSpots.length }}</span>
      <router-link to="/summary" class="nav-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </router-link>
    </div>

    <!-- 縦スナップスクロールのカード群 -->
    <div class="snap-scroll" ref="scrollContainer" @scroll="onScroll">
      <div 
        v-for="(spot, index) in filteredSpots" 
        :key="spot.id" 
        class="snap-card"
      >
        <!-- 背景画像 -->
        <img :src="spot.imageUrl" :alt="spot.name" class="snap-bg">
        <div class="snap-gradient"></div>

        <!-- コンテンツ（画面下部に表示） -->
        <div class="snap-content">
          <div class="snap-tags">
            <span v-for="tag in spot.tags" :key="tag" class="snap-tag">{{ tag }}</span>
          </div>
          <h2 class="snap-name">{{ spot.name }}</h2>
          <p class="snap-feature">{{ spot.feature }}</p>
          
          <div class="snap-meta">
            <span class="meta-item">💰 {{ spot.budget }}</span>
            <span class="meta-item">⏱️ {{ spot.duration }}</span>
          </div>
        </div>

        <!-- サイドアクションバー（TikTok風） -->
        <div class="action-bar">
          <button @click.stop="toggleFavorite(spot.id)" class="action-btn">
            <svg v-if="isFav(spot.id)" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#FF4757" stroke="#FF4757" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span class="action-label">保存</span>
          </button>
          <button @click.stop="openMap(spot)" class="action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span class="action-label">地図</span>
          </button>
          <router-link :to="'/detail/' + spot.id" class="action-btn" @click.stop>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <span class="action-label">詳細</span>
          </router-link>
        </div>

        <!-- スワイプガイド（最初のカードだけ表示） -->
        <div v-if="index === 0 && showGuide" class="swipe-guide" @click="showGuide = false">
          <div class="guide-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </div>
          <span class="guide-text">上にスワイプして次のスポットへ</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../store'
import { spots } from '../data/spots'
import type { SpotData } from '../data/spots'
import { playPopSound } from '../utils/sound.ts'

const router = useRouter()
const route = useRoute()
const scrollContainer = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const showGuide = ref(true)

// モード判定: ?mode=explore ならランダム全件、それ以外は診断結果
const isExploreMode = computed(() => route.query.mode === 'explore')

// ランダムシャッフル関数
const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 診断モードではカテゴリでフィルタ、探索モードではランダムで全件表示
const filteredSpots = computed(() => {
  if (isExploreMode.value) {
    return shuffle(spots)
  }
  if (!store.selectedCategory) {
    router.replace('/diagnosis')
    return []
  }
  return spots.filter(spot => spot.category === store.selectedCategory)
})

const isFav = (id: string) => store.favorites.includes(id)

const toggleFavorite = (id: string) => {
  playPopSound()
  if (isFav(id)) {
    store.favorites = store.favorites.filter(fid => fid !== id)
  } else {
    store.favorites.push(id)
  }
}

const openMap = (spot: SpotData) => {
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.mapQuery || spot.name)}`,
    '_blank'
  )
}

const goBack = () => {
  router.back()
}

// スクロール位置から現在のカードインデックスを計算
const onScroll = () => {
  if (!scrollContainer.value) return
  const container = scrollContainer.value
  const cardHeight = container.clientHeight
  const scrollTop = container.scrollTop
  currentIndex.value = Math.round(scrollTop / cardHeight)
  // 少しでもスクロールしたらガイドを消す
  if (scrollTop > 30) showGuide.value = false
}

// 最初のカードが表示された3秒後にガイドを自動で消す
onMounted(() => {
  setTimeout(() => {
    showGuide.value = false
  }, 3000)
})
</script>

<style scoped>
.swipe-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

/* 上部ナビゲーション */
.swipe-nav {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.4), transparent);
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.nav-btn:hover {
  background: rgba(255,255,255,0.3);
}

.nav-counter {
  color: white;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 2px;
  background: rgba(0,0,0,0.3);
  padding: 6px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

/* スナップスクロール本体 */
.snap-scroll {
  width: 100%;
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
}

/* カード */
.snap-card {
  position: relative;
  width: 100%;
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  overflow: hidden;
}

.snap-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* ゆっくりズームするアニメーション */
  animation: slowZoom 20s ease-in-out infinite alternate;
}

@keyframes slowZoom {
  from { transform: scale(1); }
  to { transform: scale(1.15); }
}

.snap-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.1) 0%,
    rgba(0,0,0,0) 40%,
    rgba(0,0,0,0.4) 70%,
    rgba(0,0,0,0.85) 100%
  );
}

/* 下部のコンテンツ表示 */
.snap-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 80px; /* サイドバーのスペースを確保 */
  padding: 32px 20px;
  z-index: 10;
  color: white;
}

.snap-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.snap-tag {
  font-size: 12px;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(5px);
  padding: 4px 12px;
  border-radius: 20px;
}

.snap-name {
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 8px;
  text-shadow: 0 2px 15px rgba(0,0,0,0.5);
  line-height: 1.3;
}

.snap-feature {
  font-size: 14px;
  opacity: 0.85;
  line-height: 1.6;
  margin-bottom: 16px;
}

.snap-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  font-size: 13px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(5px);
  padding: 6px 14px;
  border-radius: 8px;
  font-weight: 600;
}

/* サイドアクションバー */
.action-bar {
  position: absolute;
  right: 12px;
  bottom: 100px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  color: white;
}

.action-btn:hover {
  transform: scale(1.15);
}

.action-btn:active {
  transform: scale(0.9);
}

.action-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

/* スワイプガイド */
.swipe-guide {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(3px);
  animation: guideAppear 0.5s ease-out;
  cursor: pointer;
}

@keyframes guideAppear {
  from { opacity: 0; }
  to { opacity: 1; }
}

.guide-arrow {
  animation: bounceUp 1s ease-in-out infinite;
}

@keyframes bounceUp {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.guide-text {
  color: white;
  font-size: 15px;
  font-weight: 700;
  margin-top: 16px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
  letter-spacing: 1px;
}

/* スクロールバーを非表示に */
.snap-scroll::-webkit-scrollbar {
  display: none;
}
.snap-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
