import { Hero } from "./components/Hero";
import { projects } from "@/features/portfolio/data/projects";
const highlights = ["omnicube", "agentos"].map((id) =>
  projects.find((project) => project.id === id)!,
);
export function Landing() {
  return <Hero highlights={highlights} />;
}
