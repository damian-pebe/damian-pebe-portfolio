import { Landing } from "@/features/landing/Landing";
import { pageMetadata } from "@/lib/pageMetadata";
export const metadata = pageMetadata("en", "home");
export default function Page() {
  return <Landing />;
}
