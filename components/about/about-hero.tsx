"use client"

import { motion } from "framer-motion"

export function AboutHero() {
  return (
    <section className="min-h-[70vh] flex items-end pb-24 pt-40 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <motion.p
          className="text-sm text-accent font-medium tracking-widest uppercase mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          About
        </motion.p>

        <motion.h1
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground max-w-5xl leading-[1.1] tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          The stories behind the world's greatest companies.
        </motion.h1>

        <motion.p
          className="mt-10 text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Acquired is the #1 technology podcast on Apple Podcasts and Spotify. Each episode reaches over one million
          listeners.
        </motion.p>

        <motion.div
          className="mt-10 h-px bg-gradient-to-r from-accent/50 via-accent to-transparent max-w-md"
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </section>
  )
}
