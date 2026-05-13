<template>
  <div class="page-container plan-container">
    <BackButton />

    <h1 class="title">あなた専用の旅行計画</h1>

    <!-- 天気カード -->
    <div class="weather-card" v-if="weather">
      <div class="weather-main">
        <component :is="weatherIcon" :size="36" :stroke-width="1.5" class="weather-svg" />
        <div class="weather-info">
          <span class="weather-temp">{{ weather.temp }}°C</span>
          <span class="weather-desc">{{ weather.description }}</span>
        </div>
      </div>
      <p class="weather-advice">
        <Lightbulb :size="14" :stroke-width="2" />
        {{ weatherAdvice }}
      </p>
    </div>
    <div v-else class="weather-card weather-loading">
      <Cloud :size="24" :stroke-width="1.5" />
      <span>天気情報を取得中...</span>
    </div>

    <!-- おすすめスポット（天気連動） -->
    <div class="recommend-section" v-if="weatherRecommends.length > 0">
      <h2 class="section-title">
        <Sparkles :size="18" :stroke-width="2" />
        今日の天気におすすめ
      </h2>
      <div class="recommend-scroll">
        <router-link
          v-for="spot in weatherRecommends"
          :key="spot.id"
          :to="'/detail/' + spot.id"
          class="recommend-card"
        >
          <img :src="spot.imageUrl" :alt="spot.name" class="recommend-img" loading="lazy">
          <div class="recommend-overlay">
            <span class="recommend-name">{{ spot.name }}</span>
          </div>
        </router-link>
      </div>
    </div>

    <!-- モード選択 -->
    <div class="mode-tabs">
      <button class="mode-tab" :class="{ active: mode === 'auto' }" @click="mode = 'auto'">
        <Sparkles :size="16" :stroke-width="2" /> 自動で作成
      </button>
      <router-link to="/plan/custom" class="mode-tab">
        <PenLine :size="16" :stroke-width="2" /> 自分で作成
      </router-link>
    </div>

    <!-- 自動プラン：条件入力フォーム -->
    <div v-if="mode === 'auto' && !planGenerated" class="pref-form">
      <h2 class="section-title">
        <SlidersHorizontal :size="18" :stroke-width="2" />
        条件を設定
      </h2>

      <label class="form-label">予算（1人あたり）</label>
      <div class="budget-options">
        <button v-for="opt in budgetOptions" :key="opt.value"
          class="budget-btn" :class="{ active: prefBudget === opt.value }"
          @click="prefBudget = opt.value">
          {{ opt.label }}
        </button>
      </div>

      <label class="form-label">開始時間</label>
      <select v-model="prefStartTime" class="form-select">
        <option value="9">9:00</option>
        <option value="10">10:00</option>
        <option value="11">11:00</option>
        <option value="12">12:00</option>
      </select>

      <label class="form-label">滞在時間</label>
      <div class="budget-options">
        <button v-for="opt in durationOptions" :key="opt.value"
          class="budget-btn" :class="{ active: prefDuration === opt.value }"
          @click="prefDuration = opt.value">
          {{ opt.label }}
        </button>
      </div>

      <button class="btn-primary generate-btn" @click="generatePlan">
        <Route :size="18" :stroke-width="2" />
        プランを自動生成
      </button>
    </div>

    <!-- 自動プラン：タイムライン結果 -->
    <div v-if="mode === 'auto' && planGenerated && generatedSpots.length > 0">
      <div class="result-header">
        <h2 class="section-title">
          <Route :size="18" :stroke-width="2" />
          1日観光ルート
        </h2>
        <button class="reset-btn" @click="planGenerated = false">条件変更</button>
      </div>
      <p class="plan-summary">
        <MapPin :size="14" :stroke-width="2" />
        {{ generatedSpots.length }}スポット
        <span class="dot">·</span>
        <Clock :size="14" :stroke-width="2" />
        約{{ totalDuration }}
        <span class="dot">·</span>
        <Wallet :size="14" :stroke-width="2" />
        {{ totalBudget }}
      </p>

      <div class="timeline">
        <div
          v-for="(spot, index) in generatedSpots"
          :key="spot.id"
          class="timeline-item fade-up-enter"
          :style="{ animationDelay: `${index * 0.15}s` }"
        >
          <div class="time-marker">
            <div class="time-dot" :class="{ 'first': index === 0 }">
              <span class="time-number">{{ index + 1 }}</span>
            </div>
            <div class="time-line" v-if="index !== generatedSpots.length - 1"></div>
          </div>

          <div class="timeline-content">
            <span class="time-label">{{ getTimeSlot(index) }}</span>
            <router-link :to="'/detail/' + spot.id" class="plan-card">
              <img :src="spot.imageUrl" :alt="spot.name" class="plan-img" loading="lazy">
              <div class="plan-info">
                <h3 class="plan-name">{{ spot.name }}</h3>
                <p class="plan-feature">{{ spot.feature }}</p>
                <div class="plan-meta">
                  <span><Clock :size="12" :stroke-width="2" /> {{ spot.duration || '60分' }}</span>
                  <span><Wallet :size="12" :stroke-width="2" /> {{ spot.budget || '無料' }}</span>
                </div>
              </div>
            </router-link>
            <div class="travel-info" v-if="index !== generatedSpots.length - 1">
              <Car :size="14" :stroke-width="2" />
              <span>車で約10〜15分</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- スポットが足りない場合 -->
    <div v-if="mode === 'auto' && planGenerated && generatedSpots.length === 0" class="empty-state">
      <div class="empty-icon"><MapPin :size="48" :stroke-width="1.5" /></div>
      <h3>条件に合うスポットが見つかりません</h3>
      <p>予算や時間の条件を変えてみてください</p>
      <button class="btn-secondary" @click="planGenerated = false">条件を変更する</button>
    </div>

    <router-link to="/menu" class="btn-secondary back-btn">メニューに戻る</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'
