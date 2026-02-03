"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { GrainBackground } from "../grain-background"

const logoVariants = [
  { bg: "bg-background", text: "text-foreground", label: "Light" },
  { bg: "bg-foreground", text: "text-background", label: "Dark" },
  { bg: "bg-accent", text: "text-white", label: "Accent" },
  { bg: "bg-background", text: "text-accent", label: "Accent Mark" },
]

export function LogoSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <GrainBackground intensity="medium" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-12 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            className="text-xs text-accent font-mono uppercase tracking-wider mb-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            01
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">Logo</h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {logoVariants.map((variant, index) => (
            <motion.div
              key={index}
              className={`aspect-[16/9] sm:aspect-[4/3] rounded-2xl ${variant.bg} flex items-center justify-center relative overflow-hidden cursor-pointer backdrop-blur-xl border border-white/10 shadow-lg`}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

              <div className="relative z-10 flex items-baseline">
                {["A", "C", "Q"].map((letter, letterIndex) => (
                  <motion.span
                    key={letter}
                    className={`font-serif text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight ${variant.text}`}
                    animate={{
                      y: hoveredIndex === index ? [0, -8, 0] : 0,
                    }}
                    transition={{
                      duration: 0.4,
                      delay: letterIndex * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              <motion.span
                className={`absolute bottom-4 left-4 text-xs font-mono uppercase tracking-wider ${
                  variant.text === "text-background" || variant.text === "text-white"
                    ? "text-white/60"
                    : "text-foreground/60"
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                  y: hoveredIndex === index ? 0 : 10,
                }}
                transition={{ duration: 0.3 }}
              >
                {variant.label}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </GrainBackground>
  )
}
