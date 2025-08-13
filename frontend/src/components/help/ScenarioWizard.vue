<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold">使用情境精靈</h3>
      <p class="text-xs text-gray-500">第 {{ step }} 步，共 4 步</p>
    </div>

    <!-- Step 1: choose topic -->
    <div v-if="step===1" class="grid md:grid-cols-3 gap-3">
      <button
        v-for="opt in topics"
        :key="opt.value"
        class="border rounded-2xl p-4 text-left hover:bg-gray-50"
        :class="model.topic===opt.value ? 'ring-2 ring-tmblue bg-gray-50' : ''"
        @click="model.topic = opt.value"
      >
        <div class="font-semibold mb-1">{{ opt.label }}</div>
        <p class="text-sm text-gray-600">{{ opt.desc }}</p>
      </button>
    </div>

    <!-- Step 2: pain points + details -->
    <div v-else-if="step===2" class="grid gap-4">
      <div>
        <div class="text-sm font-medium mb-2">常見困難（可複選）</div>
        <div class="flex flex-wrap gap-2">
          <label v-for="p in painPointOptions" :key="p" class="inline-flex items-center gap-1 text-sm">
            <input type="checkbox" :value="p" v-model="model.painPoints" />
            <span>{{ p }}</span>
          </label>
        </div>
      </div>
      <label class="grid gap-1">
        <span class="text-sm">補充說明（可簡述目前情況、期望成果與時程）</span>
        <textarea v-model="model.details" class="border rounded-2xl px-3 py-2 min-h-[120px]" placeholder="例：想在9月開學周辦招生活動，需要講者與宣傳素材支援。"></textarea>
      </label>
    </div>

    <!-- Step 3: preference -->
    <div v-else-if="step===3" class="grid md:grid-cols-3 gap-3">
      <label class="grid gap-1">
        <span class="text-sm">偏好的協助模式</span>
        <select v-model="model.preferredMode" class="border rounded-2xl px-3 py-2">
          <option value="">不限</option>
          <option value="online">線上</option>
          <option value="offline">實體</option>
          <option value="hybrid">混合</option>
        </select>
      </label>
      <label class="grid gap-1">
        <span class="text-sm">城市</span>
        <input v-model="model.city" class="border rounded-2xl px-3 py-2" placeholder="例：台北市">
      </label>
      <label class="grid gap-1">
        <span class="text-sm">星期</span>
        <select v-model="model.weekday" class="border rounded-2xl px-3 py-2">
          <option value="">不限</option>
          <option v-for="(w,idx) in weekdays" :key="idx" :value="idx">週{{ w }}</option>
        </select>
      </label>
      <label class="grid gap-1">
        <span class="text-sm">時段</span>
        <select v-model="model.timeSlot" class="border rounded-2xl px-3 py-2">
          <option value="">不限</option>
          <option value="morning">早上</option>
          <option value="afternoon">下午</option>
          <option value="evening">晚上</option>
        </select>
      </label>
    </div>

    <!-- Step 4: suggestions -->
    <div v-else-if="step===4" class="grid gap-4">
      <div class="grid gap-2">
        <div class="flex items-center justify-between">
          <h4 class="font-semibold">建議顧問（可複選）</h4>
          <button class="btn-ghost" @click="refreshAdvisors">重新配對</button>
        </div>
        <div v-if="suggestedLoading" class="text-sm text-gray-500">配對中…</div>
        <div v-else class="grid md:grid-cols-2 gap-3">
          <label
            v-for="a in suggestions"
            :key="a.id"
            class="border rounded-2xl p-3 hover:bg-gray-50 flex items-start gap-3"
          >
            <input type="checkbox" class="mt-1" :value="a.id" v-model="model.assignedAdvisorIds" />
            <div>
              <div class="font-medium">{{ a.name }}</div>
              <div class="text-xs text-gray-600"># {{ (a.expertise || []).join(' # ') }}</div>
              <div class="text-xs text-gray-500 mt-1" v-if="a.availability?.weekdays?.length">
                可時段：週{{ a.availability.weekdays.join('、') }} / {{ (a.availability.timeSlots||[]).join('/') }}
              </div>
            </div>
          </label>
          <p v-if="!suggestions.length" class="text-sm text-gray-500">目前沒有找到建議顧問。你仍可直接提交求助單，我們將由小組分配。</p>
        </div>
      </div>

      <div class="grid gap-2">
        <h4 class="font-semibold">推薦資源</h4>
        <ul class="list-disc pl-6 text-sm text-gray-700">
          <li v-for="r in recommendedResources" :key="r.label">
            <RouterLink v-if="r.to" :to="r.to" class="underline text-tmblue">{{ r.label }}</RouterLink>
            <a v-else-if="r.href" :href="r.href" target="_blank" class="underline text-tmblue">{{ r.label }}</a>
            <span v-else>{{ r.label }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Nav -->
    <div class="flex items-center justify-between mt-6">
      <button class="btn-ghost" :disabled="step===1" @click="prev">上一步</button>
      <div class="flex gap-2">
        <button v-if="step<4" class="btn-primary" :disabled="!canNext" @click="next">下一步</button>
        <button v-else class="btn-primary" @click="complete">建立求助單</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useAdvisorStore } from '@/stores/advisors'

