"use client"

interface AcquiredLogoProps {
  className?: string
  variant?: "full" | "mark"
}

export function AcquiredLogo({ className = "", variant = "full" }: AcquiredLogoProps) {
  if (variant === "mark") {
    return <span className={`font-serif text-2xl font-semibold tracking-tight text-foreground ${className}`}>ACQ</span>
  }

  return (
    <div className={`flex items-center ${className}`}>
      <span className="font-serif text-2xl font-semibold tracking-tight text-foreground">ACQ</span>
    </div>
  )
}
