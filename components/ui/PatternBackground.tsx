export function PatternBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(/svg/plantas.svg)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '300px 300px',
          opacity: 0.08,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
