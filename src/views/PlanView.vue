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

    <!-- タイムライン -->
    <div v-if="planSpots.length > 0">
      <h2 class="section-title">
        <Route :size="18" :stroke-width="2" />
        1日観光ルート
      </h2>
      <p class="plan-summary">
        <MapPin :size="14" :stroke-width="2" />
        {{ planSpots.length }}スポット
        <span class="dot">·</span>
        <Clock :size="14" :stroke-width="2" />
        約{{ totalDuration }}
        <span class="dot">·</span>
        <Wallet :size="14" :stroke-width="2" />
        {{ totalBudget }}
      </p>

      <div class="timeline">
        <div
          v-for="(spot, index) in planSpots"
          :key="spot.id"
          class="timeline-item fade-up-enter"
          :style="{ animationDelay: `${index * 0.15}s` }"
        >
          <!-- タイムライン左側のマーカー -->
          <div class="time-marker">
            <div class="time-dot" :class="{ 'first': index === 0, 'last': index === planSpots.length - 1 }">
              <span class="time-number">{{ index + 1 }}</span>
            </div>
            <div class="time-line" v-if="index !== planSpots.length - 1"></div>
          </div>

          <!-- カード本体 -->
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

            <!-- 移動手段の表示 -->
            <div class="travel-info" v-if="index !== planSpots.length - 1">
              <Car :size="14" :stroke-width="2" />
              <span>車で約10〜15分</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- お気に入りが空の場合 -->
    <div v-else class="empty-state">
      <div class="empty-icon"><MapPin :size="48" :stroke-width="1.5" /></div>
      <h3>まだスポットがありません</h3>
      <p>お気に入りに登録したスポットから<br>自動で1日プランを作成します</p>
      <router-link to="/explore" class="btn-primary explore-btn">スポットを探す</router-link>
    </div>

    <router-link to="/menu" class="btn-secondary back-btn">メニューに戻る</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, markRaw } from 'vue'
import { store } from '../store'
import { spots } from '../data/spots'
import BackButton from '../components/BackButton.vue'
import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Wind,
  Sparkles, Route, MapPin, Clock, Wallet, Car, Lightbulb
} from 'lucide-vue-next'

// --- 天気情報 ---
interface WeatherData {
  temp: number
  description: string
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'windy'
}

const weather = ref<WeatherData | null>(null)

// 天気に対応するアイコン
const weatherIconMap = {
  sunny: markRaw(Sun),
  cloudy: markRaw(Cloud),
  rainy: markRaw(CloudRain),
  snowy: markRaw(CloudSnow),
  stormy: markRaw(CloudLightning),
  windy: markRaw(Wind)
}

const weatherIcon = computed(() => {
  if (!weather.value) return markRaw(Cloud)
  return weatherIconMap[weather.value.condition] || markRaw(Cloud)
})

// 天気に応じたアドバイス
const weatherAdvice = computed(() => {
  if (!weather.value) return ''
  switch (weather.value.condition) {
    case 'sunny': return '☀ 絶好のお出かけ日和！屋外スポットがおすすめです'
    case 'cloudy': return '過ごしやすい天気です。散策にぴったり！'
    case 'rainy': return '☂ 室内で楽しめるスポットがおすすめです'
    case 'snowy': return '温かい食事スポットで体を温めましょう'
    case 'stormy': return '荒天のため室内スポットをお選びください'
    case 'windy': return '風が強めです。防寒対策をお忘れなく'
    default: return 'お出かけを楽しみましょう！'
  }
})

// 天気に基づくおすすめスポット
const weatherRecommends = computed(() => {
  if (!weather.value) return []
  const condition = weather.value.condition

  let filtered = [...spots]
  if (condition === 'rainy' || condition === 'snowy' || condition === 'stormy') {
    // 雨・雪・嵐の日は室内系を優先
    filtered = spots.filter(s =>
      s.category === 'food' || s.category === 'history' ||
      s.tags.some(t => t.includes('カフェ') || t.includes('温泉') || t.includes('室内'))
    )
  } else {
    // 晴れ・曇りは屋外系を優先
    filtered = spots.filter(s =>
      s.category === 'sightseeing' || s.category === 'festival' ||
      s.tags.some(t => t.includes('自然') || t.includes('散歩') || t.includes('アウトドア'))
    )
  }

  // シャッフルして最大4件
  return filtered.sort(() => Math.random() - 0.5).slice(0, 4)
})

// 天気データの取得（丹波篠山市の座標）
onMounted(async () => {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=35.0758&longitude=135.2205&current_weather=true&timezone=Asia%2FTokyo'
    )
    const data = await res.json()
    const cw = data.current_weather

    // WMOコードから天気状態を判定
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

    weather.value = {
      temp: Math.round(cw.temperature),
      description,
      condition
    }
  } catch {
    // API取得失敗時はデフォルト値
    weather.value = {
      temp: 18,
      description: '情報取得不可',
      condition: 'cloudy'
    }
  }
})

// --- 旅行プラン ---
const planSpots = computed(() => {
  const favs = spots.filter(s => store.favorites.includes(s.id))
  if (favs.length === 0) return []

  // カテゴリバランスを考慮して並べ替え（食→観光→食→歴史...）
  const food = favs.filter(s => s.category === 'food')
  const others = favs.filter(s => s.category !== 'food')
  const result = []
  let fi = 0, oi = 0
  // 交互に配置
  while (fi < food.length || oi < others.length) {
    if (oi < others.length) result.push(others[oi++])
    if (fi < food.length) result.push(food[fi++])
  }
  return result.slice(0, 6) // 最大6件
})

// 時間帯スロット
const getTimeSlot = (index: number): string => {
  const slots = ['10:00', '11:30', '13:00', '14:30', '16:00', '17:30']
  return slots[index] || `${10 + index * 1.5}:00`
}

// 合計滞在時間の計算
const totalDuration = computed(() => {
  let minutes = 0
  planSpots.value.forEach(s => {
    const match = s.duration?.match(/(\d+)/)
    minutes += match ? parseInt(match[1]) : 60
  })
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}時間${m}分` : `${h}時間`
})

// 合計予算の計算
const totalBudget = computed(() => {
  let total = 0
  planSpots.value.forEach(s => {
    const match = s.budget?.match(/(\d+)/)
    if (match) total += parseInt(match[1])
  })
  return total > 0 ? `約${total.toLocaleString()}円〜` : '無料〜'
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
  height: 180px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  -webkit-tap-highlight-color: transparent;
}

.recommend-img {
  width: 100%;
  height: 100%;
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
</style>
