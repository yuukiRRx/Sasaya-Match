<template>
  <!-- 横スワイプで複数画像を閲覧できるスライダー -->
  <div class="slider-container" ref="sliderRef">
    <div
      class="slider-track"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div v-for="(img, i) in images" :key="i" class="slider-slide">
        <SkeletonImage
          :src="img"
          :alt="`${alt} ${i + 1}`"
          width="100%"
          height="100%"
        />
      </div>
    </div>

    <!-- ドットインジケーター -->
    <div v-if="images.length > 1" class="slider-dots">
      <button
        v-for="(_, i) in images"
        :key="i"
        class="slider-dot"
        :class="{ active: currentIndex === i }"
        @click="goTo(i)"
      ></button>
    </div>

    <!-- 左右の矢印ボタン（PC用） -->
    <template v-if="images.length > 1">
      <button v-if="currentIndex > 0" class="slider-arrow slider-arrow-left" @click="prev">
        <ChevronLeft :size="24" :stroke-width="2.5" />
      </button>
      <button v-if="currentIndex < images.length - 1" class="slider-arrow slider-arrow-right" @click="next">
        <ChevronRight :size="24" :stroke-width="2.5" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import SkeletonImage from './SkeletonImage.vue'

defineProps<{
  images: string[]
  alt?: string
}>()

const currentIndex = ref(0)
const touchStartX = ref(0)
const touchDiff = ref(0)

const goTo = (index: number) => {
  currentIndex.value = index
}

const prev = () => {
  if (currentIndex.value > 0) currentIndex.value--
}

const next = () => {
  // images.lengthはpropsから参照
  currentIndex.value++
}

// スワイプ操作
const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  touchDiff.value = 0
}

const onTouchMove = (e: TouchEvent) => {
  touchDiff.value = touchStartX.value - e.touches[0].clientX
}

const onTouchEnd = () => {
  if (Math.abs(touchDiff.value) > 50) {
    if (touchDiff.value > 0) {
      // 左スワイプ → 次へ
      next()
    } else {
      // 右スワイプ → 前へ
      prev()
    }
  }
}
</script>

<style scoped>
.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slider-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slider-slide {
  min-width: 100%;
  height: 100%;
}

/* ドットインジケーター */
.slider-dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 3;
}

.slider-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.slider-dot.active {
  background: white;
  width: 24px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 左右矢印 */
.slider-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  color: var(--text-main);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.slider-arrow:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.slider-arrow-left { left: 12px; }
.slider-arrow-right { right: 12px; }
</style>
