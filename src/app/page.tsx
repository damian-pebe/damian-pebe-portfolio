import HomePage from "./Components/HomePage";
import Showcase from "./Components/Showcase";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between h-full w-full">
      <HomePage />
      <Showcase/>
    </div>
  );
}
