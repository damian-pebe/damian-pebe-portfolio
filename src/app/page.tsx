import Footer from "./Components/Footer";
import HomePage from "./Components/HomePage";
import Projects from "./Components/Projects";
import Showcase from "./Components/Showcase";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between h-full w-full">
      <HomePage />
      <Showcase/>
      <Projects/>
      <Footer/>
    </div>
  );
}
