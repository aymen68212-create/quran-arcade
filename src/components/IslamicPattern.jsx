export default function IslamicPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="islamic-pattern"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M20 0 L40 20 L20 40 L0 20 Z M20 8 L32 20 L20 32 L8 20 Z"
            fill="none"
            stroke="#10B981"
            strokeWidth="1"
          />
          <circle cx="20" cy="20" r="3" fill="#10B981" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
    </svg>
  )
}
