export default function OrnamentalDivider() {
  return (
    <div className="flex items-center justify-center px-4 my-5">
      <svg
        className="w-full max-w-[320px] h-8"
        viewBox="0 0 320 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <line x1="0" y1="16" x2="125" y2="16" stroke="#F0C94A" strokeOpacity="0.6" strokeWidth="1.5" />
        <path
          d="M160 6 L170 16 L160 26 L150 16 Z"
          fill="#F0C94A"
          fillOpacity="0.6"
        />
        <path
          d="M160 10 L166 16 L160 22 L154 16 Z"
          fill="#F0C94A"
          fillOpacity="0.95"
        />
        <line x1="195" y1="16" x2="320" y2="16" stroke="#F0C94A" strokeOpacity="0.6" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
