// frontend/scripts/generate-sitemap.mjs
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { writeFileSync } from 'node:fs'
import { SitemapStream, streamToPromise } from 'sitemap'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SITE_URL = process.env.SITE_URL || 'https://ntust-empty-classroom.vercel.app/'

// 列出「可被索引」的路由（不要把無限參數頁面列進來）
const routes = [
  { url: '/',        priority: 1.0 },
  { url: '/buildings',    priority: 0.8 },
  { url: '/availability', priority: 0.8 },
  { url: '/room',    priority: 0.8 },
  { url: '/visit',    priority: 0.8 },
  { url: '/search',    priority: 0.8 },
]

const sm = new SitemapStream({ hostname: SITE_URL })
routes.forEach(r => sm.write({ ...r, changefreq: 'daily', lastmod: new Date() }))
sm.end()

const xml = await streamToPromise(sm)
const out = resolve(__dirname, '../public/sitemap.xml') // ← 指向 frontend/public
writeFileSync(out, xml.toString())
console.log('sitemap generated →', out)
