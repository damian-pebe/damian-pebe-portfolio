export default function InfiniteCarouselComponent() {
  const logos = [
    "https://skillicons.dev/icons?i=js",
    "https://skillicons.dev/icons?i=ts",
    "https://skillicons.dev/icons?i=nextjs",
    "https://skillicons.dev/icons?i=react",
    "https://skillicons.dev/icons?i=tailwind",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    "https://skillicons.dev/icons?i=express",
    "https://skillicons.dev/icons?i=py",
    "https://skillicons.dev/icons?i=django",
    "https://skillicons.dev/icons?i=pytorch",
    "https://skillicons.dev/icons?i=tensorflow",
    "https://skillicons.dev/icons?i=flask",
    "https://skillicons.dev/icons?i=flutter",
    "https://skillicons.dev/icons?i=dart",
    "https://skillicons.dev/icons?i=figma",
    "https://skillicons.dev/icons?i=cpp",
    "https://skillicons.dev/icons?i=java",
    "https://skillicons.dev/icons?i=graphql",
    "https://skillicons.dev/icons?i=postgres",
    "https://skillicons.dev/icons?i=supabase",
    "https://skillicons.dev/icons?i=mysql",
    "https://skillicons.dev/icons?i=mongodb",
    "https://skillicons.dev/icons?i=firebase",
    "https://skillicons.dev/icons?i=gcp",
    "https://skillicons.dev/icons?i=aws",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg",
    "https://skillicons.dev/icons?i=git",
    "https://skillicons.dev/icons?i=github",
    "https://skillicons.dev/icons?i=docker",
    "https://skillicons.dev/icons?i=postman",
  ];
  return (
    <div className="relative w-full overflow-hidden py-6">
      <div className="flex animate-scroll whitespace-nowrap">
        {[...logos, ...logos, ...logos].map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Tech logo ${idx}`}
            className="h-12 sm:h-16 mx-4 sm:mx-6  transition-all duration-700 hover:-translate-y-2 hover:cursor-grab"
          />
        ))}
      </div>
              
    </div>
  );
}
