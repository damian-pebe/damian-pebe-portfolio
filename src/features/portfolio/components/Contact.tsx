import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  Copy as CopyIcon,
  Github,
  Linkedin,
} from "lucide-react";
import type { Copy } from "@/i18n/copy";
import { site } from "@/lib/site";
import { LanguageText } from "../effects/LanguageText";
import { Reveal } from "./Reveal";
export function Contact({ t }: { t: Copy }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle",
  );
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copyEmail() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(site.email);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
    timer.current = setTimeout(() => setCopyStatus("idle"), 3500);
  }
  return (
    <>
      <section
        id="contact"
        className="contact section"
        aria-labelledby="contact-title"
      >
        <div className="contact-orbit" aria-hidden="true" />
        <div className="shell">
          <Reveal>
            <p className="eyebrow">{t.contact.eyebrow}</p>
            <h2 id="contact-title">
              <LanguageText effect="turn" align="center">
                {t.contact.title}
              </LanguageText>
            </h2>
            <p className="contact-intro">
              <LanguageText effect="fade" align="center">
                {t.contact.text}
              </LanguageText>
            </p>
            <div className="contact-actions">
              <a href={"mailto:" + site.email} className="contact-email">
                {site.email}
                <ArrowUpRight />
              </a>
              <button
                className="icon-button"
                onClick={copyEmail}
                aria-label={
                  copyStatus === "copied" ? t.contact.copied : t.contact.copy
                }
              >
                {copyStatus === "copied" ? (
                  <Check size={19} />
                ) : (
                  <CopyIcon size={18} />
                )}
              </button>
            </div>
            <p className="copy-status" role="status">
              {copyStatus === "copied"
                ? t.contact.copied
                : copyStatus === "failed"
                  ? t.contact.failed
                  : ""}
            </p>
          </Reveal>
        </div>
      </section>
      <footer className="site-footer shell">
        <a className="footer-brand" href="#top">
          damian pebe<span>✳</span>
        </a>
        <p>
          © {new Date().getFullYear()} Damian Pérez. {t.contact.footer}
        </p>
        <div>
          <a
            className="icon-button"
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.contact.github}
          >
            <Github size={19} />
          </a>
          <a
            className="icon-button"
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.contact.linkedin}
          >
            <Linkedin size={19} />
          </a>
          <a className="icon-button" href="#top" aria-label={t.contact.back}>
            <ArrowUp size={19} />
          </a>
        </div>
      </footer>
    </>
  );
}
