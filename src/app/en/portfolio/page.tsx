import { Portfolio } from "@/features/portfolio/Portfolio";
import { pageMetadata } from "@/lib/pageMetadata";
export const metadata = pageMetadata("en", "portfolio");
export default function Page() {
  return <Portfolio />;
}
