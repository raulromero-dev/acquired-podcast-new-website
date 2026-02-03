"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const colors = [
  { name: "Black", hex: "#0a0a0a", className: "bg-foreground", textClass: "text-background" },
  { name: "White", hex: "#fafafa", className: "bg-background border border-border", textClass: "text-foreground" },
  { name: "Accent", hex: "#32FFCC", className: "bg-accent", textClass: "text-black" },
]

const grays = [
  { hex: "#262626", className: "bg-neutral-800" },
  { hex: "#525252", className: "bg-neutral-600" },
  { hex: "#a3a3a3", className: "bg-neutral-400" },
  { hex: "#d4d4d4", className: "bg-neutral-300" },
]

export function ColorSection() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null)

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex)
    setCopiedColor(hex)
    setTimeout(() => setCopiedColor(null), 1500)
  }

  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="mb-20"
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
            02
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">Colors</h2>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {colors.slice(0, 2).map((color) => (
              <motion.button
                key={color.name}
                className={`aspect-[3/1] sm:aspect-[2/1] rounded-2xl ${color.className} flex items-end p-6 relative overflow-hidden group`}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCopy(color.hex)}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                  animate={{ x: copiedColor === color.hex ? "200%" : "-100%" }}
                  transition={{ duration: 0.6 }}
                />
                <div className="relative z-10">
                  <p className={`text-sm font-medium ${color.textClass}`}>{color.name}</p>
                  <p className={`text-xs font-mono ${color.textClass} opacity-60`}>
                    {copiedColor === color.hex ? "Copied!" : color.hex}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.button
            className="w-full aspect-[2/1] sm:aspect-[4/1] rounded-2xl bg-accent flex items-end p-6 relative overflow-hidden group"
            variants={{
              hidden: { opacity: 0, scaleX: 0.8 },
              visible: { opacity: 1, scaleX: 1 },
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => handleCopy(colors[2].hex)}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent via-[#5AFFDD] to-accent"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              style={{ backgroundSize: "200% 100%" }}
            />
            <div className="relative z-10">
              <p className="text-sm font-medium text-black">Accent Green</p>
              <p className="text-xs text-black/70 font-mono">
                {copiedColor === colors[2].hex ? "Copied!" : colors[2].hex}
              </p>
            </div>
          </motion.button>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {grays.map((gray, index) => (
              <motion.button
                key={gray.hex}
                className={`aspect-square rounded-2xl ${gray.className} flex items-end justify-start p-4 relative overflow-hidden`}
                variants={{
                  hidden: { opacity: 0, y: 20, rotate: -5 },
                  visible: { opacity: 1, y: 0, rotate: 0 },
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCopy(gray.hex)}
              >
                <p className={`text-xs font-mono ${index < 2 ? "text-white/60" : "text-neutral-600"}`}>
                  {copiedColor === gray.hex ? "Copied!" : gray.hex}
                </p>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
