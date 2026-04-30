<template>
  <!-- 画像が読み込まれるまでフワフワ光る仮表示を出すコンポーネント -->
  <div class="skeleton-wrapper" :style="{ width, height, borderRadius }">
    <transition name="skeleton-fade">
      <div v-if="!loaded" class="skeleton-shimmer"></div>
    </transition>
    <img
      v-show="loaded"
      :src="src"
      :alt="alt"
      class="skeleton-img"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  src: string
  alt?: string
  width?: string
  height?: string
  borderRadius?: string
}>()

const loaded = ref(false)

const onLoad = () => {
  loaded.value = true
}

const onError = () => {
  // エラー時もスケルトンを消す（壊れた画像を表示）
  loaded.value = true
}
</script>

<style scoped>
.skeleton-wrapper {
  position: relative;
  overflow: hidden;
  background: #E8E4DE;
}

/* フワフワ光るシマー効果 */
.skeleton-shimmer {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.4) 50%,
    rgba(255,255,255,0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: imgFadeIn 0.4s ease;
}

@keyframes imgFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* スケルトンのフェードアウト */
.skeleton-fade-leave-active {
  transition: opacity 0.3s ease;
}
.skeleton-fade-leave-to {
  opacity: 0;
}
</style>
