import { allEpisodes, type Episode } from "@/lib/episodes-data"

// Shared in-memory storage for episodes
// This ensures both admin and public APIs use the same data
const episodesStore: Episode[] = [...allEpisodes]
let featuredSlugs: string[] = ["10-years-of-acquired-with-michael-lewis", "coca-cola", "trader-joes"]

export function getEpisodesStore() {
  return {
    episodes: episodesStore,
    featuredSlugs,
  }
}

export function updateEpisode(episode: Episode) {
  const index = episodesStore.findIndex((ep) => ep.slug === episode.slug)
  if (index !== -1) {
    episodesStore[index] = episode
    return true
  }
  return false
}

export function addEpisode(episode: Episode) {
  episodesStore.unshift(episode)
}

export function deleteEpisode(slug: string) {
  const index = episodesStore.findIndex((ep) => ep.slug === slug)
  if (index !== -1) {
    episodesStore.splice(index, 1)
    featuredSlugs = featuredSlugs.filter((s) => s !== slug)
    return true
  }
  return false
}

export function setFeaturedSlugs(slugs: string[]) {
  featuredSlugs = slugs
}

export function getEpisodeBySlug(slug: string): Episode | undefined {
  return episodesStore.find((ep) => ep.slug === slug)
}
