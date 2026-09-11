import { withBase } from "@/lib/withBase";
/**
 * Aperture Blue shell: a calm index rail, ample negative space, and exact Aerial Blue interaction cues.
 */
import { Link, useLocation } from "wouter";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const logoUrl = withBase("/images/halcyon-symbol-mark_2f643a5f.png");

const navItems = [
  { href: "/services", label: "Services" },
  { href: "/book", label: "Book a session" },
  { href: "/galleries", label: "Client galleries" },
  { href: "/about", label: "About" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f7f8] text-[#142128]">
      <header className="relative z-40 border-b border-[#142128]/10 bg-[#f4f7f8]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 md:px-9">
          <Link href="/" className="group flex items-center gap-3" aria-label="Halcyon Photography Co. home">
            <img src={logoUrl} alt="" className="h-9 w-9 object-contain transition-transform duration-200 group-hover:rotate-6" />
            <span className="text-[13px] font-extrabold tracking-[0.18em]">HALCYON</span>
            <span className="hidden text-[10px] font-medium tracking-[0.17em] text-[#142128]/55 sm:inline">PHOTO CO.</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[12px] font-bold tracking-[0.04em] transition-colors hover:text-[#2783a8] ${location === item.href ? "text-[#2783a8]" : "text-[#142128]/72"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/book" className="hidden items-center gap-2 rounded-full bg-[#142128] px-4 py-2.5 text-[11px] font-bold tracking-[0.06em] text-white transition-transform duration-150 hover:bg-[#2783a8] active:scale-[.97] sm:flex">
            Check availability <ArrowUpRight size={14} />
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#142128] shadow-sm lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((current) => !current)}
          >
            {open ? <X size={19} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-[#142128]/10 bg-[#f4f7f8] px-5 py-5 lg:hidden" aria-label="Mobile navigation">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-base font-bold hover:bg-white">
                  {item.label}
                </Link>
              ))}
              <Link href="/book" onClick={() => setOpen(false)} className="mt-3 rounded-xl bg-[#142128] px-4 py-3 text-center text-sm font-bold text-white">
                Check availability
              </Link>
            </div>
          </nav>
        )}
      </header>

      {children}

      <footer className="bg-[#142128] px-5 pb-8 pt-14 text-[#edf5f7] md:px-9 md:pt-20">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[1.4fr_.7fr_.7fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="" className="h-11 w-11 object-contain" />
              <div className="text-sm font-extrabold tracking-[0.16em]">HALCYON</div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-[#edf5f7]/68">Photographs with room for the unscripted parts. Portraits, editorial sessions, and wedding-day coverage across the city and nearby coast.</p>
          </div>
          <div>
            <p className="eyebrow text-[#50a6c6]">Find your way</p>
            <div className="mt-4 flex flex-col gap-3 text-sm font-semibold text-[#edf5f7]/85">
              <Link href="/services">Services + pricing</Link>
              <Link href="/book">Book a session</Link>
              <Link href="/galleries">Client galleries</Link>
            </div>
          </div>
          <div>
            <p className="eyebrow text-[#50a6c6]">Say hello</p>
            <a href="mailto:hello@halcyon.photo" className="mt-4 inline-block text-sm font-semibold text-[#edf5f7]/85 hover:text-white">hello@halcyon.photo</a>
            <p className="mt-3 text-sm leading-6 text-[#edf5f7]/60">Serving the city, the coast, and wherever the light is worth following.</p>
          </div>
        </div>
        <div className="mx-auto mt-14 flex max-w-[1440px] flex-col justify-between gap-2 border-t border-white/10 pt-5 text-[10px] font-medium tracking-[0.08em] text-[#edf5f7]/40 sm:flex-row">
          <span>© 2026 HALCYON PHOTOGRAPHY CO.</span>
          <span>PRIVATE DELIVERY · CLEAR TERMS · KIND GUIDANCE</span>
        </div>
      </footer>
    </div>
  );
}
