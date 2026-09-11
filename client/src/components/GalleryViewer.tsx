/**
 * Aperture Blue client gallery: private delivery is presented as a composed, tangible experience.
 */
import { useEffect, useState } from "react";
import { Check, Download, ImagePlus, LockKeyhole, PackageOpen, X } from "lucide-react";

const albumUrl = "/images/halcyon-gallery-album_f740f42e.jpg";

export type Gallery = { id: string; names: string; event: string; date: string; deliveryAt: number; included: number; coverClass: string };

const deliveryTime = (timestamp: number) => {
  const remaining = Math.max(0, timestamp - Date.now());
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  return remaining ? `${days}d ${hours}h` : "Ready now";
};

export function GalleryViewer({ gallery, onClose }: { gallery: Gallery; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [ordered, setOrdered] = useState(false);
  const [, setTick] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setTick((n) => n + 1), 60_000); return () => window.clearInterval(timer); }, []);
  const toggle = (id: string) => setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const total = selected.reduce((sum, item) => sum + (item === "extras" ? 175 : item === "prints" ? 165 : 450), 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#142128]/45 p-3 backdrop-blur-sm md:p-7">
      <div className="mx-auto min-h-[calc(100vh-24px)] max-w-[1180px] rounded-[2rem] bg-[#f4f7f8] p-5 shadow-2xl md:min-h-[calc(100vh-56px)] md:p-9">
        <div className="flex items-center justify-between"><div><p className="eyebrow text-[#2783a8]">Private delivery</p><h2 className="mt-1 text-xl font-extrabold tracking-[-.04em]">{gallery.names}</h2></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#142128] shadow-sm" aria-label="Close gallery"><X size={19} /></button></div>
        <div className="mt-7 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <div><div className={`gallery-hero ${gallery.coverClass}`}><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#142128]/85 to-transparent p-6 text-white"><p className="eyebrow text-[#9ed6e9]">{gallery.event}</p><p className="mt-1 text-sm font-bold">{gallery.date} · Gallery 01</p></div></div><div className="mt-4 grid grid-cols-3 gap-3"><div className="gallery-tile tile-one" /><div className="gallery-tile tile-two" /><div className="gallery-tile tile-three" /></div></div>
          <aside className="rounded-[1.5rem] bg-white p-5 md:p-6"><div className="flex items-center gap-2 text-[#2783a8]"><LockKeyhole size={15} /><span className="eyebrow">Your gallery</span></div><h3 className="mt-2 text-2xl font-extrabold tracking-[-.055em]">{deliveryTime(gallery.deliveryAt)}</h3><p className="mt-2 text-xs leading-5 text-[#142128]/60">until the finished edit is delivered to this private space. We will email you when it is ready.</p><div className="mt-5 rounded-2xl bg-[#f1f7f8] p-4"><p className="text-2xl font-extrabold tracking-[-.05em]">{gallery.included} images</p><p className="mt-1 text-xs leading-5 text-[#142128]/58">included in your coverage, delivered in high-resolution and web-size files.</p></div><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#142128]/12 px-4 py-3 text-xs font-bold text-[#142128] hover:border-[#50a6c6]"><Download size={14} /> Download will unlock at delivery</button></aside>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_.8fr]">
          <div><p className="eyebrow text-[#2783a8]">Make it tangible</p><h3 className="mt-2 text-2xl font-extrabold tracking-[-.055em]">Add the pieces you’ll actually keep.</h3><div className="mt-5 grid gap-3">{[{ id: "extras", label: "5 additional edited images", price: "$175", detail: "You choose your favorites after delivery." }, { id: "prints", label: "Fine-art print set", price: "$165", detail: "Six archival 8 × 10 prints, carefully packed." }, { id: "album", label: "Linen heirloom album", price: "$450", detail: "A 10 × 10 keepsake, art-directed with you." }].map((item) => <button key={item.id} onClick={() => toggle(item.id)} className={`flex items-start gap-3 rounded-2xl border p-4 text-left ${selected.includes(item.id) ? "border-[#50a6c6] bg-[#e5f2f6]" : "border-[#142128]/10 bg-white"}`}><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected.includes(item.id) ? "border-[#2783a8] bg-[#2783a8] text-white" : "border-[#142128]/20"}`}>{selected.includes(item.id) && <Check size={12} />}</span><span className="min-w-0 flex-1"><span className="block text-sm font-extrabold">{item.label}</span><span className="mt-1 block text-xs leading-5 text-[#142128]/58">{item.detail}</span></span><span className="text-xs font-extrabold">{item.price}</span></button>)}</div></div>
          <div className="overflow-hidden rounded-[1.5rem] bg-[#142128] text-white"><img src={albumUrl} alt="Pale blue heirloom photo album with mounted prints" className="h-44 w-full object-cover" /><div className="p-5"><div className="flex items-center gap-2 text-[#50a6c6]"><PackageOpen size={15} /><span className="eyebrow">Gallery extras</span></div>{ordered ? <p className="mt-3 text-sm font-bold leading-6">Your mock order is noted. We’ll keep your selections with this gallery.</p> : <><p className="mt-3 text-sm leading-6 text-white/68">{selected.length ? `${selected.length} selection${selected.length > 1 ? "s" : ""} · $${total}` : "Choose any combination above; delivery stays private."}</p><button disabled={!selected.length} onClick={() => setOrdered(true)} className="mt-5 w-full rounded-xl bg-[#50a6c6] px-4 py-3 text-xs font-extrabold text-[#142128] disabled:opacity-35"><ImagePlus size={14} className="mr-2 inline" />{selected.length ? `Mock checkout · $${total}` : "Select an extra to continue"}</button></>}</div></div>
        </div>
      </div>
    </div>
  );
}
