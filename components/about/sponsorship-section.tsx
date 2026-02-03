"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function SponsorshipSection() {
  return (
    <section className="py-32 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <motion.p
              className="text-sm text-muted-foreground tracking-widest uppercase mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Sponsorship
            </motion.p>

            <motion.h2
              className="font-serif text-4xl md:text-5xl text-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Partner with us.
            </motion.h2>

            <motion.p
              className="text-lg text-muted-foreground leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Reach the most influential audience in technology and business.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link
                href="/sponsor"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-opacity group"
              >
                Get in touch
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="glass rounded-2xl p-8 border border-border/50">
              <blockquote className="text-lg text-foreground leading-relaxed mb-6">
                "Acquired created hundreds of qualified leads, and generated positive ROI even before accounting for
                brand impact. If you sell to the technology community, there is no better place."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent font-serif text-lg">V</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Travis Hedge</p>
                  <p className="text-xs text-muted-foreground">Co-Founder, Vouch</p>
                </div>
              </div>
            </div>

            {/* Decorative element - accent used for brand decoration */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 border border-accent/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
