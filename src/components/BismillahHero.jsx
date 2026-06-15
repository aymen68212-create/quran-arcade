function StarOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="hero-stars"
          x="0"
          y="0"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M24 2 L28 18 L44 18 L31 28 L36 44 L24 34 L12 44 L17 28 L4 18 L20 18 Z"
            fill="none"
            stroke="white"
            strokeWidth="0.7"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-stars)" />
    </svg>
  )
}

export default function BismillahHero() {
  return (
    <div
      className="relative min-h-[160px] overflow-hidden flex flex-col items-center justify-center px-4 py-8 border-b border-[#F0C94A]/40"
      style={{
        background: 'linear-gradient(180deg, #065F46 0%, #047857 100%)',
      }}
    >
      <StarOverlay />

      <div
        className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(240, 201, 74, 0.12))',
        }}
      />

      <div className="relative z-10 text-center">
        <span className="text-3xl block mb-3 drop-shadow-sm" aria-hidden="true">
          🌙
        </span>
        <p
          className="font-arabic text-2xl leading-relaxed mb-2 text-[#F0C94A]"
          dir="rtl"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>
        <p className="text-sm text-white/80 font-sans">
          Choisis ton exercice
        </p>
      </div>
    </div>
  )
}
