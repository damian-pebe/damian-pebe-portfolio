"use client";
import { useSite } from "@/features/site/SiteContext";
import { Capabilities } from "@/features/site/Capabilities";
import { Hero } from "./components/Hero";
export function Landing() {
  const { t } = useSite();
  return (
    <>
      <Hero />
      <div className="landing-capabilities">
        <Capabilities t={t} />
      </div>
    </>
  );
}
