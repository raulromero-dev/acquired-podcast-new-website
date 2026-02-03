"use client"

import type React from "react"
import { ArrowRight, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export function EpisodesCTA() {
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-medium text-foreground mb-1">Never miss an episode</h2>
            <p className="text-sm text-muted-foreground">Get new episodes delivered to your inbox.</p>
          </div>

          <AnimatePresence mode="wait">
            {!showForm && !submitted ? (
              <motion.button
                key="subscribe-button"
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-full text-sm font-medium hover:opacity-90 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                Subscribe
                <ArrowRight size={14} />
              </motion.button>
            ) : submitted ? (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-card/60 border border-accent/30 rounded-full text-sm font-medium text-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                You&apos;re on the list
              </motion.div>
            ) : (
              <motion.form
                key="email-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-1.5 backdrop-blur-xl bg-card/60 border border-border/50 rounded-full"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  autoFocus
                  className="bg-transparent px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-[200px]"
                />
                <motion.button
                  type="submit"
                  className="flex items-center justify-center w-8 h-8 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={14} />
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
