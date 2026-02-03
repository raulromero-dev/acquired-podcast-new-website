"use client"

import type React from "react"
import { useState } from "react"
import type { Episode } from "@/lib/episodes-data"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronLeft } from "lucide-react"
import Link from "next/link"

// Platform icons as simple SVGs
function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

function ApplePodcastsIcon({ className, isHovered }: { className?: string; isHovered?: boolean }) {
  return (
    <span className={`relative ${className}`}>
      {/* Light mode image */}
      <img
        src="/images/apple-20podcasts-20light-20mode.png"
        alt="Apple Podcasts"
        className={`w-full h-full object-contain dark:hidden ${isHovered ? "hidden" : "block"}`}
      />
      {/* Dark mode image */}
      <img
        src="/images/apple-20podcasts-20dark-20mode.png"
        alt="Apple Podcasts"
        className={`w-full h-full object-contain hidden dark:block ${isHovered ? "!hidden" : ""}`}
      />
      {/* Hover image (same for both modes) */}
      <img
        src="/images/apple-20podcasts-20hover.png"
        alt="Apple Podcasts"
        className={`w-full h-full object-contain absolute inset-0 ${isHovered ? "block" : "hidden"}`}
      />
    </span>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93-.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

interface CollapsibleSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-t border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-lg font-medium text-foreground group-hover:text-accent transition-colors">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} className="text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface EpisodeContentProps {
  episode: Episode
}

export function EpisodeContent({ episode }: EpisodeContentProps) {
  const [activeTranscriptIndex, setActiveTranscriptIndex] = useState(0)
  const [isApplePodcastsHovered, setIsApplePodcastsHovered] = useState(false)

  const hasTimestampedTranscript = Array.isArray(episode.transcript) && episode.transcript.length > 0
  const hasPlainTranscript = typeof episode.transcript === "string" && episode.transcript.trim().length > 0

  const validCarveOuts = episode.carveOuts?.filter(
    (carveOut) => carveOut.person?.trim() && carveOut.items?.some((item) => item?.trim()),
  )
  const hasCarveOuts = validCarveOuts && validCarveOuts.length > 0

  const validFollowUps = episode.followUps?.filter((followUp) => followUp?.trim())
  const hasFollowUps = validFollowUps && validFollowUps.length > 0

  const validSponsors = episode.sponsors?.filter((sponsor) => sponsor.name?.trim() || sponsor.description?.trim())
  const hasSponsors = validSponsors && validSponsors.length > 0

  return (
    <section className="pt-28 pb-8">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back link */}
        <Link
          href="/episodes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          All Episodes
        </Link>

        {/* Episode header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm uppercase tracking-wider font-medium text-foreground dark:text-accent">
              {episode.season}
              {episode.episode ? ` E${episode.episode}` : ""}
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span className="text-sm text-muted-foreground">{episode.date}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mb-4">{episode.title}</h1>
        </motion.div>

        {/* Streaming platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center gap-2 sm:gap-3 mb-10"
        >
          <span className="text-xs sm:text-sm text-muted-foreground">Listen on:</span>
          {episode.spotifyUrl && (
            <a
              href={episode.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-card border border-border hover:border-[#1DB954] hover:bg-[#1DB954]/10 transition-all group"
            >
              <SpotifyIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-[#1DB954] transition-colors" />
              <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Spotify
              </span>
            </a>
          )}
          {episode.applePodcastsUrl && (
            <a
              href={episode.applePodcastsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setIsApplePodcastsHovered(true)}
              onMouseLeave={() => setIsApplePodcastsHovered(false)}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-card border border-border hover:border-[#9933FF] hover:bg-[#9933FF]/10 transition-all group"
            >
              <ApplePodcastsIcon className="w-4 h-4 sm:w-5 sm:h-5" isHovered={isApplePodcastsHovered} />
              <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                Apple Podcasts
              </span>
            </a>
          )}
          {episode.youtubeId && (
            <a
              href={`https://youtube.com/watch?v=${episode.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-card border border-border hover:border-[#FF0000] hover:bg-[#FF0000]/10 transition-all group"
            >
              <YouTubeIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-[#FF0000] transition-colors" />
              <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                YouTube
              </span>
            </a>
          )}
        </motion.div>

        {/* YouTube embed */}
        {episode.youtubeId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative aspect-video rounded-2xl overflow-hidden bg-card border border-border mb-8"
          >
            <iframe
              src={`https://www.youtube.com/embed/${episode.youtubeId}`}
              title={episode.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="leading-relaxed mb-12 font-sans text-foreground text-base"
        >
          {episode.description}
        </motion.p>

        {(hasTimestampedTranscript || hasPlainTranscript) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="font-medium mb-8 font-sans text-xl text-foreground">
              <span className="font-bold">Transcript:</span>{" "}
              <span className="italic font-normal text-xl text-muted-foreground">
                (disclaimer: may contain unintentionally confusing, inaccurate and/or amusing transcription errors)
              </span>
            </h2>

            {/* Timestamped transcript with navigation */}
            {hasTimestampedTranscript && Array.isArray(episode.transcript) && (
              <div className="space-y-4">
                {episode.transcript.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 py-2">
                    <span className="text-xs font-mono text-accent flex-shrink-0 pt-1">{item.time}</span>
                    <span className="text-xl leading-relaxed font-sans text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Plain text transcript - flows naturally */}
            {hasPlainTranscript && typeof episode.transcript === "string" && (
              <div className="max-w-none font-sans">
                {episode.transcript.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="leading-relaxed mb-6 last:mb-0 text-foreground text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Collapsible sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {hasCarveOuts && (
            <CollapsibleSection title="Carve Outs">
              <div className="space-y-6">
                {validCarveOuts.map((carveOut, index) => (
                  <div key={index}>
                    <h4 className="text-sm font-medium text-foreground mb-2">{carveOut.person}</h4>
                    <ul className="space-y-1">
                      {carveOut.items
                        .filter((item) => item?.trim())
                        .map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-accent" />
                            {item}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {hasFollowUps && (
            <CollapsibleSection title="Follow-ups and Corrections">
              <ul className="space-y-2">
                {validFollowUps.map((followUp, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-accent mt-2 flex-shrink-0" />
                    {followUp}
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          )}

          {hasSponsors && (
            <CollapsibleSection title="Sponsors">
              <div className="grid gap-4">
                {validSponsors.map((sponsor, index) => (
                  <div key={index} className="p-4 rounded-xl bg-card/50 border border-border">
                    {sponsor.name?.trim() && (
                      <h4 className="text-sm font-medium text-foreground mb-1">{sponsor.name}</h4>
                    )}
                    {sponsor.description?.trim() && (
                      <p className="text-sm text-muted-foreground">{sponsor.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}
        </motion.div>
      </div>
    </section>
  )
}