import { spots } from '../data/spots'
import type { SpotData } from '../data/spots'
import BackButton from '../components/BackButton.vue'
import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind,
  Sparkles, Route, MapPin, Clock, Wallet, Car, Lightbulb,
  SlidersHorizontal, PenLine
} from 'lucide-vue-next'

// --- モード ---
const mode = ref<'auto'>('auto')

// --- ユーザー設定 ---
const prefBudget = ref(5000)
const prefStartTime = ref('10')
const prefDuration = ref(5)
const planGenerated = ref(false)
const generatedSpots = ref<SpotData[]>([])

const budgetOptions = [
  { label: '〜3,000円', value: 3000 },
  { label: '〜5,000円', value: 5000 },
  { label: '〜10,000円', value: 10000 },
  { label: '制限なし', value: 99999 }
]

const durationOptions = [
  { label: '半日(3h)', value: 3 },
  { label: '半日(5h)', value: 5 },
  { label: '1日(7h)', value: 7 },
  { label: '1日(10h)', value: 10 }
]

// プラン自動生成
const generatePlan = () => {
  const filtered = spots.filter(s => {
    const m = s.budget?.match(/(\d+)/)
    const cost = m ? parseInt(m[1]) : 0
    return cost <= prefBudget.value
  })
  const food = filtered.filter(s => s.category === 'food')
  const others = filtered.filter(s => s.category !== 'food')
  const balanced: SpotData[] = []
  let fi = 0, oi = 0
  while (fi < food.length || oi < others.length) {
    if (oi < others.length) balanced.push(others[oi++])
    if (fi < food.length) balanced.push(food[fi++])
  }
  let totalMin = 0
  const maxMin = prefDuration.value * 60
  const result: SpotData[] = []
  for (const s of balanced) {
    const m = s.duration?.match(/(\d+)/)
    const dur = m ? parseInt(m[1]) : 60
    if (totalMin + dur + 15 > maxMin && result.length > 0) break
    result.push(s)
    totalMin += dur + 15
  }
  generatedSpots.value = result.slice(0, 8)
  planGenerated.value = true
}

const getTimeSlot = (index: number): string => {
  const start = parseInt(prefStartTime.value)
  let minutes = 0
  for (let i = 0; i < index; i++) {
    const m = generatedSpots.value[i]?.duration?.match(/(\d+)/)
    minutes += (m ? parseInt(m[1]) : 60) + 15
  }
  const totalMin = start * 60 + minutes
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${h}:${m.toString().padStart(2, '0')}`
}

const totalDuration = computed(() => {
  let minutes = 0
  generatedSpots.value.forEach(s => {
    const m = s.duration?.match(/(\d+)/)
    minutes += m ? parseInt(m[1]) : 60
  })
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}時間${m}分` : `${h}時間`
})

