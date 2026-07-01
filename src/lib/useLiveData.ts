import { useEffect, useRef, useState } from "react";

/**
 * Generic live-data hook shared by every dashboard.
 *
 * Today `fetcher` is a synchronous mock-data generator that jitters
 * baseline numbers to simulate sensor/IoT noise. When the real data
 * pipeline is wired up, `fetcher` becomes `() => fetch('/api/...')`
 * (or a websocket subscription) — no dashboard/component code changes.
 */
export function useLiveData<T>(fetcher: () => T | Promise<T>, intervalMs = 30_000) {
  const [data, setData] = useState<T | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;

    const tick = async () => {
      const result = await fetcherRef.current();
      if (!cancelled) {
        setData(result);
        setLastUpdated(new Date());
      }
    };

    tick();
    const id = window.setInterval(tick, intervalMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [intervalMs]);

  return { data, lastUpdated };
}

/** Ticking wall-clock, used by the topbar to mirror the "real time" mockups. */
export function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

/** Small deterministic jitter helper so live refreshes feel like real sensor noise, not random flicker. */
export function jitter(base: number, spread: number, decimals = 1) {
  const value = base + (Math.random() * 2 - 1) * spread;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
