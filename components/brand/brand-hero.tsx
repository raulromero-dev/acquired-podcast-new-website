"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function BrandHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setMousePosition({ x, y })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const letters = ["A", "C", "Q"]

  return (
    <section className="pt-40 pb-32 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            className="text-xs text-accent font-mono uppercase tracking-[0.3em] mb-4"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Visual Identity
          </motion.p>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif text-foreground tracking-tight">Brand</h1>
        </motion.div>

        <motion.div
          className="mt-24 flex items-center justify-center"
          style={{
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
        >
          <div className="flex items-baseline">
            {letters.map((letter, index) => (
              <motion.span
                key={letter}
                className="font-serif text-[8rem] md:text-[12rem] lg:text-[16rem] font-semibold tracking-tight text-foreground leading-none inline-block cursor-default select-none"
                initial={{ opacity: 0, y: 100, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 1,
                  delay: 0.5 + index * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{
                  scale: 1.05,
                  color: "var(--accent)",
                  transition: { duration: 0.3 },
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center mt-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="h-[2px] w-48 bg-accent origin-left" />
        </motion.div>
      </div>
    </section>
  )
}
