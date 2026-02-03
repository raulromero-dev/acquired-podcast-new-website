"use client"

import { FileText, ImageIcon, ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

const downloads = [
  {
    icon: ImageIcon,
    title: "Logo Package",
    description: "SVG, PNG, EPS",
  },
  {
    icon: FileText,
    title: "Brand Guidelines",
    description: "PDF",
  },
]

export function DownloadSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

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
            04
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">Assets</h2>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {downloads.map((item, index) => (
            <motion.button
              key={index}
              className="group relative p-8 rounded-2xl backdrop-blur-xl bg-card/40 border border-white/10 text-left overflow-hidden shadow-lg"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

              <motion.div
                className="absolute inset-0 bg-foreground"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                style={{ originY: 1 }}
              />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{
                      rotate: hoveredIndex === index ? 360 : 0,
                      scale: hoveredIndex === index ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <item.icon
                      className={`w-6 h-6 transition-colors duration-300 ${
                        hoveredIndex === index ? "text-background" : "text-foreground"
                      }`}
                    />
                  </motion.div>
                  <div>
                    <p
                      className={`text-lg font-medium transition-colors duration-300 ${
                        hoveredIndex === index ? "text-background" : "text-foreground"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p
                      className={`text-sm transition-colors duration-300 ${
                        hoveredIndex === index ? "text-background/60" : "text-muted-foreground"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>

                <motion.div
                  animate={{
                    x: hoveredIndex === index ? 0 : -10,
                    opacity: hoveredIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowUpRight className="w-5 h-5 text-background" />
                </motion.div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
