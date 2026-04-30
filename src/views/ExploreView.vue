<template>
  <div class="page-container explore-container">
    <BackButton />

    <div class="explore-header">
      <h1 class="title">スポット一覧</h1>
      <router-link to="/recommendations?mode=explore" class="swipe-mode-btn">
        <ArrowUpDown :size="18" :stroke-width="2.5" />
        スワイプで見る
      </router-link>
    </div>

    <!-- ハッシュタグ検索 -->
    <div class="search-section">
      <div class="search-bar">
        <Search :size="18" :stroke-width="2" />
        <input v-model="searchQuery" type="text" placeholder="スポット名やタグで検索..." class="search-input">
      </div>

      <!-- タグ一覧 -->
      <div class="tag-filter">
        <button 
          v-for="tag in allTags" 
          :key="tag" 
          class="filter-tag"
          :class="{ active: selectedTag === tag }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>
      </div>

      <!-- カテゴリフィルター -->
      <div class="cat-filter">
        <button 
          v-for="cat in categories" 
          :key="cat.id" 
          class="cat-btn"
          :class="{ active: selectedCategory === cat.id, [cat.id]: true }"
          @click="toggleCategory(cat.id)"
        >
          <component :is="cat.icon" :size="14" :stroke-width="2" />
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- スポットリスト -->
    <div class="spot-grid">
      <router-link 
        v-for="(spot, index) in filteredSpots" 
        :key="spot.id" 
        :to="'/detail/' + spot.id"
        class="spot-card fade-up-enter"
        :style="{ animationDelay: `${index * 0.08}s` }"
      >
        <SkeletonImage :src="spot.imageUrl" :alt="spot.name" width="100%" height="180px" border-radius="16px 16px 0 0" class="spot-img" />
        <div class="spot-info">
          <h3 class="spot-name">{{ spot.name }}</h3>
          <p class="spot-feature">{{ spot.feature }}</p>
          <div class="spot-tags">
            <span v-for="tag in spot.tags.slice(0,2)" :key="tag" class="mini-tag">{{ tag }}</span>
          </div>
        </div>
      </router-link>
    </div>

    <p v-if="filteredSpots.length === 0" class="no-result">
      該当するスポットが見つかりませんでした 🔍
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import { spots } from '../data/spots'
import type { Category } from '../data/spots'
import BackButton from '../components/BackButton.vue'
import SkeletonImage from '../components/SkeletonImage.vue'
import { ArrowUpDown, Search, UtensilsCrossed, Landmark, Mountain, PartyPopper } from 'lucide-vue-next'

const searchQuery = ref('')
const selectedTag = ref('')
const selectedCategory = ref<Category | ''>('')

const categories = [
  { id: 'food' as Category, name: '食べ物', icon: markRaw(UtensilsCrossed) },
  { id: 'history' as Category, name: '歴史', icon: markRaw(Landmark) },
  { id: 'sightseeing' as Category, name: '観光', icon: markRaw(Mountain) },
  { id: 'festival' as Category, name: '祭り', icon: markRaw(PartyPopper) }
]

// 全タグを取得（重複排除）
const allTags = computed(() => {
  const tags = new Set<string>()
  spots.forEach(s => s.tags.forEach(t => tags.add(t)))
  return Array.from(tags)
})

const toggleTag = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? '' : tag
}

const toggleCategory = (cat: Category) => {
  selectedCategory.value = selectedCategory.value === cat ? '' : cat
}

const filteredSpots = computed(() => {
  return spots.filter(spot => {
    // カテゴリフィルター
    if (selectedCategory.value && spot.category !== selectedCategory.value) return false
    // タグフィルター
    if (selectedTag.value && !spot.tags.includes(selectedTag.value)) return false
    // テキスト検索
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      const matchName = spot.name.toLowerCase().includes(q)
      const matchFeature = spot.feature.toLowerCase().includes(q)
      const matchTag = spot.tags.some(t => t.toLowerCase().includes(q))
      if (!matchName && !matchFeature && !matchTag) return false
    }
    return true
  })
})
</script>

<style scoped>
.explore-container {
  padding-top: 72px;
}

.title {
  margin-bottom: 20px;
}

.explore-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.explore-header .title {
  margin-bottom: 0;
}

.swipe-mode-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: white;
  background: linear-gradient(135deg, var(--primary-color), var(--festival-color));
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  box-shadow: 0 3px 10px rgba(138,58,58,0.2);
  transition: all 0.2s;
  white-space: nowrap;
}

.swipe-mode-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(138,58,58,0.3);
}

.search-section {
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 16px;
  margin-bottom: 16px;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.search-bar:focus-within {
  border-color: var(--primary-color);
  box-shadow: 0 6px 20px rgba(138, 58, 58, 0.1);
  transform: translateY(-1px);
}

.search-bar svg {
  color: var(--text-light);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  font-family: var(--font-sans);
  color: var(--text-main);
  background: transparent;
}

.search-input::placeholder {
  color: #B0B0B0;
}

.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.filter-tag {
  font-size: 12px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.filter-tag:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

.filter-tag.active {
  background: linear-gradient(135deg, var(--primary-color), var(--festival-color));
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(138, 58, 58, 0.2);
}

.cat-filter {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.cat-btn {
  white-space: nowrap;
  font-size: 13px;
  font-weight: 800;
  padding: 10px 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 1);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  color: var(--text-main);
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  display: flex;
  align-items: center;
  gap: 6px;
}

.cat-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.cat-btn.active.food { background: linear-gradient(135deg, var(--food-color), #D35400); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(230, 126, 34, 0.3); }
.cat-btn.active.history { background: linear-gradient(135deg, var(--history-color), #2C3E50); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(52, 73, 94, 0.3); }
.cat-btn.active.sightseeing { background: linear-gradient(135deg, var(--sightseeing-color), #27AE60); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3); }
.cat-btn.active.festival { background: linear-gradient(135deg, var(--festival-color), #8E44AD); color: white; border-color: transparent; box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3); }

/* スポットグリッド */
.spot-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.spot-card {
  display: flex;
  gap: 16px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.spot-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.spot-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  flex-shrink: 0;
  transition: transform 0.5s;
}

.spot-card:hover .spot-img {
  transform: scale(1.05);
}

.spot-info {
  padding: 16px 16px 16px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.spot-name {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 6px;
  color: var(--text-main);
  letter-spacing: 0.5px;
}

.spot-feature {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 10px;
  line-height: 1.5;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.spot-tags {
  display: flex;
  gap: 8px;
}

.mini-tag {
  font-size: 10px;
  font-weight: 700;
  color: var(--primary-color);
  background: rgba(138, 58, 58, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
}

.no-result {
  text-align: center;
  color: var(--text-light);
  margin-top: 40px;
  font-size: 15px;
}
</style>
