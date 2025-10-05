import { watch, toRef } from 'vue'

export function useQuerySync(state, allowedKeys = null){
  // state: 一個 reactive 物件，包含會反映到網址列的欄位
  // allowedKeys: 陣列，指定哪些 key 要同步到 URL，如果為 null 則同步所有 key
  
  const keysToSync = allowedKeys || Object.keys(state)
  
  // 從 URL 讀取初始值
  for(const key of keysToSync){
    const urlVal = new URLSearchParams(location.search).get(key)
    if(urlVal !== null) state[key] = (/^\d+$/.test(urlVal)? Number(urlVal) : urlVal)
  }
  
  watch(()=>({...state}), (val)=>{
    const sp = new URLSearchParams(location.search)
    
    // 清除不相關的參數
    if (allowedKeys) {
      // 如果指定了 allowedKeys，清除不在列表中的參數
      for (const [key] of sp.entries()) {
        if (!allowedKeys.includes(key)) {
          sp.delete(key)
        }
      }
    }
    
    // 只同步指定的 keys
    keysToSync.forEach(k => {
      const v = val[k]
      if(v===undefined||v===null||v==='') sp.delete(k); else sp.set(k,v)
    })
    
    const newUrl = `${location.pathname}?${sp.toString()}`
    history.replaceState(null,'',newUrl)
  }, {deep:true})
  
  return state
}
