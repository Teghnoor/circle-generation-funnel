import Image from "next/image";
import { BEWEISE, FAQ, LINKS, NUR_FUER_DICH_WENN, REISE, SO_FUNKTIONIERT, VIDEO_STIMMEN, ZAHLEN } from "@/lib/funnel";

/** Bausteine, die Start, /video und /danke teilen. */

export function Marke({ klein = false }: { klein?: boolean }) {
  return (
    <div className="flex justify-center">
      <Image
        src="/funnel/logo.png"
        alt="The Circle Generation"
        width={600}
        height={420}
        priority={!klein}
        className={klein ? "h-10 w-auto" : "h-14 w-auto md:h-16"}
      />
    </div>
  );
}

export function Leiste({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative z-10 w-full bg-[#b10303] px-4 py-2.5 text-center text-[13px] font-medium md:text-[15px]">
      {children}
    </div>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="cg-tag">
      <span className="cg-tag-punkt" />
      {children}
    </span>
  );
}

export function Abschnitt({
  tag,
  titel,
  children,
  id,
}: {
  tag?: string;
  titel: React.ReactNode;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-5xl px-4 py-16 md:py-24">
      <div className="mb-10 flex flex-col items-center gap-4 text-center md:mb-14">
        {tag && <Tag>{tag}</Tag>}
        <h2 className="cg-h2 max-w-3xl">{titel}</h2>
      </div>
      {children}
    </section>
  );
}

export function NurFuerDich() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {NUR_FUER_DICH_WENN.map((p) => (
        <div key={p} className="cg-karte flex items-start gap-3 p-5">
          <Haken />
          <span className="text-[16px] leading-snug">…{p}.</span>
        </div>
      ))}
    </div>
  );
}

export function Schritte({ schritte }: { schritte: { titel: string; text: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {schritte.map((s, i) => (
        <div key={s.titel} className="cg-karte relative overflow-hidden p-6 md:p-7">
          <div className="pointer-events-none absolute -right-2 -top-6 text-[110px] font-semibold leading-none tracking-tighter text-white/[0.04]">
            0{i + 1}
          </div>
          <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--cg-rot)]/50 text-sm font-semibold text-[var(--cg-rot)]">
            {i + 1}
          </div>
          <h3 className="cg-h3 mb-2">{s.titel}</h3>
          <p className="cg-text text-[15px]">{s.text}</p>
        </div>
      ))}
    </div>
  );
}

export function Faq() {
  return (
    <Abschnitt id="faq" tag="FAQ" titel="Häufige Fragen">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {FAQ.map((f) => (
          <details key={f.frage} className="cg-faq cg-karte px-5 py-4 md:px-6">
            <summary className="flex items-center justify-between gap-4 py-1 text-[17px] font-medium">
              {f.frage}
              <span className="cg-faq-plus grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-xl leading-none">
                +
              </span>
            </summary>
            <p className="cg-text pb-1 pt-3 text-[15px]">{f.antwort}</p>
          </details>
        ))}
      </div>
    </Abschnitt>
  );
}

export function Fuss() {
  return (
    <footer className="border-t border-white/10 px-4 py-10 text-center">
      <Marke klein />
      <p className="cg-text mx-auto mt-5 max-w-2xl text-[13px]">
        Ergebnisse sind nicht garantiert und hängen von deinem Einsatz ab. Diese Seite ist kein Teil von Facebook, Instagram
        oder TikTok und wird nicht von Meta oder ByteDance unterstützt.
      </p>
      <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-white/60">
        <a href={LINKS.impressum} className="hover:text-white">Impressum</a>
        <a href={LINKS.datenschutz} className="hover:text-white">Datenschutz</a>
        <a href={LINKS.agb} className="hover:text-white">AGB</a>
        <a href={LINKS.instagram} className="hover:text-white" target="_blank" rel="noreferrer">Instagram</a>
      </nav>
      <p className="mt-6 text-[12px] text-white/35">© {new Date().getFullYear()} Circle Generation</p>
    </footer>
  );
}

