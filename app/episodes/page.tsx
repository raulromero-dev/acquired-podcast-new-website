"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { EpisodeCard } from "@/components/episode-card"
import { Search, ChevronLeft, ChevronRight, X, Command, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { EpisodesCTA } from "@/components/episodes-cta"
import { useNav } from "@/components/nav-context"
import type { Episode } from "@/lib/episodes-data"
import { allEpisodes } from "@/lib/episodes-data"
import { fetchAllEpisodes } from "@/lib/supabase-episodes"

const EPISODES_PER_PAGE = 9

export default function EpisodesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const { isMobileMenuOpen } = useNav()

  useEffect(() => {
    const loadEpisodes = async () => {
      try {
        const supabaseEpisodes = await fetchAllEpisodes()
        if (supabaseEpisodes.length > 0) {
          setEpisodes(supabaseEpisodes)
        } else {
          const sortedEpisodes = [...allEpisodes].sort((a, b) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            return dateB - dateA
          })
          setEpisodes(sortedEpisodes)
        }
      } catch (error) {
        console.error("[v0] Error fetching episodes:", error)
        const sortedEpisodes = [...allEpisodes].sort((a, b) => {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return dateB - dateA
        })
        setEpisodes(sortedEpisodes)
      }
      setIsLoading(false)
    }
    loadEpisodes()
  }, [])

  const filteredEpisodes = useMemo(() => {
    if (!searchQuery.trim()) return episodes
    const query = searchQuery.toLowerCase()
    return episodes.filter(
      (ep) =>
        ep.title.toLowerCase().includes(query) ||
        ep.company.toLowerCase().includes(query) ||
        ep.description.toLowerCase().includes(query) ||
        ep.duration.toLowerCase().includes(query),
    )
  }, [searchQuery, episodes])

  const totalPages = Math.ceil(filteredEpisodes.length / EPISODES_PER_PAGE)
  const paginatedEpisodes = useMemo(() => {
    const start = (currentPage - 1) * EPISODES_PER_PAGE
    return filteredEpisodes.slice(start, start + EPISODES_PER_PAGE)
  }, [filteredEpisodes, currentPage])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleSearchClick = () => {
    setIsSearchExpanded(true)
    setTimeout(() => searchInputRef.current?.focus(), 100)
  }

  const handleMobileSearchClick = () => {
    setIsMobileSearchOpen(true)
    setTimeout(() => mobileSearchInputRef.current?.focus(), 100)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        if (!searchQuery) {
          setIsSearchExpanded(false)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [searchQuery])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchExpanded(true)
        setTimeout(() => searchInputRef.current?.focus(), 100)
      }
      if (e.key === "Escape") {
        if (isSearchExpanded) {
          setIsSearchExpanded(false)
          setSearchQuery("")
          searchInputRef.current?.blur()
        }
        if (isMobileSearchOpen) {
          setIsMobileSearchOpen(false)
          if (!searchQuery) setSearchQuery("")
          mobileSearchInputRef.current?.blur()
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isSearchExpanded, isMobileSearchOpen, searchQuery])

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileSearchOpen(false)
    }
  }, [isMobileMenuOpen])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
            <h1 className="text-3xl md:text-4xl font-serif text-foreground">All Episodes</h1>

            <div ref={searchContainerRef} className="relative hidden sm:block">
              <AnimatePresence mode="wait">
                {!isSearchExpanded ? (
                  <motion.button
                    key="collapsed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={handleSearchClick}
                    className="flex items-center gap-3 px-4 py-2.5 backdrop-blur-xl bg-card/60 dark:bg-white/5 border border-border/50 rounded-full hover:border-border hover:bg-card/80 dark:hover:bg-white/10 transition-all duration-300 group"
                  >
                    <Search size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      Search
                    </span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted/50 border border-border/30">
                      <Command size={10} className="text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground font-medium">K</span>
                    </div>
                  </motion.button>
                ) : (
                  <motion.div
                    key="expanded"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    className="relative w-[360px] md:w-[420px]"
                  >
                    <div className="relative flex items-center gap-3 px-4 py-2.5 backdrop-blur-xl bg-card/90 dark:bg-white/10 border border-border/40 dark:border-white/20 rounded-full shadow-lg shadow-black/5 dark:shadow-black/20">
                      <Search size={16} className="text-muted-foreground flex-shrink-0" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search..."
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-2"
                      />
                      <AnimatePresence>
                        {searchQuery && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => handleSearchChange("")}
                            className="flex items-center justify-center w-5 h-5 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 transition-colors flex-shrink-0"
                          >
                            <X size={12} className="text-muted-foreground" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>

                    <AnimatePresence>
                      {searchQuery && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="mt-2 flex justify-center"
                        >
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 backdrop-blur-xl bg-card/60 dark:bg-white/5 border border-border/30 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                            <span className="text-xs text-muted-foreground">
                              {filteredEpisodes.length} episode{filteredEpisodes.length !== 1 ? "s" : ""}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Loading episodes...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`page-${currentPage}-${searchQuery}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedEpisodes.map((episode, index) => (
                  <motion.div
                    key={episode.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <EpisodeCard {...episode} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {paginatedEpisodes.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No episodes found matching your search.</p>
            </div>
          )}

          {totalPages > 1 && !isLoading && (
            <motion.div
              className="flex items-center justify-center gap-4 mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                whileHover={{ x: currentPage === 1 ? 0 : -2 }}
                whileTap={{ scale: currentPage === 1 ? 1 : 0.98 }}
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
              </motion.button>

              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="text-sm font-medium text-foreground min-w-[1.5ch] text-center"
                  >
                    {currentPage}
                  </motion.span>
                </AnimatePresence>
                <span className="text-sm text-muted-foreground mx-1">/</span>
                <span className="text-sm text-muted-foreground">{totalPages}</span>
              </div>

              <motion.button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                whileHover={{ x: currentPage === totalPages ? 0 : 2 }}
                whileTap={{ scale: currentPage === totalPages ? 1 : 0.98 }}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      <EpisodesCTA />

      <Footer />

      <AnimatePresence>
        {!isMobileMenuOpen && (
          <motion.div
            className="sm:hidden fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {!isMobileSearchOpen ? (
                <motion.button
                  key="mobile-collapsed"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                  onClick={handleMobileSearchClick}
                  className="flex items-center gap-2 px-5 py-3 backdrop-blur-2xl bg-card/80 dark:bg-white/10 border border-border/50 dark:border-white/20 rounded-full shadow-lg shadow-black/10"
                >
                  <Search size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Search</span>
                </motion.button>
              ) : (
                <motion.div
                  key="mobile-expanded"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                  className="w-[calc(100vw-3rem)] max-w-md"
                >
                  <div className="flex items-center gap-2 p-2 backdrop-blur-2xl bg-card/90 dark:bg-white/10 border border-border/50 dark:border-white/20 rounded-full shadow-lg shadow-black/10">
                    <Search size={16} className="text-muted-foreground ml-2 flex-shrink-0" />
                    <input
                      ref={mobileSearchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Search..."
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none py-1"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => handleSearchChange("")}
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 transition-colors flex-shrink-0"
                      >
                        <X size={12} className="text-muted-foreground" />
                      </button>
                    )}
                    <motion.button
                      onClick={() => setIsMobileSearchOpen(false)}
                      className="flex items-center justify-center w-8 h-8 bg-foreground text-background rounded-full hover:opacity-90 transition-opacity flex-shrink-0"
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowRight size={14} />
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {searchQuery && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="mt-2 flex justify-center"
                      >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 backdrop-blur-xl bg-card/60 dark:bg-white/5 border border-border/30 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          <span className="text-xs text-muted-foreground">
                            {filteredEpisodes.length} episode{filteredEpisodes.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