const emit = defineEmits(['complete'])

const step = ref(1)
const weekdays = ['日','一','二','三','四','五','六']

const topics = [
  { value: 'manpower',  label: '人手不足', desc: '幹部不足、交接斷層、例會運作吃緊' },
  { value: 'recruiting',label: '招生/招募', desc: '新生宣傳、迎新規劃、行銷素材' },
  { value: 'mentoring', label: 'Mentoring', desc: '找講者/評審、導師配對' },
  { value: 'event',     label: '活動企劃', desc: '聯合例會、工作坊、參訪' },
  { value: 'others',    label: '其他需求', desc: '自由填寫需求與時程' },
]

const model = reactive({
  topic: '',
  painPoints: [],
  details: '',
  preferredMode: '',
  city: '',
  weekday: '',
  timeSlot: '',
  assignedAdvisorIds: [],
})

// pain point options change with topic
const painPointDict = {
  manpower: ['幹部不足','招募幹部方案','交接斷層','志工招募'],
  recruiting: ['招生活動企劃','校園擺攤/說明會','宣傳素材','報名轉化'],
  operation: ['例會流程','幹部訓練','工具選型','評鑑與改善'],
  pr: ['Facebook/IG 經營','文案優化','視覺模板','社群廣告'],
  mentoring: ['講者邀請','評審邀請','導師配對','演講指導'],
  event: ['活動企劃','議程設計','合作分會媒合','現場執行'],
  others: ['自訂需求']
}
const painPointOptions = computed(() => painPointDict[model.topic] || [])

// ---- Advisor suggestions ----
const store = useAdvisorStore()
const suggestedLoading = ref(false)
const suggestions = ref([])

const topicExpertiseMap = {
  manpower: ['幹部','營運','Mentoring'],
  recruiting: ['招募','PR','行銷'],
  operation: ['營運','教育'],
  pr: ['PR','行銷','設計'],
  mentoring: ['Mentoring','教育','評審'],
  event: ['活動企劃','主持','講者'],
  others: []
}

async function refreshAdvisors(){
  suggestedLoading.value = true
  try {
    const expertise = topicExpertiseMap[model.topic] || []
    await store.fetchAdvisors({ expertise, weekday: model.weekday, timeSlot: model.timeSlot, q: '' })
    suggestions.value = store.items.slice(0, 6)
    // default select first advisor if none selected
    if (!model.assignedAdvisorIds.length && suggestions.value.length){
      model.assignedAdvisorIds = [suggestions.value[0].id]
    }
  } finally {
    suggestedLoading.value = false
  }
}

watch(() => [model.topic, model.weekday, model.timeSlot].join('|'), () => {
  if (step.value === 4) refreshAdvisors()
})

// ---- Navigation ----
const canNext = computed(() => {
  if (step.value === 1) return !!model.topic
  if (step.value === 2) return true
  if (step.value === 3) return true
  return true
})
function next(){ if (step.value < 4){ step.value++; if (step.value===4) refreshAdvisors() } }
function prev(){ if (step.value > 1) step.value-- }

function buildDetailSummary(){
  const parts = []
  if (model.painPoints.length) parts.push('困難：' + model.painPoints.join('、'))
  if (model.details) parts.push('補充：' + model.details)
  if (model.weekday || model.timeSlot) parts.push(`希望時段：${model.weekday!=='' ? '週'+weekdays[Number(model.weekday)] : '不限'} ${model.timeSlot||''}`.trim())
  return parts.join('\n')
}

function complete(){
  const preset = {
    topic: model.topic || 'others',
    assignedAdvisorIds: model.assignedAdvisorIds.slice(),
    selectedAdvisor: null, // 可在父層依 id 補齊物件
    // For HelpRequestForm fields:
    preferredMode: model.preferredMode,
    city: model.city,
    details: buildDetailSummary(),
  }
  emit('complete', preset)
}
</script>
