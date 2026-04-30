<template>
  <div class="swipe-container">
    <!-- 上部ナビゲーション -->
    <div class="swipe-nav">
      <button @click="goBack" class="nav-btn">
        <ArrowLeft :size="22" :stroke-width="2.5" />
      </button>
      <span class="nav-counter" v-if="filteredSpots.length > 0">
        {{ currentIndex + 1 }} / {{ filteredSpots.length }}
      </span>
      <router-link to="/summary" class="nav-btn">
        <Check :size="22" :stroke-width="2.5" />
      </router-link>
    </div>

    <!-- デッキ（カード群） -->
    <div class="deck">
      <div 
        v-for="(spot, index) in remainingSpots" 
        :key="spot.id"
        class="tinder-card"
        :style="getCardStyle(index)"
        @mousedown="index === 0 ? startDrag($event) : null"
        @touchstart="index === 0 ? startDrag($event) : null"
      >
        <img :src="spot.imageUrl" class="card-bg">
        <div class="card-gradient"></div>
        
        <!-- LIKE / NOPE スタンプ -->
        <div v-if="index === 0" class="stamp stamp-like" :style="{ opacity: likeOpacity }">LIKE</div>
        <div v-if="index === 0" class="stamp stamp-nope" :style="{ opacity: nopeOpacity }">NOPE</div>

        <!-- コンテンツ -->
        <div class="card-content">
          <div class="card-tags">
            <span v-for="tag in spot.tags.slice(0, 3)" :key="tag" class="card-tag">{{ tag }}</span>
          </div>
          <h2 class="card-name">{{ spot.name }}</h2>
          <p class="card-feature">{{ spot.feature }}</p>
          <div class="card-meta">
            <span><Wallet :size="14" :stroke-width="2" class="inline-icon"/> {{ spot.budget }}</span>
            <span><Clock :size="14" :stroke-width="2" class="inline-icon"/> {{ spot.duration }}</span>
          </div>
        </div>
      </div>

      <!-- 空の状態 -->
      <div v-if="remainingSpots.length === 0" class="empty-deck">
        <div class="empty-icon"><Sparkles :size="48" stroke-width="1.5" /></div>
        <h3>すべてのスポットを見ました！</h3>
        <p>お気に入りから旅行計画を作りましょう</p>
        <button @click="goToSummary" class="btn-primary mt-4">結果を見る</button>
      </div>
    </div>

    <!-- アクションボタン -->
    <div class="action-buttons" v-if="remainingSpots.length > 0">
      <button class="action-btn btn-nope" @click="swipe('left')">
        <X :size="28" :stroke-width="3" />
      </button>
      <button class="action-btn btn-detail" @click="goToDetail(remainingSpots[0].id)">
        <Info :size="24" :stroke-width="2.5" />
      </button>
      <button class="action-btn btn-like" @click="swipe('right')">
        <Heart :size="28" :stroke-width="3" fill="currentColor" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { store } from '../store'
import { spots } from '../data/spots'
import type { SpotData } from '../data/spots'
import { playPopSound } from '../utils/sound.ts'
import { ArrowLeft, Check, Heart, X, Info, Wallet, Clock, Sparkles } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

// モード判定
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
  if (isExploreMode.value) {
    return shuffle(spots)
  }
  if (!store.selectedCategory) {
    return spots.slice(0, 6) // カテゴリ未選択時はデフォルト表示
  }
  return spots.filter(spot => spot.category === store.selectedCategory)
})

const remainingSpots = ref<SpotData[]>([])
const currentIndex = ref(0)

watch(filteredSpots, (newSpots) => {
  if (remainingSpots.value.length === 0 && newSpots.length > 0) {
    remainingSpots.value = [...newSpots]
    currentIndex.value = 0
  }
}, { immediate: true })

// --- スワイプ（ドラッグ）処理 ---
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const deltaX = ref(0)
const deltaY = ref(0)
const swipeThreshold = 80

const startDrag = (e: MouseEvent | TouchEvent) => {
  if (remainingSpots.value.length === 0) return
  isDragging.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  startX.value = clientX
  startY.value = clientY
}

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  if (e.cancelable) e.preventDefault()
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  deltaX.value = clientX - startX.value
  deltaY.value = (clientY - startY.value) * 0.3 // 縦方向は控えめに
}

const stopDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  
  if (deltaX.value > swipeThreshold) {
    swipe('right')
  } else if (deltaX.value < -swipeThreshold) {
    swipe('left')
  } else {
    deltaX.value = 0
    deltaY.value = 0
  }
}

