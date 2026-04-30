<template>
  <div class="page-container menu-container">
    <!-- ユーザー挨拶 -->
    <div class="user-greeting">
      <div class="avatar">{{ userInitial }}</div>
      <div class="greeting-text">
        <p class="greeting-hello">{{ greeting }}</p>
        <p class="greeting-name">{{ store.userName || 'ゲスト' }}さん</p>
      </div>
    </div>

    <!-- メインメニューカード -->
    <div class="menu-grid">
      <router-link to="/diagnosis" class="menu-card diagnosis-card">
        <div class="icon-wrapper"><div class="card-icon"><Sparkles :size="28" :stroke-width="1.8" /></div></div>
        <h3 class="card-title">興味診断</h3>
        <p class="card-desc">3つの質問であなたに<br>ぴったりのスポットを発見</p>
      </router-link>

      <router-link to="/explore" class="menu-card explore-card">
        <div class="icon-wrapper"><div class="card-icon"><Compass :size="28" :stroke-width="1.8" /></div></div>
        <h3 class="card-title">スポット一覧</h3>
        <p class="card-desc">すべてのスポットを<br>自由に探索</p>
      </router-link>

      <router-link to="/favorites" class="menu-card favorites-card">
        <div class="icon-wrapper"><div class="card-icon"><Heart :size="28" :stroke-width="1.8" /></div></div>
        <h3 class="card-title">お気に入り</h3>
        <p class="card-desc">保存したスポット<br>{{ store.favorites.length }}件</p>
      </router-link>

      <router-link to="/ranking" class="menu-card ranking-card">
        <div class="icon-wrapper"><div class="card-icon"><Trophy :size="28" :stroke-width="1.8" /></div></div>
        <h3 class="card-title">ランキング</h3>
        <p class="card-desc">みんなのおすすめ<br>人気スポット</p>
      </router-link>
    </div>

    <!-- 旅行計画ボタン -->
    <router-link to="/plan" class="plan-banner">
      <div class="plan-icon-wrap"><Map :size="32" :stroke-width="1.8" /></div>
      <div class="plan-text">
        <h3>旅行計画を作る</h3>
        <p>予算を決めて、あなただけのプランを自動生成</p>
      </div>
      <div class="plan-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { store } from '../store'
import { getGreeting } from '../utils/timeTheme.ts'
import { Sparkles, Compass, Heart, Trophy, Map } from 'lucide-vue-next'

const greeting = getGreeting()
const userInitial = store.userName ? store.userName.charAt(0).toUpperCase() : 'G'
</script>

<style scoped>
.menu-container {
  padding: 32px 20px;
  background: transparent;
}

/* --- ユーザー挨拶 --- */
.user-greeting {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 36px;
  padding: 18px 24px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.08);
  border: 1px solid rgba(255, 255, 255, 1);
  transition: transform 0.3s ease;
}

.user-greeting:hover {
  transform: translateY(-2px);
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--festival-color));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 900;
  font-size: 22px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(138, 58, 58, 0.3);
}

.greeting-hello {
  font-size: 13px;
  color: var(--text-light);
  margin-bottom: 4px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.greeting-name {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 800;
  color: var(--text-main);
}

/* --- メインメニューグリッド --- */
.menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.menu-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 28px 12px;
  min-height: 160px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 1);
  text-decoration: none;
  color: inherit;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

/* 上部のグラデーションアクセント */
.menu-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 5px;
  background: transparent;
  transition: opacity 0.3s;
}
.diagnosis-card::before { background: linear-gradient(90deg, var(--primary-color), var(--festival-color)); }
.explore-card::before { background: linear-gradient(90deg, var(--sightseeing-color), #2ECC71); }
.favorites-card::before { background: linear-gradient(90deg, #FF6B6B, #E74C3C); }
.ranking-card::before { background: linear-gradient(90deg, #F1C40F, #F39C12); }

.menu-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
}

.menu-card:hover .icon-wrapper {
  transform: scale(1.1);
}

.menu-card:active {
  transform: scale(0.95);
}

/* アイコンを丸い背景で囲む */
.icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.diagnosis-card .icon-wrapper { background: rgba(138, 58, 58, 0.08); }
.explore-card .icon-wrapper { background: rgba(39, 174, 96, 0.08); }
.favorites-card .icon-wrapper { background: rgba(231, 76, 60, 0.08); }
.ranking-card .icon-wrapper { background: rgba(243, 156, 18, 0.08); }

.card-icon {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* アイコンの色をカードごとに設定 */
.diagnosis-card .card-icon { color: var(--primary-color); }
.explore-card .card-icon { color: var(--sightseeing-color); }
.favorites-card .card-icon { color: #E74C3C; }
.ranking-card .card-icon { color: #F39C12; }

.card-title {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--text-main);
  letter-spacing: 0.5px;
}

.card-desc {
  font-size: 11px;
  color: var(--text-light);
  line-height: 1.6;
  font-weight: 500;
}

/* --- 旅行計画バナー --- */
.plan-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  min-height: 72px;
  background: linear-gradient(135deg, var(--primary-color), #A94A4A);
  border-radius: 24px;
  text-decoration: none;
  color: white;
  box-shadow: 0 10px 30px rgba(138, 58, 58, 0.25);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

/* バナーの光沢エフェクト */
.plan-banner::after {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
  transform: skewX(-20deg);
  animation: shine 6s infinite;
}

@keyframes shine {
  0% { left: -100%; }
  20% { left: 200%; }
  100% { left: 200%; }
}

.plan-banner:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 16px 40px rgba(138, 58, 58, 0.35);
}

.plan-banner:hover .plan-arrow {
  transform: translateX(4px);
}

.plan-icon-wrap {
  font-size: 36px;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  display: flex;
  align-items: center;
  justify-content: center;
}

.plan-text {
  flex: 1;
}

.plan-text h3 {
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.plan-text p {
  font-size: 12px;
  opacity: 0.9;
  font-weight: 500;
}

.plan-arrow {
  background: rgba(255, 255, 255, 0.2);
  width: 32px; height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}
</style>
