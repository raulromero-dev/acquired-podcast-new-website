"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function HeroSection() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const heroImage = mounted && resolvedTheme === "light" ? "/garage-light-mode.png" : "/garage-dark-mode.png"

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Hero Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
          style={{
            backgroundImage: mounted ? `url('${heroImage}')` : "none",
            opacity: mounted ? 1 : 0,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background dark:from-background/30 dark:via-background/60 dark:to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/50 dark:to-background/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--background)_100%)] opacity-40" />
      </div>

      {/* Main content - positioned at bottom like Quartr */}
      <div className="relative z-10 flex-1 flex flex-col justify-end max-w-7xl mx-auto w-full px-6 pb-16 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-end">
          {/* Left - Large headline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif leading-[0.95] tracking-tight text-foreground">
              Every company
              <br />
              has a story
            </h1>
            <div className="h-1 w-16 bg-accent mt-8 rounded-full" />
          </motion.div>

          {/* Right - Description and CTAs */}
          <motion.div
            className="space-y-8 lg:pt-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
              Learn the playbooks that built the world&apos;s greatest companies — and how you can apply them.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/episodes"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Start listening
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
