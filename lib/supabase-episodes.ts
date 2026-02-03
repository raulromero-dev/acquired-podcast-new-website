import type { Episode } from "./episodes-data"
import { createClient } from "./supabase/client"

// Convert database row to Episode type
function dbRowToEpisode(row: any): Episode {
  return {
    slug: row.slug,
    title: row.title,
    company: row.company,
    duration: row.duration,
    description: row.description,
    shortDescription: row.short_description || undefined,
    season: row.season,
    episode: row.episode || "",
    date: row.date,
    coverImage: row.cover_image || "",
    youtubeId: row.youtube_id || undefined,
    spotifyUrl: row.spotify_url || undefined,
    applePodcastsUrl: row.apple_podcasts_url || undefined,
    transcript: row.transcript || undefined,
    carveOuts: row.carve_outs || undefined,
    followUps: row.follow_ups || undefined,
    sponsors: row.sponsors || undefined,
  }
}

// Convert Episode to database row format
function episodeToDbRow(episode: Episode) {
  return {
    slug: episode.slug,
    title: episode.title,
    company: episode.company,
    duration: episode.duration,
    description: episode.description,
    short_description: episode.shortDescription || null,
    season: String(episode.season),
    episode: episode.episode ? String(episode.episode) : null,
    date: episode.date,
    cover_image: episode.coverImage || null,
    youtube_id: episode.youtubeId || null,
    spotify_url: episode.spotifyUrl || null,
    apple_podcasts_url: episode.applePodcastsUrl || null,
    transcript: episode.transcript || null,
    carve_outs: episode.carveOuts || null,
    follow_ups: episode.followUps || null,
    sponsors: episode.sponsors || null,
  }
}

// Fetch all episodes from Supabase
export async function fetchAllEpisodes(): Promise<Episode[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("episodes").select("*")

  if (error) {
    console.error("[v0] Error fetching episodes:", error)
    return []
  }

  const episodes = (data || []).map(dbRowToEpisode)
  return episodes.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA // Descending order (newest first)
  })
}

// Fetch a single episode by slug
export async function fetchEpisodeBySlug(slug: string): Promise<Episode | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("episodes").select("*").eq("slug", slug).single()

  if (error) {
    console.error("[v0] Error fetching episode:", error)
    return null
  }

  return data ? dbRowToEpisode(data) : null
}

// Fetch featured episodes
export async function fetchFeaturedEpisodes(): Promise<Episode[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("episodes")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching featured episodes:", error)
    return []
  }

  return (data || []).map(dbRowToEpisode)
}

// Get featured slugs
export async function fetchFeaturedSlugs(): Promise<string[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("episodes").select("slug").eq("is_featured", true)

  if (error) {
    console.error("[v0] Error fetching featured slugs:", error)
    return []
  }

  return (data || []).map((row) => row.slug)
}

// Save/update an episode
export async function saveEpisode(episode: Episode): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  const dbRow = episodeToDbRow(episode)

  const { error } = await supabase.from("episodes").upsert(dbRow, { onConflict: "slug" })

  if (error) {
    console.error("[v0] Error saving episode:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Toggle featured status
export async function toggleFeatured(slug: string, isFeatured: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase
    .from("episodes")
    .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
    .eq("slug", slug)

  if (error) {
    console.error("[v0] Error toggling featured:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Delete an episode
export async function deleteEpisode(slug: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase.from("episodes").delete().eq("slug", slug)

  if (error) {
    console.error("[v0] Error deleting episode:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// Bulk import episodes (for migration)
export async function importEpisodes(
  episodes: Episode[],
  featuredSlugs: string[],
): Promise<{ success: boolean; error?: string; imported: number }> {
  const supabase = createClient()

  let imported = 0
  const errors: string[] = []

  for (const episode of episodes) {
    const dbRow = {
      ...episodeToDbRow(episode),
      is_featured: featuredSlugs.includes(episode.slug),
    }

    const { error } = await supabase.from("episodes").upsert(dbRow, { onConflict: "slug" })

    if (error) {
      errors.push(`${episode.slug}: ${error.message}`)
    } else {
      imported++
    }
  }

  if (errors.length > 0) {
    return { success: false, error: errors.join("; "), imported }
  }

  return { success: true, imported }
}
