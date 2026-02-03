"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { GrainBackground } from "./grain-background"

const values = [
  {
    number: "01",
    title: "Depth over breadth",
    description: "We'd rather spend 5 hours telling a complete story than rush through in 30 minutes.",
  },
  {
    number: "02",
    title: "Primary sources",
    description: "We go to original sources—founders' books, company documents, historical records.",
  },
  {
    number: "03",
    title: "Fair-minded analysis",
    description: "We approach companies with genuine curiosity about what made them successful.",
  },
  {
    number: "04",
    title: "Long-term thinking",
    description: "We celebrate companies that play long-term games and build durable advantages.",
  },
]

function ValueCard({ value, index }: { value: (typeof values)[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [60, -60])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.9, 1, 1, 0.95])

  return (
    <motion.div ref={cardRef} className="group relative" style={{ y, opacity, scale }}>
      <motion.div
        className="absolute -left-4 top-0 w-[2px] h-0 bg-accent rounded-full"
        initial={{ height: 0 }}
        whileInView={{ height: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: index * 0.15 + 0.3, ease: "easeOut" }}
      />

      <motion.span
        className="text-sm text-accent font-mono tracking-wider block"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {value.number}
      </motion.span>

      <motion.h3
        className="text-2xl md:text-3xl font-medium text-foreground mt-4 mb-4 group-hover:text-accent transition-colors duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
      >
        {value.title}
      </motion.h3>

      <motion.p
        className="text-base text-muted-foreground leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
      >
        {value.description}
      </motion.p>
    </motion.div>
  )
}

export function ValuesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const headingY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const lineWidth = useTransform(scrollYProgress, [0, 0.3], ["0%", "100%"])

  return (
    <GrainBackground className="py-40" intensity="medium" fadeEdges={true}>
      <div ref={sectionRef} className="max-w-7xl mx-auto px-6">
        <motion.div className="mb-24" style={{ y: headingY }}>
          <motion.h2
            className="text-5xl sm:text-6xl md:text-7xl font-serif italic text-foreground leading-[1.05]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Our approach
          </motion.h2>

          <motion.div className="h-[3px] bg-accent mt-8 rounded-full origin-left" style={{ width: lineWidth }} />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-x-24 gap-y-20 pl-4">
          {values.map((value, index) => (
            <ValueCard key={value.number} value={value} index={index} />
          ))}
        </div>
      </div>
    </GrainBackground>
  )
}
