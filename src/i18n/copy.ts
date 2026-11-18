import { es } from "./locales/es";
import { en } from "./locales/en";
export type Locale = "es" | "en";
export type Copy = typeof es;
export const copy: Record<Locale, Copy> = { es, en };
