"use client"

import type React from "react"

import { ArrowRight, Send } from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState } from "react"
import { GrainBackground } from "./grain-background"

export function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [80, -80])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock submission - just show success state
    setSubmitted(true)
  }

  return (
    <GrainBackground className="py-40 overflow-hidden" intensity="intense" fadeEdges={true}>
      <div ref={sectionRef} className="max-w-5xl mx-auto px-6 text-center">
        <motion.div style={{ y, scale, opacity }}>
          <motion.div
            className="flex justify-center gap-2 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-accent"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              />
            ))}
          </motion.div>

          <motion.h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-foreground leading-[1.1] mb-8"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Learn stuff you don&apos;t
            <br />
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            >
              even know you want
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
            >
              to learn about
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Join millions of listeners discovering the playbooks behind the world&apos;s greatest companies.
          </motion.p>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {!showForm && !submitted ? (
                <motion.button
                  key="subscribe-button"
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-full text-base font-medium hover:opacity-90 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  Subscribe to newsletter
                  <ArrowRight size={18} />
                </motion.button>
              ) : submitted ? (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 px-8 py-4 glass border border-accent/30 rounded-full text-base font-medium text-foreground"
                >
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  You&apos;re on the list
                </motion.div>
              ) : (
                <motion.form
                  key="email-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, scale: 0.9, width: "auto" }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-2 glass border border-border/50 rounded-full"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    autoFocus
                    className="bg-transparent px-4 py-2 text-foreground placeholder:text-muted-foreground outline-none min-w-[240px] sm:min-w-[300px]"
                  />
                  <motion.button
                    type="submit"
                    className="flex items-center justify-center w-10 h-10 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={16} />
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </GrainBackground>
  )
}
