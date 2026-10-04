import { useSyncExternalStore } from "react";

/*
 * Small external stores read with useSyncExternalStore, so browser-only state (saved
 * preferences, the intro gate) never has to be copied into React state inside an effect.
 * Server renders always see the fallback; the client snapshot takes over after hydration.
 */

const listeners = new Map<string, Set<() => void>>();

export function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
  listeners.get(key)?.forEach((notify) => notify());
}

/** A localStorage value that updates on writeStored() and on changes from other tabs. */
export function useStored(key: string): string | null {
  return useSyncExternalStore(
    (notify) => {
      const set = listeners.get(key) ?? new Set();
      set.add(notify);
      listeners.set(key, set);
      const onStorage = (e: StorageEvent) => e.key === key && notify();
      window.addEventListener("storage", onStorage);
      return () => {
        set.delete(notify);
        window.removeEventListener("storage", onStorage);
      };
    },
    () => readStored(key),
    () => null
  );
}

const noSubscribe = () => () => {};

/** True when the inline gate script switched the intro off before first paint. */
export function useIntroOff(): boolean {
  return useSyncExternalStore(
    noSubscribe,
    () => document.documentElement.dataset.intro === "off",
    () => false
  );
}
