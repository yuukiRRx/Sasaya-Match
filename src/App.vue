<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="String(route.meta.transition || 'fade')">
      <component :is="Component" />
    </transition>
  </router-view>
  <!-- ボトムナビゲーション -->
  <BottomNav />
</template>

<script setup lang="ts">
import BottomNav from './components/BottomNav.vue'
</script>

<style>
/* Global styles are handled in style.css */
</style>
