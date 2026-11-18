import { useMetalBackdrop } from "../hooks/useMetalBackdrop";
import { useSite } from "@/features/site/SiteContext";
export function MetalBackdrop() {
  const ref = useMetalBackdrop();
  const { page } = useSite();
  return (
    <div
      ref={ref}
      className="metal-backdrop"
      data-page={page}
      aria-hidden="true"
    />
  );
}
