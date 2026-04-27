<template>
  <div class="page-container summary-bg">
    <div class="summary-card">
      <div class="icon-wrap">✨</div>
      <h1 class="title">あなたの診断結果</h1>
      
      <p class="message">{{ personalizedMessage }}</p>
      
      <div class="history-section" v-if="store.history.length > 0">
        <p class="history-label">あなたが興味を持ったカテゴリ</p>
        <div class="history-tags">
          <span 
            v-for="cat in store.history" 
            :key="cat" 
            class="history-tag"
            :class="cat"
          >
            {{ getCategoryName(cat) }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="actions">
      <router-link to="/plan" class="btn-primary plan-btn">
        旅行計画を見る
      </router-link>
      <button @click="resetAndGoHome" class="btn-secondary reset-btn">
        最初からやり直す
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'
import type { Category } from '../data/spots'

const router = useRouter()

const getCategoryName = (cat: Category) => {
  const map: Record<Category, string> = {
    food: '食べ物',
    history: '歴史・建築',
    sightseeing: '観光地',
    festival: '祭り'
  }
  return map[cat]
}

const personalizedMessage = computed(() => {
  const history = store.history
  if (history.length === 0) {
    return 'まだ何も選んでいないようです。丹波篠山には魅力的なスポットがたくさんあります！'
  }
  
  if (history.includes('history') && history.includes('food')) {
    return '歴史と食に興味があるあなたには、城下町を散策しながらの食べ歩きコースがおすすめ！'
  } else if (history.includes('sightseeing') && history.includes('food')) {
    return '観光と食を満喫したいあなたには、美しい景色を楽しみながらのご当地グルメ巡りがぴったり！'
  } else if (history.includes('history')) {
    return '歴史ロマンに惹かれるあなた。丹波篠山の情緒あふれる街並みが心を満たしてくれます。'
  } else if (history.includes('food')) {
    return '食通のあなたには、丹波篠山の豊かな自然が育んだ極上のグルメがおすすめ！'
  } else if (history.includes('sightseeing')) {
    return 'リフレッシュしたいあなたには、大自然と温泉で癒されるリラックスコースがおすすめ！'
  } else {
    return 'あなたにぴったりの丹波篠山の魅力が見つかりましたか？ぜひ実際に足を運んでみてください！'
  }
})

const resetAndGoHome = () => {
  store.selectedCategory = ''
  store.history = []
  router.push('/')
}
</script>

<style scoped>
.summary-bg {
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.summary-card {
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  text-align: center;
  width: 100%;
  margin-bottom: auto;
  margin-top: 20px;
}

.icon-wrap {
  font-size: 48px;
  margin-bottom: 16px;
}

.title {
  font-size: 22px;
  margin-bottom: 24px;
  color: var(--primary-color);
}

.message {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-main);
  font-weight: 600;
  margin-bottom: 32px;
}

.history-section {
  border-top: 1px dashed #e0e0e0;
  padding-top: 24px;
}

.history-label {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 12px;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.history-tag {
  font-size: 13px;
  font-weight: bold;
  padding: 6px 16px;
  border-radius: 20px;
  color: white;
}

.history-tag.food { background-color: var(--food-color); }
.history-tag.history { background-color: var(--history-color); }
.history-tag.sightseeing { background-color: var(--sightseeing-color); }
.history-tag.festival { background-color: var(--festival-color); }

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 24px;
}

.plan-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--festival-color));
}

.reset-btn {
  margin-top: 0;
}
</style>
