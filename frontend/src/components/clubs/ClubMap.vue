<template>
  <div class="card p-0 overflow-hidden">
    <div class="flex items-center justify-between px-4 py-2 border-b">
      <h3 class="font-semibold">地圖</h3>
      <div class="flex gap-2">
        <button class="btn-ghost" @click="fitToMarkers">Fit to results</button>
        <button class="btn-ghost" @click="goTaiwan">台灣</button>
      </div>
    </div>
    <div ref="mapEl" class="h-[420px] md:h-[720px] w-full"></div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  clubs: { type: Array, default: () => [] },
  selectedId: { type: [String, Number, null], default: null }
})
const emit = defineEmits(['select'])

const mapEl = ref(null)
let map
let layerGroup
const markers = new Map()

const TM_BLUE = '#004165'
const TM_GOLD = '#D4AF37'

function createMarker(club){
  if (!club?.venue?.lat || !club?.venue?.lng) return null
  const latlng = [club.venue.lat, club.venue.lng]
  const m = L.circleMarker(latlng, {
    radius: 8,
    fillColor: TM_BLUE,
    color: '#fff',
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9,
  })
  m.on('click', () => emit('select', club))
  m.bindTooltip(club.name || 'Club', { direction: 'top', offset: [0, -8] })
  return m
}

function renderMarkers(){
  markers.clear()
  layerGroup.clearLayers()
  const withCoords = props.clubs.filter(c => c?.venue?.lat && c?.venue?.lng)
  withCoords.forEach(c => {
    const m = createMarker(c)
    if (m){
      m.addTo(layerGroup)
      markers.set(String(c.id), m)
    }
  })
  if (withCoords.length) fitToMarkers()
}

function highlightSelected(){
  markers.forEach((m, id) => {
    const isSel = String(id) === String(props.selectedId || '')
    m.setStyle({ fillColor: isSel ? TM_GOLD : TM_BLUE })
    if (isSel) m.bringToFront()
  })
}

function fitToMarkers(){
  const bounds = L.latLngBounds([])
  markers.forEach(m => bounds.extend(m.getLatLng()))
  if (bounds.isValid()){
    map.fitBounds(bounds.pad(0.15), { animate: true })
  }
}
function goTaiwan(){
  map.setView([23.6978, 120.9605], 7)
}

onMounted(() => {
  map = L.map(mapEl.value, {
    center: [23.6978, 120.9605], // Taiwan center
    zoom: 7,
    scrollWheelZoom: true
  })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)
  layerGroup = L.layerGroup().addTo(map)
  renderMarkers()
  highlightSelected()
})

onBeforeUnmount(() => {
  if (map) map.remove()
})

watch(() => props.clubs, () => {
  renderMarkers()
  highlightSelected()
}, { deep: true })

watch(() => props.selectedId, () => {
  highlightSelected()
})

defineExpose({ fitToMarkers, goTaiwan })
</script>
