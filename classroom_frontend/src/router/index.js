import { createRouter, createWebHistory } from 'vue-router'


const routes = [
{ path: '/', name: 'building' },
{ path: '/date', name: 'date' },
{ path: '/weekday', name: 'weekday' },
{ path: '/room', name: 'room' }
]


const router = createRouter({
history: createWebHistory(),
routes
})


export default router