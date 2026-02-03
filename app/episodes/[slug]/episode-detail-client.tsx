"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { EpisodesCTA } from "@/components/episodes-cta"
import { EpisodeContent } from "@/components/episode-content"
import { fetchEpisodeBySlug } from "@/lib/supabase-episodes"
import { getEpisodeBySlug } from "@/lib/episodes-data"
import type { Episode } from "@/lib/episodes-data"
import Link from "next/link"

export function EpisodeDetailClient({ slug }: { slug: string }) {
  const [episode, setEpisode] = useState<Episode | null | undefined>(undefined)

  useEffect(() => {
    const loadEpisode = async () => {
      try {
        const ep = await fetchEpisodeBySlug(slug)
        if (ep) {
          setEpisode(ep)
        } else {
          const staticEp = getEpisodeBySlug(slug)
          setEpisode(staticEp || null)
        }
      } catch (error) {
        console.error("[v0] Error fetching episode:", error)
        const staticEp = getEpisodeBySlug(slug)
        setEpisode(staticEp || null)
      }
    }
    loadEpisode()
  }, [slug])

  if (episode === undefined) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-16 text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
        <Footer />
      </main>
    )
  }

  if (episode === null) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-16 text-center">
          <h1 className="text-2xl font-medium text-foreground mb-4">Episode not found</h1>
          <Link href="/episodes" className="text-accent hover:underline">
            Back to all episodes
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <EpisodeContent episode={episode} />
      <EpisodesCTA />
      <Footer />
    </main>
  )
}
