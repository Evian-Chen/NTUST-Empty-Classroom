<template>
  <section class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">我們能幫什麼</h1>
      <button class="btn-primary" @click="openWizard">開始使用情境精靈</button>
    </div>

    <p class="text-gray-700">遇到人手不足、招生不順、例會流程卡卡或需要講者/評審？用 4 步驟告訴我們你的需求，我們就幫你配對顧問並建立求助單。</p>

    <ScenarioWizard v-if="wizardOpen" @complete="openRequest" />

    <div class="grid md:grid-cols-3 gap-4">
      <SolutionCard title="招募活動 SOP" desc="一步步規劃校園招生活動、範本與檢查清單。" :to="'/resources'"/>
      <SolutionCard title="聯合例會／參訪" desc="和社區或企業分會辦一場聯合例會。" :to="'/directory'"/>
    </div>

    <BaseModal :open="requestOpen" :title="'建立求助單'" @close="requestOpen=false">
      <HelpRequestForm :preset="requestPreset" @submitted="onSubmitted" @cancel="requestOpen=false" />
    </BaseModal>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ScenarioWizard from '@/components/help/ScenarioWizard.vue'
import SolutionCard from '@/components/help/SolutionCard.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import HelpRequestForm from '@/components/advisory/HelpRequestForm.vue'

const wizardOpen = ref(true)

function openWizard(){ wizardOpen.value = true }

const requestOpen = ref(false)
const requestPreset = reactive({})

function openRequest(preset){
  // preset from wizard: { topic, assignedAdvisorIds, preferredMode, city, details }
  Object.assign(requestPreset, preset || {})
  requestOpen.value = true
}

function onSubmitted(id){
  requestOpen.value = false
  alert('已送出！案件編號：' + (id ?? 'N/A'))
}
</script>
