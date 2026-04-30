<template>
  <Teleport to="body">
    <!-- ログイン前・ホーム画面・詳細画面ではナビを非表示 -->
    <nav v-if="showNav" class="bottom-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
      >
        <component :is="item.icon" :size="24" :stroke-width="isActive(item.path) ? 2.5 : 1.8" />
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Home, Compass, Heart, Trophy } from 'lucide-vue-next'

const route = useRoute()

// ナビゲーションの項目定義
const navItems = [
  { path: '/menu', label: 'ホーム', icon: Home },
  { path: '/explore', label: '探す', icon: Compass },
  { path: '/favorites', label: 'お気に入り', icon: Heart },
  { path: '/ranking', label: 'ランキング', icon: Trophy }
]

// ナビを表示しない画面（ログイン前・ホーム・詳細など）
const hiddenRoutes = ['/', '/login', '/detail']

const showNav = computed(() => {
  const path = route.path
  return !hiddenRoutes.some(r => path === r || (r === '/detail' && path.startsWith('/detail/')))
})

// 現在のルートがアクティブかどうか
const isActive = (path: string) => {
  return route.path === path
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: space-around;
  align-items: stretch;
  padding: 4px 0 calc(4px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

@media (min-width: 768px) {
  .bottom-nav {
    max-width: 800px;
    border-radius: 0 0 24px 24px;
  }
}

/* タップ領域を大きくしてスマホで押しやすく */
.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: var(--text-light);
  padding: 10px 20px;
  min-height: 56px;
  min-width: 64px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  -webkit-tap-highlight-color: transparent;
}

.nav-item.active {
  color: var(--primary-color);
}

/* アクティブ時の背景インジケーター */
.nav-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 3px;
  border-radius: 0 0 3px 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--festival-color));
}

.nav-item:active {
  transform: scale(0.92);
  background: rgba(138, 58, 58, 0.05);
}

.nav-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.nav-item.active .nav-label {
  font-weight: 900;
}
</style>
