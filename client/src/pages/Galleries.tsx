/** Aperture Blue galleries: private delivery laid out as a staggered visual archive rather than a product grid. */
import { useState } from "react";
import { ArrowUpRight, LockKeyhole } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { GalleryViewer, type Gallery } from "@/components/GalleryViewer";
const galleries: Gallery[] = [
  { id: "elena-micah", names: "Elena + Micah", event: "Wedding day", date: "May 30, 2026", deliveryAt: Date.now() + 1000 * 60 * 60 * 38, included: 520, coverClass: "cover-wedding" },
  { id: "rowan", names: "Rowan", event: "Directed editorial", date: "April 18, 2026", deliveryAt: Date.now() - 1000 * 60 * 60 * 24 * 5, included: 75, coverClass: "cover-editorial" },
  { id: "mara", names: "Mara + Theo", event: "Light study", date: "March 8, 2026", deliveryAt: Date.now() - 1000 * 60 * 60 * 24 * 20, included: 20, coverClass: "cover-portrait" },
];
export default function Galleries() {
  const [active, setActive] = useState<Gallery | null>(null);
  return <SiteShell><main><section className="px-5 pb-10 pt-16 md:px-9 md:pb-16 md:pt-24"><div className="mx-auto max-w-[1440px]"><div className="frame-rule"><p className="eyebrow text-[#2783a8]">Index / client galleries</p><div className="mt-3 grid gap-6 lg:grid-cols-[1.08fr_.92fr]"><h1 className="text-5xl font-extrabold leading-[.92] tracking-[-.085em] md:text-7xl">A quieter place for the finished work.</h1><div className="self-end text-sm leading-6 text-[#142128]/67">Each gallery is private to the people in it, with clear delivery timing, your included image count, and optional tangible pieces when you are ready.</div></div></div></div></section>
    <section className="px-5 pb-20 md:px-9 md:pb-28"><div className="mx-auto grid max-w-[1440px] gap-x-5 gap-y-9 md:grid-cols-12">{galleries.map((gallery, index) => <button key={gallery.id} onClick={() => setActive(gallery)} className={`group text-left ${index === 0 ? "md:col-span-6" : index === 1 ? "md:col-span-4 md:mt-20" : "md:col-span-5 md:col-start-7"}`}><div className={`gallery-cover ${gallery.coverClass}`}><div className="absolute inset-0 bg-gradient-to-t from-[#142128]/75 to-transparent" /><div className="absolute left-0 top-4 bg-[#f4f7f8] px-3 py-2 font-mono text-[10px] font-bold tracking-[.1em] text-[#2783a8]">FRAME 0{index + 1}</div><div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white"><div><p className="eyebrow text-[#b8e2ee]">Private gallery</p><p className="mt-1 text-lg font-extrabold tracking-[-.04em]">{gallery.names}</p></div><ArrowUpRight size={18} /></div></div><div className="frame-stack flex justify-between gap-5 py-4"><div><div className="flex items-center gap-2 text-xs font-bold text-[#142128]/60"><LockKeyhole size={13} className="text-[#2783a8]" /> {gallery.event}</div><p className="mt-3 max-w-sm text-sm leading-6 text-[#142128]/67">Open the private gallery for delivery timing, included images, and tangible extras.</p></div><span className="aperture-tab mt-1 h-2 w-4 shrink-0" /></div></button>)}</div></section>
    {active && <GalleryViewer gallery={active} onClose={() => setActive(null)} />}
  </main></SiteShell>;
}
