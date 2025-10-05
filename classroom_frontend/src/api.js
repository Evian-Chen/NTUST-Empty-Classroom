export async function getBuildings() {
  const res = await fetch("/api/buildings");
  if (!res.ok) throw new Error("Failed to load buildings");
  return res.json();
}
export async function getAvailability(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/availability?${qs}`);
  if (res.status == 400) {
    return res.json();
  }
  if (!res.ok) throw new Error("Failed to load availability");
  return res.json();
}
export async function getWeekAvailability(params) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`/api/availability/week?${qs}`);
  if (!res.ok) throw new Error("Failed to load week availability");
  return res.json();
}
export async function getRoomDetail(roomKey, weekday) {
  let url = `/api/room/${encodeURIComponent(roomKey)}`;
  
  if (weekday) {
    const params = new URLSearchParams({ weekday: weekday });
    url += `?${params.toString()}`;
  }
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load room detail");
  return res.json();
}
export async function getHoliday(date) {
  const res = await fetch(`/api/calendar/${encodeURIComponent(date)}`);
  if (!res.ok) throw new Error("Failed to load calendar");
  return res.json();
}
export async function getLikes() {
  const res = await fetch("/api/site/likes");
  if (!res.ok) throw new Error("Failed to load likes");
  return res.json();
}
export async function postLike() {
  const res = await fetch("/api/site/like", { method: "POST" });
  if (!res.ok) throw new Error("Failed to like");
  return res.json();
}
