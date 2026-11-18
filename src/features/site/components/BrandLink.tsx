import Link from "next/link";
import { pageHref } from "@/features/navigation/routes";
import { scrollToSection } from "@/features/navigation/scrollToSection";
import { useSite } from "../SiteContext";
import { site } from "@/lib/site";
export function BrandLink({
  className,
  onNavigate,
}: {
  className: string;
  onNavigate?: () => void;
}) {
  const { locale, page } = useSite();
  return (
    <Link
      href={pageHref("home", locale)}
      className={className}
      aria-label={`${site.name} — ${locale === "es" ? "Inicio" : "Home"}`}
      onClick={(event) => {
        onNavigate?.();
        if (
          page === "home" &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey
        ) {
          event.preventDefault();
          scrollToSection("hero", true);
        }
      }}
    >
      {site.name}
    </Link>
  );
}
