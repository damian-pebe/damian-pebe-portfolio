import { useHeroShader } from "../hooks/useHeroShader";
export function HeroShader() {
  const ref = useHeroShader();
  return <div ref={ref} className="hero-shader" aria-hidden="true" />;
}
