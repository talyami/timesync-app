// Major world timezones with friendly names
export const TIMEZONES = [
  { value: 'Pacific/Honolulu', label: 'Hawaii (HST)', offset: -10 },
  { value: 'America/Anchorage', label: 'Alaska (AKST)', offset: -9 },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST)', offset: -8 },
  { value: 'America/Denver', label: 'Denver (MST)', offset: -7 },
  { value: 'America/Chicago', label: 'Chicago (CST)', offset: -6 },
  { value: 'America/New_York', label: 'New York (EST)', offset: -5 },
  { value: 'America/Toronto', label: 'Toronto (EST)', offset: -5 },
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)', offset: -3 },
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires (ART)', offset: -3 },
  { value: 'Atlantic/Reykjavik', label: 'Reykjavik (GMT)', offset: 0 },
  { value: 'Europe/London', label: 'London (GMT)', offset: 0 },
  { value: 'Europe/Dublin', label: 'Dublin (GMT)', offset: 0 },
  { value: 'Europe/Lisbon', label: 'Lisbon (WET)', offset: 0 },
  { value: 'Europe/Paris', label: 'Paris (CET)', offset: 1 },
  { value: 'Europe/Berlin', label: 'Berlin (CET)', offset: 1 },
  { value: 'Europe/Amsterdam', label: 'Amsterdam (CET)', offset: 1 },
  { value: 'Europe/Madrid', label: 'Madrid (CET)', offset: 1 },
  { value: 'Europe/Rome', label: 'Rome (CET)', offset: 1 },
  { value: 'Europe/Stockholm', label: 'Stockholm (CET)', offset: 1 },
  { value: 'Europe/Warsaw', label: 'Warsaw (CET)', offset: 1 },
  { value: 'Europe/Athens', label: 'Athens (EET)', offset: 2 },
  { value: 'Europe/Helsinki', label: 'Helsinki (EET)', offset: 2 },
  { value: 'Europe/Bucharest', label: 'Bucharest (EET)', offset: 2 },
  { value: 'Europe/Kiev', label: 'Kyiv (EET)', offset: 2 },
  { value: 'Africa/Cairo', label: 'Cairo (EET)', offset: 2 },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)', offset: 2 },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)', offset: 3 },
  { value: 'Europe/Istanbul', label: 'Istanbul (TRT)', offset: 3 },
  { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: 4 },
  { value: 'Asia/Karachi', label: 'Karachi (PKT)', offset: 5 },
  { value: 'Asia/Kolkata', label: 'Mumbai/Delhi (IST)', offset: 5.5 },
  { value: 'Asia/Dhaka', label: 'Dhaka (BST)', offset: 6 },
  { value: 'Asia/Bangkok', label: 'Bangkok (ICT)', offset: 7 },
  { value: 'Asia/Jakarta', label: 'Jakarta (WIB)', offset: 7 },
  { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh (ICT)', offset: 7 },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)', offset: 8 },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)', offset: 8 },
  { value: 'Asia/Shanghai', label: 'Shanghai/Beijing (CST)', offset: 8 },
  { value: 'Asia/Taipei', label: 'Taipei (CST)', offset: 8 },
  { value: 'Asia/Manila', label: 'Manila (PHT)', offset: 8 },
  { value: 'Asia/Seoul', label: 'Seoul (KST)', offset: 9 },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: 9 },
  { value: 'Australia/Perth', label: 'Perth (AWST)', offset: 8 },
  { value: 'Australia/Adelaide', label: 'Adelaide (ACST)', offset: 9.5 },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)', offset: 10 },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST)', offset: 10 },
  { value: 'Australia/Brisbane', label: 'Brisbane (AEST)', offset: 10 },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST)', offset: 12 },
  { value: 'Pacific/Fiji', label: 'Fiji (FJT)', offset: 12 },
];

export const AVATAR_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#d946ef', // Fuchsia
  '#ec4899', // Pink
  '#f43f5e', // Rose
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
];

export function getRandomColor() {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatTimeInZone(date, timezone) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  }).format(date);
}

export function formatDateInZone(date, timezone) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: timezone,
  }).format(date);
}

export function getHourInZone(date, timezone) {
  return parseInt(
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: timezone,
    }).format(date)
  );
}

export function getWorkingStatus(hour) {
  if (hour >= 9 && hour < 17) return { status: 'working', label: 'Working hours' };
  if (hour >= 17 && hour < 22) return { status: 'late', label: 'Evening' };
  if (hour >= 22 || hour < 6) return { status: 'sleeping', label: 'Night time' };
  return { status: 'late', label: 'Early morning' };
}

export function getOffsetFromUTC(timezone) {
  const now = new Date();
  const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  return (tzDate - utcDate) / (1000 * 60 * 60);
}

export function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// Encode room data to URL-safe string
export function encodeRoomData(room) {
  const json = JSON.stringify(room);
  return btoa(encodeURIComponent(json));
}

// Decode room data from URL
export function decodeRoomData(encoded) {
  try {
    const json = decodeURIComponent(atob(encoded));
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}
