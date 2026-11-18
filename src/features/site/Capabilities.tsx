import { ArrowUpRight, Boxes, Code2, Orbit, PenTool } from "lucide-react";
import type { Copy } from "@/i18n/copy";
import { LanguageText } from "@/features/language/LanguageText";
const icons = [Code2, Orbit, Boxes, PenTool];
export function Capabilities({ t }: { t: Copy }) {
  return (
    <section
      id="approach"
      className="approach"
      aria-labelledby="approach-title"
    >
      <div className="approach-header">
        <h2 id="approach-title">
          <LanguageText>{t.approach.eyebrow}</LanguageText>
        </h2>
        <a
          href="https://clyra.dev/portfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Clyra
          <ArrowUpRight size={14} />
        </a>
      </div>
      <div className="capability-strip">
        {t.approach.capabilities.map((label, index) => {
          const Icon = icons[index];
          return (
            <span key={index}>
              <Icon size={18} strokeWidth={1.25} />
              <LanguageText>{label}</LanguageText>
            </span>
          );
        })}
      </div>
    </section>
  );
}