const totalBudget = computed(() => {
  let total = 0
  generatedSpots.value.forEach(s => {
    const m = s.budget?.match(/(\d+)/)
    if (m) total += parseInt(m[1])
  })
  return total > 0 ? `約${total.toLocaleString()}円〜` : '無料〜'
})

// --- 天気情報 ---
interface WeatherData {
  temp: number
  description: string
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy'
}
const weather = ref<WeatherData | null>(null)
const weatherIconMap = {
  sunny: markRaw(Sun), cloudy: markRaw(Cloud), rainy: markRaw(CloudRain),
  snowy: markRaw(CloudSnow), stormy: markRaw(CloudLightning), windy: markRaw(Wind)
}
const weatherIcon = computed(() => {
  if (!weather.value) return markRaw(Cloud)
  return weatherIconMap[weather.value.condition] || markRaw(Cloud)
})
const weatherAdvice = computed(() => {
  if (!weather.value) return ''
  const map: Record<string, string> = {
    sunny: '☀ 絶好のお出かけ日和！屋外スポットがおすすめです',
    cloudy: '過ごしやすい天気です。散策にぴったり！',
    rainy: '☂ 室内で楽しめるスポットがおすすめです',
    snowy: '温かい食事スポットで体を温めましょう',
    stormy: '荒天のため室内スポットをお選びください',
    windy: '風が強めです。防寒対策をお忘れなく'
  }
  return map[weather.value.condition] || 'お出かけを楽しみましょう！'
})
const weatherRecommends = computed(() => {
  if (!weather.value) return []
  const c = weather.value.condition
  let f = [...spots]
  if (c === 'rainy' || c === 'snowy' || c === 'stormy') {
    f = spots.filter(s => s.category === 'food' || s.category === 'history')
  } else {
    f = spots.filter(s => s.category === 'sightseeing' || s.category === 'festival')
  }
  return f.sort(() => Math.random() - 0.5).slice(0, 4)
})

onMounted(async () => {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.0758&longitude=135.2205&current_weather=true&timezone=Asia%2FTokyo')
    const data = await res.json()
    const cw = data.current_weather
    let condition: WeatherData['condition'] = 'sunny'
    let description = '晴れ'
    const code = cw.weathercode as number
    if (code <= 1) { condition = 'sunny'; description = '快晴' }
    else if (code <= 3) { condition = 'cloudy'; description = '曇り' }
    else if (code <= 49) { condition = 'cloudy'; description = '霧' }
    else if (code <= 69) { condition = 'rainy'; description = '雨' }
    else if (code <= 79) { condition = 'snowy'; description = '雪' }
    else if (code <= 84) { condition = 'rainy'; description = '雨' }
    else if (code <= 86) { condition = 'snowy'; description = '雪' }
    else if (code <= 99) { condition = 'stormy'; description = '雷雨' }
    if (cw.windspeed > 30) { condition = 'windy'; description = '強風' }
    weather.value = { temp: Math.round(cw.temperature), description, condition }
  } catch {
    weather.value = { temp: 18, description: '情報取得不可', condition: 'cloudy' }
  }
})
</script>




<style scoped>
.plan-container {
  padding: 72px 24px 80px;
}

