import { reactive } from 'vue'
import type { Category } from './data/spots'
import type { DiagnosisAnswer } from './utils/diagnosis'

export const store = reactive({
  // ユーザー情報
  userName: '' as string,
  isLoggedIn: false,

  // 診断関連
  selectedCategory: '' as Category | '',
  history: [] as Category[],
  diagnosisAnswers: null as DiagnosisAnswer | null,

  // お気に入り
  favorites: [] as string[]
})
