export default function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }, (_, i) => {
        let dotClass = 'w-2 h-2 rounded-full border border-border bg-transparent'
        if (i < current) {
          dotClass = 'w-2 h-2 rounded-full bg-text-secondary'
        } else if (i === current) {
          dotClass = 'w-2 h-2 rounded-full bg-primary-green'
        }
        return <span key={i} className={dotClass} />
      })}
    </div>
  )
}
