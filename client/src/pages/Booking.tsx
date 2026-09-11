/** Aperture Blue booking page: a calm, keyboard-friendly request flow that rewards decisive planning. */
import { useSearch } from "wouter";
import { BookingFlow } from "@/components/BookingFlow";
import { SiteShell } from "@/components/SiteShell";

export default function Booking() {
  const search = useSearch();
  const packageParam = new URLSearchParams(search).get("package");
  return <SiteShell><main className="bg-[#f4f7f8]"><BookingFlow initialPackage={packageParam} /></main></SiteShell>;
}
