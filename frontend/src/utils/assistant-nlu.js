import { useRouter } from 'vue-router'

// Simple keyword intent detection for zh-TW / en mix
const cityWords = ['台北','臺北','新北','桃園','台中','臺中','台南','高雄','新竹','基隆','嘉義','彰化','雲林','南投','苗栗','宜蘭','花蓮','台東','臺東','屏東','金門','澎湖','連江']
const langWords = { '中文': 'zh', '英文':'en', 'English':'en', '中英':'bilingual', '雙語':'bilingual' }
const modeWords = { '線上':'online', '實體':'offline', '混合':'hybrid', 'Hybrid':'hybrid' }
const timeWords = { '早上':'morning', '上午':'morning', '下午':'afternoon', '晚上':'evening' }

export function respondLocal(text, context = {}){
  const lower = (text || '').toLowerCase()
  const zh = text || ''

  // Normalize filters
  const params = {}

  // city
  const city = cityWords.find(c => zh.includes(c))
  if (city) params.city = city

  // language
  for (const k in langWords){ if (zh.includes(k)) { params.language = langWords[k]; break } }

  // meeting mode
  for (const k in modeWords){ if (zh.includes(k)) { params.mode = modeWords[k]; break } }

  // time slot
  for (const k in timeWords){ if (zh.includes(k)) { params.timeSlot = timeWords[k]; break } }

  // directory intent
  if (['找分會','分會','名錄','directory','club'].some(k => zh.includes(k) || lower.includes(k))){
    return {
      text: hint('我可以幫你在「分會名錄」依條件篩選。'),
      actions: [
        { label: city ? `去看 ${city} 的分會` : '打開分會名錄', intent: 'directory', params },
        { label: '學生分會', intent: 'directory', params: { ...params, type: 'student' } },
        { label: '社區分會', intent: 'directory', params: { ...params, type: 'community' } },
        { label: '企業分會', intent: 'directory', params: { ...params, type: 'corporate' } },
      ]
    }
  }

  // events intent
  if (['活動','event','calendar','日曆','報名'].some(k => zh.includes(k) || lower.includes(k))){
    return {
      text: hint('我帶你去「活動」頁面，你可以用日曆或清單查看。'),
      actions: [
        { label: '打開活動列表', intent: 'events', params: {} },
        { label: '本月行事曆', intent: 'events', params: { view: 'calendar' } },
      ]
    }
  }

  // help/advisory
  if (['幫忙','顧問','媒合','求助','需要協助','help','advisory'].some(k => zh.includes(k) || lower.includes(k))){
    return {
      text: hint('聽起來你需要顧問/媒合支援～我可以開啟「使用情境精靈」，幫你 4 步驟建立求助單。'),
      actions: [
        { label: '打開我們能幫什麼', intent: 'help' },
        { label: '建立求助單', intent: 'advisory' },
      ]
    }
  }

  // resources intent
  if (['資源','模板','指南','教學','影片','案例','pathways','總會','官網'].some(k => zh.toLowerCase().includes(k) || lower.includes(k))){
    const actions = [
      { label: '資源中心', intent: 'resources' },
      { label: 'Pathways', intent: 'resources', params: { q: 'Pathways' } },
      { label: 'Find a Club（官方）', intent: 'resources', params: { q: 'Find a Club' } },
    ]
    return { text: hint('帶你到「資源中心」。也可以直接開官方入口。'), actions }
  }

  // me center
  if (['收藏','報名','通知','個人','我的'].some(k => zh.includes(k) )){
    return {
      text: hint('我可以帶你到個人中心。'),
      actions: [
        { label: '打開個人中心', intent: 'me' },
        { label: '查看我的報名', intent: 'me', params: { tab: 'registrations' } },
        { label: '查看我的求助單', intent: 'me', params: { tab: 'requests' } },
      ]
    }
  }

  // fallback
  return {
    text: '我還在學習中😅 你可以這樣問我：\n•「幫我找 台北 晚上 雙語 的 分會」\n•「本月的活動日曆」\n•「Pathways 的入門指南在哪？」',
    actions: [
      { label: '找分會', intent: 'directory' },
      { label: '活動', intent: 'events' },
      { label: '我們能幫什麼', intent: 'help' },
      { label: '資源中心', intent: 'resources' },
    ]
  }
}

function hint(s){ return s + '（我已把你說的條件帶入囉）' }

export function navigateForIntent(router, intent, params = {}){
  switch (intent){
    case 'directory':
      router.push({ path: '/directory', query: clean(params) })
      break
    case 'events':
      router.push({ path: '/events', query: clean(params) })
      break
    case 'help':
      router.push({ path: '/help' })
      break
    case 'advisory':
      router.push({ path: '/advisory' })
      break
    case 'resources':
      router.push({ path: '/resources', query: clean(params) })
      break
    case 'me':
      router.push({ path: '/me' })
      break
    default:
      break
  }
}

function clean(obj){
  const o = {}
  Object.keys(obj || {}).forEach(k => {
    const v = obj[k]
    if (v !== undefined && v !== null && v !== '') o[k] = v
  })
  return o
}
