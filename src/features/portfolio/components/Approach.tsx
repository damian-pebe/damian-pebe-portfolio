import { ArrowUpRight, Asterisk, Layers3, Orbit } from "lucide-react";
import type { Copy } from "@/i18n/copy";
import { Reveal } from "./Reveal";
const icons = [Layers3, Orbit, Asterisk];
export function Approach({ t }: { t: Copy }) {
  return (
    <section
      className="approach section shell"
      id="approach"
      aria-labelledby="approach-title"
    >
      <Reveal>
        <p className="eyebrow">{t.approach.eyebrow}</p>
        <div className="approach-heading">
          <h2 id="approach-title">{t.approach.title}</h2>
          <p>{t.approach.description}</p>
        </div>
      </Reveal>
      <div className="approach-grid">
        {t.approach.items.map((item, index) => {
          const Icon = icons[index];
          return (
            <Reveal
              className="approach-item"
              key={item.title}
              delay={index * 0.06}
            >
              <div className="approach-icon">
                <Icon size={28} strokeWidth={1.3} />
                <span>0{index + 1}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="eyebrow">{item.tag}</span>
            </Reveal>
          );
        })}
      </div>
      <div className="built-with">
        <span>React · Next.js · TypeScript · Python · Rust · Cloud</span>
        <a
          href="https://clyra.dev/portfolio"
          target="_blank"
          rel="noopener noreferrer"
        >
          Clyra
          <ArrowUpRight size={16} />
        </a>
      </div>
    </section>
  );
}
