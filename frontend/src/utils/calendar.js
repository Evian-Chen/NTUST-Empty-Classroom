// Simple helpers to create Google Calendar links and .ics files from Event objects
// Expected Event shape: { id, title, datetimeStart, datetimeEnd, city, venue, onlineLink, description, hostName }
function pad(n){ return String(n).padStart(2, '0') }

function toUTCStringNoSep(d){
  // returns YYYYMMDDTHHMMSSZ in UTC
  const dt = new Date(d)
  const y = dt.getUTCFullYear()
  const m = pad(dt.getUTCMonth()+1)
  const day = pad(dt.getUTCDate())
  const hh = pad(dt.getUTCHours())
  const mm = pad(dt.getUTCMinutes())
  const ss = pad(dt.getUTCSeconds())
  return `${y}${m}${day}T${hh}${mm}${ss}Z`
}

export function googleCalendarUrl(ev){
  const text = encodeURIComponent(ev.title || 'Event')
  const dates = `${toUTCStringNoSep(ev.datetimeStart)}/${toUTCStringNoSep(ev.datetimeEnd || ev.datetimeStart)}`
  const detailsParts = [
    ev.description || '',
    ev.hostName ? `Host: ${ev.hostName}` : '',
    ev.onlineLink ? `Online: ${ev.onlineLink}` : '',
  ].filter(Boolean)
  const details = encodeURIComponent(detailsParts.join('\n'))
  const location = encodeURIComponent([ev.venue, ev.city].filter(Boolean).join(', '))
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${location}`
}

export function buildICS(ev){
  // Minimal iCalendar content (UTC times)
  const uid = ev.id || `${Date.now()}@tm-campus`
  const dtstamp = toUTCStringNoSep(new Date())
  const dtstart = toUTCStringNoSep(ev.datetimeStart)
  const dtend = toUTCStringNoSep(ev.datetimeEnd || ev.datetimeStart)
  const summary = (ev.title || 'Event').replace(/\n/g, ' ')
  const descParts = [
    ev.description || '',
    ev.hostName ? `Host: ${ev.hostName}` : '',
    ev.onlineLink ? `Online: ${ev.onlineLink}` : '',
  ].filter(Boolean)
  const description = descParts.join('\n').replace(/\r?\n/g, '\n')
  const location = [ev.venue, ev.city].filter(Boolean).join(', ')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TM Campus//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}

export function downloadICS(ev){
  const blob = new Blob([buildICS(ev)], { type: 'text/calendar;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = (ev.title || 'event') + '.ics'
  document.body.appendChild(a)
  a.click()
  URL.revokeObjectURL(a.href)
  a.remove()
}
