import { useEffect, useSyncExternalStore } from "react";
export type Theme = "light" | "dark";
const eventName = "portfolio-theme";
function readTheme(): Theme {
  try {
    return localStorage.getItem(eventName) === "dark" ? "dark" : "light";
  } catch {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }
}
function subscribe(notify: () => void) {
  window.addEventListener(eventName, notify);
  window.addEventListener("storage", notify);
  return () => {
    window.removeEventListener(eventName, notify);
    window.removeEventListener("storage", notify);
  };
}
export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    readTheme,
    () => "light" as Theme,
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(eventName, next);
    } catch {
      /* Session-only choice when storage is unavailable. */
    }
    window.dispatchEvent(new Event(eventName));
  };
  return { theme, toggle };
}
