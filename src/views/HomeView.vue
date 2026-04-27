<template>
  <div class="page-container home-container">
    <div class="hero-section">
      <!-- 自動切り替えスライドショー背景 -->
      <transition-group name="bg-fade" tag="div" class="bg-slider">
        <div 
          v-for="(bg, index) in backgrounds" 
          :key="bg"
          v-show="currentBgIndex === index"
          class="hero-bg"
          :style="{ backgroundImage: `url(${bg})` }"
        ></div>
      </transition-group>
      
      <div class="overlay"></div>
      
      <div class="hero-content">
        <h2 class="sub-brand">あなたに合う丹波篠山案内</h2>
        <h1 class="brand">ササヤマッチ</h1>
      </div>
    </div>
    
    <div class="content-section">
      <!-- 時間帯による挨拶メッセージ -->
      <p class="greeting">{{ greeting }}</p>
      <p class="description">
        直感で選ぶだけで、あなたにぴったりの<br>
        丹波篠山のスポットが見つかります。
      </p>
      
      <button @click="startGame" class="btn-primary start-btn">
        <span>診断をスタート</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { playPopSound } from '../utils/sound.ts'
import { getGreeting } from '../utils/timeTheme.ts'

const router = useRouter()
const greeting = getGreeting()

// 丹波篠山をイメージした高品質な画像群（山、古い街並み、自然）
const backgrounds = [
  '/images/dekansyo.png',
  '/images/makekirai.jpg',
  '/images/syoin.jpg'
]

const currentBgIndex = ref(0)
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  // 5秒ごとに背景画像を自動切り替え
  timer = setInterval(() => {
    currentBgIndex.value = (currentBgIndex.value + 1) % backgrounds.length
  }, 5000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const startGame = () => {
  playPopSound()
  setTimeout(() => {
    router.push('/login')
  }, 200)
}
</script>

<style scoped>
.home-container {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.hero-section {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 60vh;
}

.bg-slider {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  /* スライドショーに少しズーム（Ken Burns効果）をかける */
  animation: zoomInOut 10s infinite alternate;
}

@keyframes zoomInOut {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

/* スライドショーのクロスフェード（じわっと切り替わる）アニメーション */
.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 2s ease-in-out;
}
.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* 時間帯によって変化するオーバーレイ */
  background: linear-gradient(to bottom, var(--time-overlay-start, rgba(30,20,20,0.4)), var(--time-overlay-end, rgba(20,20,30,0.8)));
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  margin-top: -40px;
  animation: fadeInDown 1.2s ease-out;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.sub-brand {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 12px;
  letter-spacing: 4px;
  opacity: 0.9;
}

.brand {
  font-size: 42px;
  font-weight: 900;
  letter-spacing: 4px;
  text-shadow: 0 4px 15px rgba(0,0,0,0.5);
  margin-left: 4px; /* letter-spacingのズレ調整 */
}

.content-section {
  background: white;
  padding: 32px 24px;
  border-radius: 24px 24px 0 0;
  margin-top: -20px;
  position: relative;
  z-index: 2;
  box-shadow: 0 -4px 15px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  min-height: 250px;
}

.greeting {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 700;
  color: var(--time-accent, var(--primary-color));
  text-align: center;
  margin-bottom: 12px;
  letter-spacing: 1px;
  animation: fadeInDown 0.8s ease-out;
}

.description {
  color: var(--text-main);
  line-height: 1.8;
  text-align: center;
  margin-bottom: 32px;
  font-weight: 600;
}

.start-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: auto;
}
</style>
