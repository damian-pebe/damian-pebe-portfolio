import { m, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useSite } from "../SiteContext";
export function ThemeToggle() {
  const { theme, toggleTheme, themeChanging, languageChanging, t } = useSite();
  const reduced = useReducedMotion();
  const light = theme === "light";
  return (
    <button
      className="theme-switch icon-button"
      aria-label={light ? t.theme.dark : t.theme.light}
      disabled={themeChanging || languageChanging}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        void toggleTheme({
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2,
        });
      }}
    >
      <m.span
        className="theme-icon"
        initial={false}
        animate={{
          rotate: light ? 180 : 0,
          scale: themeChanging && !reduced ? [1, 0.82, 1] : 1,
        }}
        transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden="true"
      >
        <Sun size={17} className={light ? "is-hidden" : ""} />
        <Moon size={16} className={light ? "" : "is-hidden"} />
      </m.span>
    </button>
  );
}
