export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8">
        <img
          src="/images/logo.png"
          alt="VayuSathi"
          className="w-full h-full object-contain"
        />
      </div>
      <span className="font-bold text-xl" style={{ color: '#10B981' }}>
        VayuSathi
      </span>
    </div>
  )
} 