/* 天気カード */
.weather-card {
  background: linear-gradient(135deg, #667EEA, #764BA2);
  border-radius: 20px;
  padding: 20px 24px;
  color: white;
  margin-bottom: 28px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.weather-loading {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0.8;
  font-size: 14px;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.weather-svg {
  opacity: 0.9;
}

.weather-info {
  display: flex;
  flex-direction: column;
}

.weather-temp {
  font-size: 28px;
  font-weight: 900;
  line-height: 1;
}

.weather-desc {
  font-size: 14px;
  opacity: 0.85;
  font-weight: 600;
  margin-top: 4px;
}

.weather-advice {
  font-size: 13px;
  opacity: 0.9;
  background: rgba(255,255,255,0.15);
  padding: 10px 14px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

/* セクションタイトル */
.section-title {
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* おすすめ横スクロール */
.recommend-section {
  margin-bottom: 32px;
}

.recommend-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
  -webkit-overflow-scrolling: touch;
}

.recommend-scroll::-webkit-scrollbar {
  display: none;
}

.recommend-card {
  min-width: 140px;
  width: 140px;
  height: 180px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  -webkit-tap-highlight-color: transparent;
  background: #f0f0f0;
}

.recommend-img {
  display: block;
  width: 140px;
  height: 180px;
  object-fit: cover;
}

.recommend-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 12px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
}

.recommend-name {
  font-size: 13px;
  font-weight: 800;
  color: white;
}

/* プランサマリー */
.plan-summary {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-light);
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.dot {
  opacity: 0.4;
}

/* タイムライン */
.timeline {
  display: flex;
  flex-direction: column;
}

.timeline-item {
  display: flex;
  gap: 16px;
}

.time-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 36px;
  flex-shrink: 0;
}

.time-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(138, 58, 58, 0.1);
  border: 2px solid var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.time-dot.first {
  background: var(--primary-color);
}

.time-dot.first .time-number {
  color: white;
}

.time-number {
  font-size: 13px;
  font-weight: 900;
  color: var(--primary-color);
}

.time-line {
  width: 2px;
  flex: 1;
  background: linear-gradient(to bottom, var(--primary-color), rgba(138, 58, 58, 0.15));
  min-height: 40px;
}

.timeline-content {
  flex: 1;
  padding-bottom: 20px;
}

.time-label {
  font-size: 12px;
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 8px;
  display: block;
}

.plan-card {
  display: flex;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  border: 1px solid rgba(255,255,255,1);
  -webkit-tap-highlight-color: transparent;
}

.plan-card:active {
  transform: scale(0.98);
}

.plan-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  flex-shrink: 0;
}

.plan-info {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.plan-name {
  font-family: var(--font-serif);
  font-size: 15px;
  font-weight: 800;
  margin-bottom: 4px;
  color: var(--text-main);
}

.plan-feature {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plan-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-light);
}

.plan-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 移動情報 */
.travel-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-light);
  font-weight: 600;
  margin-top: 12px;
  padding-left: 8px;
}

/* 空の状態 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  color: var(--text-light);
  opacity: 0.4;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  color: var(--text-light);
  line-height: 1.8;
}

.explore-btn {
  margin-top: 24px;
  width: auto;
  padding: 14px 40px;
}


.back-btn {
  margin-top: 32px;
}

/* モード選択タブ */
.mode-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 24px;
}
.mode-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  min-height: 48px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,1);
  background: rgba(255,255,255,0.7);
  font-size: 14px;
  font-weight: 800;
  color: var(--text-main);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s;
  -webkit-tap-highlight-color: transparent;
}
.mode-tab.active {
  background: linear-gradient(135deg, var(--primary-color), var(--festival-color));
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(138,58,58,0.2);
}

/* 条件設定フォーム */
.pref-form {
  background: rgba(255,255,255,0.85);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255,255,255,1);
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
}
.form-label {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 10px;
  margin-top: 20px;
}
.form-label:first-of-type {
  margin-top: 8px;
}
.budget-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.budget-btn {
  padding: 10px 16px;
  min-height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.9);
  font-size: 13px;
  font-weight: 700;
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.2s;
  -webkit-tap-highlight-color: transparent;
}
.budget-btn.active {
  background: linear-gradient(135deg, var(--primary-color), var(--festival-color));
  color: white;
  border-color: transparent;
  box-shadow: 0 3px 10px rgba(138,58,58,0.2);
}
.form-select {
  width: 100%;
  padding: 12px 16px;
  min-height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.08);
  background: white;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237F8C8D' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
}
.generate-btn {
  margin-top: 24px;
  gap: 8px;
}

/* 結果ヘッダー */
.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0;
}
.result-header .section-title {
  margin-bottom: 0;
}
.reset-btn {
  font-size: 13px;
  font-weight: 700;
  color: var(--primary-color);
  background: none;
  border: 1px dashed rgba(138,58,58,0.3);
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
</style>
