'use client';

export function PatternBackground({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/plants.png)',
          backgroundSize: '180px 180px',
          backgroundRepeat: 'repeat',
          opacity: 0.15,
        }}
      />
    </div>
  );
}