const swipe = (direction: 'left' | 'right') => {
  if (remainingSpots.value.length === 0) return
  playPopSound()
  
  const currentSpot = remainingSpots.value[0]
  if (direction === 'right') {
    if (!store.favorites.includes(currentSpot.id)) {
      store.favorites.push(currentSpot.id)
    }
  }

  deltaX.value = direction === 'right' ? window.innerWidth * 1.5 : -window.innerWidth * 1.5
  deltaY.value = 50
  
  setTimeout(() => {
    remainingSpots.value.shift()
    deltaX.value = 0
    deltaY.value = 0
    currentIndex.value++
  }, 300)
}

const getCardStyle = (index: number) => {
  if (index === 0) {
    const rotate = deltaX.value * 0.04
    return {
      transform: `translate(${deltaX.value}px, ${deltaY.value}px) rotate(${rotate}deg)`,
      transition: isDragging.value ? 'none' : 'transform 0.3s ease',
      zIndex: 10
    }
  } else if (index === 1) {
    const progress = Math.min(1, Math.abs(deltaX.value) / 150)
    const scale = 0.93 + progress * 0.07
    const y = 12 - progress * 12
    return {
      transform: `scale(${scale}) translateY(${y}px)`,
      transition: isDragging.value ? 'none' : 'transform 0.3s ease',
      zIndex: 9
    }
  } else {
    return { display: 'none' }
  }
}

const likeOpacity = computed(() => Math.max(0, Math.min(1, deltaX.value / 80)))
const nopeOpacity = computed(() => Math.max(0, Math.min(1, -deltaX.value / 80)))

onMounted(() => {
  window.addEventListener('mousemove', onDrag, { passive: false })
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag, { passive: false })
  window.addEventListener('touchend', stopDrag)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
})

const goBack = () => router.back()
const goToSummary = () => router.push('/summary')
const goToDetail = (id: string) => router.push('/detail/' + id)
</script>

<style scoped>
.swipe-container {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh; /* モバイルブラウザ対応 */
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 上部ナビゲーション */
.swipe-nav {
  position: absolute;
  top: 0; left: 0; right: 0;
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
  width: 48px; height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  cursor: pointer;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
}

.nav-counter {
  color: white;
  font-size: 14px;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  letter-spacing: 2px;
}

/* デッキ領域 */
.deck {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 100px;
}

/* スワイプカード */
.tinder-card {
  position: absolute;
  width: calc(100% - 32px);
  max-width: 380px;
  height: 70vh;
  height: 70dvh;
  max-height: 580px;
  border-radius: 24px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.35);
  overflow: hidden;
  cursor: grab;
  touch-action: none;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;
}

.tinder-card:active {
  cursor: grabbing;
}

.card-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.card-gradient {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 65%;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
  pointer-events: none;
}

/* スタンプ */
.stamp {
  position: absolute;
  top: 50px;
  padding: 8px 20px;
  border-radius: 12px;
  border: 4px solid;
  font-size: 36px;
  font-weight: 900;
  letter-spacing: 4px;
  z-index: 10;
  pointer-events: none;
}

.stamp-like {
  right: 30px;
  color: #2ECC71;
  border-color: #2ECC71;
  transform: rotate(12deg);
}

.stamp-nope {
  left: 30px;
  color: #E74C3C;
  border-color: #E74C3C;
  transform: rotate(-12deg);
}

/* カードコンテンツ */
.card-content {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 28px 24px;
  color: white;
  pointer-events: none;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.card-tag {
  font-size: 11px;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 16px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(4px);
}

.card-name {
  font-family: var(--font-serif);
  font-size: 26px;
  font-weight: 900;
  margin-bottom: 8px;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.card-feature {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 14px;
  line-height: 1.5;
}

.card-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  font-weight: 700;
}

.inline-icon {
  vertical-align: middle;
  margin-top: -2px;
}

/* アクションボタン */
.action-buttons {
  position: absolute;
  bottom: 28px;
  left: 0; right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  z-index: 20;
}

.action-btn {
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  -webkit-tap-highlight-color: transparent;
}

.action-btn:active {
  transform: scale(0.9);
}

.btn-nope {
  width: 64px; height: 64px;
  color: #E74C3C;
}
.btn-like {
  width: 64px; height: 64px;
  color: #2ECC71;
}
.btn-detail {
  width: 52px; height: 52px;
  color: #3498DB;
}

/* 空の状態 */
.empty-deck {
  text-align: center;
  color: white;
  padding: 40px;
}

.empty-icon {
  color: rgba(255,255,255,0.5);
  margin-bottom: 16px;
}

.empty-deck h3 {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 8px;
}

.empty-deck p {
  font-size: 14px;
  opacity: 0.7;
}

.mt-4 {
  margin-top: 24px;
}

.empty-deck .btn-primary {
  width: auto;
  padding: 14px 40px;
}
</style>
