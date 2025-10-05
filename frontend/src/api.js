const API_BASE = import.meta.env.VITE_API_BASE || 'api'; // dev 無就走 proxy 的 /api

export async function getBuildings() {
  const res = await fetch(`${API_BASE}/buildings`);
  if (!res.ok) throw new Error("Failed to load buildings");
  return res.json();
}
export async function getAvailability(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/availability?${qs}`);
  if (res.status == 400) {
    return res.json();
  }
  if (!res.ok) throw new Error("Failed to load availability");
  return res.json();
}
export async function getWeekAvailability(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/availability/week?${qs}`);
  if (!res.ok) throw new Error("Failed to load week availability");
  return res.json();
}
export async function getRoomDetail(roomKey, weekday) {
  let url = `${API_BASE}/room/${encodeURIComponent(roomKey)}`;
  
  if (weekday) {
    const params = new URLSearchParams({ weekday: weekday });
    url += `?${params.toString()}`;
  }
  
  const res = await fetch(url);
  if (res.status == 400) {
    return res.json();
  }
  if (!res.ok) throw new Error("Failed to load room detail");
  return res.json();
}
export async function getHoliday(date) {
  const res = await fetch(`${API_BASE}/calendar/${encodeURIComponent(date)}`);
  if (!res.ok) throw new Error("Failed to load calendar");
  return res.json();
}
export async function postSearchCount() {
  const res = await fetch(`${API_BASE}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ date: new Date() })
  });
  if (!res.ok) throw new Error("Failed to post search count");
  return res.json();
}
export async function getSearchCount() {
  const res = await fetch(`${API_BASE}/search/count`);
  if (!res.ok) throw new Error("Failed to get search count");
  return res.json();
}