"use client"

import { motion } from "framer-motion"
import { GrainBackground } from "../grain-background"

export function TypographySection() {
  return (
    <GrainBackground intensity="subtle" className="py-32 overflow-hidden">
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
            03
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">Typography</h2>
        </motion.div>

        <div className="space-y-16">
          {/* Display Font */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl backdrop-blur-xl bg-card/40 border border-white/10"
          >
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-6">Display</p>
            <p className="text-4xl sm:text-5xl md:text-6xl font-serif text-foreground leading-tight">
              Playfair Display
            </p>
            <p className="mt-4 text-lg text-muted-foreground font-serif">
              Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
            </p>
          </motion.div>

          {/* Body Font */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 rounded-2xl backdrop-blur-xl bg-card/40 border border-white/10"
          >
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider mb-6">Body</p>
            <p className="text-4xl sm:text-5xl md:text-6xl font-sans text-foreground leading-tight tracking-tight">
              Inter
            </p>
            <p className="mt-4 text-lg text-muted-foreground font-sans">
              Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
            </p>
          </motion.div>
        </div>

        {/* Tagline showcase */}
        <motion.div
          className="mt-24 pt-16 border-t border-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground leading-tight max-w-3xl">
            {"Every company has a story.".split(" ").map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-[0.3em]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>
          <motion.p
            className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed font-sans"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Learn the playbooks that built the world&apos;s greatest companies.
          </motion.p>
        </motion.div>
      </div>
    </GrainBackground>
  )
}
