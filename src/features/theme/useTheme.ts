import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { flushSync } from "react-dom";
import { revealTheme, type ThemeOrigin } from "./themeTransition";
export type Theme = "light" | "dark";
const preferenceKey = "portfolio-theme";
function readTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
function storedTheme(): Theme {
  try {
    return localStorage.getItem(preferenceKey) === "dark" ? "dark" : "light";
  } catch {
    return readTheme();
  }
}
function subscribe(notify: () => void) {
  const syncStorage = (event: StorageEvent) => {
    if (event.key !== preferenceKey && event.key !== null) return;
    document.documentElement.dataset.theme = storedTheme();
    notify();
  };
  window.addEventListener(preferenceKey, notify);
  window.addEventListener("storage", syncStorage);
  return () => {
    window.removeEventListener(preferenceKey, notify);
    window.removeEventListener("storage", syncStorage);
  };
}
export function useTheme(pathname: string) {
  const theme = useSyncExternalStore(
    subscribe,
    readTheme,
    () => "light" as Theme,
  );
  const [changing, setChanging] = useState(false);
  const busy = useRef(false);
  const active = useRef<ReturnType<typeof revealTheme> | null>(null);
  useEffect(() => () => active.current?.cancel(), [pathname]);
  const toggle = async (origin?: ThemeOrigin) => {
    if (busy.current) return;
    busy.current = true;
    setChanging(true);
    const next = theme === "light" ? "dark" : "light";
    const reveal = revealTheme(
      () =>
        flushSync(() => {
          document.documentElement.dataset.theme = next;
          try {
            localStorage.setItem(preferenceKey, next);
          } catch {
            /* Keep the session choice. */
          }
          window.dispatchEvent(new Event(preferenceKey));
        }),
      origin,
    );
    active.current = reveal;
    try {
      await reveal.finished;
    } finally {
      if (active.current === reveal) active.current = null;
      busy.current = false;
      setChanging(false);
    }
  };
  return { theme, changing, toggle };
}
