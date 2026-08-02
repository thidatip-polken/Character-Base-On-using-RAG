const DOTS = [
  { top: "12%", left: "8%", size: 6, tone: "bg-gold/70", delay: "0s" },
  { top: "22%", left: "88%", size: 4, tone: "bg-blushDeep/60", delay: "0.4s" },
  { top: "68%", left: "6%", size: 5, tone: "bg-lilacDeep/50", delay: "0.9s" },
  { top: "80%", left: "92%", size: 4, tone: "bg-gold/60", delay: "1.3s" },
  { top: "45%", left: "95%", size: 3, tone: "bg-blushDeep/50", delay: "1.7s" },
];

/** A handful of quiet, twinkling accents — not a dense field, just punctuation. */
export default function Sparkles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {DOTS.map((d, i) => (
        <span
          key={i}
          className={`absolute rounded-full animate-twinkle ${d.tone}`}
          style={{
            top: d.top,
            left: d.left,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  );
}
