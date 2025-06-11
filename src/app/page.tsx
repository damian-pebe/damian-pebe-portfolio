import Footer from "./Components/Footer";
import HomePage from "./Components/HomePage";
import Projects from "./Components/Projects";
import Showcase from "./Components/Showcase";
import TitleCarousel from "./Components/TitleCarousel";
import InfiniteCarouselComponent from "./Components/CarouselTechs";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between h-full w-full">
      <HomePage />
      <Showcase />
      <TitleCarousel />
      <InfiniteCarouselComponent />
      <Projects />
      <Footer />
    </div>
  );
}
