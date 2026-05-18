<template>
  <div class="swipe-container">
    <!-- 上部ナビゲーション -->
    <div class="swipe-nav">
      <button @click="goBack" class="nav-btn">
        <ArrowLeft :size="20" :stroke-width="2.5" />
      </button>
      <span class="nav-counter">{{ currentIndex + 1 }} / {{ filteredSpots.length }}</span>
      <router-link to="/summary" class="nav-btn">
        <Check :size="20" :stroke-width="2.5" />
      </router-link>
    </div>

    <!-- 縦スナップスクロール -->
    <div class="snap-scroll" ref="scrollContainer" @scroll="onScroll">
      <div
        v-for="spot in filteredSpots"
        :key="spot.id"
        class="snap-card"
      >
        <!-- 背景画像 -->
        <img :src="spot.imageUrl" :alt="spot.name" class="snap-bg">
        <div class="snap-gradient"></div>

        <!-- コンテンツ -->
        <div class="snap-content">
          <div class="snap-tags">
            <span v-for="tag in spot.tags.slice(0, 3)" :key="tag" class="snap-tag">{{ tag }}</span>
          </div>
          <h2 class="snap-name">{{ spot.name }}</h2>
          <p class="snap-feature">{{ spot.feature }}</p>
          <div class="snap-meta">
            <span class="meta-item"><Wallet :size="13" :stroke-width="2" /> {{ spot.budget }}</span>
            <span class="meta-item"><Clock :size="13" :stroke-width="2" /> {{ spot.duration }}</span>
          </div>
        </div>

        <!-- TikTok風サイドバー -->
        <div class="action-bar">
          <button @click.stop="toggleFavorite(spot.id)" class="action-btn">
            <Heart :size="26" :stroke-width="2" :fill="isFav(spot.id) ? '#FF4757' : 'none'" :color="isFav(spot.id) ? '#FF4757' : 'white'" />
            <span class="action-label">保存</span>
          </button>
          <button @click.stop="openMap(spot)" class="action-btn">
            <MapPin :size="26" :stroke-width="2" />
            <span class="action-label">地図</span>
          </button>
          <router-link :to="'/detail/' + spot.id" class="action-btn" @click.stop>
            <Info :size="26" :stroke-width="2" />
            <span class="action-label">詳細</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- スクロールガイド -->
    <div class="scroll-guide" v-if="showGuide" @click="showGuide = false">
      <ChevronUp :size="20" :stroke-width="2" />
      <span>スワイプして次へ</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../store'
import { spots } from '../data/spots'
import { playPopSound } from '../utils/sound.ts'
import { ArrowLeft, Check, Heart, MapPin, Info, Wallet, Clock, ChevronUp } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const scrollContainer = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const showGuide = ref(true)

const isExploreMode = computed(() => route.query.mode === 'explore')

const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const filteredSpots = computed(() => {
  if (isExploreMode.value) return shuffle(spots)
  if (!store.selectedCategory) return spots.slice(0, 8)
  return spots.filter(spot => spot.category === store.selectedCategory)
})

const isFav = (id: string) => store.favorites.includes(id)

const toggleFavorite = (id: string) => {
  playPopSound()
  const idx = store.favorites.indexOf(id)
  if (idx === -1) store.favorites.push(id)
  else store.favorites.splice(idx, 1)
}

const openMap = (spot: { mapQuery?: string; name: string }) => {
  const q = encodeURIComponent(spot.mapQuery || spot.name + ' 丹波篠山')
  window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank')
}

const onScroll = () => {
  if (!scrollContainer.value) return
  const h = scrollContainer.value.clientHeight
  const idx = Math.round(scrollContainer.value.scrollTop / h)
  currentIndex.value = idx
  if (showGuide.value && idx > 0) showGuide.value = false
}

const goBack = () => router.back()
</script>

<style scoped>
.swipe-container {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #000;
}

.swipe-nav {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  padding-top: calc(16px + env(safe-area-inset-top));
  background: linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%);
}

.nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px; height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.15);
  color: white;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s var(--ease-ios);
  -webkit-tap-highlight-color: transparent;
}

.nav-btn:active { transform: scale(0.9); }

.nav-counter {
  color: white;
  font-size: 13px;
  font-weight: 700;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
  letter-spacing: 2px;
}

/* 縦スナップスクロール */
.snap-scroll {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.snap-scroll::-webkit-scrollbar { display: none; }

.snap-card {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  scroll-snap-align: start;
  position: relative;
  overflow: hidden;
}

.snap-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.snap-gradient {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 60%;
  background: linear-gradient(to top,
    rgba(0,0,0,0.85) 0%,
    rgba(0,0,0,0.4) 40%,
    transparent 100%
  );
  pointer-events: none;
}

/* コンテンツ */
.snap-content {
  position: absolute;
  bottom: 0; left: 0; right: 72px;
  padding: 0 20px 100px;
  color: white;
}

.snap-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.snap-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 20px;
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.snap-name {
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 900;
  margin-bottom: 8px;
  line-height: 1.25;
  text-shadow: 0 2px 12px rgba(0,0,0,0.4);
  letter-spacing: 0.03em;
}

.snap-feature {
  font-size: 14px;
  opacity: 0.88;
  margin-bottom: 14px;
  line-height: 1.6;
}

.snap-meta {
  display: flex;
  gap: 16px;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 700;
  opacity: 0.9;
}

/* TikTok風サイドバー */
.action-bar {
  position: absolute;
  right: 12px;
  bottom: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  z-index: 10;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s var(--ease-ios);
}
.action-btn:active { transform: scale(0.85); }

.action-label {
  font-size: 11px;
  font-weight: 700;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
}

/* スクロールガイド */
.scroll-guide {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: rgba(255,255,255,0.8);
  font-size: 12px;
  font-weight: 600;
  z-index: 15;
  animation: guideFloat 2s ease-in-out infinite;
}

@keyframes guideFloat {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-8px); }
}
</style>
