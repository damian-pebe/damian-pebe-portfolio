import { useHeroShader } from "../hooks/useHeroShader";
export function HeroShader() {
  const ref = useHeroShader();
  return (
    <div className="hero-shader" aria-hidden="true">
      <canvas ref={ref} data-effect="clyra-radial" data-running="false" />
    </div>
  );
}
