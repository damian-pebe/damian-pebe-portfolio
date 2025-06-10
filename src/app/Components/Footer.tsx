import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { SOCIAL_LINKS } from "@/Environment/SocialsLinks";
import { Linkedin, Whatsapp } from "react-bootstrap-icons";

export default function Footer() {
  return (
    <footer className="text-[#121212] font-poppins">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16 px-8 py-20 pt-10 md:pt-20 text-sm">
        <Email />
        <SocialLinks />
      </div>

      <div className="pb-14 text-center text-[10vw] md:text-[7vw] leading-none font-careny">
        Full Stack Developer
      </div>
    </footer>
  );
}

function Email() {
  return (
    <div className="space-y-4">
      <p className="text-gray-600">Contact</p>
      <div className="flex items-center gap-1">
        <Link
          href={SOCIAL_LINKS.contact}
          target="_blank"
          className="group flex items-center border border-black/10 hover:cursor-pointer rounded-full p-2 transition-transform duration-500 hover:-translate-y-1"
        >
          <ArrowUpRightIcon
            size={28}
            className="bg-black text-white rounded-full p-1 transition-transform duration-700 group-hover:rotate-[360deg]"
          />
        </Link>
        <p className="text-[5vw] md:text-[1.5vw] font-light">damian.pebe@gmail.com</p>
      </div>
    </div>
  );
}
function SocialLinks() {
  return (
    <div className="w-full flex flex-row items-center justify-center gap-3 h-full text-black">
      <div className="hidden md:flex flex-row items-center gap-3 pr-5">
        <div className="relative">
          <div className="h-3 w-3 rounded-full bg-green-700 animate-pulse" />
          <div className="absolute -inset-1 h-5 w-5 rounded-full bg-green-500/40 animate-ping" />
        </div>
        <span className="text-sm  pr-5">Available</span>
        <div className="h-14 w-0.5 bg-black/60 rounded-sm " />
      </div>

      <Link
        href={SOCIAL_LINKS.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center h-10 w-10 bg-[#FAFAFA] rounded-lg shadow-lg shadow-black/30 hover:shadow-black/60 transform transition-all hover:-translate-y-2 hover:-translate-x-1 hover:-rotate-3 duration-300"
      >
        <svg
          className="w-full h-full p-2.5"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z"></path>
        </svg>
      </Link>
      <Link
        href={SOCIAL_LINKS.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center h-10 w-10 bg-[#FAFAFA] rounded-lg shadow-lg shadow-black/30 hover:shadow-black/60 transform transition-all hover:-translate-y-2 hover:-translate-x-1 hover:-rotate-2 duration-300"
      >
        <Linkedin className="w-full h-full p-3" />
      </Link>
      <Link
        href={SOCIAL_LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center h-10 w-10 bg-[#FAFAFA] rounded-lg shadow-lg shadow-black/30 hover:shadow-black/60 transform transition-all hover:-translate-y-2 duration-300"
      >
        <Whatsapp className="w-full h-full p-3" />
      </Link>
      <Link
        href={SOCIAL_LINKS.contact}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center h-10 w-10 bg-[#FAFAFA] rounded-lg shadow-lg shadow-black/30 hover:shadow-black/60 transform transition-all hover:-translate-y-2 hover:translate-x-1 hover:rotate-2 duration-300"
      >
        <svg
          className="w-full h-full p-2.5 bi bi-envelope-at"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M2 2a2 2 0 0 0-2 2v8.01A2 2 0 0 0 2 14h5.5a.5.5 0 0 0 0-1H2a1 1 0 0 1-.966-.741l5.64-3.471L8 9.583l7-4.2V8.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2zm3.708 6.208L1 11.105V5.383zM1 4.217V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v.217l-7 4.2z" />
          <path d="M14.247 14.269c1.01 0 1.587-.857 1.587-2.025v-.21C15.834 10.43 14.64 9 12.52 9h-.035C10.42 9 9 10.36 9 12.432v.214C9 14.82 10.438 16 12.358 16h.044c.594 0 1.018-.074 1.237-.175v-.73c-.245.11-.673.18-1.18.18h-.044c-1.334 0-2.571-.788-2.571-2.655v-.157c0-1.657 1.058-2.724 2.64-2.724h.04c1.535 0 2.484 1.05 2.484 2.326v.118c0 .975-.324 1.39-.639 1.39-.232 0-.41-.148-.41-.42v-2.19h-.906v.569h-.03c-.084-.298-.368-.63-.954-.63-.778 0-1.259.555-1.259 1.4v.528c0 .892.49 1.434 1.26 1.434.471 0 .896-.227 1.014-.643h.043c.118.42.617.648 1.12.648m-2.453-1.588v-.227c0-.546.227-.791.573-.791.297 0 .572.192.572.708v.367c0 .573-.253.744-.564.744-.354 0-.581-.215-.581-.8Z" />
        </svg>
      </Link>
      <Link
        href={SOCIAL_LINKS.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center h-10 w-10 bg-[#FAFAFA] rounded-lg shadow-lg shadow-black/30 hover:shadow-black/60 transform transition-all hover:-translate-y-2 hover:translate-x-1 hover:rotate-3 duration-300 "
      >
        <svg
          className="w-full h-full p-2.5"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
        </svg>
      </Link>
    </div>
  );
}
