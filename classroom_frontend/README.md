# Toastmasters Campus Committee — Frontend (Vue 3 + Vite, JavaScript)

A starter for the Campus Committee website to connect student clubs with community/corporate clubs.

## Tech
- Vue 3 + Vite (JavaScript)
- Vue Router, Pinia
- Tailwind CSS
- Axios (with auth interceptor)

## Getting Started
```bash
npm i
cp .env.sample .env
npm run dev
```
The dev server proxies `/api` to `http://localhost:3000` (configure in `vite.config.js`).

## Structure
- `src/pages/*` route pages
- `src/stores/*` Pinia stores
- `src/components/*` shared components
- `src/utils/http.js` Axios instance

## Next Steps
- Wire real endpoints for clubs/events/advisors/requests
- Add map (Leaflet or Google Maps) to Directory page
- Implement Calendar view in Events
- Build Admin CMS tables and Kanban
