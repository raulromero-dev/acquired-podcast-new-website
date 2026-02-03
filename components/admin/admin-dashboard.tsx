"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { LogOut, Plus, Search, Star, StarOff, X, Download, Upload, Database, RefreshCw } from "lucide-react"
import { EpisodeEditor } from "@/components/admin/episode-editor"
import type { Episode } from "@/lib/episodes-data"
import { allEpisodes } from "@/lib/episodes-data"
import {
  getStoredEpisodes,
  saveEpisodes,
  getStoredFeaturedSlugs,
  saveStoredFeaturedSlugs,
} from "@/lib/episodes-client-store"
import {
  fetchAllEpisodes,
  fetchFeaturedSlugs,
  saveEpisode,
  toggleFeatured,
  importEpisodes,
} from "@/lib/supabase-episodes"

export function AdminDashboard() {
  const router = useRouter()
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [featuredSlugs, setFeaturedSlugs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [useSupabase, setUseSupabase] = useState(true)
  const [isMigrating, setIsMigrating] = useState(false)

  useEffect(() => {
    const loadEpisodes = async () => {
      setIsLoading(true)
      try {
        if (useSupabase) {
          const [supabaseEpisodes, supabaseFeatured] = await Promise.all([fetchAllEpisodes(), fetchFeaturedSlugs()])

          // If Supabase is empty, load from default data
          if (supabaseEpisodes.length === 0) {
            setEpisodes(allEpisodes)
            setFeaturedSlugs([])
          } else {
            setEpisodes(supabaseEpisodes)
            setFeaturedSlugs(supabaseFeatured)
          }
        } else {
          // Fallback to localStorage
          const storedEpisodes = getStoredEpisodes()
          const storedFeatured = getStoredFeaturedSlugs()
          setEpisodes(storedEpisodes)
          setFeaturedSlugs(storedFeatured)
        }
      } catch (error) {
        console.error("[v0] Error loading episodes:", error)
        // Fallback to localStorage on error
        const storedEpisodes = getStoredEpisodes()
        const storedFeatured = getStoredFeaturedSlugs()
        setEpisodes(storedEpisodes)
        setFeaturedSlugs(storedFeatured)
        setSaveMessage({ type: "error", text: "Failed to connect to database, using local data" })
        setTimeout(() => setSaveMessage(null), 3000)
      }
      setIsLoading(false)
    }

    loadEpisodes()
  }, [useSupabase])

  useEffect(() => {
    if (searchQuery) {
      const filtered = episodes.filter(
        (ep) =>
          ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ep.company.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredEpisodes(filtered)
    } else {
      setFilteredEpisodes(episodes)
    }
  }, [searchQuery, episodes])

  const handleExportData = () => {
    const data = {
      episodes: episodes,
      featuredSlugs: featuredSlugs,
      exportedAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `acquired-episodes-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setSaveMessage({ type: "success", text: "Data exported successfully!" })
    setTimeout(() => setSaveMessage(null), 3000)
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.episodes && Array.isArray(data.episodes)) {
          setIsMigrating(true)
          setSaveMessage({ type: "success", text: "Importing to database..." })

          const result = await importEpisodes(data.episodes, data.featuredSlugs || [])

          if (result.success) {
            // Reload episodes from Supabase
            const [supabaseEpisodes, supabaseFeatured] = await Promise.all([fetchAllEpisodes(), fetchFeaturedSlugs()])
            setEpisodes(supabaseEpisodes)
            setFeaturedSlugs(supabaseFeatured)
            setSaveMessage({ type: "success", text: `Imported ${result.imported} episodes to database!` })
          } else {
            setSaveMessage({ type: "error", text: `Import errors: ${result.error}` })
          }

          setIsMigrating(false)
          setTimeout(() => setSaveMessage(null), 5000)
        }
      } catch (error) {
        console.error("[v0] Import error:", error)
        setSaveMessage({ type: "error", text: "Failed to import data. Invalid file format." })
        setIsMigrating(false)
        setTimeout(() => setSaveMessage(null), 3000)
      }
    }
    reader.readAsText(file)
    event.target.value = ""
  }

  const handleMigrateToSupabase = async () => {
    setIsMigrating(true)
    setSaveMessage({ type: "success", text: "Migrating local data to database..." })

    try {
      const localEpisodes = getStoredEpisodes()
      const localFeatured = getStoredFeaturedSlugs()

      if (localEpisodes.length === 0) {
        setSaveMessage({ type: "error", text: "No local data to migrate" })
        setIsMigrating(false)
        setTimeout(() => setSaveMessage(null), 3000)
        return
      }

      const result = await importEpisodes(localEpisodes, localFeatured)

      if (result.success) {
        // Reload from Supabase
        const [supabaseEpisodes, supabaseFeatured] = await Promise.all([fetchAllEpisodes(), fetchFeaturedSlugs()])
        setEpisodes(supabaseEpisodes)
        setFeaturedSlugs(supabaseFeatured)
        setSaveMessage({ type: "success", text: `Migrated ${result.imported} episodes to database!` })
      } else {
        setSaveMessage({ type: "error", text: `Migration errors: ${result.error}` })
      }
    } catch (error) {
      console.error("[v0] Migration error:", error)
      setSaveMessage({ type: "error", text: "Failed to migrate data" })
    }

    setIsMigrating(false)
    setTimeout(() => setSaveMessage(null), 5000)
  }

  const handleLogout = async () => {
    localStorage.removeItem("admin_session")
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
  }

  const handleSaveEpisode = async (episode: Episode) => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      // Generate slug if not provided
      if (!episode.slug) {
        episode.slug = episode.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
      }

      if (useSupabase) {
        const result = await saveEpisode(episode)

        if (!result.success) {
          throw new Error(result.error)
        }

        // Reload episodes from Supabase
        const supabaseEpisodes = await fetchAllEpisodes()
        setEpisodes(supabaseEpisodes)
      } else {
        // Fallback to localStorage
        const currentEpisodes = [...episodes]
        if (isCreating) {
          currentEpisodes.unshift(episode)
        } else {
          const index = currentEpisodes.findIndex((ep) => ep.slug === episode.slug)
          if (index !== -1) {
            currentEpisodes[index] = episode
          }
        }
        saveEpisodes(currentEpisodes)
        setEpisodes(currentEpisodes)
      }

      setSaveMessage({ type: "success", text: isCreating ? "Episode created!" : "Episode saved!" })

      setTimeout(() => {
        setSelectedEpisode(null)
        setIsCreating(false)
        setSaveMessage(null)
      }, 1500)
    } catch (error) {
      console.error("[v0] Save error:", error)
      setSaveMessage({ type: "error", text: `Failed to save episode: ${error}` })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleFeatured = async (slug: string) => {
    const isCurrentlyFeatured = featuredSlugs.includes(slug)
    const newFeaturedState = !isCurrentlyFeatured

    // Optimistic update
    let newFeatured: string[]
    if (isCurrentlyFeatured) {
      newFeatured = featuredSlugs.filter((s) => s !== slug)
    } else {
      newFeatured = [...featuredSlugs, slug]
    }
    setFeaturedSlugs(newFeatured)

    if (useSupabase) {
      const result = await toggleFeatured(slug, newFeaturedState)
      if (!result.success) {
        // Revert on error
        setFeaturedSlugs(featuredSlugs)
        setSaveMessage({ type: "error", text: "Failed to update featured status" })
        setTimeout(() => setSaveMessage(null), 3000)
      }
    } else {
      saveStoredFeaturedSlugs(newFeatured)
    }
  }

  const handleCreateNew = () => {
    const newEpisode: Episode = {
      slug: "",
      title: "",
      company: "",
      duration: "",
      description: "",
      season: "",
      episode: "",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      coverImage: "/placeholder.svg?height=600&width=400",
      youtubeId: "",
      spotifyUrl: "",
      applePodcastsUrl: "",
    }
    setSelectedEpisode(newEpisode)
    setIsCreating(true)
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-accent/3 via-transparent to-transparent pointer-events-none" />

      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/5 border border-border/50">
              <span className="text-lg font-serif font-semibold text-foreground">ACQ</span>
            </div>
            <div className="h-6 w-px bg-border/50" />
            <span className="text-sm text-muted-foreground font-medium">Admin</span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/10 border border-accent/20">
              <Database className="w-3 h-3 text-accent" />
              <span className="text-xs text-accent font-medium">Supabase</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMigrateToSupabase}
              disabled={isMigrating}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all disabled:opacity-50"
              title="Migrate local data to Supabase database"
            >
              <RefreshCw className={`w-4 h-4 ${isMigrating ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Migrate</span>
            </button>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all"
              title="Export all episode data as JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <label className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
            <div className="h-6 w-px bg-border/50 mx-1" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm font-medium ${
              saveMessage.type === "success"
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-red-500/20 text-red-400 border border-red-500/30"
            }`}
          >
            {saveMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {/* Title and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-medium text-foreground">Episodes</h1>
            <p className="text-muted-foreground text-sm mt-1">{episodes.length} total episodes</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-2.5 w-56 bg-card/50 backdrop-blur-xl border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 focus:bg-card/80 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              New Episode
            </button>
          </div>
        </div>

        <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border/50 text-xs text-muted-foreground uppercase tracking-wider font-medium bg-muted/20">
            <div className="col-span-5">Episode</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2 hidden sm:block">Date</div>
            <div className="col-span-2">Featured</div>
            <div className="col-span-1">Edit</div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-muted-foreground/20 border-t-foreground rounded-full animate-spin" />
            </div>
          ) : filteredEpisodes.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              {searchQuery ? "No episodes match your search" : "No episodes yet"}
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {filteredEpisodes.map((episode, index) => (
                <motion.div
                  key={episode.slug}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/20 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <img
                      src={episode.coverImage || "/placeholder.svg"}
                      alt={episode.title}
                      className="w-12 h-12 rounded-lg object-cover bg-muted border border-border/30"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{episode.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{episode.company}</p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="inline-flex px-2 py-1 text-xs rounded-md bg-muted/50 text-muted-foreground border border-border/30">
                      {episode.season === "Special" || episode.season === "ACQ2"
                        ? episode.season
                        : `S${episode.season}`}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm text-muted-foreground hidden sm:block">{episode.date}</div>
                  <div className="col-span-2">
                    <button
                      onClick={() => handleToggleFeatured(episode.slug)}
                      className={`p-2 rounded-lg transition-all ${
                        featuredSlugs.includes(episode.slug)
                          ? "text-accent bg-accent/10 dark:text-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {featuredSlugs.includes(episode.slug) ? (
                        <Star className="w-4 h-4 fill-current" />
                      ) : (
                        <StarOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="col-span-1">
                    <button
                      onClick={() => {
                        setSelectedEpisode(episode)
                        setIsCreating(false)
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-foreground bg-foreground/5 border border-border/50 rounded-lg hover:bg-foreground/10 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Episode Editor Modal */}
      <AnimatePresence>
        {selectedEpisode && (
          <EpisodeEditor
            episode={selectedEpisode}
            isCreating={isCreating}
            isSaving={isSaving}
            saveMessage={saveMessage}
            onSave={handleSaveEpisode}
            onClose={() => {
              setSelectedEpisode(null)
              setIsCreating(false)
              setSaveMessage(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
