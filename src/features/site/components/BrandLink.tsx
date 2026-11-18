import Link from "next/link";
import { pageHref } from "@/features/navigation/routes";
import { scrollToSection } from "@/features/navigation/scrollToSection";
import { useSite } from "../SiteContext";
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
      aria-label={
        locale === "es" ? "damian pérez — Inicio" : "damian pérez — Home"
      }
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
      damian pérez<span aria-hidden="true">.</span>
    </Link>
  );
}
