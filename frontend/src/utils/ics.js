export function eventToICS(e){
  // Expect ISO strings; fallback to now
  const uid = (e.id || Math.random().toString(36).slice(2)) + '@tm-campus'
  const dtstart = toICSDate(e.datetimeStart)
  const dtend = e.datetimeEnd ? toICSDate(e.datetimeEnd) : toICSDate(addHours(new Date(e.datetimeStart || Date.now()), 2).toISOString())
  const title = escapeText(e.title || 'Toastmasters Event')
  const desc = escapeText(e.description || '')
  const loc = escapeText(e.venue || e.city || '')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TM Campus//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toICSDate(new Date().toISOString())}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${title}`,
    desc ? `DESCRIPTION:${desc}` : null,
    loc ? `LOCATION:${loc}` : null,
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n')
}

function toICSDate(iso){
  const d = new Date(iso)
  const YYYY = d.getUTCFullYear()
  const MM = String(d.getUTCMonth()+1).padStart(2,'0')
  const DD = String(d.getUTCDate()).padStart(2,'0')
  const HH = String(d.getUTCHours()).padStart(2,'0')
  const MI = String(d.getUTCMinutes()).padStart(2,'0')
  const SS = String(d.getUTCSeconds()).padStart(2,'0')
  return `${YYYY}${MM}${DD}T${HH}${MI}${SS}Z`
}
function addHours(date, hours){
  const d = new Date(date); d.setHours(d.getHours() + hours); return d
}
function escapeText(s){ return (s || '').replace(/[\n,;]/g, ' ') }
