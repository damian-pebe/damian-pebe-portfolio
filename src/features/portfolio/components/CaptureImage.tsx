import Image, { type ImageProps } from "next/image";
import { useRef } from "react";
import { useSite } from "@/features/site/SiteContext";
import type { Theme } from "@/features/theme/useTheme";
import { useAlternateCapture } from "../hooks/useAlternateCapture";
import { captureSrcSet } from "../utils/responsiveImages";

export function CaptureImage({
  sources,
  alt,
  sizes = "100vw",
  ...props
}: Omit<ImageProps, "src"> & { sources: Record<Theme, string> }) {
  const { theme } = useSite();
  const ref = useRef<HTMLImageElement>(null);
  const paired = sources.light !== sources.dark;
  useAlternateCapture(
    ref,
    paired ? sources[theme === "light" ? "dark" : "light"] : undefined,
    paired
      ? captureSrcSet(sources[theme === "light" ? "dark" : "light"])
      : undefined,
    sizes,
  );
  return (
    <picture>
      <source srcSet={captureSrcSet(sources[theme])} sizes={sizes} />
      <Image
        {...props}
        ref={ref}
        alt={alt}
        src={sources[theme]}
        data-theme-image={paired ? "" : undefined}
        decoding="sync"
      />
    </picture>
  );
}
