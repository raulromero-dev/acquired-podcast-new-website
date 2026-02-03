"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { GrainBackground } from "@/components/grain-background"

const stats = [
  { value: 76, label: "Work in tech, finance, or investing", suffix: "%" },
  { value: 35, label: "C-level or VP executives", suffix: "%" },
  { value: 20, label: "Current founders", suffix: "%" },
  { value: 1, label: "Listeners per episode", suffix: "M+" },
]

const geoData = [
  { region: "English-speaking", value: 72, dots: 36 },
  { region: "Europe", value: 11, dots: 6 },
  { region: "Asia", value: 10, dots: 5 },
  { region: "Rest of World", value: 7, dots: 3 },
]

function RadialStat({
  value,
  maxValue = 100,
  label,
  suffix = "%",
  delay = 0,
  index,
}: {
  value: number
  maxValue?: number
  label: string
  suffix?: string
  delay?: number
  index: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [displayValue, setDisplayValue] = useState(0)

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const progress = (value / maxValue) * circumference

  useEffect(() => {
    if (isInView) {
      const duration = 1500
      const steps = 60
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setDisplayValue(value)
          clearInterval(timer)
        } else {
          setDisplayValue(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, delay: delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative w-44 h-44 md:w-52 md:h-52">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-border"
          />
          {/* Animated progress arc */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-accent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={isInView ? { strokeDashoffset: circumference - progress } : {}}
            transition={{ duration: 1.5, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Decorative tick marks */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180
            const x1 = 80 + (radius - 8) * Math.cos(angle)
            const y1 = 80 + (radius - 8) * Math.sin(angle)
            const x2 = 80 + (radius - 4) * Math.cos(angle)
            const y2 = 80 + (radius - 4) * Math.sin(angle)
            return (
              <motion.line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground/30"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: delay + 0.1 + i * 0.03 }}
              />
            )
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-4xl md:text-5xl font-serif text-foreground tabular-nums"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: delay + 0.4 }}
          >
            {displayValue}
            {suffix}
          </motion.span>
        </div>

        {/* Floating indicator dot */}
        <motion.div
          className="absolute w-3 h-3 bg-accent rounded-full shadow-lg shadow-accent/50"
          style={{
            top: "50%",
            left: "50%",
            marginTop: -6,
            marginLeft: -6,
          }}
          initial={{
            x: radius * Math.cos(-Math.PI / 2),
            y: radius * Math.sin(-Math.PI / 2),
          }}
          animate={
            isInView
              ? {
                  x: radius * Math.cos(-Math.PI / 2 + (value / maxValue) * 2 * Math.PI),
                  y: radius * Math.sin(-Math.PI / 2 + (value / maxValue) * 2 * Math.PI),
                }
              : {}
          }
          transition={{ duration: 1.5, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <motion.p
        className="text-sm text-muted-foreground text-center mt-4 max-w-32"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: delay + 0.6 }}
      >
        {label}
      </motion.p>
    </motion.div>
  )
}

function DotMatrix({ data, isInView }: { data: typeof geoData; isInView: boolean }) {
  // Create dots with region assignments
  const dots: { region: string; index: number; color: string }[] = []
  let dotIndex = 0

  for (const item of data) {
    for (let i = 0; i < item.dots; i++) {
      dots.push({
        region: item.region,
        index: dotIndex++,
        color:
          item.region === "English-speaking"
            ? "bg-accent"
            : item.region === "Europe"
              ? "bg-accent/60"
              : item.region === "Asia"
                ? "bg-accent/40"
                : "bg-accent/20",
      })
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5 max-w-md">
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${dot.color}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{
            duration: 0.4,
            delay: 0.5 + i * 0.02,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={{ scale: 1.5 }}
        />
      ))}
    </div>
  )
}

function GlobeRing({ isInView }: { isInView: boolean }) {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80">
      {/* Outer rings */}
      {[1, 0.75, 0.5].map((scale, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 border border-border/50 rounded-full"
          style={{ transform: `scale(${scale})` }}
          initial={{ opacity: 0, scale: scale * 0.8 }}
          animate={isInView ? { opacity: 1, scale } : {}}
          transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
        />
      ))}

      {/* Animated orbital dots */}
      {geoData.map((item, i) => {
        const orbitRadius = 40 + i * 25
        const startAngle = i * 90

        return (
          <motion.div
            key={item.region}
            className="absolute top-1/2 left-1/2 w-3 h-3"
            style={{ marginTop: -6, marginLeft: -6 }}
            initial={{ opacity: 0 }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    x: [
                      orbitRadius * Math.cos((startAngle * Math.PI) / 180),
                      orbitRadius * Math.cos(((startAngle + 360) * Math.PI) / 180),
                    ],
                    y: [
                      orbitRadius * Math.sin((startAngle * Math.PI) / 180),
                      orbitRadius * Math.sin(((startAngle + 360) * Math.PI) / 180),
                    ],
                  }
                : {}
            }
            transition={{
              opacity: { duration: 0.5, delay: 0.5 + i * 0.1 },
              x: { duration: 20 + i * 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
              y: { duration: 20 + i * 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
            }}
          >
            <div className="w-full h-full rounded-full bg-accent" style={{ opacity: 1 - i * 0.2 }} />
          </motion.div>
        )
      })}

      {/* Center label */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="text-center">
          <span className="text-3xl font-serif text-foreground">50+</span>
          <p className="text-xs text-muted-foreground mt-1">Countries</p>
        </div>
      </motion.div>
    </div>
  )
}

export function AudienceSection() {
  const ref = useRef(null)
  const geoRef = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const isGeoInView = useInView(geoRef, { once: true, margin: "-50px" })

  return (
    <GrainBackground intensity="medium" fadeEdges={true} className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.p
          className="text-sm text-muted-foreground tracking-widest uppercase mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          The Audience
        </motion.p>

        <motion.h2
          className="font-serif text-4xl md:text-5xl text-foreground mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Decision makers listen.
        </motion.h2>

        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4 mb-32">
          {stats.map((stat, index) => (
            <RadialStat
              key={stat.label}
              value={stat.value}
              maxValue={stat.suffix === "M+" ? 1 : 100}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.15}
              index={index}
            />
          ))}
        </div>

        <motion.div
          ref={geoRef}
          className="border-t border-border pt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-16">
            <div className="flex-1">
              <motion.p
                className="text-sm text-muted-foreground tracking-widest uppercase mb-6"
                initial={{ opacity: 0 }}
                animate={isGeoInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6 }}
              >
                Global Reach
              </motion.p>

              <motion.h3
                className="font-serif text-3xl md:text-4xl text-foreground mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={isGeoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Listeners in 50+ countries
              </motion.h3>

              {/* Dot matrix visualization */}
              <DotMatrix data={geoData} isInView={isGeoInView} />

              {/* Legend */}
              <div className="flex flex-wrap gap-6 mt-8">
                {geoData.map((item, i) => (
                  <motion.div
                    key={item.region}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={isGeoInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 1 + i * 0.1 }}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.region === "English-speaking"
                          ? "bg-accent"
                          : item.region === "Europe"
                            ? "bg-accent/60"
                            : item.region === "Asia"
                              ? "bg-accent/40"
                              : "bg-accent/20"
                      }`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.region} <span className="text-foreground tabular-nums">{item.value}%</span>
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Globe visualization */}
            <div className="flex-shrink-0">
              <GlobeRing isInView={isGeoInView} />
            </div>
          </div>
        </motion.div>
      </div>
    </GrainBackground>
  )
}
