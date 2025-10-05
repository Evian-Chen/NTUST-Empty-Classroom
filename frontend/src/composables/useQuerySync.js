import { watch, toRef } from 'vue'
export function useQuerySync(state){
  // state: 一個 reactive 物件，包含會反映到網址列的欄位
  for(const key of Object.keys(state)){
    const urlVal = new URLSearchParams(location.search).get(key)
    if(urlVal !== null) state[key] = (/^\d+$/.test(urlVal)? Number(urlVal) : urlVal)
  }
  watch(()=>({...state}), (val)=>{
    const sp = new URLSearchParams(location.search)
    Object.entries(val).forEach(([k,v])=>{
      if(v===undefined||v===null||v==='') sp.delete(k); else sp.set(k,v)
    })
    const newUrl = `${location.pathname}?${sp.toString()}`
    history.replaceState(null,'',newUrl)
  }, {deep:true})
  return state
}
