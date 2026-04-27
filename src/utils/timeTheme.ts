// 時間帯による自動変化（ダイナミックUX）

export type TimePeriod = 'morning' | 'evening' | 'night'

// 現在の時間帯を取得
export const getTimePeriod = (): TimePeriod => {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 15) return 'morning'
  if (hour >= 15 && hour < 18) return 'evening'
  return 'night'
}

// 時間帯ごとの挨拶文
export const getGreeting = (): string => {
  const period = getTimePeriod()
  switch (period) {
    case 'morning':
      return '今日の丹波篠山、どこ行く？'
    case 'evening':
      return '歩き疲れたら、ちょっと一休み。'
    case 'night':
      return '明日の計画、立ててみる？'
  }
}

// 時間帯ごとのテーマカラー設定をCSSカスタムプロパティに適用
export const applyTimeTheme = () => {
  const period = getTimePeriod()
  const root = document.documentElement

  switch (period) {
    case 'morning':
      // 朝〜昼: スッキリした白や明るい緑（枝豆グリーン）
      root.style.setProperty('--time-bg', '#F0F7EE')
      root.style.setProperty('--time-gradient-start', 'rgba(200, 230, 180, 0.3)')
      root.style.setProperty('--time-gradient-end', 'rgba(240, 247, 238, 0.9)')
      root.style.setProperty('--time-accent', '#6B9B3A')
      root.style.setProperty('--time-overlay-start', 'rgba(30, 50, 20, 0.3)')
      root.style.setProperty('--time-overlay-end', 'rgba(20, 40, 20, 0.75)')
      break
    case 'evening':
      // 夕方: 夕焼けのようなオレンジ（レトロカラー）
      root.style.setProperty('--time-bg', '#FDF0E6')
      root.style.setProperty('--time-gradient-start', 'rgba(255, 180, 100, 0.3)')
      root.style.setProperty('--time-gradient-end', 'rgba(253, 240, 230, 0.9)')
      root.style.setProperty('--time-accent', '#D4762C')
      root.style.setProperty('--time-overlay-start', 'rgba(60, 30, 10, 0.35)')
      root.style.setProperty('--time-overlay-end', 'rgba(50, 20, 10, 0.8)')
      break
    case 'night':
      // 夜: ダークモード風の落ち着いた黒や濃紺
      root.style.setProperty('--time-bg', '#1A1A2E')
      root.style.setProperty('--time-gradient-start', 'rgba(20, 20, 50, 0.3)')
      root.style.setProperty('--time-gradient-end', 'rgba(26, 26, 46, 0.95)')
      root.style.setProperty('--time-accent', '#E2C275')
      root.style.setProperty('--time-overlay-start', 'rgba(10, 10, 30, 0.4)')
      root.style.setProperty('--time-overlay-end', 'rgba(10, 10, 20, 0.9)')
      break
  }
}
