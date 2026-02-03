"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

const quotes = [
  {
    text: "It's hard to stop once you start listening.",
    author: "Eddy Cue",
    role: "SVP Services, Apple",
  },
  {
    text: "You guys have nailed an important set of stories to tell in a format that works for serious audiences.",
    author: "Chris Cox",
    role: "Chief Product Officer, Meta",
  },
  {
    text: "You do an amazing job. You do your research.",
    author: "Jensen Huang",
    role: "CEO and Founder, NVIDIA",
  },
]

export function QuotesSection() {
  const [activeQuote, setActiveQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % quotes.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-32 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <motion.p
          className="text-sm text-muted-foreground tracking-widest uppercase mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          What people are saying
        </motion.p>

        <div className="relative min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeQuote}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <blockquote className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight max-w-4xl">
                "{quotes[activeQuote].text}"
              </blockquote>
              <div className="mt-10 flex items-center gap-4">
                <div className="w-12 h-px bg-accent" />
                <div>
                  <p className="text-foreground font-medium">{quotes[activeQuote].author}</p>
                  <p className="text-sm text-muted-foreground">{quotes[activeQuote].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-2 mt-16">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveQuote(index)}
              className="group relative h-1 w-16 bg-muted rounded-full overflow-hidden"
            >
              {activeQuote === index ? (
                <motion.div
                  key={`progress-${activeQuote}`}
                  className="absolute inset-y-0 left-0 bg-accent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              ) : (
                <div className="absolute inset-y-0 left-0 bg-accent/30 rounded-full w-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
