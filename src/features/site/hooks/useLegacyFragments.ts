import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/i18n/copy";
import { pageHref } from "@/features/navigation/routes";
import { scrollToSection } from "@/features/navigation/scrollToSection";
/** Existing bookmarks still work; all new navigation uses clean paths. */
export function useLegacyFragments(locale: Locale) {
  const router = useRouter();
  useEffect(() => {
    const migrate = () => {
      const fragment = location.hash.slice(1);
      if (!fragment) return;
      history.replaceState(
        history.state,
        "",
        location.pathname + location.search,
      );
      if (fragment === "work") router.replace(pageHref("portfolio", locale));
      else if (["contact", "approach", "main"].includes(fragment))
        scrollToSection(fragment);
      else window.scrollTo({ top: 0, behavior: "instant" });
    };
    migrate();
    window.addEventListener("hashchange", migrate);
    return () => window.removeEventListener("hashchange", migrate);
  }, [locale, router]);
}
