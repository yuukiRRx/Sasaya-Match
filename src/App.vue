<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="String(route.meta.transition || 'fade')">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
// Main App Component
</script>

<style>
/* Global styles are handled in style.css */
</style>
