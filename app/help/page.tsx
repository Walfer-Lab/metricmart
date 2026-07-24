import HelpPage from "./HelpPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Need help?",
  description: "Send us your message now",
  keywords: ["help", "support", "contact", "metricmart", "metricmart.in"],
};

export default function Page() {
  return (
    <HelpPage />
  )
}