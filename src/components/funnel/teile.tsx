import Logo from "@/components/logo";
import { FAQ, LINKS, NUR_FUER_DICH_WENN, SAEULEN, STIMMEN } from "@/lib/funnel";

/** Bausteine, die Start, /video und /danke teilen. */

export function Marke() {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <span style={{ ["--circle-red" as string]: "#ff2e32" }}>
        <Logo groesse={30} />
      </span>
      <span className="text-[19px] font-semibold tracking-[-0.03em]">Circle Generation</span>
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

export function Saeulen() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {SAEULEN.map((s, i) => (
        <div key={s.titel} className="cg-karte p-6 md:p-7">
          <div className="mb-5 font-mono text-sm text-[var(--cg-rot)]">0{i + 1}</div>
          <h3 className="cg-h3 mb-2">{s.titel}</h3>
          <p className="cg-text text-[15px]">{s.text}</p>
        </div>
      ))}
    </div>
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

export function Stimmen() {
  if (STIMMEN.length === 0) return null;
  return (
    <Abschnitt tag="Kundenstimmen" titel="Erfolgsgeschichten unserer Teilnehmer">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STIMMEN.map((s) => (
          <figure key={s.name} className="cg-karte overflow-hidden">
            {s.bild && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.bild} alt={`Erfolgsgeschichte von ${s.name}`} className="w-full" loading="lazy" />
            )}
            <figcaption className="p-5">
              <p className="text-[15px] italic leading-relaxed">„{s.zitat}“</p>
              <p className="mt-3 text-sm font-semibold">{s.name}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Abschnitt>
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
      <Marke />
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
