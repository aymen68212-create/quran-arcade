export default function TimerBar({ percentage, color }) {
  const colorMap = {
    emerald: '#10B981',
    gold: '#F0C94A',
    red: '#EF4444',
  }

  return (
    <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-1000 ease-linear"
        style={{
          width: `${percentage}%`,
          backgroundColor: colorMap[color] || colorMap.emerald,
        }}
      />
    </div>
  )
}
