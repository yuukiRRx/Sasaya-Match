<template>
  <div class="result-container">
    <BackButton />

    <!-- AI分析アニメーション（表示中） -->
    <div v-if="isAnalyzing" class="analyzing">
      <div class="analyze-spinner"></div>
      <p class="analyze-text">AIが分析中...</p>
      <p class="analyze-sub">あなたにぴったりのスポットを探しています</p>
    </div>

    <!-- 結果表示 -->
    <div v-else class="result-content">
      <div class="result-card">
        <div class="result-emoji">{{ result.typeEmoji }}</div>
        <p class="result-label">あなたのタイプは...</p>
        <h1 class="result-type">{{ result.typeName }}</h1>
        <p class="result-desc">{{ result.description }}</p>
      </div>

      <button @click="goToRecommendations" class="btn-primary see-btn">
        おすすめスポットを見る
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>

      <router-link to="/menu" class="btn-secondary">メニューに戻る</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'
import { getDiagnosisResult } from '../utils/diagnosis.ts'
import { playPopSound } from '../utils/sound.ts'
import BackButton from '../components/BackButton.vue'

const router = useRouter()
const isAnalyzing = ref(true)

const result = computed(() => {
  if (!store.diagnosisAnswers) {
    return { typeName: '不明', typeEmoji: '❓', description: '', categories: [] }
  }
  return getDiagnosisResult(store.diagnosisAnswers)
})

onMounted(() => {
  // 2秒間「分析中」アニメーションを表示してから結果を見せる
  setTimeout(() => {
    isAnalyzing.value = false
    playPopSound()
  }, 2000)
})

const goToRecommendations = () => {
  playPopSound()
  // 診断結果の1番目のカテゴリをselectedCategoryにセット
  if (result.value.categories.length > 0) {
    store.selectedCategory = result.value.categories[0] as any
    // 診断履歴も更新
    result.value.categories.forEach(cat => {
      if (!store.history.includes(cat as any)) {
        store.history.push(cat as any)
      }
    })
  }
  router.push('/recommendations')
}
</script>

<style scoped>
.result-container {
  min-height: 100vh;
  padding: 80px 20px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
}

/* AI分析アニメーション */
.analyzing {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex: 1;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  padding: 40px;
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}

.analyze-spinner {
  width: 80px;
  height: 80px;
  border: 6px solid rgba(138, 58, 58, 0.1);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.analyze-text {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 900;
  color: var(--text-main);
  letter-spacing: 1px;
}

.analyze-sub {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-light);
}

/* 結果カード */
.result-content {
  width: 100%;
  animation: resultAppear 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes resultAppear {
  from { opacity: 0; transform: scale(0.9) translateY(40px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.result-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  border-radius: 32px;
  padding: 48px 24px;
  text-align: center;
  margin-bottom: 32px;
  position: relative;
  overflow: hidden;
}

.result-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 6px;
  background: linear-gradient(90deg, var(--primary-color), var(--festival-color));
}

.result-emoji {
  font-size: 80px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.result-label {
  font-size: 14px;
  font-weight: 800;
  color: var(--text-light);
  letter-spacing: 2px;
  margin-bottom: 12px;
}

.result-type {
  font-family: var(--font-serif);
  font-size: 32px;
  font-weight: 900;
  color: var(--primary-color);
  margin-bottom: 24px;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(255,255,255,0.8);
}

.result-desc {
  font-size: 15px;
  line-height: 1.8;
  font-weight: 500;
  color: var(--text-main);
}

.see-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
  box-shadow: 0 8px 20px rgba(138, 58, 58, 0.3);
}

.see-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 25px rgba(138, 58, 58, 0.4);
}
</style>
