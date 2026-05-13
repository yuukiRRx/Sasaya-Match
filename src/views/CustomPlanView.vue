<template>
  <div class="page-container custom-plan">
    <BackButton />
    <h1 class="title">旅行計画を自分で作る</h1>
    <p class="subtitle">スポットを選んでオリジナルの計画を作りましょう</p>

    <!-- 選択済みスポット -->
    <div v-if="selectedSpots.length > 0" class="selected-section">
      <h2 class="section-title"><Route :size="18" :stroke-width="2" /> あなたのプラン</h2>
      <p class="plan-summary">
        <MapPin :size="14" :stroke-width="2" /> {{ selectedSpots.length }}スポット
        <span class="dot">·</span>
        <Clock :size="14" :stroke-width="2" /> 約{{ totalDuration }}
        <span class="dot">·</span>
        <Wallet :size="14" :stroke-width="2" /> {{ totalBudget }}
      </p>
      <div class="selected-list">
        <div v-for="(spot, index) in selectedSpots" :key="spot.id" class="selected-item">
          <span class="selected-num">{{ index + 1 }}</span>
          <img :src="spot.imageUrl" :alt="spot.name" class="selected-img">
          <div class="selected-info">
            <span class="selected-name">{{ spot.name }}</span>
            <span class="selected-meta">{{ spot.duration }} · {{ spot.budget }}</span>
          </div>
          <button class="remove-btn" @click="removeSpot(spot.id)">
            <X :size="16" :stroke-width="2.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- スポット選択 -->
    <h2 class="section-title"><Plus :size="18" :stroke-width="2" /> スポットを追加</h2>
    <div class="search-bar">
      <Search :size="18" :stroke-width="2" />
      <input v-model="searchQuery" type="text" placeholder="スポットを検索..." class="search-input">
    </div>

    <div class="spot-list">
      <div v-for="spot in availableSpots" :key="spot.id" class="spot-item" @click="addSpot(spot)">
        <img :src="spot.imageUrl" :alt="spot.name" class="spot-thumb">
        <div class="spot-info">
          <span class="spot-name">{{ spot.name }}</span>
          <span class="spot-meta">{{ spot.duration }} · {{ spot.budget }}</span>
        </div>
        <Plus :size="20" :stroke-width="2.5" class="add-icon" />
      </div>
    </div>

    <router-link to="/plan" class="btn-secondary back-btn">戻る</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { spots } from '../data/spots'
import type { SpotData } from '../data/spots'
import BackButton from '../components/BackButton.vue'
import { Route, MapPin, Clock, Wallet, X, Plus, Search } from 'lucide-vue-next'

const searchQuery = ref('')
const selectedIds = ref<string[]>([])

const selectedSpots = computed(() => spots.filter(s => selectedIds.value.includes(s.id)))

const availableSpots = computed(() => {
  return spots.filter(s => {
    if (selectedIds.value.includes(s.id)) return false
    if (!searchQuery.value) return true
    const q = searchQuery.value.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.tags.some(t => t.includes(q))
  })
})

const addSpot = (spot: SpotData) => {
  if (!selectedIds.value.includes(spot.id)) {
    selectedIds.value.push(spot.id)
  }
}
const removeSpot = (id: string) => {
  selectedIds.value = selectedIds.value.filter(i => i !== id)
}

const totalDuration = computed(() => {
  let min = 0
  selectedSpots.value.forEach(s => {
    const m = s.duration?.match(/(\d+)/)
    min += m ? parseInt(m[1]) : 60
  })
  const h = Math.floor(min / 60)
  const m = min % 60
  return m > 0 ? `${h}時間${m}分` : `${h}時間`
})

const totalBudget = computed(() => {
  let total = 0
  selectedSpots.value.forEach(s => {
    const m = s.budget?.match(/(\d+)/)
    if (m) total += parseInt(m[1])
  })
  return total > 0 ? `約${total.toLocaleString()}円〜` : '無料〜'
})
</script>

<style scoped>
.custom-plan { padding: 72px 24px 80px; }
.section-title {
  font-family: var(--font-serif);
  font-size: 18px; font-weight: 800; color: var(--text-main);
  margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
}
.plan-summary {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 700; color: var(--text-light);
  margin-bottom: 16px; flex-wrap: wrap;
}
.dot { opacity: 0.4; }

/* 選択済みリスト */
.selected-section { margin-bottom: 32px; }
.selected-list { display: flex; flex-direction: column; gap: 10px; }
.selected-item {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,0.9); border-radius: 14px;
  padding: 10px 14px; border: 1px solid rgba(255,255,255,1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.selected-num {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--primary-color); color: white;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 900; flex-shrink: 0;
}
.selected-img {
  width: 48px; height: 48px; border-radius: 10px;
  object-fit: cover; flex-shrink: 0;
}
.selected-info { flex: 1; min-width: 0; }
.selected-name { display: block; font-size: 14px; font-weight: 800; }
.selected-meta { font-size: 11px; color: var(--text-light); }
.remove-btn {
  width: 36px; height: 36px; border-radius: 50%;
  border: none; background: rgba(231,76,60,0.08);
  color: #E74C3C; display: flex; align-items: center;
  justify-content: center; cursor: pointer; flex-shrink: 0;
  -webkit-tap-highlight-color: transparent;
}

/* 検索バー */
.search-bar {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; min-height: 52px;
  background: rgba(255,255,255,0.85); border: 1px solid rgba(255,255,255,1);
  border-radius: 16px; margin-bottom: 16px;
}
.search-bar svg { color: var(--text-light); flex-shrink: 0; }
.search-input {
  flex: 1; border: none; outline: none; font-size: 15px;
  font-family: var(--font-sans); color: var(--text-main); background: transparent;
}

/* スポットリスト */
.spot-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.spot-item {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,0.7); border-radius: 14px;
  padding: 10px 14px; border: 1px solid rgba(255,255,255,0.8);
  cursor: pointer; transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.spot-item:active { transform: scale(0.98); background: rgba(255,255,255,0.95); }
.spot-thumb {
  width: 48px; height: 48px; border-radius: 10px;
  object-fit: cover; flex-shrink: 0;
}
.spot-info { flex: 1; min-width: 0; }
.spot-name { display: block; font-size: 14px; font-weight: 800; }
.spot-meta { font-size: 11px; color: var(--text-light); }
.add-icon { color: var(--primary-color); flex-shrink: 0; }
.back-btn { margin-top: 16px; }
</style>