const SO_ICONS = [
  // Video
  <path key="v" d="M4 6.5A2.5 2.5 0 0 1 6.5 4h7A2.5 2.5 0 0 1 16 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 4 17.5zM16 10l4-2.5v9L16 14" />,
  // Kommentar
  <path key="k" d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM8 9.5h8M8 12.5h5" />,
  // Team
  <path key="t" d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.5M17.5 14.5A5.5 5.5 0 0 1 20.5 19" />,
  // Provision
  <path key="p" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15 8.5h-4.25a1.75 1.75 0 0 0 0 3.5h2.5a1.75 1.75 0 0 1 0 3.5H9M12 7v1.5M12 15.5V17" />,
];

/** Vom Video bis zur Provision — damit der Lead vor dem Training weiß, worum es geht. */
export function SoFunktioniert() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {SO_FUNKTIONIERT.map((s, i) => (
        <li key={s.titel} className="cg-karte relative p-6">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#ff2e32]/40 bg-[#ff2e32]/10">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#ff2e32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                {SO_ICONS[i]}
              </svg>
            </span>
            {i < SO_FUNKTIONIERT.length - 1 && (
              <span aria-hidden className="hidden text-xl text-white/25 lg:ml-auto lg:block">→</span>
            )}
          </div>
          <h3 className="cg-h3 mb-1.5">{s.titel}</h3>
          <p className="cg-text text-[15px]">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Echte Clips, laden erst beim Antippen. */
export function VideoStimmen() {
  if (VIDEO_STIMMEN.length === 0) return null;
  return (
    <div className="-mx-4 flex snap-x snap-mandatory items-start gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
      {VIDEO_STIMMEN.map((s) => (
        <figure key={s.src} className="cg-karte w-[78%] shrink-0 snap-center overflow-hidden sm:w-[46%] md:w-auto">
          <div className={`relative bg-black ${s.hochkant ? "aspect-[9/16] md:aspect-video" : "aspect-video"}`}>
            <video
              src={s.src}
              poster={s.poster}
              controls
              playsInline
              preload="none"
              controlsList="nodownload"
              className="absolute inset-0 h-full w-full object-contain"
            />
          </div>
          <figcaption className="px-4 py-3 text-[15px] font-medium">{s.titel}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Der Weg „vorher → heute". */
export function Reise() {
  if (REISE.length === 0) return null;
  return (
    <div className="-mx-4 flex snap-x snap-mandatory items-end gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
      {REISE.map((r, i) => (
        <figure key={r.bild} className="w-[62%] shrink-0 snap-center sm:w-[38%] md:w-auto">
          <div className="cg-karte relative aspect-[3/4] overflow-hidden">
            <Image src={r.bild} alt={`${r.text}${r.wer ? ` – ${r.wer}` : ""}, ${r.datum}`} fill sizes="(min-width: 768px) 20vw, 62vw" className="object-cover" />
            <span
              className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                i === REISE.length - 1 || r.text === "Heute" ? "bg-[#ff2e32] text-white" : "bg-black/70 text-white/85"
              }`}
            >
              {r.datum}
            </span>
          </div>
          <figcaption className="mt-2 text-[14px] text-white/70">
            {r.text}
            {r.wer && <span className="text-white/45"> · {r.wer}</span>}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function Beweise() {
  if (BEWEISE.length === 0) return null;
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 md:mx-auto md:max-w-xl">
      {BEWEISE.map((b) => (
        <figure key={b.bild}>
          <div className="cg-karte relative aspect-[736/1600] max-h-[460px] overflow-hidden">
            <Image src={b.bild} alt={b.text} fill sizes="(min-width: 768px) 280px, 50vw" className="object-cover object-top" />
          </div>
          <figcaption className="mt-2 text-center text-[13px] text-white/55">{b.text}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function Zahlen() {
  if (ZAHLEN.length === 0) return null;
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 px-4 md:grid-cols-4">
      {ZAHLEN.map((z) => (
        <div key={z.text} className="cg-karte px-4 py-5 text-center">
          <div className="text-[30px] font-semibold tracking-[-0.04em] text-[#ff2e32]">{z.wert}</div>
          <div className="mt-1 text-[13px] text-white/60">{z.text}</div>
        </div>
      ))}
    </div>
  );
}

export function Haken({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`mt-0.5 h-5 w-5 shrink-0 ${className}`} aria-hidden>
      <circle cx="10" cy="10" r="10" fill="rgba(255,46,50,0.16)" />
      <path d="M6 10.2l2.6 2.6L14 7.4" fill="none" stroke="#ff2e32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Schloss({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="11" width="16" height="10" rx="2.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

export function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
    </svg>
  );
}
