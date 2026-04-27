// AI診断のロジック

export interface DiagnosisAnswer {
  style: 'relaxed' | 'active'    // Q1: のんびり or アクティブ
  mood: 'healing' | 'exciting'   // Q2: 癒し or ワクワク
  food: 'hearty' | 'light'       // Q3: がっつり or あっさり
}

export interface DiagnosisResult {
  typeName: string
  typeEmoji: string
  description: string
  categories: string[]  // おすすめカテゴリ（優先度順）
}

// 8パターンの結果を定義
const resultMap: Record<string, DiagnosisResult> = {
  // のんびり + 癒し + がっつり
  'relaxed-healing-hearty': {
    typeName: '里山グルメ癒しタイプ',
    typeEmoji: '🍲',
    description: 'のんびりした雰囲気で、地元の絶品グルメを楽しみたいあなた。丹波篠山の豊かな食文化が待っています。',
    categories: ['food', 'sightseeing', 'history']
  },
  // のんびり + 癒し + あっさり
  'relaxed-healing-light': {
    typeName: '静寂の庭園散策タイプ',
    typeEmoji: '🌿',
    description: 'ゆったりとした時間の中で、心を落ち着けたいあなた。歴史ある庭園や温泉が最高の癒しになります。',
    categories: ['sightseeing', 'history', 'food']
  },
  // のんびり + ワクワク + がっつり
  'relaxed-exciting-hearty': {
    typeName: '食い倒れ冒険タイプ',
    typeEmoji: '🍖',
    description: 'マイペースに、でも美味しいものはしっかり食べたい！そんなあなたには食の宝庫・丹波篠山がぴったり。',
    categories: ['food', 'festival', 'sightseeing']
  },
  // のんびり + ワクワク + あっさり
  'relaxed-exciting-light': {
    typeName: '文化探訪タイプ',
    typeEmoji: '🏯',
    description: '歴史や文化に触れながら、のんびり楽しみたいあなた。城下町の散策や丹波焼の体験がおすすめ。',
    categories: ['history', 'festival', 'sightseeing']
  },
  // アクティブ + 癒し + がっつり
  'active-healing-hearty': {
    typeName: 'パワーチャージタイプ',
    typeEmoji: '💪',
    description: '体を動かした後は温泉とグルメで回復！メリハリのある旅が好きなあなたにぴったりのプランです。',
    categories: ['food', 'sightseeing', 'festival']
  },
  // アクティブ + 癒し + あっさり
  'active-healing-light': {
    typeName: '自然満喫タイプ',
    typeEmoji: '🌸',
    description: 'アクティブに自然を楽しみつつ、ヘルシーなグルメも味わいたい。四季折々の丹波篠山を体感しましょう。',
    categories: ['sightseeing', 'food', 'history']
  },
  // アクティブ + ワクワク + がっつり
  'active-exciting-hearty': {
    typeName: '全力エンジョイタイプ',
    typeEmoji: '🔥',
    description: 'お祭りも食も全力で楽しむ！丹波篠山のアツい魅力を全身で体感するのがあなたのスタイル。',
    categories: ['festival', 'food', 'sightseeing']
  },
  // アクティブ + ワクワク + あっさり
  'active-exciting-light': {
    typeName: '伝統体験タイプ',
    typeEmoji: '🎭',
    description: '新しい体験に飛び込みたいあなた。陶芸体験やお祭り、能舞台など、丹波篠山の伝統文化に触れてみましょう。',
    categories: ['festival', 'history', 'sightseeing']
  }
}

export const getDiagnosisResult = (answers: DiagnosisAnswer): DiagnosisResult => {
  const key = `${answers.style}-${answers.mood}-${answers.food}`
  return resultMap[key] || resultMap['relaxed-healing-light']
}
