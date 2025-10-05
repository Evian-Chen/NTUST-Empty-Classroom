const API_BASE = import.meta.env.VITE_API_BASE || ''; // dev 無就走 proxy 的 /api

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