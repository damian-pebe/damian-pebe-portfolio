import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-between h-[80vh] w-full">
      <div className="flex justify-center items-center w-full p-5 gap-x-16">
        <div className="w-full flex flex-row justify-end gap-x-2 items-center h-full">
          <Image
            className="rounded-full"
            src="/damianCrop.jpg"
            width={60}
            height={60}
            alt="Profile Picture"
          />
          <div className=" flex flex-col justify-start ">
            <h1 className="text-md text-black font-semibold">Damian Pebe</h1>
            <p className="text-xs text-gray-600">Full Stack Developer</p>
          </div>
        </div>
        <div className="w-full flex h-full text-black">
          <button className="h-10 w-10 bg-white rounded-sm"></button>
        </div>
      </div>
    </div>
  );
}
