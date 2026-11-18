import { createContext, useContext } from "react";
import type { Copy, Locale } from "@/i18n/copy";
import type { PageKind } from "@/features/navigation/routes";
import type { Theme } from "@/features/theme/useTheme";
import type { ThemeOrigin } from "@/features/theme/themeTransition";
export interface SitePreferences {
  locale: Locale;
  t: Copy;
  page: PageKind;
  theme: Theme;
  languageChanging: boolean;
  themeChanging: boolean;
  changeLocale: (locale: Locale) => Promise<void>;
  toggleTheme: (origin?: ThemeOrigin) => Promise<void>;
}
export const SiteContext = createContext<SitePreferences | null>(null);
export function useSite() {
  const value = useContext(SiteContext);
  if (!value) throw new Error("Site preferences require SiteShell");
  return value;
}
