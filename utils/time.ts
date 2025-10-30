export type HHmm = `${number}${number}:${number}${number}`;

// Parse "HH:mm" into minutes since midnight
export function parseHHmm(value: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return NaN;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return NaN;
  return h * 60 + min;
}

// Difference in minutes from now to target "HH:mm" today (negative if past)
export function diffNowMinutes(target: string): number {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const targetMinutes = parseHHmm(target);
  if (Number.isNaN(targetMinutes)) return NaN;
  return targetMinutes - nowMinutes;
}

export type PrayerKey = 'subuh' | 'terbit' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';
export interface PrayerTime { key: PrayerKey; label: string; time: HHmm; }

// Find first item with time after now; if none, return last
export function findUpcoming(prayers: PrayerTime[]): PrayerKey | null {
  const now = new Date();
  const nowM = now.getHours() * 60 + now.getMinutes();
  for (const p of prayers) {
    const m = parseHHmm(p.time);
    if (!Number.isNaN(m) && m >= nowM) return p.key;
  }
  return prayers.length ? prayers[prayers.length - 1].key : null;
}

// Format a simple countdown label; placeholder for real timer
export function formatEtaLabel(minutesAhead: number): string {
  if (Number.isNaN(minutesAhead)) return '';
  if (minutesAhead <= 0) return 'Sudah Masuk Waktu';
  if (minutesAhead < 60) return `${minutesAhead}m`;
  const h = Math.floor(minutesAhead / 60);
  const m = minutesAhead % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

// Real-time ETA label updater for client components
// Refresh every `refreshMs` (default 30s) to avoid heavy updates
import { useEffect, useState } from 'react';

export function useEtaLabel(target: string | null | undefined, refreshMs = 30_000): string {
  const compute = () => {
    if (!target) return '';
    const diff = diffNowMinutes(target);
    return formatEtaLabel(diff);
  };
  const [label, setLabel] = useState<string>(compute());

  useEffect(() => {
    setLabel(compute());
    const id = setInterval(() => setLabel(compute()), refreshMs);
    return () => clearInterval(id);
  }, [target, refreshMs]);

  return label;
}
