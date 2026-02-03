"use client"

import { Play, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface EpisodeCardProps {
  title: string
  company: string
  duration: string
  description: string
  shortDescription?: string
  season: string | number
  episode: string | number
  coverImage: string
  date?: string
  slug: string
}

export function EpisodeCard({
  title,
  company,
  duration,
  description,
  shortDescription,
  season,
  episode,
  coverImage,
  date,
  slug,
}: EpisodeCardProps) {
  const displayDescription = shortDescription || description

  return (
    <Link href={`/episodes/${slug}`}>
      <motion.div
        className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-accent/30 transition-all duration-500 h-full"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Image area */}
        <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden">
          <Image
            src={coverImage || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full glass border border-white/20 flex items-center justify-center text-white backdrop-blur-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Play size={24} fill="currentColor" className="ml-1" />
            </motion.div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex flex-col h-[200px] sm:h-[240px]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="uppercase tracking-wider font-medium text-foreground dark:text-accent">
              {season}
              {episode ? ` E${episode}` : ""}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-medium text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-2 min-h-[56px] sm:min-h-[60px]">
            {title}
          </h3>

          <p className="hidden sm:block text-sm text-muted-foreground leading-relaxed line-clamp-4 flex-grow">
            {displayDescription}
          </p>

          <motion.div
            className="group/btn flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors mt-auto pt-4"
            whileHover={{ x: 4 }}
          >
            <span className="relative">
              Listen now
              <motion.span
                className="absolute -bottom-0.5 left-0 h-px bg-accent origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  )
}
