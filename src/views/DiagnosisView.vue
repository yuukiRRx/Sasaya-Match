<template>
  <div class="diag-container">
    <BackButton />

    <!-- プログレスバー -->
    <div class="progress-wrap">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${((step) / 3) * 100}%` }"></div>
      </div>
      <span class="progress-text">{{ step }} / 3</span>
    </div>

    <!-- 質問カード -->
    <transition name="q-fade" mode="out-in">
      <!-- Q1: 旅のスタイル -->
      <div v-if="step === 0" key="q0" class="question-card">
        <p class="q-label">Q1</p>
        <h2 class="q-title">旅のスタイルは？</h2>
        <div class="choice-grid">
          <button @click="answer('style', 'relaxed')" class="choice-btn">
            <span class="choice-emoji">🚶</span>
            <span class="choice-text">のんびり散策派</span>
            <span class="choice-sub">歴史ある街並みをゆったり歩く</span>
          </button>
          <button @click="answer('style', 'active')" class="choice-btn">
            <span class="choice-emoji">🏃</span>
            <span class="choice-text">アクティブ冒険派</span>
            <span class="choice-sub">いろんなスポットを巡りたい</span>
          </button>
        </div>
      </div>

      <!-- Q2: 今の気分 -->
      <div v-else-if="step === 1" key="q1" class="question-card">
        <p class="q-label">Q2</p>
        <h2 class="q-title">今の気分は？</h2>
        <div class="choice-grid">
          <button @click="answer('mood', 'healing')" class="choice-btn">
            <span class="choice-emoji">🌿</span>
            <span class="choice-text">癒されたい</span>
            <span class="choice-sub">自然や温泉でリラックス</span>
          </button>
          <button @click="answer('mood', 'exciting')" class="choice-btn">
            <span class="choice-emoji">🎉</span>
            <span class="choice-text">ワクワクしたい</span>
            <span class="choice-sub">新しい体験や発見を求める</span>
          </button>
        </div>
      </div>

      <!-- Q3: 食の好み -->
      <div v-else-if="step === 2" key="q2" class="question-card">
        <p class="q-label">Q3</p>
        <h2 class="q-title">食の好みは？</h2>
        <div class="choice-grid">
          <button @click="answer('food', 'hearty')" class="choice-btn">
            <span class="choice-emoji">🥩</span>
            <span class="choice-text">がっつり食べたい</span>
            <span class="choice-sub">お肉や鍋で大満足</span>
          </button>
          <button @click="answer('food', 'light')" class="choice-btn">
            <span class="choice-emoji">🍵</span>
            <span class="choice-text">あっさり楽しみたい</span>
            <span class="choice-sub">スイーツやお茶でまったり</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'
import { playPopSound } from '../utils/sound.ts'
import type { DiagnosisAnswer } from '../utils/diagnosis.ts'
import BackButton from '../components/BackButton.vue'

const router = useRouter()
const step = ref(0)

const answers = ref<Partial<DiagnosisAnswer>>({})

const answer = (key: keyof DiagnosisAnswer, value: string) => {
  playPopSound();
  (answers.value as any)[key] = value
  
  if (step.value < 2) {
    step.value++
  } else {
    // 全問回答済み → 結果をストアに保存して結果画面へ
    store.diagnosisAnswers = answers.value as DiagnosisAnswer
    setTimeout(() => {
      router.push('/diagnosis-result')
    }, 200)
  }
}
</script>

<style scoped>
.diag-container {
  min-height: 100vh;
  padding: 80px 20px 32px;
  display: flex;
  flex-direction: column;
  background: transparent;
}

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  padding: 12px 20px;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 1);
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--festival-color));
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.progress-text {
  font-size: 14px;
  font-weight: 800;
  color: var(--text-main);
  min-width: 40px;
  text-align: right;
}

.question-card {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.q-label {
  font-size: 15px;
  font-weight: 900;
  color: var(--primary-color);
  letter-spacing: 2px;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(255,255,255,0.5);
}

.q-title {
  font-family: var(--font-serif);
  font-size: 30px;
  font-weight: 900;
  color: var(--text-main);
  margin-bottom: 40px;
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(255,255,255,0.5);
}

.choice-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

.choice-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.choice-btn:hover {
  transform: translateY(-6px);
  border-color: var(--primary-color);
  box-shadow: 0 16px 32px rgba(138, 58, 58, 0.15);
  background: rgba(255, 255, 255, 0.95);
}

.choice-btn:active {
  transform: scale(0.96);
}

.choice-emoji {
  font-size: 48px;
  margin-bottom: 16px;
  transition: transform 0.4s;
}

.choice-btn:hover .choice-emoji {
  transform: scale(1.15);
}

.choice-text {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 900;
  color: var(--text-main);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.choice-sub {
  font-size: 13px;
  color: var(--text-light);
  font-weight: 600;
}

/* 質問切り替えアニメーション */
.q-fade-enter-active { animation: qIn 0.4s ease-out; }
.q-fade-leave-active { animation: qOut 0.25s ease-in; }

@keyframes qIn {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes qOut {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-30px); }
}
</style>
