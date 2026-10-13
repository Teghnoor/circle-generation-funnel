/**
 * Das Circle-Zeichen: roter Ring. Der zweite, größere Ring pulsiert sehr
 * langsam — genug, dass die Seite lebt, wenig genug, dass man es beim
 * Arbeiten nicht bemerkt.
 */
export default function Logo({ groesse = 26 }: { groesse?: number }) {
  return (
    <svg
      width={groesse}
      height={groesse}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <circle
        cx="16"
        cy="16"
        r="12"
        stroke="#ff2e32"
        strokeWidth="1"
        opacity="0.5"
        className="anim-ring"
        style={{ transformOrigin: "center" }}
      />
      <circle cx="16" cy="16" r="9.5" stroke="#ff2e32" strokeWidth="2.5" />
      <circle cx="16" cy="16" r="3" fill="#ff2e32" />
    </svg>
  );
}
