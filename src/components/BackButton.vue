<template>
  <button @click="goBack" class="back-button">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => router.back()
</script>

<style scoped>
.back-button {
  position: absolute;
  top: 20px;
  left: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  z-index: 50;
  transition: all 0.2s;
  color: var(--text-main);
}

.back-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.back-button:active {
  transform: scale(0.95);
}
</style>
