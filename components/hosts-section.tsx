"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export function HostsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const contentY = useTransform(scrollYProgress, [0, 1], [60, -60])
  const card1Y = useTransform(scrollYProgress, [0, 1], [100, -50])
  const card2Y = useTransform(scrollYProgress, [0, 1], [150, -30])

  return (
    <section className="py-40 bg-background">
      <div ref={sectionRef} className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left - Content with parallax */}
          <motion.div style={{ y: contentY }}>
            <motion.h2
              className="text-5xl sm:text-6xl md:text-7xl font-serif italic text-foreground leading-[1.05] mb-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Meet your hosts
            </motion.h2>

            <motion.div
              className="h-[3px] w-16 bg-accent mb-10 rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 64 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />

            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed max-w-lg"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Ben Gilbert and David Rosenthal launched Acquired in 2015. What started as casual conversations evolved
              into one of the most respected business podcasts, known for meticulously researched deep dives.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-3 px-7 py-4 bg-accent text-accent-foreground rounded-full text-base font-medium hover:opacity-90 transition-opacity"
                >
                  About us
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <Link
                href="/community"
                className="inline-flex items-center gap-2 px-7 py-4 text-muted-foreground hover:text-foreground transition-colors text-base"
              >
                Join community
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Host cards with staggered parallax */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div
              className="aspect-[3/4] rounded-2xl bg-card border border-border overflow-hidden relative group"
              style={{ y: card1Y }}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Image
                src="/images/ben-vercel-ship-25.png"
                alt="Ben Gilbert"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/3 to-transparent dark:opacity-0 opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-medium text-foreground">Ben Gilbert</h3>
              </div>
            </motion.div>

            <motion.div
              className="aspect-[3/4] rounded-2xl bg-card border border-border overflow-hidden relative group mt-16"
              style={{ y: card2Y }}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ y: -8 }}
            >
              <Image
                src="/images/david-vercel-ship-25.avif"
                alt="David Rosenthal"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-accent/3 to-transparent dark:opacity-0 opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-medium text-foreground">David Rosenthal</h3>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
