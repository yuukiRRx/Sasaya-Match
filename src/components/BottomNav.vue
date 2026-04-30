<template>
  <!-- ログイン前・ホーム画面・詳細画面ではナビを非表示 -->
  <nav v-if="showNav" class="bottom-nav">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
    >
      <component :is="item.icon" :size="22" :stroke-width="isActive(item.path) ? 2.5 : 1.8" />
      <span class="nav-label">{{ item.label }}</span>
    </router-link>
  </nav>
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
  align-items: center;
  padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.06);
  z-index: 100;
}

@media (min-width: 768px) {
  .bottom-nav {
    max-width: 800px;
    border-radius: 0 0 24px 24px;
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  color: var(--text-light);
  padding: 6px 16px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
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
  width: 28px;
  height: 3px;
  border-radius: 0 0 3px 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--festival-color));
}

.nav-item:active {
  transform: scale(0.9);
}

.nav-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.nav-item.active .nav-label {
  font-weight: 900;
}
</style>
