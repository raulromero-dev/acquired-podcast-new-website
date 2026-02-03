"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface GrainBackgroundProps {
  children: React.ReactNode
  className?: string
  intensity?: "subtle" | "medium" | "intense"
  fadeEdges?: boolean
}

export function GrainBackground({ children, className, intensity = "medium", fadeEdges = true }: GrainBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "absolute inset-0 pointer-events-none z-[1]",
          // Light mode green tint values
          intensity === "subtle" && "grain-bg-subtle",
          intensity === "medium" && "grain-bg-medium",
          intensity === "intense" && "grain-bg-intense",
        )}
      />

      <div
        className={cn(
          "absolute inset-0 pointer-events-none z-[2]",
          // Light mode opacity
          "opacity-[0.25]",
          // Dark mode needs higher opacity
          "dark:opacity-[0.35]",
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      <div
        className={cn("absolute inset-0 pointer-events-none z-[2]", "opacity-[0.15] dark:opacity-[0.2]")}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise2)'/%3E%3C/svg%3E")`,
          mixBlendMode: "soft-light",
        }}
      />

      {fadeEdges && (
        <>
          <div
            className="absolute inset-x-0 top-0 h-32 z-[3] pointer-events-none"
            style={{
              background: "linear-gradient(to bottom, var(--background) 0%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-32 z-[3] pointer-events-none"
            style={{
              background: "linear-gradient(to top, var(--background) 0%, transparent 100%)",
            }}
          />
        </>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  )
}
