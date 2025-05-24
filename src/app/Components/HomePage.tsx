import Image from "next/image";
import { Linkedin, StarFill } from "react-bootstrap-icons";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-between h-[75vh] w-full">
      <Header />
      <HeroSection />
    </div>
  );
}

function Header() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full md:px-32 pt-4 px-2 md:p-8">
      <div className="group w-full flex flex-col md:flex-row justify-center gap-2 items-center h-full hover:cursor-pointer">
        <Image
          className="rounded-full group-hover:-rotate-6 duration-700"
          src="/damianCrop.jpg"
          width={60}
          height={60}
          alt="Profile Picture"
        />
        <div className="text-center md:text-left flex flex-col justify-start gap-1">
          <h1 className="text-2xl text-black font-ephesis tracking-widest group-hover:-translate-y-1 duration-700">
            Damian Pebe
          </h1>
          <p className="text-sm text-gray-600 font-poppins font-extralight group-hover:translate-y-1 duration-700">
            Full Stack Developer
          </p>
        </div>
      </div>
      <div className="flex flex-col md:hidden items-center justify-center gap-2">
        <div className="h-0.5 w-52 bg-black/60 rounded-sm my-3" />
      </div>

      <div className="w-full flex flex-row items-center justify-center gap-3 h-full text-black">
        <div className="hidden md:flex flex-row items-center gap-3 pr-5">
          <div className="relative">
            <div className="h-3 w-3 rounded-full bg-green-700 animate-pulse" />
            <div className="absolute -inset-1 h-5 w-5 rounded-full bg-green-500/40 animate-ping" />
          </div>
          <span className="text-sm  pr-5">Available</span>
          <div className="h-14 w-0.5 bg-black/60 rounded-sm " />
        </div>

        <button className="flex justify-center items-center h-10 w-10 bg-[#FAFAFA] rounded-lg shadow-lg shadow-black/30 hover:shadow-black/60 transform transition-all hover:-translate-y-2 hover:-translate-x-1 hover:-rotate-3 duration-300">
          {" "}
          <svg
            className="w-full h-full p-2.5"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="#000000"
            viewBox="0 0 256 256"
          >
            <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z"></path>
          </svg>{" "}
        </button>
        <button className="flex justify-center items-center h-10 w-10 bg-[#FAFAFA] rounded-lg shadow-lg shadow-black/30 hover:shadow-black/60 transform transition-all hover:-translate-y-2 duration-300">
          {" "}
          <Linkedin className="w-full h-full p-3" />{" "}
        </button>
        <button className="flex justify-center items-center h-10 w-10 bg-[#FAFAFA] rounded-lg shadow-lg shadow-black/30 hover:shadow-black/60 transform transition-all hover:-translate-y-2 hover:translate-x-1 hover:rotate-3 duration-300 ">
          {" "}
          <svg
            className="w-full h-full p-2.5"
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="#000000"
            viewBox="0 0 256 256"
          >
            <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
          </svg>{" "}
        </button>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 md:pt-14">
      <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center space-x-2 mb-6 hover:cursor-grab hover:-translate-y-2 transition duration-1000">
        <span className="text-black text-sm font-medium flex items-center justify-center h-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <StarFill key={index} />
          ))}
        </span>
        <span className="text-black text-sm font-careny font-bold items-center justify-center h-full pt-0.5">
          100+ Satisfied Customers
        </span>
      </div>

      <h1 className="text-5xl sm:text-7xl font-careny font-bold tracking-tight text-black leading-tight max-w-3xl">
        I craft websites <br />
        that hustle as hard <br />
        as you do
      </h1>

      <p className="text-gray-500 mt-6 max-w-md text-xl sm:text-base font-poppins">
        I design innovative solutions that captivate audiences,
        <br />
        and every interaction inspires action
      </p>

      <button className="mt-8 px-6 py-3 bg-black text-white rounded-lg text-base sm:text-lg font-plaster font-light shadow-lg shadow-black/20 hover:shadow-black/80 hover:-translate-y-3 transform duration-700 transition-all hover:tracking-widest">
        Contact Me
      </button>
    </div>
  );
}
