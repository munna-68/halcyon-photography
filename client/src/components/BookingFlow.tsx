/**
 * Aperture Blue booking flow: operational clarity shaped like a refined studio call sheet.
 */
import { useEffect, useMemo, useState } from "react";
import { Check, ChevronLeft, Clock3, FileText, LockKeyhole, Sparkles, Sun, TimerReset } from "lucide-react";
import { getGoldenHour, getPackage, formatMinutes, formatPrice, packages, type Package } from "@/data/photography";

type Vibe = "candid" | "editorial" | "film";
type Location = "studio" | "outdoor" | "open";
type HoldStatus = "idle" | "held" | "paid" | "expired";

const days = Array.from({ length: 30 }, (_, index) => index + 1);
const availability = new Set([2, 3, 5, 6, 9, 10, 12, 14, 16, 17, 19, 20, 23, 24, 26, 28, 29]);

const timeLeft = (expiresAt: number | null) => {
  if (!expiresAt) return "24:00:00";
  const remaining = Math.max(0, expiresAt - Date.now());
  const hours = Math.floor(remaining / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

function recommendPackages(vibe: Vibe | null, location: Location | null, people: string) {
  if (people === "9+") return packages.filter((item) => item.id === "wedding");
  if (vibe === "editorial") return packages.filter((item) => item.id === "editorial" || item.id === "portrait");
  if (location === "outdoor") return packages.filter((item) => item.id === "mini" || item.id === "editorial");
  if (location === "studio") return packages.filter((item) => item.id === "portrait" || item.id === "editorial");
  return packages.filter((item) => item.id !== "wedding");
}

function PackageChoice({ item, selected, onSelect }: { item: Package; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`relative w-full overflow-hidden border p-5 text-left transition-all duration-200 active:scale-[.985] ${selected ? "border-[#50a6c6] bg-[#f1f7f8] shadow-[0_12px_32px_rgba(39,131,168,.08)]" : "border-[#142128]/10 bg-white hover:-translate-y-0.5 hover:border-[#50a6c6]/55"}`}
    >
      {selected && <span className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-[#2783a8] text-white"><Check size={14} /></span>}
      <p className="eyebrow text-[#2783a8]">{item.eyebrow}</p>
      <h3 className="mt-2 text-xl font-extrabold tracking-[-0.04em]">{item.name}</h3>
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-[#142128]/64">
        <span>{item.durationLabel}</span><span>{item.locationLabel}</span>
      </div>
      <p className="mt-4 text-sm font-extrabold">{formatPrice(item.price)} <span className="font-medium text-[#142128]/50">total</span></p>
    </button>
  );
}

export function BookingFlow({ initialPackage }: { initialPackage?: string | null }) {
  const [step, setStep] = useState(1);
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [people, setPeople] = useState("1–2");
  const [selectedId, setSelectedId] = useState<string | null>(initialPackage ?? null);
  const [date, setDate] = useState<number | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [holdStatus, setHoldStatus] = useState<HoldStatus>("idle");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [, setClock] = useState(0);

  const recommended = useMemo(() => recommendPackages(vibe, location, people), [vibe, location, people]);
  const selectedPackage = getPackage(selectedId ?? recommended[0]?.id);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setClock((value) => value + 1);
      if (holdStatus === "held" && expiresAt && Date.now() >= expiresAt) {
        setHoldStatus("expired");
        setSlot(null);
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, holdStatus]);

  const golden = date ? getGoldenHour(5, date) : null;
  const isGoldenBound = selectedPackage.location !== "studio";
  const availableSlots = (() => {
    if (!date) return [];
    if (selectedPackage.id === "wedding") {
      return [`Golden-hour portrait reserve · ${formatMinutes(golden!.start)}`];
    }
    if (!isGoldenBound) return ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM"];
    const duration = selectedPackage.duration;
    const output: string[] = [];
    for (let start = golden!.start; start + duration <= golden!.end; start += 15) output.push(formatMinutes(start));
    return output;
  })();

  const resetForNewTime = () => {
    setHoldStatus("idle");
    setExpiresAt(null);
    setSlot(null);
    setContractAccepted(false);
    setStep(3);
  };

  const placeHold = () => {
    setHoldStatus("held");
    setExpiresAt(Date.now() + 24 * 60 * 60 * 1000);
    setStep(4);
  };

  const steps = ["Shape it", "Choose coverage", "Find the light", "Hold + retainer"];

  return (
    <section className="relative py-8 md:py-12">
      <div className="mx-auto max-w-[1240px] px-5 md:px-9">
        <div className="grid gap-10 lg:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-8 lg:h-fit">
            <p className="eyebrow text-[#2783a8]">Availability desk</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.07em] md:text-5xl">Make a little room for it.</h1>
            <div className="mt-8 flex gap-3 lg:flex-col lg:gap-0">
              {steps.map((label, index) => {
                const active = step === index + 1;
                const done = step > index + 1;
                return <div key={label} className="flex min-w-0 items-center gap-3 py-2 lg:py-3"><span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold ${active ? "bg-[#2783a8] text-white" : done ? "bg-[#50a6c6] text-[#142128]" : "bg-[#142128]/8 text-[#142128]/45"}`}>{done ? <Check size={12} /> : index + 1}</span><span className={`hidden text-xs font-bold lg:inline ${active ? "text-[#142128]" : "text-[#142128]/48"}`}>{label}</span></div>;
              })}
            </div>
            <p className="mt-8 hidden border-l-2 border-[#50a6c6] pl-3 text-xs leading-5 text-[#142128]/62 lg:block">Dates are not confirmed until the retainer lands. We keep your selected time exclusive for 24 hours.</p>
          </aside>

          <div className="call-sheet min-w-0 p-5 md:p-9">
            {step === 1 && <div className="animate-frame-in">
              <p className="eyebrow text-[#2783a8]">First, a few cues</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.055em] md:text-4xl">How should this feel?</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#142128]/64">Your answers create a useful starting point. We use them to narrow the session options and carry your notes through to the request.</p>
              <div className="mt-8 grid gap-8">
                <fieldset><legend className="text-sm font-extrabold">The energy</legend><div className="mt-3 grid gap-3 sm:grid-cols-3">{([ ["candid", "Candid", "Movement, real glances, low pressure"], ["editorial", "Editorial", "Intentional direction, visual concept"], ["film", "Film-inspired", "Soft grain, unhurried, tactile"], ] as const).map(([value, title, body]) => <button key={value} onClick={() => setVibe(value)} className={`border p-4 text-left transition-all ${vibe === value ? "border-[#50a6c6] bg-[#f1f7f8]" : "border-[#142128]/10 hover:border-[#50a6c6]/60"}`}><span className="aperture-tab mb-3 block h-2 w-4 opacity-80" /><span className="text-sm font-extrabold">{title}</span><span className="mt-1 block text-xs leading-5 text-[#142128]/58">{body}</span></button>)}</div></fieldset>
                <fieldset><legend className="text-sm font-extrabold">Where do you see it?</legend><div className="mt-3 flex flex-wrap gap-2">{([ ["studio", "In the studio"], ["outdoor", "Out in the light"], ["open", "I’m open to it"], ] as const).map(([value, label]) => <button key={value} onClick={() => setLocation(value)} className={`border-b-2 px-4 py-2.5 text-xs font-bold ${location === value ? "border-[#2783a8] bg-[#f1f7f8] text-[#142128]" : "border-[#142128]/10 text-[#142128]/70 hover:border-[#50a6c6]"}`}>{label}</button>)}</div></fieldset>
                <fieldset><legend className="text-sm font-extrabold">How many are in the frame?</legend><div className="mt-3 flex flex-wrap gap-2">{["1–2", "3–5", "6–8", "9+"].map((value) => <button key={value} onClick={() => setPeople(value)} className={`border-b-2 px-4 py-2.5 text-xs font-bold ${people === value ? "border-[#2783a8] bg-[#f1f7f8] text-[#142128]" : "border-[#142128]/10 text-[#142128]/70 hover:border-[#50a6c6]"}`}>{value}</button>)}</div></fieldset>
              </div>
              <button disabled={!vibe || !location} onClick={() => setStep(2)} className="button-primary mt-9 disabled:cursor-not-allowed disabled:opacity-35">See my recommended coverage <Sparkles size={15} /></button>
            </div>}

            {step === 2 && <div className="animate-frame-in">
              <button onClick={() => setStep(1)} className="button-back"><ChevronLeft size={15} /> Refine my cues</button>
              <p className="eyebrow mt-7 text-[#2783a8]">A useful shortlist</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.055em] md:text-4xl">Built around the way you want to be seen.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#142128]/64">We have prioritized these based on your direction: <span className="font-bold text-[#142128]">{vibe ?? "open"}</span> · <span className="font-bold text-[#142128]">{location ?? "open"}</span> · <span className="font-bold text-[#142128]">{people} people</span>.</p>
              <div className="mt-7 grid gap-3 md:grid-cols-2">{recommended.map((item) => <PackageChoice key={item.id} item={item} selected={selectedId === item.id || (!selectedId && item.id === recommended[0].id)} onSelect={() => setSelectedId(item.id)} />)}</div>
              <div className="mt-6 rounded-2xl bg-[#f1f7f8] p-4 text-xs leading-5 text-[#142128]/65"><span className="font-bold text-[#142128]">All coverage is transparent.</span> {selectedPackage.includes.join(" · ")}. You will see the retainer and agreement before anything is confirmed.</div>
              <button onClick={() => setStep(3)} className="button-primary mt-7">Find available times <Clock3 size={15} /></button>
            </div>}

            {step === 3 && <div className="animate-frame-in">
              <button onClick={() => setStep(2)} className="button-back"><ChevronLeft size={15} /> Change coverage</button>
              <div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow text-[#2783a8]">June 2026 availability</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-0.055em] md:text-4xl">{selectedPackage.name}</h2></div><span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e5f2f6] px-3 py-2 text-[11px] font-bold text-[#226d8d]"><TimerReset size={13} /> Date holds are 24 hours</span></div>
              <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_.9fr]">
                <div><div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-[0.08em] text-[#142128]/42">{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <span key={`${day}-${index}`} className="py-2">{day}</span>)}</div><div className="grid grid-cols-7 gap-1">{Array.from({ length: 6 }, (_, i) => <span key={`blank-${i}`} />)}{days.map((day) => { const available = availability.has(day); return <button disabled={!available} onClick={() => { setDate(day); setSlot(null); }} key={day} className={`aspect-square rounded-full text-xs font-bold transition-all ${date === day ? "bg-[#2783a8] text-white shadow-lg shadow-[#2783a8]/25" : available ? "bg-[#f1f7f8] text-[#142128] hover:bg-[#dceff4]" : "cursor-not-allowed text-[#142128]/25"}`}>{day}</button>; })}</div><p className="mt-4 text-xs leading-5 text-[#142128]/54">Open dates are shown in blue-gray. We start with a small June window so the availability system stays legible in this demo.</p></div>
                <div className="rounded-[1.4rem] bg-[#142128] p-5 text-white">{date ? <><p className="eyebrow text-[#50a6c6]">{isGoldenBound ? "Light calculation" : "Studio hours"}</p><h3 className="mt-2 text-xl font-extrabold">Tuesday, June {date}</h3>{isGoldenBound ? <div className="mt-4 rounded-xl bg-white/8 p-4"><div className="flex items-center gap-2 text-sm font-bold"><Sun size={16} className="text-[#50a6c6]" /> Golden hour · {formatMinutes(golden!.start)}–{formatMinutes(golden!.end)}</div><p className="mt-2 text-xs leading-5 text-white/62">Based on our seeded June sunset table. Outdoor time slots must begin and end inside this day’s light window.</p></div> : <p className="mt-4 text-sm leading-6 text-white/65">Studio sessions are available during daylight business hours, without a sunset constraint.</p>}<div className="mt-5 grid gap-2">{availableSlots.length ? availableSlots.map((time) => <button onClick={() => setSlot(time)} key={time} className={`rounded-xl border px-4 py-3 text-left text-xs font-bold transition-all ${slot === time ? "border-[#50a6c6] bg-[#50a6c6] text-[#142128]" : "border-white/14 bg-white/5 text-white hover:border-white/40"}`}>{time}{selectedPackage.id === "wedding" && <span className="ml-2 font-medium opacity-70">· daily coverage follows in agreement</span>}</button>) : <p className="rounded-xl bg-white/8 p-4 text-xs leading-5 text-white/62">This package needs more time than the golden-hour window. Choose a daylight-studio package or another kind of coverage.</p>}</div></> : <div className="grid min-h-[280px] place-items-center text-center"><Sun size={30} className="text-[#50a6c6]" /><p className="-mt-14 max-w-[180px] text-sm font-bold leading-5">Choose an open date to see the day’s light.</p></div>}</div>
              </div>
              <button disabled={!slot} onClick={placeHold} className="button-primary mt-8 disabled:cursor-not-allowed disabled:opacity-35">Put {slot ?? "this time"} on hold <LockKeyhole size={15} /></button>
            </div>}

            {step === 4 && <div className="animate-frame-in">
              <button onClick={resetForNewTime} className="button-back"><ChevronLeft size={15} /> Choose another time</button>
              {holdStatus === "expired" ? <div className="mt-7 rounded-[1.5rem] bg-[#fff1ee] p-6"><p className="eyebrow text-[#ad533f]">Hold released</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-.055em]">That time is back in the calendar.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-[#142128]/65">The retainer window has passed, so this temporary hold has released automatically. Pick another open time and we can start fresh.</p><button onClick={resetForNewTime} className="button-dark mt-6">Return to availability</button></div> : holdStatus === "paid" ? <div className="mt-7 rounded-[1.5rem] bg-[#e5f2f6] p-6"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#2783a8] text-white"><Check size={20} /></span><p className="eyebrow mt-5 text-[#2783a8]">Retainer received</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-.055em]">You’re in the light.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-[#142128]/65">Your date is confirmed. A calm, practical session guide and the rest of your agreement are on their way to your inbox in this demo flow.</p><button onClick={() => { setStep(1); setHoldStatus("idle"); setDate(null); setSlot(null); }} className="button-dark mt-6">Plan another session</button></div> : <><p className="eyebrow mt-7 text-[#2783a8]">A small pause, not a confirmation</p><h2 className="mt-2 text-3xl font-extrabold tracking-[-.055em]">We’re holding {slot} for you.</h2><div className="mt-6 grid gap-4 lg:grid-cols-[1fr_.9fr]"><div className="rounded-[1.5rem] bg-[#142128] p-6 text-white"><p className="eyebrow text-[#50a6c6]">Exclusive hold</p><div className="mt-3 text-4xl font-extrabold tracking-[-.06em] tabular-nums">{timeLeft(expiresAt)}</div><p className="mt-2 text-xs leading-5 text-white/60">remaining to review the agreement and pay your retainer. When this reaches zero, the date releases automatically.</p><button onClick={() => setHoldStatus("expired")} className="mt-5 text-xs font-bold text-[#50a6c6] underline underline-offset-4">Demo: release this hold now</button></div><div className="rounded-[1.5rem] border border-[#142128]/10 p-6"><p className="eyebrow text-[#2783a8]">Retainer</p><p className="mt-2 text-3xl font-extrabold tracking-[-.05em]">{formatPrice(selectedPackage.retainer)}</p><p className="mt-2 text-xs leading-5 text-[#142128]/58">Applied to your {formatPrice(selectedPackage.price)} {selectedPackage.name} total. The remaining balance is due before your session.</p></div></div><label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl bg-[#f1f7f8] p-4 text-xs leading-5 text-[#142128]/70"><input checked={contractAccepted} onChange={(event) => setContractAccepted(event.target.checked)} type="checkbox" className="mt-0.5 h-4 w-4 accent-[#2783a8]" /><span><span className="font-bold text-[#142128]"><FileText size={13} className="mr-1 inline" /> I reviewed the mock session agreement.</span> It covers rescheduling, image delivery, and the remaining balance in plain language.</span></label><button disabled={!contractAccepted} onClick={() => setHoldStatus("paid")} className="button-primary mt-6 disabled:cursor-not-allowed disabled:opacity-35">Pay {formatPrice(selectedPackage.retainer)} retainer <LockKeyhole size={15} /></button><p className="mt-3 text-[11px] text-[#142128]/48">Demo checkout only. No payment details are collected.</p></>}
            </div>}
          </div>
        </div>
      </div>
    </section>
  );
}
