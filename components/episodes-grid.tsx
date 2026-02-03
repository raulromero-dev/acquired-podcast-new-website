"use client"

import { EpisodeCard } from "./episode-card"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { fetchAllEpisodes, fetchFeaturedSlugs } from "@/lib/supabase-episodes"
import { allEpisodes as defaultEpisodes } from "@/lib/episodes-data"
import type { Episode } from "@/lib/episodes-data"

export function EpisodesGrid() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const [displayEpisodes, setDisplayEpisodes] = useState<Episode[]>([])

  useEffect(() => {
    const loadEpisodes = async () => {
      try {
        const [episodes, featuredSlugs] = await Promise.all([fetchAllEpisodes(), fetchFeaturedSlugs()])

        const allEpisodes = episodes.length > 0 ? episodes : defaultEpisodes

        const featured = featuredSlugs
          .map((slug) => allEpisodes.find((ep) => ep.slug === slug))
          .filter((ep): ep is Episode => ep !== undefined)

        if (featured.length < 4) {
          const nonFeatured = allEpisodes.filter((ep) => !featuredSlugs.includes(ep.slug))
          featured.push(...nonFeatured.slice(0, 4 - featured.length))
        }

        setDisplayEpisodes(featured.slice(0, 6))
      } catch (error) {
        console.error("[v0] Error loading episodes:", error)
        setDisplayEpisodes(defaultEpisodes.slice(0, 6))
      }
    }
    loadEpisodes()
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const headerY = useTransform(scrollYProgress, [0, 1], [80, -40])

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 420
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section ref={sectionRef} className="py-40 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          style={{ y: headerY }}
        >
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-serif italic text-foreground leading-[1.05] text-balance">
              Deep dives into
              <br />
              remarkable companies
            </h2>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft size={22} />
            </motion.button>
            <motion.button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight size={22} />
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-16 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Each episode is an exhaustive, meticulously researched journey into the complete arc of a company&apos;s
          story.
        </motion.p>

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-8 -mx-6 px-4 md:px-6 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayEpisodes.map((episode, index) => (
            <motion.div
              key={episode.slug}
              className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[420px] snap-center md:snap-start"
              initial={{ opacity: 0, y: 60, rotateY: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <EpisodeCard {...episode} />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 flex items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            className="h-px bg-border flex-1 origin-left"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
          <Link
            href="/episodes"
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
          >
            View all episodes
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
