import { Code2, PenTool, Orbit } from "lucide-react";
import { LanguageText } from "@/features/language/LanguageText";
import { useSite } from "@/features/site/SiteContext";

const icons = [Code2, PenTool, Orbit];

export function HeroBadges() {
  const { t } = useSite();
  return (
    <ul className="hero-badges" aria-label={t.hero.specialties}>
      {icons.map((Icon, index) => (
        <li className="hero-badge" key={index}>
          <Icon size={12} strokeWidth={1.5} aria-hidden="true" />
          <LanguageText effect="wipe">{t.hero.badges[index]}</LanguageText>
        </li>
      ))}
    </ul>
  );
}
